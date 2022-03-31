import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequiredAssetsComponent } from './user-required-assets.component';

describe('UserRequiredAssetsComponent', () => {
  let component: UserRequiredAssetsComponent;
  let fixture: ComponentFixture<UserRequiredAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRequiredAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRequiredAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
