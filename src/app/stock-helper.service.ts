import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, Subject } from 'rxjs';
import {
  dateToStr,
  getStockHistoryDetailsArray,
  strToDate,
} from './utils/helper';
import {
  StockAndBondLabel,
  stockAndBondMap,
  stockBondRotateDetail,
} from './stock.model';
import {
  HQ,
  StockBondRotateAnalysisRawData,
  StockBondRotateAnalysisReport,
  StockFromStartDateToEndDate,
} from './stock.model';

export const ONE_DAY_IN_TIME: number = 3600 * 24 * 1000;

@Injectable({
  providedIn: 'root',
})
export class StockHelperService {
  public isStockBondRotateAnalysisReportVisible = false;
  public stockAndBondRotateAnalysisReportSubject: Subject<StockBondRotateAnalysisReport> =
    new Subject();

  private baseUrl: string = 'http://q.stock.sohu.com/hisHq';

  constructor(private http: HttpClient) {}

  getStockFromStartDateToEndDate(
    start: string,
    end: string,
    stockID: string
  ): Observable<StockFromStartDateToEndDate> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('code', `cn_${stockID}`);
    httpParams = httpParams.set('start', start);
    httpParams = httpParams.set('end', end);
    httpParams = httpParams.set('stat', '1');
    httpParams = httpParams.set('order', 'D');
    httpParams = httpParams.set('period', 'd');
    httpParams = httpParams.set('callback', 'historySearchHandler');
    httpParams = httpParams.set('rt', 'json');

    let httpHeader = new HttpHeaders();
    httpHeader = httpHeader.set('Cache-Control', 'no-cache');
    httpHeader = httpHeader.set('User-Agent', 'PostmanRuntime/7.26.8');
    httpHeader = httpHeader.set('Accept', '*/*');
    httpHeader = httpHeader.set('host', 'sohu.com');
    httpHeader = httpHeader.set('Origin', 'http://localhost:4400');
    httpHeader = httpHeader.set('Accept-Encoding', 'gzip, deflate, br');
    httpHeader = httpHeader.set('Access-Control-Allow-Origin', '*');

