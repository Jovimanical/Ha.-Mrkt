import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-loan-application',
  templateUrl: './my-loan-application.component.html',
  styleUrls: ['./my-loan-application.component.scss']
})
export class MyLoanApplicationComponent implements OnInit {
  public PageName = "Loan Applications"
  constructor() { }

  ngOnInit(): void {
  }

}
