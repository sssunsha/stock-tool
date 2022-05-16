import { stock_510050 } from './const/stock/history/big/stock_510050';
import { stock_510300 } from './const/stock/history/big/stock_510300';
import { stock_511010 } from './const/stock/history/bond/stock_511010';
import { stock_511260 } from './const/stock/history/bond/stock_511260';
import { stock_518880 } from './const/stock/history/bond/stock_518880';
import { stock_159915 } from './const/stock/history/small/stock_159915';
import { stock_510500 } from './const/stock/history/small/stock_510500';
export interface Stock {}

export interface StockFromStartDateToEndDate {
  status: number;
  hq: Array<Array<string>>;
  code: string;
  stat?: Array<Object>;
}

export enum HQ {
  date = 0,
  openPrice = 1,
  closePrice = 2,
  increase = 3,
  increaseRate = 4,
}

export enum StockAndBondLabel {
  hs300 = '沪深300',
  sz50 = '上证50',
  zz500 = '中证500',
  cyb = '创业板',
  FiveYearBond = '五年期国债',
  TenYearBond = '十年期国债',
  Gold = '黄金ETF',
  empty = '空仓',
}

export interface StockBondRotateOption {
  label: StockAndBondLabel;
  value: StockFromStartDateToEndDate;
}

export interface StockBondRotateDateOption {
  label: string;
  value: number;
}

// 每次股债轮换的详细记录
export interface stockBondRotateDetail {
  at: Date;
  from?: StockAndBondLabel;
  to?: StockAndBondLabel;
}

export interface StockBondRotateAnalysisReport
  extends StockBondRotateAnalysisRawData {
  startDate?: Date;
  endDate?: Date;
  increaseRateTotal?: number; // 总增长率
  increaseRatePerYear?: number; // 年增长率
  startAmount?: number; // 初始金额
  endAmount?: number; // 最终金额
  reportDetails?: Array<StockBondRotateAnalysisReportDetail>; // 记录每个周期的详细情况
  taxTotal?: number; // 税费总额
  taxPerYear?: number; // 年税费
  currentStock?: StockAndBondLabel;
  currentDate?: Date;
  baseEndPrice?: number; // 用来计算持仓成本
  currentEndPrice?: number; // 用来计算阶段收益
  rotateHistory?: Array<stockBondRotateDetail>;
  isOnGoing?: boolean;
}

export interface StockBondRotateAnalysisReportDetail {
  startDate?: string;
  endDate?: string;
  currentStock?: StockAndBondLabel;
  currentIncrease?: number;
  endAmount?: number;
  startPrice?: number;
  endPrice?: number;
}

export interface StockBondRotateAnalysisRawData {
  big: StockAndBondLabel;
  small: StockAndBondLabel;
  bond: StockAndBondLabel;
  start: string;
  end: string;
  everyInDay: number;
}

export const bigStockOptions: Array<StockBondRotateOption> = [
  {
    label: StockAndBondLabel.hs300,
    value: stock_510300,
  },
  {
    label: StockAndBondLabel.sz50,
    value: stock_510050,
  },
];

export const smallStockOptions: Array<StockBondRotateOption> = [
  {
    label: StockAndBondLabel.zz500,
    value: stock_510500,
  },
  {
    label: StockAndBondLabel.cyb,
    value: stock_159915,
  },
];

export const bondOptions: Array<StockBondRotateOption> = [
  {
    label: StockAndBondLabel.FiveYearBond,
    value: stock_511010,
  },
  {
    label: StockAndBondLabel.TenYearBond,
    value: stock_511260,
  },
  {
    label: StockAndBondLabel.Gold,
    value: stock_518880,
  },
];

export const stockAndBondMap: Map<
  StockAndBondLabel,
  StockFromStartDateToEndDate | null
> = new Map<StockAndBondLabel, StockFromStartDateToEndDate | null>([
  [StockAndBondLabel.Gold, stock_518880],
  [StockAndBondLabel.TenYearBond, stock_511260],
  [StockAndBondLabel.FiveYearBond, stock_511010],
  [StockAndBondLabel.cyb, stock_159915],
  [StockAndBondLabel.zz500, stock_510500],
  [StockAndBondLabel.sz50, stock_510050],
  [StockAndBondLabel.hs300, stock_510300],
  [StockAndBondLabel.empty, null],
]);

export const dateOptions: Array<StockBondRotateDateOption> = [
  {
    label: '5天',
    value: 5,
  },
  {
    label: '10天',
    value: 10,
  },
  {
    label: '15天',
    value: 15,
  },
  {
    label: '20天',
    value: 20,
  },
  {
    label: '25天',
    value: 25,
  },
  {
    label: '30天',
    value: 30,
  },
];
