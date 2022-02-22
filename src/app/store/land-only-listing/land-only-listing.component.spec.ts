import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandOnlyListingComponent } from './land-only-listing.component';

describe('LandOnlyListingComponent', () => {
  let component: LandOnlyListingComponent;
  let fixture: ComponentFixture<LandOnlyListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandOnlyListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandOnlyListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
