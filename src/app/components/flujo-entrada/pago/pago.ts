import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago',
  imports: [CommonModule],
  templateUrl: './pago.html',
  styleUrl: './pago.css',
  template: `<p style="color:white">Paso 4: Procesar Pago</p>`
})
export class Pago {
  montoTotal = input.required<number>();
  
  onAtras = output<void>();
  onPagoExitoso = output<void>();
}
