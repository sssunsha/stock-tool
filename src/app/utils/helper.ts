import { FdDate } from '@fundamental-ngx/core';
import { StockFromStartDateToEndDate } from '../stock.model';
import { cloneDeep } from 'lodash-es';

export function fdDateToString(date: FdDate): string {
  return date?.toDateString().replace(/-/g, '') || '';
}

export function getStockHistoryDetailsArray(
  stock: StockFromStartDateToEndDate | undefined | null
): Array<Array<string>> {
  return cloneDeep(stock?.hq || []).reverse();
}

export function strToDate(str: string): Date {
  return new Date(str);
}

export function dateToStr(date: Date): string {
  if (date) {
    return date.toISOString().split('T')[0];
  }
  return '';
}

export function addOneDay(dateStr: string): Date {
  const date = new Date(dateStr);
  const newDate = new Date(date.getTime() + 3600 * 1000 * 24);
  return newDate;
}
