import { Component, OnInit, NgZone } from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { ThemeService } from '../../core/theme.service';
declare var $: any
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public isAuthenticated: boolean = false;
  public mobile: boolean;
  public toggleTheme: false;
  public isAdmin = false;
  public isVerificationRequired = false;
  public userRole: any = 'user';

  constructor(private userService: UserService, public themeService: ThemeService, private _ngZone: NgZone) { }

  ngOnInit(): void {
    this.userService.verificationChanged$
      .subscribe(value => {
        this.isVerificationRequired = value;
      });

    this.userService.authenticationChanged$
      .subscribe(isAuthenticated => {
        if (isAuthenticated != null) {
          this.isAuthenticated = isAuthenticated;
          if (this.isAuthenticated) {
            this.getCurrentUser();
            console.log('call')
          }
        }
      });

    $(".submenu-link").on("click", function (ef) {
      ef.preventDefault();
      $(this).toggleClass("sl_tog");
      $(this).parent("li").find("ul").slideToggle(300);
    });
    //this.getCurrentUser()
  }


  toggleSidebar(showMenu: boolean): void {
    this.userService.emitIsMenuShowing(showMenu);
  }

  private getCurrentUser(): void {
    if (!this.isAuthenticated) {
      return;
    } else {
      this.userService.getCurrentUser()
        .subscribe((user: any) => {
         // console.log('user.data.roles', user.data.roles)
          this._ngZone.run(() => {
            this.isAdmin = user.data.roles.indexOf('admin') !== -1;
            this.userRole = user.data.roles;
            // console.log('Outside Done!');
          });

        }, (error) => {

        });
    }
  }
}
