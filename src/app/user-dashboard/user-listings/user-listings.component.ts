import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-listings',
  templateUrl: './user-listings.component.html',
  styleUrls: ['./user-listings.component.scss']
})
export class UserListingsComponent implements OnInit {
  public PageName = "My Property Listings";
  public myProperties: Array<any> = [];
  
  constructor() { }

  ngOnInit(): void {
  }

}
