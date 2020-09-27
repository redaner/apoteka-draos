import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptHistoryComponent } from './receipt-history.component';

describe('ReceiptHistoryComponent', () => {
  let component: ReceiptHistoryComponent;
  let fixture: ComponentFixture<ReceiptHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
