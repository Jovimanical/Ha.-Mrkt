import { Component, OnInit } from '@angular/core';
import { Cart } from 'app/shared/models/cart.model';
import { StoreService } from 'app/shared/services/store.service';

@Component({
  selector: 'app-checkout-confirmation',
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['./checkout-confirmation.component.scss']
})
export class CheckoutConfirmationComponent implements OnInit {
  public cart: Cart;
  public sessionStorageCarts = 'houseAfrica.carts';

  constructor(private storeService: StoreService) { }

  async ngOnInit() {
    // const clearCart = await this.storeService.clearCompletedCart();
    // if (clearCart) {
    //   localStorage.removeItem(this.sessionStorageCarts);
    // }
  }

}
