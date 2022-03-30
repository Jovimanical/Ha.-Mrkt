import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTransactionHistoryComponent } from './system-transaction-history.component';

describe('SystemTransactionHistoryComponent', () => {
  let component: SystemTransactionHistoryComponent;
  let fixture: ComponentFixture<SystemTransactionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemTransactionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
