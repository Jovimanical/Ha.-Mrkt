import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'app/authentication/authentication.service';

@Component({
  selector: 'app-dashboard-menu-status',
  templateUrl: './dashboard-menu-status.component.html',
  styleUrls: ['./dashboard-menu-status.component.scss']
})
export class DashboardMenuStatusComponent implements OnInit {
  @Input() public dashboardTitle: any = 'New Dashboard';
  public dashboardUserInfo: any = 'Saviour Obih-Anyanwu';
  public dashboardUserAvatar: any = '/assets/images/avatar/5.jpg';
  public UserInfo: any = {}

  constructor(private authService: AuthenticationService) {

  }

  ngOnInit(): void {
    this.UserInfo = this.authService.getUserInfo();
    if (this.UserInfo instanceof Object && Object.keys(this.UserInfo).length !== 0) {
      this.dashboardUserInfo = this.UserInfo.firstname + ' ' + this.UserInfo.lastname;
      this.dashboardUserAvatar = this.UserInfo.profileImage;
    }
  }

}
