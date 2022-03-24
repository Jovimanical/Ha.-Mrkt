import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { User } from './user/user.model';

@Injectable()
export class BroadcastService {

  private profileUpdated = new Subject<User>();
  profileUpdated$ = this.profileUpdated.asObservable();

  private getCart = new ReplaySubject<void>();
  getCart$ = this.getCart.asObservable();

  private balanceUpdated = new ReplaySubject<number>();
  balanceUpdated$ = this.balanceUpdated.asObservable(); 
  
  private pointBalanceUpdated = new ReplaySubject<number>();
  pointBalanceUpdated$ = this.pointBalanceUpdated.asObservable();

  private getBalance = new ReplaySubject<void>();
  getBalance$ = this.getBalance.asObservable(); 
  
  private getPointBalance = new ReplaySubject<void>();
  getPointBalance$ = this.getPointBalance.asObservable();

  public emitProfileUpdated(user: User) {
    this.profileUpdated.next(user);
  }

  public emitGetCart() {
    this.getCart.next();
  }

  public emitBalanceUpdated(balance: number) {
    this.balanceUpdated.next(balance);
  } 
  
  public emitPointBalanceUpdated(balance: number) {
    this.pointBalanceUpdated.next(balance);
  }

  public emitGetBalance() {
    this.getBalance.next();
  } 
  
  public emitGetPointBalance() {
    this.getPointBalance.next();
  }
}
