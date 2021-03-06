import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
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


  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  constructor(private storeService: StoreService, private router: Router, public changeDectection: ChangeDetectorRef, private broadcastService: BroadcastService,) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }

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

  //TODO check the .PaymentMethod and redirect accordingly
  // if paymentMethod is 1 == outright payment 2 = mortgage  3 = pay small small
  showItem(property: any) {
    switch (property.ApplicationStatus) {
      case 'PROCESSING':
      case 'DECLINED':
        this.router.navigate([`/user-dashboard/user-application-status/${property.id}`]);
        break;
      case 'PENDING':
        this.router.navigate([`/property-search/checkout/${property.id}`]);
        break;

      default:
        this.router.navigate([`/property-search/checkout-application-requirements/${property.id}`]);
        break;
    }

  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }

  public loadDashboardInfo() {

  }

}
