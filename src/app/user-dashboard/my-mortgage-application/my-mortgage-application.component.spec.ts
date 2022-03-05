import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMortgageApplicationComponent } from './my-mortgage-application.component';

describe('MyMortgageApplicationComponent', () => {
  let component: MyMortgageApplicationComponent;
  let fixture: ComponentFixture<MyMortgageApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMortgageApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMortgageApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
