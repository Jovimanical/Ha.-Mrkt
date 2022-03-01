import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceLandComponent } from './choice-land.component';

describe('ChoiceLandComponent', () => {
  let component: ChoiceLandComponent;
  let fixture: ComponentFixture<ChoiceLandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoiceLandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoiceLandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
