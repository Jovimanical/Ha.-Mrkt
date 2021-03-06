import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerificationComponent } from './verification/verification.component';
import { PublicGuardService } from './public-guard.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SmsConfirmationComponent } from './sms-confirmation/sms-confirmation.component';
import { AuthGuardService } from './auth-guard.service';
import { LinkedInSyncComponent } from './linked-in-sync/linked-in-sync.component';
import { SmsResponseComponent } from './sms-response/sms-response.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const authRoutes: Routes = [
  { path: 'authentication/login', component: LoginComponent },
  { path: 'authentication/register', component: RegisterComponent },
  { path: 'authentication/verification/:token/:email', component: VerificationComponent },
  { path: 'authentication/reset-password/:token/:email', component: ResetPasswordComponent },
  { path: 'authentication/forgot-password', component: ForgotPasswordComponent, canActivate: [PublicGuardService] },
  { path: 'authentication/sms-confirmation', component: SmsConfirmationComponent, canActivate: [PublicGuardService] },
  { path: 'authentication/sms-response', component: SmsResponseComponent, canActivate: [PublicGuardService] },
  { path: 'authentication/linked-in-sync', component: LinkedInSyncComponent, canActivate: [AuthGuardService] }
];



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(authRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
