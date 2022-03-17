import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceBuildingComponent } from './choice-building.component';

describe('ChoiceBuildingComponent', () => {
  let component: ChoiceBuildingComponent;
  let fixture: ComponentFixture<ChoiceBuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoiceBuildingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoiceBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
