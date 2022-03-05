import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-messaging',
  templateUrl: './user-messaging.component.html',
  styleUrls: ['./user-messaging.component.scss']
})
export class UserMessagingComponent implements OnInit {
  public PageName = "Messages"
  public Messaging:Array<any> = [];
  constructor() { }

  ngOnInit(): void {
  }

}
