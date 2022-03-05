import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-my-properties',
  templateUrl: './user-my-properties.component.html',
  styleUrls: ['./user-my-properties.component.scss']
})
export class UserMyPropertiesComponent implements OnInit {
  public PageName = "My Properties"
  public myProperties: Array<any> = [];
  
  constructor() { }

  ngOnInit(): void {
  }

}
