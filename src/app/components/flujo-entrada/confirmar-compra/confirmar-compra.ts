import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmar-compra',
  imports: [CommonModule],
  templateUrl: './confirmar-compra.html',
  styleUrl: './confirmar-compra.css',
  template: `<p style="color:white">Paso 3: Candy Bar y Resumen</p>`
})
export class ConfirmarCompra {
  reservaActual = input.required<any>();
  
  onAtras = output<void>();
  onSiguiente = output<any>();
}
