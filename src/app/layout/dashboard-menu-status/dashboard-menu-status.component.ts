import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'app/authentication/authentication.service';

@Component({
  selector: 'app-dashboard-menu-status',
  templateUrl: './dashboard-menu-status.component.html',
  styleUrls: ['./dashboard-menu-status.component.scss']
})
export class DashboardMenuStatusComponent implements OnInit {
  @Input() public dashboardTitle: any = 'Dashboard';
  public dashboardUserInfo: any = 'Firstname Lastname';
  public dashboardUserAvatar: any = '/assets/images/avatar/5.jpg';
  public UserInfo: any = {}

  constructor(private authService: AuthenticationService) {

  }

  async ngOnInit() {
    try {
      this.UserInfo = await this.authService.getUserInfo();
      // console.log('this.UserInfo', this.UserInfo)
      if (this.UserInfo instanceof Object && Object.keys(this.UserInfo).length !== 0) {
        this.dashboardUserInfo = `${this.UserInfo.firstname} ${this.UserInfo.lastname}`;
        this.dashboardUserAvatar = this.UserInfo.profileImage;
      }
    } catch (error) {
      console.log("this.UserInfo", error)
    }
  }

  logoutUser(){
    this.authService.logout();
  }

}
