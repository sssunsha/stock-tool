import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBondRotateAnalysisReportComponent } from './stock-bond-rotate-analysis-report.component';

describe('StockBondRotateAnalysisReportComponent', () => {
  let component: StockBondRotateAnalysisReportComponent;
  let fixture: ComponentFixture<StockBondRotateAnalysisReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockBondRotateAnalysisReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBondRotateAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
