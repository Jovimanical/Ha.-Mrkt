import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserService } from '../core/user/user.service';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html'
})
export class ShellComponent implements OnInit, OnDestroy {
  public isMobile: boolean;
  public isAuthenticated: boolean;
  private watcher: Subscription;
  public isVerificationRequired = false;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private media: MediaObserver,
    public themeService: ThemeService) { }

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
  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  onToggleSidebar($event: any): void {
    // this.sidebar.toggle();
  }
}
