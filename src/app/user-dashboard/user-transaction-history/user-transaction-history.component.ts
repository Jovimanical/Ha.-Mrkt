import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountService } from 'app/shared/accounts/account.service';

@Component({
  selector: 'app-user-transaction-history',
  templateUrl: './user-transaction-history.component.html',
  styleUrls: ['./user-transaction-history.component.scss']
})
export class UserTransactionHistoryComponent implements OnInit, AfterViewInit {
  public PageName = "Transaction History";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public transactionHistory: MatTableDataSource<any>;
  public displayedColumns: string[] = ['id', 'amount', 'details', 'transaction_type', 'receiver_Account', 'created_at'];
  //dataSource = ELEMENT_DATA;
  constructor(private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.accountService.getUserTransactionHistory().subscribe((accountHistory) => {
      //  console.log('accountHistory', accountHistory)
      if (accountHistory?.data.records instanceof Array && accountHistory.data.records.length > 0) {
        this.transactionHistory = new MatTableDataSource(accountHistory.data.records)
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.transactionHistory.paginator = this.paginator;
      this.transactionHistory.sort = this.sort;
    }, 3000);

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.transactionHistory.filter = filterValue.trim().toLowerCase();

    if (this.transactionHistory.paginator) {
      this.transactionHistory.paginator.firstPage();
    }
  }


}
