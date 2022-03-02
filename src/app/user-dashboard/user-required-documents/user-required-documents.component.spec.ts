import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequiredDocumentsComponent } from './user-required-documents.component';

describe('UserRequiredDocumentsComponent', () => {
  let component: UserRequiredDocumentsComponent;
  let fixture: ComponentFixture<UserRequiredDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRequiredDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRequiredDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
