import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDigitalTitleComponent } from './user-digital-title.component';

describe('UserDigitalTitleComponent', () => {
  let component: UserDigitalTitleComponent;
  let fixture: ComponentFixture<UserDigitalTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDigitalTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDigitalTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
