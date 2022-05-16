import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBondRotateAnalysisComponent } from './stock-bond-rotate-analysis.component';

describe('StockBondRotateAnalysisComponent', () => {
  let component: StockBondRotateAnalysisComponent;
  let fixture: ComponentFixture<StockBondRotateAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockBondRotateAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBondRotateAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
