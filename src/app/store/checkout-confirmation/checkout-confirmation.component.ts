import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cart } from 'app/shared/models/cart.model';
import { StoreService } from 'app/shared/services/store.service';
import { BroadcastService } from 'app/core/broadcast.service';

@Component({
  selector: 'app-checkout-confirmation',
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['./checkout-confirmation.component.scss']
})
export class CheckoutConfirmationComponent implements OnInit {
  public cart: Cart;
  public sessionStorageCarts = 'houseAfrica.carts';
  public propertyID: any = 0;

  constructor(private storeService: StoreService, private route: ActivatedRoute, private broadcastService: BroadcastService,) { }

  async ngOnInit() {
    this.route.params.subscribe(async (params: any) => {
      this.propertyID = params['id'];
      this.storeService.removeFromCart(this.propertyID).subscribe((results) => {
        this.broadcastService.emitGetCart();
      })
    });
    // 
    // if (clearCart) {
    //   localStorage.removeItem(this.sessionStorageCarts);
    // }
  }


  // public loadUserCart() {
  //   const carts = localStorage.getItem(this.sessionStorageCarts);
  //   if (carts === null || carts === undefined) {
  //     return
  //   } else {
  //      const userCarts: Array<any> = JSON.parse(carts);
  //      userCarts.forEach((element) => {
  //        if(element.id === this.propertyID){
  //          userCarts.splice()
  //        }
  //      });
  //   }
  // }

}
