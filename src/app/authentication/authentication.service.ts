import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserService } from 'app/core/user/user.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { HAEncryptStorage } from './encryption-storage'

@Injectable()
export class AuthenticationService {
  private sessionStorageTokenKey = 'houseAfrica.token';
  private sessionStorageUserInfo = 'houseAfrica.user';
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(
    private location: Location,
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
    @Inject('Window') private window: any
  ) {
    this.userSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem(this.sessionStorageUserInfo)));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): any {
    return this.userSubject.value;
  }

  public getToken(): string {
    // Attempt to retrieve the token from session storage.
    let token = sessionStorage.getItem(this.sessionStorageTokenKey);
    // If not in session storage, attempt to get it from the URL.
    if (!token) {
      token = this.getTokenFromUrl();
      // If it was in the URL, save it to session storage.
      if (token) {
        sessionStorage.setItem(this.sessionStorageTokenKey, token);
      }
    }
    return token;
  }

  async getUserInfo() {

    try {
      // Attempt to retrieve the token from session storage.
      let token: any = sessionStorage.getItem(this.sessionStorageUserInfo);
      // If not in session storage, attempt to get it from the URL.
      if (token === 'undefined' || token === 'null') {
        const userInfo: any = await this.fetchDataAsPromise();
        // If it was in the URL, save it to session storage.
        if (userInfo.data instanceof Object && Object.keys(userInfo).length !== 0) {
          sessionStorage.setItem(this.sessionStorageUserInfo, JSON.stringify(userInfo.data));
          token = userInfo.data
          return token;
        } else {
          this.logout();
        }
      } else {
        return JSON.parse(token);
      }


    } catch (error) {
      // console.log('Erroruuuuuiiiioooo', error.error.message)
      if (error.error.message === 'Error : Expired token') {
        this.logout()
      }
      return false
    }
  }

  public setToken(token: string): void {
    sessionStorage.setItem(this.sessionStorageTokenKey, token);
  }

  public setUserInfo(user: string): any {
    sessionStorage.setItem(this.sessionStorageUserInfo, JSON.stringify(user));
    this.userSubject.next(user);
    return user;
  }


  public isAuthenticated(): boolean {
    return this.getToken() != null;
  }

  public goToOauthLogin(): void {
    const RESPONSE_TYPE = 'token';
    const oauthUrl = `${environment.SERVER_URL}/oauth/authorize?client_id=${environment.OAUTH_CLIENT_ID}
&redirect_uri=${encodeURIComponent(environment.OAUTH_REDIRECT_URL)}
&response_type=${RESPONSE_TYPE}
&scope=email`;
    this.window.location.href = oauthUrl;
  }

  public logout(): void {
    sessionStorage.removeItem(this.sessionStorageTokenKey);
    sessionStorage.removeItem(this.sessionStorageUserInfo);
    this.userSubject.next(null);
    this.router.navigate(['authentication/login']);
  }

  public goToVerification(): void {
    this.userService.emitUserVerificationRequired(true);
    this.router.navigate(['authentication/verification']);
  }

  private getTokenFromUrl(): string {
    const tokenIndex = this.window.location.href.indexOf('access_token');
    if (tokenIndex === -1) {
      return null;
    }

    const paramLength = 'access_token='.length;
    const token = this.window.location.href.substring(tokenIndex + paramLength, this.window.location.href.indexOf('&'));
    const pathWithoutHash = this.location.path(false).split('#')[0];
    this.location.replaceState(pathWithoutHash);
    return token;
  }

  public fetchDataAsPromise() {
    return this.http
      .get(`${environment.API_URL}/users/profiles/me`)
      .toPromise();
  }

}
