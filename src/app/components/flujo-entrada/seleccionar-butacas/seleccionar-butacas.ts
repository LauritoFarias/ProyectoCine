import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seleccionar-butacas',
  imports: [CommonModule],
  templateUrl: './seleccionar-butacas.html',
  styleUrl: './seleccionar-butacas.css',
})
export class SeleccionarButacas {

  funcion = input<any>();
  
  onAtras = output<void>();
  onSiguiente = output<any[]>();

}
