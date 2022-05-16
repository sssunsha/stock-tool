import { Component, OnInit } from '@angular/core';
import {
  DatetimeAdapter,
  DateTimeFormats,
  DATE_TIME_FORMATS,
  FdDate,
  FdDatetimeAdapter,
  FD_DATETIME_FORMATS,
} from '@fundamental-ngx/core';
import { StockHelperService } from '../stock-helper.service';
import { fdDateToString } from '../utils/helper';

@Component({
  selector: 'app-stock-grow-status',
  templateUrl: './stock-grow-status.component.html',
  styleUrls: ['./stock-grow-status.component.scss'],
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
export class StockGrowStatusComponent implements OnInit {
  endDate: FdDate = FdDate.getNow();
  // the default start date is the date of end date one month ago
  startDate: FdDate = this.generateStartDate();
  stockID: string = '';

  constructor(private stockHelperService: StockHelperService) {}

  ngOnInit(): void {}

  search(): void {
    this.stockHelperService
      .getStockFromStartDateToEndDate(
        this.getStartDate(),
        this.getEndDate(),
        this.stockID
      )
      .subscribe(
        (data) => console.log(data),
        (error) => console.error(error)
      );
  }

  getEndDate(): string {
    return fdDateToString(this.endDate);
  }

  getStartDate(): string {
    return fdDateToString(this.startDate);
  }

  generateStartDate(): FdDate {
    let end = new Date();
    end.setMonth(end.getMonth() - 1);
    return FdDate.getFdDateByDate(end);
  }
}
