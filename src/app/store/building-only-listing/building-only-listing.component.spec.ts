import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingOnlyListingComponent } from './building-only-listing.component';

describe('BuildingOnlyListingComponent', () => {
  let component: BuildingOnlyListingComponent;
  let fixture: ComponentFixture<BuildingOnlyListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingOnlyListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingOnlyListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
