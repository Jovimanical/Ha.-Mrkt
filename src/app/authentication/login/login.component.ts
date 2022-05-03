import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { LoginService } from './login.service';
import { MobileService } from '../../core/mobile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public loginMobileForm: FormGroup;
  public loginFailed = false;
  public isMobile = false;
  public working = false;
  private watcher: Subscription;
  public hide: boolean = true;
  public returnUrl: string;

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private mobileService: MobileService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }

  }

  ngOnInit(): void {
    // get return url from route parameters or default to ‘/’


    this.initializeForm();
    // this.isMobile = this.mobileService.isMobile();
    // this.watcher = this.mobileService.mobileChanged$.subscribe((isMobile: boolean) => {
    //   this.isMobile = isMobile;
    // });
  }

  ngOnDestroy(): void {
    // this.watcher.unsubscribe();
  }


  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.working = true;

    if (this.isMobile) {
      const phone = this.loginMobileForm.value.phone;
      this.loginService.sendLoginLink(phone, this.isMobile)
        .subscribe((result: any) => {
          this.router.navigate(['authentication/sms-confirmation']);
          this.working = false;
        }, (error: any) => {
          this.working = false;
          this.loginFailed = true;
        });
    } else {

      let loginObj: any = {};
      loginObj.email = this.loginForm.value.email;
      loginObj.password = this.loginForm.value.password;
      // console.log('loginObj', loginObj)
      this.loginService.loginAction(loginObj).pipe(first()).subscribe((response) => {
        // console.log('login response', response)
        this.working = false;
        switch (response.user.roles) {
          case 'user':
            // this.router.navigate([this.returnUrl]);
            this.returnUrl = this.route.snapshot.queryParams['redirectUrl'] || '/user-dashboard';
            this.router.navigateByUrl(this.returnUrl).then(() => {
              window.location.reload();
            });
            break;
          case 'agents':
            const returnAgentUrl = this.route.snapshot.queryParams['redirectUrl'] || '/agent-dashboard';
            this.router.navigateByUrl(returnAgentUrl).then(() => {
              window.location.reload();
            });
            break;

          case 'admin':
            const returnAdminUrl = this.route.snapshot.queryParams['redirectUrl'] || '/admin-dashboard';
            this.router.navigateByUrl(returnAdminUrl).then(() => {
              window.location.reload();
            });
            break;

          default:
            this.router.navigate(['/listings']).then(() => {
              window.location.reload();
            });
            break;
        }


      }, error => {
        console.error('Error login', error)
        this.toastr.error('Login Status', error.error.message);
        this.working = false;
        this.loginFailed = true;
      });
    }
  }

  get emailInput() { return this.loginForm.get('email'); }
  get passwordInput() { return this.loginForm.get('password'); }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.min(6)]]
    });

    this.loginMobileForm = this.formBuilder.group({
      phone: ['', Validators.required]
    });
  }

  public goToRegister() {
    this.router.navigate(['/authentication/register']);
  }
}
