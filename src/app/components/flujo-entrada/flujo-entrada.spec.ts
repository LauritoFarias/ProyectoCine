import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlujoEntrada } from './flujo-entrada';

describe('FlujoEntrada', () => {
  let component: FlujoEntrada;
  let fixture: ComponentFixture<FlujoEntrada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlujoEntrada],
    }).compileComponents();

    fixture = TestBed.createComponent(FlujoEntrada);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
