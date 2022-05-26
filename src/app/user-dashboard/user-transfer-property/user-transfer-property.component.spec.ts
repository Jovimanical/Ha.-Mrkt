import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTransferPropertyComponent } from './user-transfer-property.component';

describe('UserTransferPropertyComponent', () => {
  let component: UserTransferPropertyComponent;
  let fixture: ComponentFixture<UserTransferPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTransferPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTransferPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
