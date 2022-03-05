import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-mortgage-application',
  templateUrl: './my-mortgage-application.component.html',
  styleUrls: ['./my-mortgage-application.component.scss']
})
export class MyMortgageApplicationComponent implements OnInit {
  public PageName = "Mortgage Applications"
  constructor() { }

  ngOnInit(): void {
  }

}
