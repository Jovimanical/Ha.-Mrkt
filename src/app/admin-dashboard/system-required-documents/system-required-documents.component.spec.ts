import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemRequiredDocumentsComponent } from './system-required-documents.component';

describe('SystemRequiredDocumentsComponent', () => {
  let component: SystemRequiredDocumentsComponent;
  let fixture: ComponentFixture<SystemRequiredDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemRequiredDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemRequiredDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
