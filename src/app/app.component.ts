import { Component } from '@angular/core';
import { StockHelperService } from './stock-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'stock-tool';

  constructor(public stockHelperService: StockHelperService) {}
}
