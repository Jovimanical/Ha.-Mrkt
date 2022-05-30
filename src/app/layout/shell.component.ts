import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy, AfterViewInit, NgZone } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventsService } from 'angular4-events';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserService } from '../core/user/user.service';
import { AccountService } from 'app/shared/accounts/account.service';
import { BroadcastService } from 'app/core/broadcast.service';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ShellComponent implements OnInit, OnDestroy, AfterViewInit {
  public isMobile: boolean;
  public isAuthenticated: boolean;
  private watcher: Subscription;
  public isVerificationRequired = false;
  public showHideFooter: boolean = true;
  public userInfo: any;
  public totalBalance: number;
  public totalPoint: number;
  public pagesToHideFooter: Array<any> = ['/property-search/application', '/property-search/checkout-application-requirements', '/property-search/checkout', '/property-search/property/*']


  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private media: MediaObserver,
    public themeService: ThemeService,
    private accountService: AccountService,
    private eventService: EventsService,
    private _ngZone: NgZone,
    private broadcastService: BroadcastService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isMobile = this.media.isActive('xs') || this.media.isActive('sm');
    this.watcher = this.media.media$.subscribe((change: MediaChange) => {
      this.isMobile = change.mqAlias === 'xs' || change.mqAlias === 'sm';
    });
    this.userService.verificationChanged$
      .subscribe((value: any) => {
        this.isVerificationRequired = value;
      });

    // this.userService.authenticationChanged$
    //   .subscribe(isAuthenticated => {
    //     if (isAuthenticated != null) {
    //       this.isAuthenticated = isAuthenticated;
    //       if (this.isAuthenticated) {
    //         this.getCurrentUser();
    //       }
    //     }
    //   });
    //this.showHide()
    this.getCurrentUser();
    this.getAccounts();
  }


  getCurrentUser() {
    if (this.isAuthenticated) {
      const userRoles = this.userService.getCurrentActiveUser();
      this._ngZone.run(() => {
        this.userInfo = userRoles.roles
        // console.log('userInfo', this.userInfo)
      });
    }
  }


  showHide() {
    this.router.events.subscribe((event: any) => {
      // console.log('routerEvent', event.url)
      // console.log('this.activatedRoute', this.activatedRoute)
      if (event instanceof Object && event !== undefined) {
        const showPageListing = this.pagesToHideFooter.includes(event.url)
        if (showPageListing) {
          this.showHideFooter = false;
        } else {
          this.showHideFooter = true;
        }
        return;
      }
    });
  }

  private getAccounts(): void {
    if (!this.isAuthenticated) {

      return;

    } else {
      this.accountService.getUserAccounts()
        .subscribe((accounts: any) => {
          // We're just supporting one account right now. Grab the first result.

          if (accounts.data.records instanceof Array && accounts.data.records.length > 0) {
            const account = accounts.data.records[0];
           // console.log('Accounts', account)
            this._ngZone.run(() => {
              this.totalBalance = account.account_balance !== "0" ? parseFloat(account.account_balance) : 0.00;
              this.totalPoint = account.account_point !== "0" ? parseInt(account.account_point, 10) : 0;
              this.eventService.publish("accountBalance", this.totalBalance);
              this.eventService.publish("accountPoint", this.totalPoint);
              //console.log('all called')
            })
            this.broadcastService.emitBalanceUpdated(this.totalBalance);
          }
        }, (error) => {
          // console.log('getAccounts - Error', error)
          if (error.error.message === 'Error : Expired token') {
            console.log('getAccounts call logout')
            // this.userService.logout();
          }
        });
    }
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  onToggleSidebar($event: any): void {
    // this.sidebar.toggle();
  }
}
