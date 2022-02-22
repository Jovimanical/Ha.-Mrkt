import { Component, OnInit } from '@angular/core';
import { BroadcastService } from 'app/core/broadcast.service';
import { CartProduct } from 'app/shared/models/cart-product.model';
import { StoreService } from 'app/shared/services/store.service';
import { Router } from '@angular/router';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public subtotal = 0;
  public cartProducts: CartProduct[] = [];
  public balance = 0;

  constructor(
    private storeService: StoreService,
    private broadcastService: BroadcastService,
    private router: Router,
    private notificationService: NotificationService) { }

  ngOnInit() {
    
    this.storeService.fetchCart().subscribe((response:any) => {
      this.cartProducts = response ? response.data : [];
      // save to loal store
      this.subtotal = response ? response.totalCost : 0;
    });
    this.broadcastService.balanceUpdated$
      .subscribe(balance => this.balance = balance);
  }

  removeItem(index: number) {
    const product = this.cartProducts[index];
    this.storeService.removeFromCart(product.cartProductId).subscribe(updatedCart => {
      this.cartProducts = updatedCart.products;
      this.subtotal = updatedCart.totalCost;
      this.broadcastService.emitGetCart();
    });
  }

  showItem(index: number){

  }

  goToCheckout(): void {
    if (this.balance < this.subtotal) {
      this.notificationService.showErrorMessage('Insufficient funds for checkout');
      return;
    }
    this.router.navigate(['/store/checkout']);
  }
}
