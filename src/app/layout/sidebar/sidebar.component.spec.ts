import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidebarComponent } from './sidebar.component';
import { Observable } from 'rxjs';
import { UserService } from '../../core/user/user.service';
import { AngularMaterialModule } from '../../shared/angular-material/angular-material.module';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let userService: UserService;

  beforeEach(async(() => {

    const userServiceStub: any = { getCurrentUser: () => { } };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        FlexLayoutModule
      ],
      declarations: [SidebarComponent],
      providers: [
        { provide: UserService, useValue: userServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.inject(UserService);
    spyOn(userService, 'getCurrentUser').and.callFake(() => new Observable(o => o.next()));
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
