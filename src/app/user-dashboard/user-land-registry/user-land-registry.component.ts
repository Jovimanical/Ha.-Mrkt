import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-land-registry',
  templateUrl: './user-land-registry.component.html',
  styleUrls: ['./user-land-registry.component.scss']
})
export class UserLandRegistryComponent implements OnInit {
  public PageName = "Land Registry"
  constructor() { }

  ngOnInit(): void {
  }

}
