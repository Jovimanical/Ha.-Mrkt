import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLandComponent } from './register-land.component';

describe('RegisterLandComponent', () => {
  let component: RegisterLandComponent;
  let fixture: ComponentFixture<RegisterLandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterLandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterLandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
