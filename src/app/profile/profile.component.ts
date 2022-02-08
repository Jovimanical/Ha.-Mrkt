import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from '../core/user/user.service';
import { User } from '../core/user/user.model';
import { BroadcastService } from '../core/broadcast.service';
import { ConfirmPasswordValidator } from 'app/shared/validators/confirm-password.validator';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  profileErrors: any[] = [];
  user: User;
  profileImage: string;
  loading = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private broadcastService: BroadcastService) { }

  ngOnInit() {
    this.loading = true;
    this.userService.getCurrentUser()
      .subscribe((user: any) => {
        this.user = user.data;
        this.initializeForm(user.data);
        this.loading = false;
      }, (error) => {

      });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }
    this.profileErrors = [];
    const profile = this.profileForm.value as User;
    if (this.profileImage != null) {
      profile.profileImage = this.profileImage;
    }
    this.loading = true;
    this.userService.updateProfile(profile)
      .subscribe(
        (user: any) => {
          this.user = user.data;
          this.broadcastService.emitProfileUpdated(this.user);
          this.notificationService.showSuccessMessage('Profile updated successfully');
          this.resetPasswordFields();
          this.loading = false;
        },
        error => {
          this.loading = false;
          this.profileErrors = error.error[0].errorDescription;
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
      company: [user.company, Validators.required],
      currentPassword: [''],
      newPassword: [''],
      confirmNewPassword: [''],
      phones: this.formBuilder.array([])
    });

    user.phones.forEach(phone => {
      this.phones.push(this.formBuilder.group({
        phoneNumber: [phone.phoneNumber, Validators.required],
        phoneType: 'Mobile'
      }));
    });

    if (this.phones.length === 0) {
      this.phones.push(this.formBuilder.group({
        phoneNumber: [null, Validators.required],
        phoneType: 'Mobile'
      }));
    }

    this.profileForm.get('newPassword').valueChanges.subscribe(value => {
      if (value) {
        this.profileForm.get('currentPassword').setValidators([Validators.required]);
        this.profileForm.get('confirmNewPassword').setValidators([ConfirmPasswordValidator.MatchPassword]);
        this.profileForm.get('currentPassword').updateValueAndValidity();
        this.profileForm.get('confirmNewPassword').updateValueAndValidity();
      } else {
        this.profileForm.get('currentPassword').clearValidators();
        this.profileForm.get('confirmNewPassword').clearValidators();
        this.profileForm.get('currentPassword').updateValueAndValidity();
        this.profileForm.get('confirmNewPassword').updateValueAndValidity();
      }
    });
  }

  private resetPasswordFields(): void {
    this.profileForm.get('currentPassword').setValue(null);
    this.profileForm.get('newPassword').setValue(null);
    this.profileForm.get('confirmNewPassword').setValue(null);
    this.profileForm.get('currentPassword').clearValidators();
    this.profileForm.get('newPassword').clearValidators();
    this.profileForm.get('confirmNewPassword').clearValidators();
  }
}
