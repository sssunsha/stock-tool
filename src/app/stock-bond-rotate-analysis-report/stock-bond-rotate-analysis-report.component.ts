import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StockHelperService } from '../stock-helper.service';
import {
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
  }
}