    return this.http.get<StockFromStartDateToEndDate>(this.baseUrl, {
      params: httpParams,
      headers: httpHeader,
    });
  }

  generateStockBondRotateReport(rawData: StockBondRotateAnalysisRawData): void {
    const bigStockDetails: Array<Array<string>> = getStockHistoryDetailsArray(
      stockAndBondMap.get(rawData.big)
    );
    const bigStockDetailsLastIndex: number = bigStockDetails.length - 1;
    const smallStockDetails: Array<Array<string>> = getStockHistoryDetailsArray(
      stockAndBondMap.get(rawData.small)
    );
    const smallStockDetailsLastIndex: number = smallStockDetails.length - 1;
    const bondDetails: Array<Array<string>> = getStockHistoryDetailsArray(
      stockAndBondMap.get(rawData.bond)
    );
    const bondDetailsLastIndex: number = bondDetails.length - 1;

    let isStockChanged = false;

    // first check the date from start to end is existed in the stock history details
    if (
      strToDate(rawData.start) < strToDate(bigStockDetails[0][HQ.date]) ||
      strToDate(rawData.start) < strToDate(smallStockDetails[0][HQ.date]) ||
      strToDate(rawData.start) < strToDate(bondDetails[0][HQ.date])
    ) {
      alert('起始日期太早');
      return;
    }

    if (
      strToDate(rawData.end) >
        strToDate(bigStockDetails[bigStockDetailsLastIndex][HQ.date]) ||
      strToDate(rawData.end) >
        strToDate(smallStockDetails[smallStockDetailsLastIndex][HQ.date]) ||
      strToDate(rawData.end) >
        strToDate(bondDetails[bondDetailsLastIndex][HQ.date])
    ) {
      alert('截止日期太迟');
      return;
    }

    if (strToDate(rawData.end) < strToDate(rawData.start)) {
      alert('截止日期不能早于起始日期');
      return;
    }

    // 第一轮先根据间隔周期计算出哪个盘最有优势，并且重仓

    this.isStockBondRotateAnalysisReportVisible = true;

    const bigFirstIndex = bigStockDetails.findIndex(
      (d) => d[HQ.date] === rawData.start
    );
    const smallFirstIndex = smallStockDetails.findIndex(
      (d) => d[HQ.date] === rawData.start
    );
    const bondFirstIndex = bondDetails.findIndex(
      (d) => d[HQ.date] === rawData.start
    );

    const analysisReport: StockBondRotateAnalysisReport = { ...rawData };
    analysisReport.startDate = new Date(rawData.start);
    analysisReport.endDate = new Date(rawData.end);
    analysisReport.startAmount = 10000; // 初始为1万元
    analysisReport.endAmount = analysisReport.startAmount;
    analysisReport.reportDetails = [];
    analysisReport.increaseRateTotal = 0;
    analysisReport.increaseRatePerYear = 0;
    analysisReport.taxTotal = 0; // 初始税费为0
    analysisReport.currentDate = analysisReport.startDate;
    analysisReport.currentStock = StockAndBondLabel.empty;
    analysisReport.baseEndPrice = 0;
    analysisReport.currentEndPrice = 0;
    analysisReport.rotateHistory = [];
    analysisReport.isOnGoing = true;

    let currentDayIncluded = 0 - rawData.everyInDay;

    while (
      bigStockDetails.length - 1 - rawData.everyInDay - bigFirstIndex >
        currentDayIncluded &&
      smallStockDetails.length - 1 - rawData.everyInDay - smallFirstIndex >
        currentDayIncluded &&
      bondDetails.length - 1 - rawData.everyInDay - bondFirstIndex >
        currentDayIncluded &&
      bigFirstIndex + currentDayIncluded >= 0 &&
      smallFirstIndex + currentDayIncluded >= 0 &&
      bondFirstIndex + currentDayIncluded >= 0 &&
      analysisReport.currentDate <= new Date(rawData.end)
    ) {
      // 计算一个周期的开始始日期
      const baseDateStr =
        bigStockDetails[bigFirstIndex + currentDayIncluded][HQ.date];
      // 计算一个周期的开始那天的收盘价格
      const bigStartPrice = this.getEndPriceBasedOnDate(
        bigStockDetails,
        baseDateStr
      );
      const smallStartPrice = this.getEndPriceBasedOnDate(
        smallStockDetails,
        baseDateStr
      );
      const bondStartPrice = this.getEndPriceBasedOnDate(
        bondDetails,
        baseDateStr
      );
      const previousStock = analysisReport.currentStock;

      // 叠加一个周期
      currentDayIncluded += rawData.everyInDay;

      // 计算一个周期结束的日期
      const currentDateStr =
        bigStockDetails[bigFirstIndex + currentDayIncluded][HQ.date];
      // 计算一个周期结束那天的收盘价格
      const bigEndPrice = this.getEndPriceBasedOnDate(
        bigStockDetails,
        currentDateStr
      );
      const smallEndPrice = this.getEndPriceBasedOnDate(
        smallStockDetails,
        currentDateStr
      );
      const bondEndPrice = this.getEndPriceBasedOnDate(
        bondDetails,
        currentDateStr
      );

      // 计算大盘，小盘，和债券在本周期内的涨跌情况
      const bigIncreaseRate = (bigEndPrice - bigStartPrice) / bigStartPrice;
      const smallIncreaseRate =
        (smallEndPrice - smallStartPrice) / smallStartPrice;
      const bondIncreaseRate = (bondEndPrice - bondStartPrice) / bondStartPrice;

      // 根据当前的持股情况更新analysis report 的 currentEndPrice
      this.updateCurrentPrice(
        analysisReport,
        bigStartPrice,
        smallStartPrice,
        bondStartPrice,
        bigEndPrice,
        smallEndPrice,
        bondEndPrice
      );

      // 准备换仓记录
      const rotateDetail: stockBondRotateDetail = {
        at: new Date(
          bigStockDetails[currentDayIncluded + bigFirstIndex][HQ.date]
        ),
        from: analysisReport.currentStock,
        to: StockAndBondLabel.empty, // default is go to empty
      };

      // 选出阶段涨幅最大的股票，全仓买进, 并且做轮转记录
      // TODO:: 还是要想想换仓策略
      let sortArray: Array<{ rate: number; label: StockAndBondLabel }> = [
        { rate: bigIncreaseRate, label: rawData.big },
        { rate: smallIncreaseRate, label: rawData.small },
        { rate: bondIncreaseRate, label: rawData.bond },
      ];
      sortArray = sortArray.sort((a, b) => (a.rate > b.rate ? -1 : 1));

      if (
        sortArray[0].rate > 0 &&
        sortArray[0].label != analysisReport.currentStock
      ) {
        // 如果上一个周期增长率最大的类别是盈利的，并且与当前的持仓类别不一样，就开始换仓
        // 先计算当前的收益情况
        this.updateEndAmount(analysisReport);
        analysisReport.taxTotal += this.calculateTax(analysisReport);
        analysisReport.endAmount -= this.calculateTax(analysisReport);

        // 换仓
        isStockChanged = true;
        analysisReport.currentStock = sortArray[0].label;
        switch (sortArray[0].rate) {
          case bigIncreaseRate:
            analysisReport.baseEndPrice = bigEndPrice;
            break;
          case smallIncreaseRate:
            analysisReport.baseEndPrice = smallEndPrice;
            break;
          case bondIncreaseRate:
            analysisReport.baseEndPrice = bondEndPrice;
            break;
        }
        rotateDetail.to = sortArray[0].label;
        analysisReport.rotateHistory?.push(rotateDetail);
      } else if (sortArray[0].rate <= 0) {
        // 如果上一个周期所有类别都在亏损，就空仓
        if (analysisReport.currentStock !== StockAndBondLabel.empty) {
          // 当前没有空仓, 需要换仓
          // 先计算当前的收益情况
          this.updateEndAmount(analysisReport, true);
          analysisReport.currentStock = StockAndBondLabel.empty;
          isStockChanged = true;
          rotateDetail.to = StockAndBondLabel.empty;
          analysisReport.baseEndPrice = 0;
          analysisReport.rotateHistory?.push(rotateDetail);
        } else {
          // 当前已经是空仓的话，继续空仓
          isStockChanged = false;
          analysisReport.currentStock = StockAndBondLabel.empty;
          analysisReport.baseEndPrice = 0; // 空仓的情况持仓成本为0
        }
      } else {
        // 继续持仓不变，更新收益
        isStockChanged = false;
        this.updateEndAmount(analysisReport);
      }

      analysisReport.currentDate = rotateDetail.at;

      this.updateReportRoundDetail(
        analysisReport,
        previousStock,
        currentDateStr,
        baseDateStr
      );
    }
    // 计算最后一段时间的收益 (假设最后一段时间不换仓, 也不用再算税费)
    if (
      analysisReport.endDate.getTime() > analysisReport.currentDate.getTime()
    ) {
      let currentEndPrice = 0;
      const endDateStr = dateToStr(analysisReport.endDate);
      const currentDateStr = dateToStr(analysisReport.currentDate);
      switch (analysisReport.currentStock) {
        case StockAndBondLabel.FiveYearBond:
        case StockAndBondLabel.TenYearBond:
        case StockAndBondLabel.Gold:
          analysisReport.currentEndPrice = parseFloat(
            (bondDetails.find((d) => d[HQ.date] === endDateStr) || [])[
              HQ.closePrice
            ]
          );
          this.updateEndAmount(analysisReport, isStockChanged);
          break;
        case StockAndBondLabel.cyb:
        case StockAndBondLabel.zz500:
          analysisReport.currentEndPrice = parseFloat(
            (smallStockDetails.find((d) => d[HQ.date] === endDateStr) || [])[
              HQ.closePrice
            ]
          );
          this.updateEndAmount(analysisReport, isStockChanged);
          break;
        case StockAndBondLabel.hs300:
        case StockAndBondLabel.sz50:
          analysisReport.currentEndPrice = parseFloat(
            (bigStockDetails.find((d) => d[HQ.date] === endDateStr) || [])[
              HQ.closePrice
            ]
          );
          this.updateEndAmount(analysisReport, isStockChanged);
          break;
        case StockAndBondLabel.empty:
          analysisReport.currentEndPrice = 0;
          break;
      }
      this.updateReportRoundDetail(
        analysisReport,
        analysisReport.currentStock,
        endDateStr,
        currentDateStr
      );
    }

    // 计算 总增长率
    analysisReport.increaseRateTotal =
      (analysisReport.endAmount - analysisReport.startAmount) /
      analysisReport.startAmount;
    // 计算 年增长率
    const totalDay =
      (analysisReport.endDate.getTime() - analysisReport.startDate.getTime()) /
      ONE_DAY_IN_TIME;
    analysisReport.increaseRatePerYear =
      analysisReport.increaseRateTotal / (totalDay / 360);
    // 计算年税费
    analysisReport.taxPerYear = analysisReport.taxTotal / (totalDay / 360);
    // 计算盈利率
    analysisReport.increaseRateTotal =
      (analysisReport.endAmount - analysisReport.startAmount) /
      analysisReport.startAmount;
    analysisReport.increaseRatePerYear =
      analysisReport.increaseRateTotal / (totalDay / 360);
    analysisReport.isOnGoing = false;

    this.stockAndBondRotateAnalysisReportSubject.next(analysisReport);
  }

  // 计算增长后的总金额变化
  private calculateIncrease(
    endAmount: number,
    basePrice: number,
    currentPrice: number
  ): number {
    return (endAmount / basePrice) * currentPrice;
  }

  // 计算扣税后的总金额变化
  private calculateTax(analysisReport: StockBondRotateAnalysisReport): number {
    if (analysisReport.currentStock !== StockAndBondLabel.empty) {
      return (analysisReport.endAmount || 0) * (0.03 * 0.01); // 税率万分之三
    } else {
      return 0;
    }
  }

  private updateEndAmount(
    analysisReport: StockBondRotateAnalysisReport,
    isNeedUpdateTax: boolean = false
  ): void {
    if (analysisReport.currentStock !== StockAndBondLabel.empty) {
      // 空仓不用叠加收益
      analysisReport.endAmount = this.calculateIncrease(
        analysisReport.endAmount || 0,
        analysisReport.baseEndPrice || 0,
        analysisReport.currentEndPrice || 0
      );
    }

    if (isNeedUpdateTax) {
      if (analysisReport.taxTotal && analysisReport.endAmount) {
        analysisReport.taxTotal += this.calculateTax(analysisReport);
        analysisReport.endAmount -= this.calculateTax(analysisReport);
      }
    }
  }

  private updateReportRoundDetail(
    analysisReport: StockBondRotateAnalysisReport,
    currentStock: StockAndBondLabel,
    currentDateStr: string,
    baseDateStr: string
  ): void {
    let lastEndAmount = analysisReport.startAmount;
    if ((analysisReport.reportDetails || []).length > 0) {
      lastEndAmount =
        (analysisReport.reportDetails || [])[
          (analysisReport.reportDetails || []).length - 1
        ].endAmount || 0;
    }
    analysisReport.reportDetails?.push({
      currentIncrease: (analysisReport.endAmount || 0) - (lastEndAmount || 0),
      currentStock: currentStock,
      endDate: currentDateStr,
      startDate: baseDateStr,
      endAmount: analysisReport.endAmount,
      startPrice: analysisReport.baseEndPrice,
      endPrice: analysisReport.currentEndPrice,
    });
  }

  private getEndPriceBasedOnDate(
    stockDetails: string[][],
    dateStr: string
  ): number {
    if (stockDetails.length) {
      const value = stockDetails.find((s) => s[HQ.date] === dateStr);
      if (value) {
        return parseFloat(value[HQ.closePrice]);
      }
    }
    window.alert(`can't find ${dateStr} endPrice`);
    return -1;
  }

  private updateCurrentPrice(
    analysisReport: StockBondRotateAnalysisReport,
    bigStartPrice: number,
    smallStartPrice: number,
    bondStartPrice: number,
    bigEndPrice: number,
    smallEndPrice: number,
    bondEndPrice: number
  ): void {
    switch (analysisReport.currentStock) {
      case StockAndBondLabel.FiveYearBond:
      case StockAndBondLabel.TenYearBond:
      case StockAndBondLabel.Gold:
        analysisReport.currentEndPrice = bondEndPrice;
        analysisReport.baseEndPrice = bondStartPrice;
        break;
      case StockAndBondLabel.cyb:
      case StockAndBondLabel.zz500:
        analysisReport.currentEndPrice = smallEndPrice;
        analysisReport.baseEndPrice = smallStartPrice;
        break;
      case StockAndBondLabel.hs300:
      case StockAndBondLabel.sz50:
        analysisReport.currentEndPrice = bigEndPrice;
        analysisReport.baseEndPrice = bigStartPrice;
        break;
      case StockAndBondLabel.empty:
        analysisReport.currentEndPrice = 0;
        analysisReport.baseEndPrice = 0;
        break;
    }
  }
}
