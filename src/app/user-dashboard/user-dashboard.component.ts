import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BroadcastService } from 'app/core/broadcast.service';
import { StoreService } from 'app/shared/services/store.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  public PageName = "Dashboard";
  public numberOfListing: any = 0;
  public numberOfReviews: any = 0;
  public numberOfWishlist: any = 0;
  public numberOfViews: any = 0;
  public userMessages: Array<any> = [];
  public userActivity: Array<any> = [];
  public featuredPost: Array<any> = [];
  public userStatics: Array<any> = [];
  public cartProducts: Array<any> = [];
  public isLoading: boolean = true;


  constructor(private storeService: StoreService, private router: Router, public changeDectection: ChangeDetectorRef, private broadcastService: BroadcastService,) { }

  ngOnInit() {

    this.storeService.fetchCart().subscribe((response: any) => {
      // console.log('response.data.records', response.data.records);
      if (response.data.records instanceof Array && response.data.records.length > 0) {
        // save to loal store
        response.data.records.forEach((element: any) => {
          //this.subtotal += element.PropertyAmount ? parseFloat(element.PropertyAmount) : 0;
          if (element?.PropertyJson) {
            element.PropertyJson = JSON.parse(element.PropertyJson);
          }
          this.cartProducts.push(element);
        });
      } else {
        this.cartProducts = [];
      }
      this.isLoading = false;
      this.changeDectection.detectChanges();

    }, (error) => {
      this.isLoading = false;
      this.changeDectection.detectChanges();
    });

  }

  removeItem(index: number) {
    const product = this.cartProducts[index];
    this.storeService.removeFromCart(product.id).subscribe((updatedCart) => {

      // if (this.cartProducts instanceof Array && this.cartProducts.length > 0) {
      //   this.cartProducts.forEach((element: any) => {
      //     this.subtotal += element.PropertyAmount ? parseFloat(element.PropertyAmount) : 0;
      //   });
      // }

      this.broadcastService.emitGetCart();
    });
  }

  showItem(property: any) {
    if (property.ApplicationStatus === 'PROCESSING') {
      this.router.navigate([`/listings/checkout/${property.id}`]);
    } else {
      this.router.navigate([`/listings/checkout-option-mortgage/${property.id}`]);
    }
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }

  public loadDashboardInfo() {

  }

}
