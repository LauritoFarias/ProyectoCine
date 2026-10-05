import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarFuncion } from './seleccionar-funcion';

describe('SeleccionarFuncion', () => {
  let component: SeleccionarFuncion;
  let fixture: ComponentFixture<SeleccionarFuncion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarFuncion],
    }).compileComponents();

    fixture = TestBed.createComponent(SeleccionarFuncion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
