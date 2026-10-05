import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SeleccionarFuncion } from './seleccionar-funcion/seleccionar-funcion';
import { SeleccionarButacas } from './seleccionar-butacas/seleccionar-butacas';
import { ConfirmarCompra } from './confirmar-compra/confirmar-compra';
import { Pago } from './pago/pago';

@Component({
  selector: 'app-flujo-entrada',
  imports: [CommonModule, SeleccionarFuncion, SeleccionarButacas, ConfirmarCompra, Pago],
  templateUrl: './flujo-entrada.html',
  styleUrl: './flujo-entrada.css',
})
export class FlujoEntrada implements OnInit {

  private route = inject(ActivatedRoute);

  pasoActual = signal<number>(1); 

  // Estado global de la reserva
  reserva = signal({
    peliculaId: '',
    funcion: null as any,
    butacas: [] as any[],
    candy: [] as any[],
    total: 0
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reserva.update(r => ({ ...r, peliculaId: id }));
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

  onResumenConfirmado(datosConfirmacion: any) {
    // Aquí guardaremos el total y lo del candy
    this.avanzarPaso();
  }

  finalizarCompra() {
    console.log("¡Compra finalizada!", this.reserva());
    // Lógica final de PDF y base de datos
  }
}
