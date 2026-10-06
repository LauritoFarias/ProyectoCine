import { environment } from '../../../../environments/environment';
import { Component, input, output, OnInit, OnDestroy, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase';
import { AuthService } from '../../../services/auth'

interface Butaca { fila: string; columna: number; tipo: string; estado: 'Libre' | 'Seleccionada' | 'Ocupada'; }
interface FilaEstructura { letra: string; izquierda: Butaca[]; centro: Butaca[]; derecha: Butaca[]; }

@Component({
  selector: 'app-seleccionar-butacas',
  imports: [CommonModule],
  templateUrl: './seleccionar-butacas.html',
  styleUrl: './seleccionar-butacas.css',
})
export class SeleccionarButacas implements OnInit, OnDestroy {

  private supabase = inject(SupabaseService);
  private authService = inject(AuthService);

  funcion = input.required<any>();
  onAtras = output<void>();
  onSiguiente = output<any[]>();

  mapaFilas = signal<FilaEstructura[]>([]);
  butacasSeleccionadas = signal<Butaca[]>([]);
  
  // Nuevo Signal para el Toast
  toastMensaje = signal<string>('');

  private canalRealtime: any;
  private idUsuarioActual = '';

  async ngOnInit() {
    this.idUsuarioActual = this.authService.currentUser()?.id || crypto.randomUUID();
    this.generarMapaVacio();
    await this.cargarButacasOcupadas();
    this.suscribirseATiempoReal();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.butacasSeleccionadas().length > 0) {
      
      // Construimos la URL directa a la API de Supabase para borrar
      // TODAS las butacas de este usuario en esta función de un solo golpe.
      const url = `${environment.supabaseUrl}/rest/v1/butacas_reservadas?id_funcion=eq.${this.funcion().id}&id_usuario=eq.${this.idUsuarioActual}`;
      
      // Usamos fetch nativo con keepalive (magia pura)
      fetch(url, {
        method: 'DELETE',
        headers: {
          'apikey': environment.supabaseKey,
          'Authorization': `Bearer ${environment.supabaseKey}` 
        },
        keepalive: true // <--- Esto asegura que llegue al servidor aunque se cierre la pestaña
      });
    }
  }

  async ngOnDestroy() {
    if (this.canalRealtime) {
      this.supabase.cliente.removeChannel(this.canalRealtime);
    }
    
    if (this.butacasSeleccionadas().length > 0) {
       await this.liberarMisButacas();
    }
  }

  private async liberarMisButacas() {
    const funcionId = this.funcion().id;
    const promesasLiberacion = this.butacasSeleccionadas().map(b => 
      this.supabase.liberarButaca(funcionId, b.fila, b.columna)
    );
    
    // Ejecutamos todas las liberaciones a la vez
    await Promise.all(promesasLiberacion);
    console.log("Se liberaron las butacas seleccionadas al abandonar la página.");
  }

  mostrarToast(mensaje: string) {
    this.toastMensaje.set(mensaje);
    setTimeout(() => this.toastMensaje.set(''), 3000);
  }

  generarMapaVacio() {
    const ordenFilas = ['T','S','R','Q','P','O','N','M','L','J','I','H','G','F','E','D','C','B','A'];
    const mapaTemporal: FilaEstructura[] = [];

    for (const letra of ordenFilas) {
      let tipo = 'Estandar';
      if (['R','S','T'].includes(letra)) tipo = 'VIP';
      if (letra === 'J') tipo = 'Accesible';

      const cantIzq = letra === 'J' ? 2 : 4;
      const cantCen = letra === 'J' ? 10 : 20;
      const cantDer = letra === 'J' ? 2 : 4;

      let numColumna = 1;
      const bloqueIzq = this.crearBloque(letra, cantIzq, tipo, numColumna);
      numColumna += cantIzq;
      const bloqueCen = this.crearBloque(letra, cantCen, tipo, numColumna);
      numColumna += cantCen;
      const bloqueDer = this.crearBloque(letra, cantDer, tipo, numColumna);

      mapaTemporal.push({ letra, izquierda: bloqueIzq, centro: bloqueCen, derecha: bloqueDer });
    }
    this.mapaFilas.set(mapaTemporal);
  }

  private crearBloque(fila: string, cantidad: number, tipo: string, inicioCol: number): Butaca[] {
    return Array.from({ length: cantidad }).map((_, i) => ({
      fila, columna: inicioCol + i, tipo, estado: 'Libre'
    }));
  }

  async cargarButacasOcupadas() {
    const ocupadas = await this.supabase.getButacasOcupadas(this.funcion().id);
    ocupadas.forEach((ocupada: any) => this.actualizarEstadoLocal(ocupada.fila, ocupada.columna, ocupada.id_usuario));
  }

  suscribirseATiempoReal() {
    this.canalRealtime = this.supabase.cliente.channel('sala_butacas')
      .on('postgres_changes', { 
        event: '*', schema: 'public', table: 'butacas_reservadas', filter: `id_funcion=eq.${this.funcion().id}` 
      }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          this.actualizarEstadoLocal(payload.new['fila'], payload.new['columna'], payload.new['id_usuario']);
        } else if (payload.eventType === 'DELETE') {
          this.actualizarEstadoLocal(payload.old['fila'], payload.old['columna'], null, true);
        }
      })
      .subscribe();
  }

  actualizarEstadoLocal(fila: string, columna: number, idUsuario: string | null, liberada: boolean = false) {
    // Reconstruimos el array completo
    const nuevoMapa = this.mapaFilas().map(f => {
      if (f.letra !== fila) return f;
      
      // Le decimos a TypeScript explícitamente que esto devuelve un arreglo de Butaca
      const actualizarBloque = (bloque: Butaca[]): Butaca[] => bloque.map(b => {
        if (b.columna === columna) {
          // Asignamos el estado tipado para que TypeScript no chille
          const nuevoEstado: Butaca['estado'] = liberada 
            ? 'Libre' 
            : (idUsuario === this.idUsuarioActual ? 'Seleccionada' : 'Ocupada');
            
          return { ...b, estado: nuevoEstado };
        }
        return b;
      });

      return {
        ...f,
        izquierda: actualizarBloque(f.izquierda),
        centro: actualizarBloque(f.centro),
        derecha: actualizarBloque(f.derecha)
      };
    });

    this.mapaFilas.set(nuevoMapa);
  }

  async clickButaca(butaca: Butaca) {
    if (butaca.estado === 'Ocupada') return;

    try {
      if (butaca.estado === 'Seleccionada') {
        await this.supabase.liberarButaca(this.funcion().id, butaca.fila, butaca.columna);
        this.butacasSeleccionadas.update(b => b.filter(x => !(x.fila === butaca.fila && x.columna === butaca.columna)));
        this.actualizarEstadoLocal(butaca.fila, butaca.columna, null, true);
        
      } else if (butaca.estado === 'Libre') {
        await this.supabase.bloquearButaca(this.funcion().id, butaca.fila, butaca.columna, butaca.tipo, this.idUsuarioActual);
        this.butacasSeleccionadas.update(b => [...b, butaca]);
        this.actualizarEstadoLocal(butaca.fila, butaca.columna, this.idUsuarioActual);
      }
    } catch (error) {
      // Reemplazamos el alert por el Toast y forzamos el color negro localmente
      this.mostrarToast(`La butaca ${butaca.fila}-${butaca.columna} acaba de ser tomada por otra persona.`);
      this.actualizarEstadoLocal(butaca.fila, butaca.columna, 'otro_usuario');
    }
  }

  continuar() {
    const butacasFinales = [...this.butacasSeleccionadas()];
    this.butacasSeleccionadas.set([]);
    
    this.onSiguiente.emit(butacasFinales);
  }

}
