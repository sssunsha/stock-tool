import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { StockHelperService } from '../stock-helper.service';
import {
  bigStockOptions,
  smallStockOptions,
  StockBondRotateAnalysisReport,
  bondOptions,
  dateOptions,
  StockAndBondLabel,
  StockBondRotateOption,
} from '../stock.model';
import {
  DatetimeAdapter,
  DATE_TIME_FORMATS,
  FdDate,
  FdDatetimeAdapter,
  FD_DATETIME_FORMATS,
} from '@fundamental-ngx/core';
import { Subscription } from 'rxjs';

export interface LocalStockBondRotateAnalysisReport
  extends StockBondRotateAnalysisReport {
  isChecked?: boolean;
}

@Component({
  selector: 'app-stock-bond-rotate-analysis-comparison',
  templateUrl: './stock-bond-rotate-analysis-comparison.component.html',
  styleUrls: ['./stock-bond-rotate-analysis-comparison.component.scss'],
  providers: [
    {
      provide: DatetimeAdapter,
      useClass: FdDatetimeAdapter,
    },
    {
      provide: DATE_TIME_FORMATS,
      useValue: FD_DATETIME_FORMATS,
    },
  ],
})
export class StockBondRotateAnalysisComparisonComponent
  implements OnInit, OnDestroy
{
  reports: Array<LocalStockBondRotateAnalysisReport> = [];
  endDate: FdDate = new FdDate(2022, 4, 29);
  startDate: FdDate = new FdDate(2019, 4, 29);
  isChecked: boolean = false;
  constructor(
    public stockHelperService: StockHelperService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.stockHelperService.stockAndBondRotateAnalysisReportSubject.subscribe(
      (data) => {
        if (data) {
          this.reports.push(data);
        } else {
          this.sortReports();
        }
      }
    );
  }

  sortReports(): void {
    this.reports.sort((a, b) =>
      (a.increaseRatePerYear || 0) > (b.increaseRatePerYear || 0) ? -1 : 1
    );
    this.changeDetectorRef.detectChanges();
  }

  reportSelectedChanged(): void {
    // do the compare or look for the details or one report
    this.stockHelperService.stockAndBondRotateAnalysisReportComparisonSubject.next(
      this.reports.filter((r) => r.isChecked)
    );
  }

  go(): void {
    this.reports = [];
    bigStockOptions.forEach((big) => {
      smallStockOptions.forEach((small) => {
        bondOptions.forEach((bond) => {
          dateOptions.forEach((date) => {
            this.stockHelperService.generateStockBondRotateReport({
              big: big.label,
              small: small.label,
              bond: bond.label,
              everyInDay: parseInt(date.label),
              start: this.startDate.toDateString(),
              end: this.endDate.toDateString(),
            });
          });
        });
      });
    });
    this.stockHelperService.stockAndBondRotateAnalysisReportSubject.next(
      undefined
    );
  }
}
