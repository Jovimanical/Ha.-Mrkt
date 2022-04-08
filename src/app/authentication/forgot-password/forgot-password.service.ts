import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ForgotPassword } from './forgot-password.model';

@Injectable()
export class ForgotPasswordService {

  constructor(private http: HttpClient) { }

 public sendVerificationCode(model: any): Promise<ForgotPassword> {
    return this.http.post<ForgotPassword>(`${environment.API_URL}/auth/forgot-password/request/`, model).toPromise();
  }

  public verifyCode(model: any): Promise<ForgotPassword> {
    return this.http.post<ForgotPassword>(`${environment.API_URL}/auth/forgot-password/verify/`, model).toPromise();
  }

  public changePassword(model: any): Promise<ForgotPassword> {
    return this.http.post<ForgotPassword>(`${environment.API_URL}/auth/forgot-password/change-password/`, model).toPromise();
  }
}
