import {
  Component,
  HostBinding, OnInit, Output, EventEmitter,
  ComponentFactoryResolver, ChangeDetectionStrategy,
  ChangeDetectorRef, AfterViewInit, OnDestroy,
} from '@angular/core';
import { EventsService } from 'angular4-events';
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOut } from './estate-map-sidebar.animation';
import { AnimationEvent } from '@angular/animations';
import { StoreService } from 'app/shared/services/store.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { BroadcastService } from 'app/core/broadcast.service';
import { AuthenticationService } from '../../authentication/authentication.service';


@Component({
  selector: 'app-estate-map-sidebar',
  templateUrl: './estate-map-sidebar.component.html',
  styleUrls: ['./estate-map-sidebar.component.scss'],
  animations: [slideInOut],
  changeDetection: ChangeDetectionStrategy.Default
})
export class EstateMapSidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() animationStateChanged = new EventEmitter<AnimationEvent>();
  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public property_Details: any;
  public propertView: any = {}
  public propertyMap: any = {}
  public propertyListing: any;
  public showView: boolean;
  public totalRooms: number = 0;
  public estateName: any
  public unitName: any;
  public listPropertyReviews: Array<any> = [];
  public listFeaturedProperty: Array<any> = [];
  public listSimilarProperty: Array<any> = [];
  public propertyUnitName: any;
  public loading = false;
  public submitted = false;
  public single_map: any
  public isAuthenticated = false;


  //cart info
  public sessionStorageBookmarks = 'houseAfrica.bookmarks';
  public sessionStorageCarts = 'houseAfrica.carts';
  public userCarts: Array<any> = [];
  public userBookMarks: Array<any> = [];

  constructor(
    public changeDectection: ChangeDetectorRef,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private broadcastService: BroadcastService,
    public router: Router,
    private eventService: EventsService,
    private storeService: StoreService,
    private authService: AuthenticationService,
  ) {

  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    // subscribe to event with name "ShowProperty"
    this.propertyListing = this.eventService.subscribe("ShowProperty", async (data: any) => {
      if (data instanceof Object && Object.keys(data).length !== 0) {
        this.propertView = data
        this.totalRooms = this.propertView.property_bathroom_count + this.propertView.property_bedroom_count + this.propertView.property_sittingroom_count
        this.showProps();
      }
    });

    this.propertyListing = this.eventService.subscribe("UnitOptions", async (data: any) => {
      if (data instanceof Object && Object.keys(data).length !== 0) {
        this.propertyMap = data;
      }
    });

    // this.route.params.subscribe(params => {
    //   this.unitName = params['id'];
    //   this.propertyUnitName = `ha-unit${this.unitName}`
    //   this.estateName = params['estate'].replace('-', ' ');
    //   this.getEstateUnit(this.unitName)
    // });
  }

  ngAfterViewInit(): void {
    this.checkPropertyObj()
    this.loadUserCart();
    this.loadFavorite();
  }

  ngOnDestroy(): void {
    this.propertyListing.unsubscribe();
  }

  public loadUserCart() {
    const carts = sessionStorage.getItem(this.sessionStorageCarts);
    if (carts === null || carts === undefined) {
      this.userCarts = [];
    } else {
      this.userCarts = JSON.parse(carts);
    }
  }

  public loadFavorite() {
    const bookmarks = sessionStorage.getItem(this.sessionStorageBookmarks);
    if (bookmarks === null || bookmarks === undefined) {
      this.userBookMarks = [];
    } else {
      this.userBookMarks = JSON.parse(bookmarks);
    }
  }



  public saveToLocalStorage(propObjListing: any, tableName: any) {
    //console.log('saveBlockAndUnits', propObjListing)
    if (JSON.stringify(propObjListing) !== "[]") {
      sessionStorage.setItem(tableName, JSON.stringify(propObjListing));
    }
  }

  public addToFavorite(property: any): void {
    if (!this.isAuthenticated) {
      this.notificationService.showErrorMessage('Login is required to perform this action');
      return;
    }

    this.submitted = true;
    let bookmartItemExit: boolean = false

    if (this.userBookMarks instanceof Array && this.userBookMarks.length > 0) {
      this.userBookMarks.forEach((element) => {
        if (element.LinkedEntity === property.LinkedEntity) {
          this.notificationService.showErrorMessage('Item has already been bookmarked');
          bookmartItemExit = true;
          return;
        }
      });
    }

    if (!bookmartItemExit) {

      this.loading = true;
      this.storeService.addToBookmark(JSON.stringify(property))
        .subscribe(() => {
          this.userBookMarks.push(property);
          //this.broadcastService.emitGetCart();
          //this.router.navigate(['/listings/application']);
          this.notificationService.showSuccessMessage('Successfully added to cart');
          setTimeout(() => {
            this.saveToLocalStorage(this.userBookMarks, this.sessionStorageBookmarks)
            this.notificationService.showSuccessMessage('Item added to bookmark');
            this.loading = false;
          }, 1000);
          this.loading = false;
          this.submitted = false;
        }, errors => {
          if (errors.error.message === "Error No Token Found") {
            this.notificationService.showErrorMessage('You would need to signup or login to perform this action');
          } else {
            this.notificationService.showErrorMessage(errors.error.message);
          }
          this.loading = false;
          this.submitted = false;
        });
    }
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive).
   * The value is no lower than min (or the next integer greater than min
   * if min isn't an integer) and no greater than max (or the next integer
   * lower than max if max isn't an integer).
   * Using Math.round() will give you a non-uniform distribution!
   */
  public getRandomInt(min: any, max: any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  public packageUnitForExport(params: any = 1) {
    let repakagedUnit: any = {};

    if (Object.keys(this.propertView).length !== 0 && Object.keys(this.propertyMap).length !== 0) {

      repakagedUnit.EntityParent = this.propertView.EntityParent;
      repakagedUnit.LinkedEntity = this.propertView.LinkedEntity;
      repakagedUnit.PropertyFloor = this.propertView.PropertyFloor;
      repakagedUnit.PropertyId = this.propertView.PropertyId;
      repakagedUnit.PropertyName = this.propertView.PropertyName ? this.propertView.PropertyName : 'Not Available'
      repakagedUnit.PropertyJson = this.propertyMap;
      repakagedUnit.PropertyType = 3;
      repakagedUnit.PaymentMethod = 1;
      repakagedUnit.PropertyStatus = this.propertView.property_status;
      repakagedUnit.PropertyAmount = this.getRandomInt(1111111, 999999);

      if (params === 1) {
        this.addToCart(repakagedUnit);
      } else {
        this.addToFavorite(repakagedUnit)
      }
    }


  }

  public saveBlockAndUnits(propObjListing: any) {
    //console.log('saveBlockAndUnits', propObjListing)
    if (JSON.stringify(propObjListing) !== "[]") {
      sessionStorage.setItem(this.propertyUnitName, JSON.stringify(propObjListing));
    }
  }


  async getEstateUnit(EstateID: any) {
    try {
      const unitListingInfo: any = await this.storeService.fetchSingleUnitsAsPromise(EstateID);
      if (unitListingInfo) {
        console.log('unitListingInfo', unitListingInfo)
      }
    } catch (error) {
      console.log('getEstateUnit- Error', error)
    }
  }

  public showProps() {
    setTimeout(() => {
      this.showView = false;
      this.changeDectection.detectChanges()
      //console.log('this.propertView', this.propertView, this.showView);
    }, 1000);
  }



  public addReview() {

  }

  public addViews() {

  }

  public likeReviews() {

  }

  public shareProperty() {

  }

  public addToCart(property: any): void {
    if (!this.isAuthenticated) {
      this.notificationService.showErrorMessage('Login is required to perform this action');
      return;
    }

    this.submitted = true;
    this.loading = true;
    let cartItemExit: boolean = false

    if (this.userCarts instanceof Array && this.userCarts.length > 0) {
      this.userCarts.forEach((element) => {
        if (element.LinkedEntity === property.LinkedEntity) {
          this.notificationService.showErrorMessage('Item has already added to cart');
          cartItemExit = true;
          return;
        }
      });
    }


    if (!cartItemExit) {

      this.storeService.addToCart(JSON.stringify(property))
        .subscribe(() => {
          this.userCarts.push(property);
          this.broadcastService.emitGetCart();
          this.router.navigate(['/listings/cart']);
          this.notificationService.showSuccessMessage('Successfully added to cart');

          setTimeout(() => {
            this.saveToLocalStorage(this.userCarts, this.sessionStorageCarts)
            this.notificationService.showSuccessMessage('Added to Cart');
            this.loading = false;
          }, 1000);
          this.loading = false;
          this.submitted = false;
        }, errors => {
          this.loading = false;
          this.submitted = false;
          if (errors.error.message === "Error No Token Found") {
            this.notificationService.showErrorMessage('You would need to signup or login to perform this action');
          } else {
            this.notificationService.showErrorMessage(errors.error.message);
          }

        });
    }
  }

  public checkPropertyObj() {
    const propertyListing = sessionStorage.getItem('HA_ESTATE_LISTING');
    // console.log(propertyListing)
    if (propertyListing === null || propertyListing === undefined) {
      // this.storeService.listAllEstate()
      //   .subscribe((result: any) => {
      //     // console.log('result', result)
      //     if (result.contentData instanceof Array && result.contentData.length > 0) {
      //       this.propertyListing = this.formatLoadedData(result.contentData)
      //     }
      //   }, (error: any) => {
      //     return this.propertyListing = []
      //   });
      console.log('No show')
    } else {
      return this.listFeaturedProperty = JSON.parse(propertyListing).slice(0, 5);
    }
  }




  public onAnimationStart(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  public onAnimationDone(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation() {
    this.animationState = 'leave';
  }


}
