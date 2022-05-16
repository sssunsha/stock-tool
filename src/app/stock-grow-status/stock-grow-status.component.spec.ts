import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockGrowStatusComponent } from './stock-grow-status.component';

describe('StockGrowStatusComponent', () => {
  let component: StockGrowStatusComponent;
  let fixture: ComponentFixture<StockGrowStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockGrowStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockGrowStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
