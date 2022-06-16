import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FundamentalNgxCoreModule } from '@fundamental-ngx/core';
import { StockGrowStatusComponent } from './stock-grow-status/stock-grow-status.component';
import { DatePickerModule } from '@fundamental-ngx/core/date-picker';
import { FormsModule } from '@angular/forms';
import { StockBondRotateAnalysisComponent } from './stock-bond-rotate-analysis/stock-bond-rotate-analysis.component';
import { SelectModule } from '@fundamental-ngx/core/select';
import { StockBondRotateAnalysisReportComponent } from './stock-bond-rotate-analysis-report/stock-bond-rotate-analysis-report.component';
import { StockBondRotateAnalysisComparisonComponent } from './stock-bond-rotate-analysis-comparison/stock-bond-rotate-analysis-comparison.component';
import { CheckboxModule } from '@fundamental-ngx/core/checkbox';
import { FixedCardLayoutModule } from '@fundamental-ngx/core/fixed-card-layout';
import { ResizableCardLayoutModule } from '@fundamental-ngx/core/resizable-card-layout';

@NgModule({
  declarations: [
    AppComponent,
    StockGrowStatusComponent,
    StockBondRotateAnalysisComponent,
    StockBondRotateAnalysisReportComponent,
    StockBondRotateAnalysisComparisonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    DatePickerModule,
    SelectModule,
    ResizableCardLayoutModule,
    FundamentalNgxCoreModule,
    CheckboxModule,
    FixedCardLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
