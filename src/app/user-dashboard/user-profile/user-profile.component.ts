import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from '../../core/user/user.service';
import { User } from '../../core/user/user.model';
import { BroadcastService } from '../../core/broadcast.service';
import { ConfirmPasswordValidator } from 'app/shared/validators/confirm-password.validator';
import { NotificationService } from 'app/shared/services/notification.service';
import { AuthenticationService } from 'app/authentication/authentication.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  public PageName = "My Profile"
  public profileForm: FormGroup;
  public changePasswordForm: FormGroup;
  public socialMediaForm: FormGroup;
  public profileErrors: any[] = [];
  public user: User;
  public profileImage: string;
  public loading = false;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private broadcastService: BroadcastService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.userService.getCurrentUser()
      .subscribe((user: any) => {
        this.user = user.data;
        this.profileImage = this.user.profileImage;
        this.initializeForm(user.data);
        this.initChangePasswordForm();
        this.initializeSocialForm(user.data);
        this.loading = false;
      }, (error) => {

      });
  }

  public saveProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }
    this.profileErrors = [];
    const profile = this.profileForm.value;
    if (this.profileImage !== null) {
      profile.profileImage = this.profileImage;
    }
    this.loading = true;
    this.userService.updateProfile(JSON.stringify(profile))
      .subscribe(
        (user: any) => {
          this.userService.getCurrentUser()
            .subscribe((user: any) => {
              this.user = user.data;
              this.authService.setUserInfo(user.data);
              this.broadcastService.emitProfileUpdated(this.user);
              this.notificationService.showSuccessMessage('Profile updated successfully');
              //this.resetPasswordFields();
              this.loading = false;

            }, (error) => {

            });
        },
        error => {
          this.loading = false;
          this.profileErrors = error.error[0].errorDescription;
          this.notificationService.showErrorMessage(error.error.message);
        });
  }


  onProfileImageChanged(image: any): void {
    this.profileImage = image;
  }

  get phones(): FormArray {
    return this.profileForm.get('phones') as FormArray;
  }

  private initializeForm(user: User): void {
    this.profileForm = this.formBuilder.group({
      firstname: [user.firstname, Validators.required],
      lastname: [user.lastname, Validators.required],
      email: [user.email, Validators.required],
      mobile: [user.mobile, Validators.required],
      address: [user.address, Validators.required]
    });
  }

  private initChangePasswordForm(): void {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });

    this.changePasswordForm.get('newPassword').valueChanges.subscribe(value => {
      if (value) {
        this.changePasswordForm.get('currentPassword').setValidators([Validators.required]);
        this.changePasswordForm.get('confirmNewPassword').setValidators([ConfirmPasswordValidator.MatchPassword]);
        this.changePasswordForm.get('currentPassword').updateValueAndValidity();
        this.changePasswordForm.get('confirmNewPassword').updateValueAndValidity();
      } else {
        this.changePasswordForm.get('currentPassword').clearValidators();
        this.changePasswordForm.get('confirmNewPassword').clearValidators();
        this.changePasswordForm.get('currentPassword').updateValueAndValidity();
        this.changePasswordForm.get('confirmNewPassword').updateValueAndValidity();
      }
    });
  }

  private resetPasswordFields(): void {
    this.changePasswordForm.get('currentPassword').setValue(null);
    this.changePasswordForm.get('newPassword').setValue(null);
    this.changePasswordForm.get('confirmNewPassword').setValue(null);
    this.changePasswordForm.get('currentPassword').clearValidators();
    this.changePasswordForm.get('newPassword').clearValidators();
    this.changePasswordForm.get('confirmNewPassword').clearValidators();
  }

  private initializeSocialForm(user: User): void {
    this.socialMediaForm = this.formBuilder.group({
      facebook: ['', Validators.required],
      twitter: ['', Validators.required],
      instagram: ['', Validators.required],
      others: ['', Validators.required],
    });
  }

  public saveSocial() {
    this.notificationService.showErrorMessage('No Implementation Yet');
    if (this.socialMediaForm.invalid) {
      return;
    }

  }

  public changePassword() {

    if (this.changePasswordForm.invalid) {
      return;
    }

    const changePassword = this.changePasswordForm.value;
    this.loading = true;
    this.userService.updateUserPassword(JSON.stringify(changePassword))
      .subscribe(
        (user: any) => {
          this.notificationService.showSuccessMessage(user.message);
          this.loading = false;
          this.resetPasswordFields();
        },
        error => {
          this.loading = false;
          console.error('error', error)
          this.notificationService.showErrorMessage(error.error.message);
        });

  }

}
