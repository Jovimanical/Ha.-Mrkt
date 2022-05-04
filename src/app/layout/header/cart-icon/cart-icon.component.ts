import { Component, OnInit } from '@angular/core';
import { BroadcastService } from 'app/core/broadcast.service';
import { StoreService } from 'app/shared/services/store.service';
import { AuthenticationService } from '../../../authentication/authentication.service';

@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.scss']
})
export class CartIconComponent implements OnInit {
  public cartLength = 0;
  public isAuthenticated: boolean;
  public sessionStorageCarts = 'houseAfrica.carts';
  constructor(private storeService: StoreService, private broadcastService: BroadcastService, private authService: AuthenticationService,) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    setTimeout(() => {
      this.getCart();
    }, 500);

    this.broadcastService.getCart$.subscribe(() => {
      this.getCart();
    });
  }

  private getCart(): void {
    if (!this.isAuthenticated) {
      return
    }
    this.storeService.fetchCart().subscribe((result: any) => {
      this.cartLength = result.data?.records ? result.data.records.length : 0;
      if (result.data.records instanceof Array && result.data.records.length > 0) {
        if (JSON.stringify(result.data.records) !== "[]") {
          sessionStorage.setItem(this.sessionStorageCarts, JSON.stringify(result.data.records));
        }
      }
    }, (error) => {
      // console.log('Error loading Cart', error)
      this.cartLength = 0
    });
  }
}
