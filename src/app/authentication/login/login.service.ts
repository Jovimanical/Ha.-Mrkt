import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication.service';
import { Login } from './login.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  public loginAction(login: Login): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
     return this.http.post(`${environment.SERVER_URL}/auth/login`, login, { headers })
      .pipe(
        map((response: any) => {
          this.authService.setToken(response.token.access_token);
          this.authService.setUserInfo(response.token.user);
          return response;
        })
      );
  }

  public sendLoginLink(phone: string, isMobile: boolean): Observable<any> {    
    return this.http.post(`${environment.API_URL}/login-links`, { phone, isMobile });
  }
}
