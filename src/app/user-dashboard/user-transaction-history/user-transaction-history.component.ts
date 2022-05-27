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
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;
  public transactionHistory: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumns: string[] = ['id', 'amount', 'details', 'transaction_type', 'receiver_Account', 'created_at'];
  public isLoading: boolean = true;

  constructor(
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.accountService.getUserTransactionHistory().subscribe((accountHistory: any) => {
      //  console.log('accountHistory', accountHistory)
      if (accountHistory?.data.records instanceof Array && accountHistory.data.records.length > 0) {
        this.transactionHistory.data = accountHistory.data.records
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.transactionHistory.sort = this.sort;
      this.transactionHistory.paginator = this.paginator;
      this.isLoading = false
    }, 3000);

  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.transactionHistory.filter = filterValue.trim().toLowerCase();

    if (this.transactionHistory.paginator) {
      this.transactionHistory.paginator.firstPage();
    }
  }

  public redirectToDetails(params:any){

  }


}
