import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoginService } from 'app/authentication/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public loginForm: FormGroup;
  public loginFailed = false;
  public isMobile = false;
  public working = false;
  private watcher: Subscription;
  public hide: boolean = true;
  constructor(private loginService: LoginService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.working = true;
    let loginObj: any = {};
    loginObj.email = this.loginForm.value.email;
    loginObj.password = this.loginForm.value.password;
    // console.log('loginObj', loginObj)
    this.loginService.loginAction(loginObj).subscribe((response) => {
      console.log('login response', response)
      this.working = false;


      switch (response.user.role) {
        case 'user':
          this.router.navigate(['/user-dashboard']);
          break;
        case 'agents':

          break;

        case 'admin':

          break;

        default:
          this.router.navigate(['/listings']);
          break;
      }
    }, error => {
      console.error('Error login', error)
      this.toastr.error('Login Status', error.error.message);
      this.working = false;
      this.loginFailed = true;
    });

  }

  get emailInput() { return this.loginForm.get('email'); }
  get passwordInput() { return this.loginForm.get('password'); }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.min(6)]]
    });
  }

}

