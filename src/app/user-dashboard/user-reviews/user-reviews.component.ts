import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.scss']
})
export class UserReviewsComponent implements OnInit {
  public PageName = "My Reviews"
  public MyReviews:Array<any> = [];
  constructor() { }

  ngOnInit(): void {
  }

}
