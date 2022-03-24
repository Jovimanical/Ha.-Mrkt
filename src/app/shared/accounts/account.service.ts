import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account } from './account.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AccountService {

  constructor(private http: HttpClient) { }

  public getUserAccounts(): Observable<Array<Account>> {
    return this.http.get<Array<Account>>(`${environment.API_URL}/accounts/user-accounts/list/1/30`);
  }


 public getUserTransactionHistory(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/transactions/user-transactions/list/1/30`);
  }



  public updateUserAccounts(account: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/accounts/update/`, account).toPromise();
  }

  public getTotalAccountsBalance(accounts: Array<Account>) {
    let balance = 0;
    accounts.forEach(account => {
      balance += account.account_balance;
    });
    return balance;
  }


  public getTotalAccountsPointBalance(accounts: Array<Account>) {
    let pointBalance = 0;
    accounts.forEach((account: any) => {
      pointBalance += account.account_point;
    });
    return pointBalance;
  }
}
