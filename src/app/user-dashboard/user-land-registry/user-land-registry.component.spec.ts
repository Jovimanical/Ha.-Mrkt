import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLandRegistryComponent } from './user-land-registry.component';

describe('UserLandRegistryComponent', () => {
  let component: UserLandRegistryComponent;
  let fixture: ComponentFixture<UserLandRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLandRegistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLandRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
