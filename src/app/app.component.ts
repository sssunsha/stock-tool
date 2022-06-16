import { Component } from '@angular/core';
import { ResizableCardLayoutConfig } from '@fundamental-ngx/core';
import { StockHelperService } from './stock-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  layoutConfig: ResizableCardLayoutConfig;
  title = 'stock-tool';

  constructor(public stockHelperService: StockHelperService) {
    this.layoutConfig = [
      {
        rank: 1,
        cardWidthColSpan: 1,
        cardHeightRowSpan: 35,
        // cardMiniHeaderRowSpan: 5,
        // cardMiniContentRowSpan: 12,
        resizable: true,
      },
      {
        rank: 2,
        cardWidthColSpan: 1,
        cardHeightRowSpan: 35,
        // cardMiniHeaderRowSpan: 5,
        // cardMiniContentRowSpan: 8,
        resizable: true,
      },
      {
        rank: 3,
        cardWidthColSpan: 2,
        cardHeightRowSpan: 85,
        // cardMiniHeaderRowSpan: 5,
        // cardMiniContentRowSpan: 8,
        resizable: true,
      },
      {
        rank: 4,
        cardWidthColSpan: 2,
        cardHeightRowSpan: 50,
        // cardMiniHeaderRowSpan: 5,
        // cardMiniContentRowSpan: 8,
        resizable: true,
      },
    ];
  }
}
