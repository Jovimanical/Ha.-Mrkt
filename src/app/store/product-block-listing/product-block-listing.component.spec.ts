import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBlockListingComponent } from './product-block-listing.component';

describe('ProductBlockListingComponent', () => {
  let component: ProductBlockListingComponent;
  let fixture: ComponentFixture<ProductBlockListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBlockListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBlockListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
