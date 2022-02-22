import { Component, OnInit } from '@angular/core';
import { forkJoin  } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  public PageName = "Dashboard";

  public numberOfListing: any = 0;
  public numberOfReviews: any = 0;
  public numberOfWishlist: any = 0;
  public numberOfViews: any = 0;
  public userMessages: Array<any> = [];
  public userActivity: Array<any> = [];
  public featuredPost: Array<any> = [];
  public userStatics: Array<any> = [];


  constructor() { }

  ngOnInit() {
  }

  public loadDashboardInfo(){
    
  }

}
