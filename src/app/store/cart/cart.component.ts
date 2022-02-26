import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { BroadcastService } from 'app/core/broadcast.service';
import { EventsService } from 'angular4-events';
import { CartProduct } from 'app/shared/models/cart-product.model';
import { StoreService } from 'app/shared/services/store.service';
import { Router } from '@angular/router';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit, AfterViewInit, OnDestroy {
  public subtotal = 0;
  public cartProducts: Array<any> = [];
  public balance = 0;

  constructor(
    private storeService: StoreService,
    private broadcastService: BroadcastService,
    private router: Router,
    private notificationService: NotificationService,
    public changeDectection: ChangeDetectorRef,
    private eventService: EventsService,

  ) { }

  ngOnInit() {

    this.storeService.fetchCart().subscribe((response: any) => {
      // console.log('response.data.records', response.data.records);

      if (response.data.records instanceof Array && response.data.records.length > 0) {
        // save to loal store
        response.data.records.forEach((element: any) => {
          this.subtotal += element.PropertyAmount ? parseFloat(element.PropertyAmount) : 0;
          element.PropertyJson = JSON.parse(element.PropertyJson);
          this.cartProducts.push(element);
        });
      } else {
        this.cartProducts = [];
      }
      this.changeDectection.detectChanges();

    });

    this.broadcastService.balanceUpdated$
      .subscribe(balance => this.balance = balance);
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }

  removeItem(index: number) {
    const product = this.cartProducts[index];
    this.storeService.removeFromCart(product.id).subscribe((updatedCart) => {

      if (this.cartProducts instanceof Array && this.cartProducts.length > 0) {
        this.cartProducts.forEach((element: any) => {
          this.subtotal += element.PropertyAmount ? parseFloat(element.PropertyAmount) : 0;
        });
      }

      this.broadcastService.emitGetCart();
    });
  }

  showItem(index: number) {
    const product = this.cartProducts[index];


  }

  goToCheckout(params: any = 1): void {
    // if (this.balance < this.subtotal) {
    //   this.notificationService.showErrorMessage('Insufficient funds for checkout');
    //   return;
    // }

    if (params === 1) {
      this.router.navigate(['/store/checkout-option-mortgage']);
    } else {
      this.router.navigate(['store/checkout-option-mortgage']);
    }

  }
}
