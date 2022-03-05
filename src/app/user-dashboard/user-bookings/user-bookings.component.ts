import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.scss']
})
export class UserBookingsComponent implements OnInit {
  public PageName = "Bookings"
  public myBookings: Array<any> = [];
  constructor() { }

  ngOnInit(): void {
  }

}
