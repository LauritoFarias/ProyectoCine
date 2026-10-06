import { TestBed } from '@angular/core/testing';

import { Butacas } from './butacas';

describe('Butacas', () => {
  let service: Butacas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Butacas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
