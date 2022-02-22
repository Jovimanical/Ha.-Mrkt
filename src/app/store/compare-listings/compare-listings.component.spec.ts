import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareListingsComponent } from './compare-listings.component';

describe('CompareListingsComponent', () => {
  let component: CompareListingsComponent;
  let fixture: ComponentFixture<CompareListingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareListingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
