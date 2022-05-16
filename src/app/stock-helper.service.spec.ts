import { TestBed } from '@angular/core/testing';

import { StockHelperService } from './stock-helper.service';

describe('StockHelperService', () => {
  let service: StockHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
