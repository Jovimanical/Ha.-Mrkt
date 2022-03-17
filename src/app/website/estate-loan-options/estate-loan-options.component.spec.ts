import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateLoanOptionsComponent } from './estate-loan-options.component';

describe('EstateLoanOptionsComponent', () => {
  let component: EstateLoanOptionsComponent;
  let fixture: ComponentFixture<EstateLoanOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateLoanOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateLoanOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
