import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBondRotateAnalysisComparisonComponent } from './stock-bond-rotate-analysis-comparison.component';

describe('StockBondRotateAnalysisComparisonComponent', () => {
  let component: StockBondRotateAnalysisComparisonComponent;
  let fixture: ComponentFixture<StockBondRotateAnalysisComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockBondRotateAnalysisComparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBondRotateAnalysisComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
