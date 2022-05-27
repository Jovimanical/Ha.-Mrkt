import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-digital-title',
  templateUrl: './user-digital-title.component.html',
  styleUrls: ['./user-digital-title.component.scss']
})
export class UserDigitalTitleComponent implements OnInit {
  public PageName = "Digital Title"
  constructor() { }

  ngOnInit(): void {
  }

}
