import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-seleccionar-funcion',
  imports: [CommonModule],
  templateUrl: './seleccionar-funcion.html',
  styleUrl: './seleccionar-funcion.css',
  template: `
    <div style="color: white; padding: 2rem;">
      <h2>Paso 1: Selección de Función</h2>
      <!-- Como ahora es un signal, lo leemos con paréntesis en el HTML -->
      <p>ID de la Película recibida: {{ peliculaId() }}</p>
      
      <button (click)="simularEleccion()" style="padding: 10px; background: red; color: white; border: none;">
        Simular elección y avanzar
      </button>
    </div>
  `
})
export class SeleccionarFuncion {
  // Nueva sintaxis de Signal Inputs
  peliculaId = input.required<string>(); 
  
  // Nueva sintaxis de Signal Outputs
  onSiguiente = output<any>(); 

  simularEleccion() {
    this.onSiguiente.emit({ id_funcion: 99, horario: '20:30' });
  }
}
