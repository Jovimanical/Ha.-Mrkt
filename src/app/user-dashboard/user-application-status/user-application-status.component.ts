import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-application-status',
  templateUrl: './user-application-status.component.html',
  styleUrls: ['./user-application-status.component.scss']
})
export class UserApplicationStatusComponent implements OnInit {
  public PageName = "Application Status"
  constructor() { }

  ngOnInit(): void {
  }

}
