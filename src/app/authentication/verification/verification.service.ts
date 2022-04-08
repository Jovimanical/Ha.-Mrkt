import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Verification } from './verification.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VerificationService {

  constructor(private http: HttpClient) { }

  public sendCode(params:any): Observable<any> {
    return this.http.post(`${environment.API_URL}/users/verifications/resend-email-verification/`, params);
  }

  public verify(verification: Verification): Observable<any> {
    return this.http.put(`${environment.API_URL}/users/verifications/email-verification/`, JSON.stringify(verification));
  }
}
