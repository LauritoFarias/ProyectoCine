import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarButacas } from './seleccionar-butacas';

describe('SeleccionarButacas', () => {
  let component: SeleccionarButacas;
  let fixture: ComponentFixture<SeleccionarButacas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarButacas],
    }).compileComponents();

    fixture = TestBed.createComponent(SeleccionarButacas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
