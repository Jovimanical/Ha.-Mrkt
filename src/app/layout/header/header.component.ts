import { Component, OnInit, Input, Output, EventEmitter, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { EventsService } from 'angular4-events';
import { UserService } from 'app/core/user/user.service';
import { AccountService } from 'app/shared/accounts/account.service';
import { BroadcastService } from 'app/core/broadcast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public isMobile = false;
  @Input() public isAuthenticated = false;
  @Input() public userRoles: any;
  @Input() public totalBalance: number;
  @Input() public totalPoint: number;
  @Output() onToggleSidebar = new EventEmitter<void>();
  public isVerificationRequired = false;
  public isMenuShowing = false;

  public bookmarkedWishlist: Array<any> = [];
  public compareListing: Array<any> = [];

  public accountInfo: any


  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private broadcastService: BroadcastService,
    private eventService: EventsService,
    public ngZone: NgZone
  ) { }

  ngOnInit() {
    this.userService.verificationChanged$
      .subscribe(value => this.isVerificationRequired = value);
    this.userService.authenticationChanged$
      .subscribe(isAuthenticated => {
        if (isAuthenticated != null) {
          this.isAuthenticated = isAuthenticated;
          // this.getAccounts();
        }
      });

    this.userService.menuShowing$
      .subscribe(isMenuShowing => this.isMenuShowing = isMenuShowing);

    // this.broadcastService.getBalance$.subscribe(() => {
    //   this.getAccounts();
    // });

    this.initPubsub();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.accountInfo.unsubscribe();
  }

  public initPubsub() {
    this.accountInfo = this.eventService.subscribe("accountBalance", async (data: any) => {
      this.ngZone.run(() => {
        this.totalBalance = data
      })
      // console.log('balance', data)
    });
    this.accountInfo = this.eventService.subscribe("accountPoint", async (data: any) => {
      this.ngZone.run(() => {
        this.totalPoint = data
      })
      // console.log('points', data)
    });
  }

  toggleSidebar(showMenu: boolean): void {
    this.onToggleSidebar.emit();
    this.userService.emitIsMenuShowing(showMenu);
  }

  // TODO: Move into an account balance component.
  private getAccounts(): void {
    if (!this.isAuthenticated) {

      return;

    } else {
      this.accountService.getUserAccounts()
        .subscribe((accounts: any) => {
          // We're just supporting one account right now. Grab the first result.
          console.log('Accounts-2', accounts)
          if (accounts.data.records instanceof Array && accounts.data.records.length > 0) {
            const account = accounts.data.records[0];
            this.ngZone.run(() => {
              this.totalBalance = parseFloat(account.account_balance);
              this.totalPoint = parseInt(account.account_point, 10);
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


  public clearWishlist() {

  }

  public removeWishlist() {

  }

  public removeCompareItem() {

  }
}
