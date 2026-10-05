import { CommonModule } from '@angular/common';
import { Component, input, output, OnInit, inject, signal, computed } from '@angular/core';
import { SupabaseService } from '../../../services/supabase';

@Component({
  selector: 'app-seleccionar-funcion',
  imports: [CommonModule],
  templateUrl: './seleccionar-funcion.html',
  styleUrl: './seleccionar-funcion.css',
})
export class SeleccionarFuncion {

  private supabase = inject(SupabaseService);

  pelicula = input.required<any>(); 
  onSiguiente = output<any>(); 

  funciones = signal<any[]>([]);

  diaSeleccionado = signal<string>('');
  formatoSeleccionado = signal<string>('');
  funcionSeleccionada = signal<any>(null);


  diasDisponibles = computed(() => {
    const fechas = this.funciones().map(f => f.fecha_hora_inicio.split('T')[0]);
    return [...new Set(fechas)]; // Quita duplicados
  });

  formatosDisponibles = computed(() => {
    if (!this.diaSeleccionado()) return [];
    
    const funcDelDia = this.funciones().filter(f => f.fecha_hora_inicio.startsWith(this.diaSeleccionado()));
    const formatos = funcDelDia.map(f => `${f.tipo_proyeccion} ${f.idioma}`);
    return [...new Set(formatos)];
  });

  horariosDisponibles = computed(() => {
    if (!this.diaSeleccionado() || !this.formatoSeleccionado()) return [];
    
    return this.funciones().filter(f => 
      f.fecha_hora_inicio.startsWith(this.diaSeleccionado()) && 
      `${f.tipo_proyeccion} ${f.idioma}` === this.formatoSeleccionado()
    );
  });

  async ngOnInit() {
    const data = await this.supabase.getFuncionesByPelicula(this.pelicula().id);
    this.funciones.set(data);

    if (this.diasDisponibles().length > 0) {
      this.seleccionarDia(this.diasDisponibles()[0]);
    }
  }

  seleccionarDia(dia: string) {
    this.diaSeleccionado.set(dia);
    
    const formatos = this.formatosDisponibles();
    this.seleccionarFormato(formatos.length > 0 ? formatos[0] : '');
  }

  seleccionarFormato(formato: string) {
    this.formatoSeleccionado.set(formato);
    this.funcionSeleccionada.set(null);
  }

  seleccionarHorario(funcion: any) {
    this.funcionSeleccionada.set(funcion);
  }

  confirmarFuncion() {
    if (this.funcionSeleccionada()) {
      this.onSiguiente.emit(this.funcionSeleccionada());
    }
  }

  
  formatearFecha(fechaIso: string): string {
    const partes = fechaIso.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  extraerHora(fechaHoraIso: string): string {
    const hora = fechaHoraIso.split('T')[1];
    return hora.substring(0, 5);
  }
}
