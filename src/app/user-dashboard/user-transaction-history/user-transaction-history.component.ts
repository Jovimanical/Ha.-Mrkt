import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-transaction-history',
  templateUrl: './user-transaction-history.component.html',
  styleUrls: ['./user-transaction-history.component.scss']
})
export class UserTransactionHistoryComponent implements OnInit {
  public PageName = "Transaction History"
  constructor() { }

  ngOnInit(): void {
  }

}
