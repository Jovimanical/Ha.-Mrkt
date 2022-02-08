import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMaplayoutComponent } from './store-maplayout.component';

describe('StoreMaplayoutComponent', () => {
  let component: StoreMaplayoutComponent;
  let fixture: ComponentFixture<StoreMaplayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreMaplayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreMaplayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
