import { Component, OnInit } from '@angular/core';
import { BroadcastService } from 'app/core/broadcast.service';
import { StoreService } from 'app/shared/services/store.service';

@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.scss']
})
export class CartIconComponent implements OnInit {
  public cartLength = 0;
  public sessionStorageCarts = 'houseAfrica.carts';
  constructor(private storeService: StoreService, private broadcastService: BroadcastService) { }

  ngOnInit() {
    this.getCart();
    this.broadcastService.getCart$.subscribe(() => {
      this.getCart();
    });
  }

  private getCart(): void {
    this.storeService.fetchCart().subscribe((result: any) => {
      this.cartLength = result ? result.data.records.length : 0;
      if (result.data.records instanceof Array && result.data.records.length > 0) {
        if (JSON.stringify(result.data.records) !== "[]") {
          localStorage.setItem(this.sessionStorageCarts, JSON.stringify(result.data.records));
        }
      }
    }, (error) => {
      // console.log('Error loading Cart', error)
      this.cartLength = 0
    });
  }
}
