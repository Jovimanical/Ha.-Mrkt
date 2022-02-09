import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-my-settings',
  templateUrl: './user-my-settings.component.html',
  styleUrls: ['./user-my-settings.component.scss']
})
export class UserMySettingsComponent implements OnInit {
  public PageName = "Settings"
  constructor() { }

  ngOnInit(): void {
  }

}
