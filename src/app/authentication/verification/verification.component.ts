import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VerificationService } from './verification.service';
import { Verification } from './verification.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  public verificationForm: FormGroup;
  public codeSent = false;
  public verificationFailed = false;
  public userEmail: string = '';
  public userCode: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private verificationService: VerificationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userEmail = params['email'];
      this.userCode = params['code'];
    });
    
    this.initializeForm();
  }

  sendCode(): void {
    this.verificationService.sendCode()
      .subscribe(() => {
        this.codeSent = true;
      });
  }

  verify(): boolean {
    if (this.verificationForm.invalid) {
      return;
    }

    const verification = this.verificationForm.value as Verification;
    this.verificationService.verify(verification)
      .subscribe(() => {
        this.userService.emitUserVerificationRequired(false);
        this.router.navigate(['/listings']);
      }, () => {
        this.verificationFailed = true;
      });
  }

  private initializeForm(): void {
    this.verificationForm = this.formBuilder.group({
      email: [this.userEmail ? this.userEmail : '', Validators.required],
      code: [this.userCode ? this.userCode : '', Validators.required]
    });
  }
}
