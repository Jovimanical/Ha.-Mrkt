import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredLandProcessComponent } from './registered-land-process.component';

describe('RegisteredLandProcessComponent', () => {
  let component: RegisteredLandProcessComponent;
  let fixture: ComponentFixture<RegisteredLandProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredLandProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredLandProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
