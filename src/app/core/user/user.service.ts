import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from './user.model';
import { UserStatus } from './user-status.model';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class UserService {
  private sessionStorageTokenKey = 'houseAfrica.token';
  private sessionStorageUserInfo = 'houseAfrica.user';
  private userSubscription = new BehaviorSubject<User>(null);
  userChanged$ = this.userSubscription.asObservable();

  private verificationSubscription = new BehaviorSubject<boolean>(null);
  verificationChanged$ = this.verificationSubscription.asObservable();

  private authenticationSubscription = new BehaviorSubject<boolean>(null);
  authenticationChanged$ = this.authenticationSubscription.asObservable();

  private isMenuShowing = new BehaviorSubject<boolean>(null);
  menuShowing$ = this.isMenuShowing.asObservable();

  private isAuthenticated: boolean = false;
  private refreshTokenTimeout: any;
  private accountSubject: BehaviorSubject<User>;
  public account: Observable<User>;

  constructor(private http: HttpClient, private router: Router,) {
    this.accountSubject = new BehaviorSubject<User>(null);
    this.account = this.accountSubject.asObservable();
  }

  public get accountValue(): User {
    return this.accountSubject.value;
  }

  getUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${environment.API_URL}/users`);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.API_URL}/users/profiles/me`)
      .pipe(
        map(response => {
          this.userSubscription.next(response);
          return response;
        })
      );
  }

  toggleStatus(userId: string, status: UserStatus): Observable<User> {
    return this.http.put<User>(`${environment.API_URL}/users/${userId}/account-status`, status);
  }

  updateProfile(user: any): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/users/update-profiles/`, user);
  }

  updateUserPassword(user: any): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/users/password-update/`, user);
  }

  emitUserVerificationRequired(required: boolean): void {
    this.verificationSubscription.next(required);
  }

  emitUserAuthenticated(isAuthenticated: boolean): void {
    if (this.isAuthenticated !== isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
      this.authenticationSubscription.next(isAuthenticated);
    }
  }

  emitIsMenuShowing(showMenu: boolean): void {
    this.isMenuShowing.next(showMenu);
  }

  getCurrentActiveUser() {
    const userInfo = sessionStorage.getItem(this.sessionStorageUserInfo);
    if (userInfo === null || userInfo === undefined) {
      return {}
    } else {
      return JSON.parse(userInfo);
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.sessionStorageTokenKey);
    sessionStorage.removeItem(this.sessionStorageUserInfo);
    this.router.navigate(['authentication/login']);
  }

  public validateResetToken(token: any) {
    return this.http.post(`${environment.API_URL}/auth/forgot-password/verify/`, token);
  }

  public resetPassword(token: any) {
    return this.http.post(`${environment.API_URL}/auth/forgot-password/change-password/`, token);
  }

  public refreshToken() {
    return this.http.post<any>(`${environment.API_URL}/auth/refresh-token`, {}, { withCredentials: true })
      .pipe(map((account) => {
        this.accountSubject.next(account);
        this.startRefreshTokenTimer();
        return account;
      }));
  }

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

}
