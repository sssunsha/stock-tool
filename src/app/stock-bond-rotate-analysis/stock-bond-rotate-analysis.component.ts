import { Component, OnInit } from '@angular/core';
import { StockHelperService } from '../stock-helper.service';
import { fdDateToString } from '../utils/helper';
import {
  bigStockOptions,
  bondOptions,
  smallStockOptions,
  dateOptions,
} from '../stock.model';
import {
  DatetimeAdapter,
  DATE_TIME_FORMATS,
  FdDate,
  FdDatetimeAdapter,
  FD_DATETIME_FORMATS,
} from '@fundamental-ngx/core';
import {
  StockAndBondLabel,
  StockBondRotateDateOption,
  StockBondRotateOption,
  StockFromStartDateToEndDate,
} from '../stock.model';

@Component({
  selector: 'app-stock-bond-rotate-analysis',
  templateUrl: './stock-bond-rotate-analysis.component.html',
  styleUrls: ['./stock-bond-rotate-analysis.component.scss'],
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
export class StockBondRotateAnalysisComponent implements OnInit {
  bigStockOptions: Array<StockBondRotateOption> = bigStockOptions;
  bigStockSelected: any = StockAndBondLabel.hs300;
  smallStockOptions: Array<StockBondRotateOption> = smallStockOptions;
  smallStockSelected: any = StockAndBondLabel.cyb;
  bondOptions: Array<StockBondRotateOption> = bondOptions;
  bondSelected: any = StockAndBondLabel.TenYearBond;
  dateOptions: Array<StockBondRotateDateOption> = dateOptions;
  dateSelected: any;

  endDate: FdDate = new FdDate(2022, 4, 29);
  startDate: FdDate = new FdDate(2019, 4, 29);

  constructor(private stockHelperService: StockHelperService) {}

  ngOnInit(): void {
    this.dateSelected = this.dateOptions[3].value;
  }

  go(): void {
    this.stockHelperService.generateStockBondRotateReport({
      big: this.bigStockSelected,
      small: this.smallStockSelected,
      bond: this.bondSelected,
      everyInDay: this.dateSelected,
      start: this.startDate.toDateString(),
      end: this.endDate.toDateString(),
    });
  }
}
