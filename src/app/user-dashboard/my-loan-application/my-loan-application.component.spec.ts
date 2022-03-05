import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLoanApplicationComponent } from './my-loan-application.component';

describe('MyLoanApplicationComponent', () => {
  let component: MyLoanApplicationComponent;
  let fixture: ComponentFixture<MyLoanApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyLoanApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLoanApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
