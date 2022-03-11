import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateMapSidebarComponent } from './estate-map-sidebar.component';

describe('EstateMapSidebarComponent', () => {
  let component: EstateMapSidebarComponent;
  let fixture: ComponentFixture<EstateMapSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateMapSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateMapSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
