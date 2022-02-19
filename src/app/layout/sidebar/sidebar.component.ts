import { Component, OnInit } from '@angular/core';
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

  constructor(private userService: UserService, public themeService: ThemeService) { }

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
          }
        }
      });

    $(".submenu-link").on("click", function (ef) {
      ef.preventDefault();
      $(this).toggleClass("sl_tog");
      $(this).parent("li").find("ul").slideToggle(300);
    });
  }


  toggleSidebar(showMenu: boolean): void {
    this.userService.emitIsMenuShowing(showMenu);
  }

  private getCurrentUser(): void {
    this.userService.getCurrentUser()
      .subscribe((user: any) => {
        this.isAdmin = user.data.roles.indexOf('Administrator') !== -1;
      }, (error) => {

      });
  }
}
