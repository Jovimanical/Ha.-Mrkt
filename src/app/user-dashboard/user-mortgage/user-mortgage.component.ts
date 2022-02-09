import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-mortgage',
  templateUrl: './user-mortgage.component.html',
  styleUrls: ['./user-mortgage.component.scss']
})
export class UserMortgageComponent implements OnInit {
  public PageName = "Mortgage"
  constructor() { }

  ngOnInit(): void {
  }

}
