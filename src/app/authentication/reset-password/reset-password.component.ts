import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/shared/services/alert.service';
import { first } from 'rxjs/operators';
import { MustMatch } from 'app/shared/must-match.validator'
import { ForgotPassword } from '../forgot-password/forgot-password.model';
import { ForgotPasswordStep } from '../forgot-password/forgot-password-step.enum';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public codeSent = false;
  public verificationFailed = false;
  public userEmail: string = '';
  public userCode: string = ''
  public TokenStatus = ForgotPasswordStep;
  public tokenStatus = ForgotPasswordStep.Validating;
  public model: ForgotPassword = { forgotPasswordStep: ForgotPasswordStep.VerifyUser };
  public token = null;
  public form: FormGroup;
  public loading = false;
  public submitted = false;


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userEmail = params['email'];
      this.userCode = params['token'];
      this.codeSent = true;
    });
    this.form = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required],
    }, {
      validator: MustMatch('newPassword', 'confirmNewPassword')
    });

    const token = this.route.snapshot.queryParams['token'];

    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

    this.model.email = this.userEmail;
    this.model.verificationCode = this.userCode;

    this.userService.validateResetToken(JSON.stringify(this.model))
      .pipe(first())
      .subscribe({
        next: () => {
          this.token = token;
          this.tokenStatus = ForgotPasswordStep.ResetPassword;
        },
        error: () => {
          this.tokenStatus = ForgotPasswordStep.Invalid;
        }
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.model.newPassword = this.f.newPassword.value;
    this.model.confirmNewPassword = this.f.confirmNewPassword.value;
    this.userService.resetPassword(this.model)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
          this.router.navigate(['/authentication/login'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }


}
