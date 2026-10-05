import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarCompra } from './confirmar-compra';

describe('ConfirmarCompra', () => {
  let component: ConfirmarCompra;
  let fixture: ComponentFixture<ConfirmarCompra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarCompra],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmarCompra);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
