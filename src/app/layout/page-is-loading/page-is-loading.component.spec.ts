import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageIsLoadingComponent } from './page-is-loading.component';

describe('PageIsLoadingComponent', () => {
  let component: PageIsLoadingComponent;
  let fixture: ComponentFixture<PageIsLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageIsLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageIsLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
