import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserService } from '../core/user/user.service';
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
  public pagesToHideFooter: Array<any> = ['/listings/application', '/listings/checkout-option-mortgage', '/listings/checkout', '/listings/products/*']


  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private media: MediaObserver,
    public themeService: ThemeService,
    private router: Router, private activatedRoute: ActivatedRoute
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
  }


  showHide(){
 this.router.events.subscribe((event: any) => {
      console.log('routerEvent', event.url)
      console.log('this.activatedRoute', this.activatedRoute)
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

  ngAfterViewInit(): void {
   
  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  onToggleSidebar($event: any): void {
    // this.sidebar.toggle();
  }
}
