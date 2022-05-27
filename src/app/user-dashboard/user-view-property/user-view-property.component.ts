import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-view-property',
  templateUrl: './user-view-property.component.html',
  styleUrls: ['./user-view-property.component.scss']
})
export class UserViewPropertyComponent implements OnInit {
  public PageName = "Property View"
  constructor() { }

  ngOnInit(): void {
  }

}
