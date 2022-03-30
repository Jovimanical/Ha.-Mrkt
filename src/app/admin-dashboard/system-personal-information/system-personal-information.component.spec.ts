import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemPersonalInformationComponent } from './system-personal-information.component';

describe('SystemPersonalInformationComponent', () => {
  let component: SystemPersonalInformationComponent;
  let fixture: ComponentFixture<SystemPersonalInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemPersonalInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemPersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
