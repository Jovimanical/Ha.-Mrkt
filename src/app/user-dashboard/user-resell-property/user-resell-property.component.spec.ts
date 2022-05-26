import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResellPropertyComponent } from './user-resell-property.component';

describe('UserResellPropertyComponent', () => {
  let component: UserResellPropertyComponent;
  let fixture: ComponentFixture<UserResellPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserResellPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResellPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
