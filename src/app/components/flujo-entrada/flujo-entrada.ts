import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { SeleccionarFuncion } from './seleccionar-funcion/seleccionar-funcion';
import { SeleccionarButacas } from './seleccionar-butacas/seleccionar-butacas';
import { ConfirmarCompra } from './confirmar-compra/confirmar-compra';
import { Pago } from './pago/pago';

@Component({
  selector: 'app-flujo-entrada',
  imports: [CommonModule, RouterLink, SeleccionarFuncion, SeleccionarButacas, ConfirmarCompra, Pago],
  templateUrl: './flujo-entrada.html',
  styleUrl: './flujo-entrada.css',
})
export class FlujoEntrada implements OnInit {

  private route = inject(ActivatedRoute);
  private supabase = inject(SupabaseService);

  pasoActual = signal<number>(1); 
  
  peliculaSeleccionada = signal<any>(null);

  reserva = signal({
    peliculaId: '',
    funcion: null as any,
    butacas: [] as any[],
    candy: [] as any[],
    total: 0
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reserva.update(r => ({ ...r, peliculaId: id }));
      
      const peli = await this.supabase.getPeliculaById(id);
      
      if (peli) {
        const peliculaConGeneros = {
          ...peli,
          generosStr: peli.generos ? peli.generos.map((g: any) => g.nombre).join(', ') : ''
        };
        
        this.peliculaSeleccionada.set(peliculaConGeneros);
      }
    }
  }

  avanzarPaso() { this.pasoActual.update(p => p + 1); }
  retrocederPaso() { this.pasoActual.update(p => p - 1); }

  onFuncionSeleccionada(funcionElegida: any) {
    this.reserva.update(r => ({ ...r, funcion: funcionElegida }));
    this.avanzarPaso();
  }

  onButacasSeleccionadas(butacasElegidas: any[]) {
    this.reserva.update(r => ({ ...r, butacas: butacasElegidas }));
    this.avanzarPaso();
  }

  onResumenConfirmado(datos: any) { this.avanzarPaso(); }
  finalizarCompra() { console.log("¡Compra finalizada!"); }
}
