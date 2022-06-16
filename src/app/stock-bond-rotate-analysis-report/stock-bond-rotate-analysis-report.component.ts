import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StockHelperService } from '../stock-helper.service';
import {
  StockAndBondLabel,
  StockBondRotateAnalysisReport,
  StockBondRotateAnalysisReportDetail,
} from '../stock.model';

@Component({
  selector: 'app-stock-bond-rotate-analysis-report',
  templateUrl: './stock-bond-rotate-analysis-report.component.html',
  styleUrls: ['./stock-bond-rotate-analysis-report.component.scss'],
})
export class StockBondRotateAnalysisReportComponent implements OnInit {
  result: Array<StockBondRotateAnalysisReportDetail> = [];
  report: StockBondRotateAnalysisReport | undefined;
  StockAndBondLabel = StockAndBondLabel;
  constructor(
    public stockHelperService: StockHelperService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.stockHelperService.stockAndBondRotateAnalysisReportSubject.subscribe(
      (data) => {
        if (data) {
          this.result = data.reportDetails || [];
          this.report = data;
        } else {
          this.result = [];
          this.report = undefined;
        }
        this.changeDetectorRef.detectChanges();
      }
    );
    this.stockHelperService.stockAndBondRotateAnalysisReportComparisonSubject.subscribe(
      (list) => {
        if (list?.length === 1) {
          // show the detail of one report
          this.result = list[0].reportDetails || [];
          this.report = list[0];
        } else if (list?.length > 1) {
          this.result = [];
          this.report = undefined;
        } else {
          this.result = [];
          this.report = undefined;
        }
        this.changeDetectorRef.detectChanges();
      }
    );
  }
}
