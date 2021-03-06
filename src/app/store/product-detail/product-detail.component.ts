import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import rewind from '@mapbox/geojson-rewind';
import * as L from 'leaflet';
import { imageOverlay, latLng, tileLayer, svgOverlay } from "leaflet";
import 'leaflet.locatecontrol';
import Swal from 'sweetalert2';
import EventService from "eventservice";
import { EventsService } from 'angular4-events';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatSidenav } from '@angular/material/sidenav';
import { EstateMapSidebarService } from 'app/layout/estate-map-sidebar/estate-map-sidebar.service';
import { environment } from '../../../environments/environment';
import { NotificationService } from 'app/shared/services/notification.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { BroadcastService } from 'app/core/broadcast.service';
import { MobileService } from 'app/core/mobile.service';
import { Subscription } from 'rxjs';
import { Observable, Subscriber } from 'rxjs';
import { StoreService } from 'app/shared/services/store.service';
import { NavigationService } from 'app/shared/services/navigation.service'
import { UserService } from 'app/core/user/user.service';
import { AccountService } from 'app/shared/accounts/account.service';
import {
  PROPERTY_INFO_CHARGE,
  PROPERTY_STREETVIEW_CHARGE,
  PROPERTY_ESTATE_CHARGE,
  PROPERTY_HISTORY_CHARGE,
  PROPERTY_FLOOR_PLAN_CHARGE,
  PROPERTY_DOCUMENTS_CHARGE
} from 'app/shared/constants';




const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  allowEscapeKey: false,
})


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;


  public quantity = 1;
  public loading = false;
  public submitted = false;
  public mobile = false;
  public map: any;
  public lat = 9.077751;
  public lng = 8.6774567;
  public STORAGE_NAME = 'ha_marketplace_';
  public EstateName: string = ''
  public EstateInfo: any = null
  public EstateBlockAndUnits: Array<any> = [];
  public ESTATE_MAPSOURCE: any;
  public ESTATE_INFO: any = {};
  public ESTATE_BLOCK_MAP: any;
  public ESTATE_BLOCK_UNITS: any;
  private watcher: Subscription;
  public simpCounter = 0;
  public isMapLoading = true;
  public isAuthenticated: boolean = false;

  public showView: boolean;
  public propertView: any = {};
  public propertyMap: any = {};
  public totalRooms: number = 0;
  public listPropertyReviews: Array<any> = [];
  public isShowing: boolean = false;

  // data
  public source: any;
  public markers: any;
  public publishProperty: any;
  public svgElement: any = './assets/images/estate-placeholder.png';
  public sessionStorageBookmarks = 'houseAfrica.bookmarks';
  public userBookMarks: Array<any> = [];
  public sessionStorageCarts = 'houseAfrica.carts';
  public userCarts: Array<any> = [];

  //tabs
  public showContainer = true;
  public showFullSidenav = true;
  public justTheComponent = true;
  public tabsPlacement = 'start';
  public panorama: google.maps.StreetViewPanorama;

  public locationUnitLat: any;
  public locationUnitLong: any;
  public totalBalance = 0;
  public userAccount: any = {};
  public userInfo: any = {};

  public showEstateInfo: boolean = false;
  public showPropertyInfo: boolean = false;
  public showPropertyStreetView: boolean = false;
  public showPropertyFloorPlans: boolean = false;
  public showPropertyHistory: boolean = false;
  public showPropertyDocuments: boolean = false;

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    public router: Router,
    public changeDectection: ChangeDetectorRef,
    private notificationService: NotificationService,
    private broadcastService: BroadcastService,
    private eventService: EventsService,
    private mobileService: MobileService,
    private estateSidebarService: EstateMapSidebarService,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthenticationService,
    private userService: UserService,
    private accountService: AccountService,
    private navigation: NavigationService

  ) {

    this.isMapLoading = true;
  }

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches));

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.userService.getCurrentUser().subscribe((user: any) => {
        // We're just supporting one account right now. Grab the first result.
        if (user.data instanceof Object && Object.keys(user.data).length !== 0) {
          this.userInfo = user.data;

        } else {
          this.notLoggedInConfirmation()
        }
      }, (error) => {
        if (error.error.message === 'Error : Expired token') {
          console.log('Call logout')
        }
        // show payment Modal
      });
    } else {
      this.notLoggedInConfirmation()
    }

    this.route.params.subscribe(params => {
      const PropertyID = params['id'];
      this.returnEstatePropertyObj(PropertyID);
      setTimeout(() => {
        this.checkPropertyObj(PropertyID);
      }, 1000)
    });

    this.mobile = this.mobileService.isMobile();
    this.watcher = this.mobileService.mobileChanged$
      .subscribe(isMobile => this.mobile = isMobile);

    this.broadcastService.getBalance$.subscribe(() => {
      this.getAccounts(null, null);
    });

  }

  ngAfterViewInit(): void {
    EventService.on("DisplayPropertyInfo", async (propertyFeature) => {
      this.openSidebar();
      setTimeout(() => {
        // create estate with single unit
        let RepakageUnit = this.ESTATE_MAPSOURCE;
        RepakageUnit.features.push(propertyFeature);

        this.showPropertyInfo = false;
        this.showPropertyStreetView = false;
        this.showPropertyFloorPlans = false;
        this.showPropertyHistory = false;
        this.showPropertyDocuments = false;
        this.showEstateInfo = false;

        this.propertyMap = RepakageUnit;
        this.propertView = propertyFeature.properties
        this.totalRooms = this.propertView.property_bathroom_count + this.propertView.property_bedroom_count + this.propertView.property_sittingroom_count
        this.showView = false;

        const coordinates = propertyFeature.geometry.coordinates;
        const coord = coordinates[0][0][0]
        this.locationUnitLat = coord[0];
        this.locationUnitLong = coord[1];
        // this.initializeStreetView(coord[0], coord[1])
        this.changeDectection.detectChanges();

      }, 500);
    });


    this.loadFavorite();
    this.loadUserCart();

    //to remove any initiallization of a previous map
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
    this.watcher.unsubscribe();
    EventService.off("DisplayPropertyInfo", "HAKeyID");
  }


  /**
   * It's a function that displays a confirmation modal to the user when they try to view a property that
   * requires them to be logged in
   */
  public notLoggedInConfirmation() {
    Swal.fire({
      title: 'Opps! Login is required?',
      text: 'You will need to Login to be able to view this property.',
      icon: 'info',
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Yes, Login.',
      cancelButtonText: 'No, Maybe later.',
    }).then((result) => {
      //  console.log('results', result)
      if (result.value) {
        Toast.fire({
          icon: 'success',
          title: 'Redirecting to Login ...'
        });
        setTimeout(() => {
          this.router.navigate(['/authentication/login']);
        }, 3000);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Toast.fire({
          icon: 'error',
          title: 'You would be redirected to the previous page ...'
        })
        setTimeout(() => {
          this.navigation.back()
        }, 3000);

      }
    });
  }


  /**
   * It's a function that displays a confirmation modal to the user when the user's search credit is
   * insufficient
   */
  public insufficentBalanceConfirmation() {
    Swal.fire({
      title: 'Insufficent Search Credit',
      text: 'You will need to purchase search credits to contine',
      icon: 'warning',
      showCancelButton: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      // console.log('results', result)
      if (result.value) {
        Toast.fire({
          icon: 'success',
          title: 'Redirecting to Search Subscription Payment page ...'
        });
        setTimeout(() => {
          this.router.navigate([`/user-dashboard/user-search-subscription`]);
        }, 3000);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Toast.fire({
          icon: 'error',
          title: 'You would be not be able to access the information requested ...'
        })
        // setTimeout(() => {
        //   this.navigation.back()
        // }, 3000);
        this.openSidebar()
      }
    });
  }


  /**
   * It's a function that displays a sweet alert modal with a title, text, icon, showCancelButton,
   * confirmButtonText, and cancelButtonText
   */
  public accountRetry() {
    Swal.fire({
      title: 'Account Error?',
      text: 'We are unable to identify your Account, Would you like to try again!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Try Again!',
      cancelButtonText: 'No, Maybe later'
    }).then((result) => {
      if (result.value) {
        Toast.fire({
          icon: 'success',
          title: 'Retrying Account.'
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Toast.fire({
          icon: 'error',
          title: 'You would be able to access this information ...'
        })
        // setTimeout(() => {
        //   this.navigation.back()
        // }, 3000);
        this.openSidebar()
      }
    })
  }

  public generateReference(): string {
    let date = new Date();
    return 'HA-Ref' + Math.floor((Math.random() * 1000000000) + 1) + date.getTime().toString();
  }

  /**
   * It deducts the amount of points used for the search from the user's account
   * @param {number} amountDeductable - This is the number of points you want to deduct from the user's
   * account.
   */
  async makeAccountDeductions(amountDeductable: number, accountNarration: any = false, action: any = false) {
    try {

      const availablePoint = parseInt(this.userAccount.account_point, 10);
      const availableAmount = parseFloat(this.userAccount.account_balance);

      if (availablePoint > 0) {

        const AmountToDeduct = availableAmount / availablePoint

        this.userAccount.account_balance = availableAmount - AmountToDeduct;
        this.userAccount.account_point = availablePoint - amountDeductable;
        const deductSearchAmount = await this.accountService.updateUserAccounts(JSON.stringify(this.userAccount))
        if (deductSearchAmount) {
          let transactionHistory: any = {}
          transactionHistory.sender_id = this.userInfo.id;
          transactionHistory.receiver_id = 1
          transactionHistory.amount = AmountToDeduct;
          transactionHistory.charge = 1
          transactionHistory.post_balance = availableAmount
          transactionHistory.transaction_type = `${accountNarration}`
          transactionHistory.sender_Account = this.userInfo.mobile
          transactionHistory.receiver_Account = 'HOUSEAFRICA001'
          transactionHistory.trx = this.generateReference();
          transactionHistory.details = `DEDUCTION FOR USER ACTION TO ${accountNarration}`;
          transactionHistory.created_at = new Date()
          transactionHistory.updated_at = new Date()

          const addTHistory = await this.storeService.addTransactionHistory(JSON.stringify(transactionHistory));
          if (addTHistory) {
            // console.log('paid in full', action)
            switch (action) {
              case 'SHOW-PROPERTY-INFO':
                this.showPropertyInfo = true;
                this.changeDectection.detectChanges();
                break;
              case 'SHOW-PROPERTY-STREETVIEW':
                this.showPropertyStreetView = true;
                this.changeDectection.detectChanges();
                break;
              case 'SHOW-PROPERTY-DOCUMENT':
                this.showPropertyDocuments = true;
                this.changeDectection.detectChanges();

                break;
              case 'SHOW-PROPERTY-FLOORPLANS':
                this.showPropertyFloorPlans = true;
                this.changeDectection.detectChanges();
                break;
              case 'SHOW-PROPERTY-HISTORY':
                this.showPropertyHistory = true;
                this.changeDectection.detectChanges();
                break;
              case 'SHOW-ESTATE-INFO':
                this.showEstateInfo = true;
                this.changeDectection.detectChanges();
                break;

              default:
                break;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error Deduce Amount', error)
      Toast.fire({
        icon: 'error',
        title: 'We are unable to make deductions for last Request, You would be able to access the Information ...'
      })
      // setTimeout(() => {
      //   this.navigation.back()
      // }, 3000);
      this.openSidebar()

    }

  }

  /**
   * We're calling the `getUserAccounts` function from the `accountService` and if the response is
   * successful, we're checking if the `account_point` is 0. If it is, we're calling the
   * `insufficentBalanceConfirmation` function. If it's not, we're calling the `makeAccountDeductions`
   * function
   */
  private getAccounts(amountToDeduct: any, accountNaration: any, action: any = null): void {
    this.accountService.getUserAccounts()
      .subscribe((accounts: any) => {
        // console.log('accounts', accounts.data.records[0])
        // We're just supporting one account right now. Grab the first result.

        if (accounts?.data.records instanceof Array && accounts.data.records.length > 0) {
          const account = accounts.data.records[0];
          this.userAccount = accounts.data.records[0];

          if (amountToDeduct !== null) {
            if (account.account_point === "0") {
              this.insufficentBalanceConfirmation()
              return;
            } else {
              this.totalBalance = account.account_point !== "0" ? parseInt(account.account_point, 10) : 0;
              this.broadcastService.emitPointBalanceUpdated(this.totalBalance);
              this.makeAccountDeductions(amountToDeduct, accountNaration, action);
            }
          } else {
            return;
          }
        } else {
          this.accountRetry()
        }
      }, (error) => {
        if (error.error.message === 'Error : Expired token') {
          console.log('Call logout action')
        }
        // show payment Modal
        this.accountRetry();
      });

  }



  public placementToggle(change: any) {
    change.checked === true ? this.tabsPlacement = 'start' : this.tabsPlacement = 'end';
  }

  public onContentVisibilityChange(change: any) {
    console.log('change', change);
  }

  public openSidebar() {
    // I'd like to insert the "ContentComponent" into the sidebar.
    // const sidebarRef: OverlayRef = this.estateSidebarService.open('');
    if (!this.isShowing) {
      this.isShowing = true;
      this.changeDectection.detectChanges()
    }
    else {
      this.isShowing = false;
      this.changeDectection.detectChanges();
    }
    // console.log('ha')

  }

  /**
   * If the user has bookmarks, load them from session storage. 
   * If not, create an empty array
   */
  public loadFavorite() {
    const bookmarks = sessionStorage.getItem(this.sessionStorageBookmarks);
    if (bookmarks === null || bookmarks === undefined) {
      this.userBookMarks = [];
    } else {
      this.userBookMarks = JSON.parse(bookmarks);
    }
  }

  /* The above code is adding a property to the user's bookmark list. */
  public loadUserCart() {
    const carts = sessionStorage.getItem(this.sessionStorageCarts);
    if (carts === null || carts === undefined) {
      this.userCarts = [];
    } else {
      this.userCarts = JSON.parse(carts);
    }
  }

  /**
   * It takes two parameters, the first is an object and the second is a string. It then checks if the
   * object is empty, if it is not empty it saves the object to the session storage
   * @param {any} propObjListing - This is the object that you want to save to local storage.
   * @param {any} tableName - The name of the table you want to save to local storage.
   */
  public saveToLocalStorage(propObjListing: any, tableName: any) {
    //console.log('saveBlockAndUnits', propObjListing)
    if (JSON.stringify(propObjListing) !== "[]") {
      sessionStorage.setItem(tableName, JSON.stringify(propObjListing));
    }
  }


  /**
   * It checks if the user is authenticated, if not, it shows an error message. If the user is
   * authenticated, it checks if the property is already bookmarked, if not, it adds the property to the
   * user's bookmarks
   * @param {any} property - This is the property object that is being bookmarked.
   * @returns a boolean value.
   */

  public addToFavorite(property: any): void {
    if (!this.isAuthenticated) {
      this.notificationService.showErrorMessage('Login is required to perform this action');
      return;
    }

    this.submitted = true;
    let alreadyExit: boolean = false

    if (this.userBookMarks instanceof Array && this.userBookMarks.length > 0) {
      this.userBookMarks.forEach((element) => {
        if (element.PropertyId === property.PropertyId) {
          this.notificationService.showErrorMessage('Item has already been bookmarked');
          alreadyExit = true;
          return;
        }
      });
    }

    if (!alreadyExit) {
      this.openSidebar()
      this.loading = true;
      this.storeService.addToBookmark(JSON.stringify(property))
        .subscribe(() => {
          this.userBookMarks.push(property);
          Swal.fire(
            'Bookmarked!',
            'This property has been bookmarked.',
            'success'
          )
          this.loading = false;
          this.submitted = false;
          setTimeout(() => {
            this.saveToLocalStorage(this.userBookMarks, this.sessionStorageBookmarks)
            this.notificationService.showSuccessMessage('Item added to bookmark');
            this.loading = false;
          }, 1000);

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



  /**
   * It takes the data from the property view and repackages it into a new object that can be used for
   * the cart and favourite
   * @param {any} [params=1] - 1 - Add to cart
   */
  public packageUnitForExport(params: any = 1) {
    let repakagedUnit: any = {};

    if (Object.keys(this.propertView).length !== 0 && Object.keys(this.propertyMap).length !== 0) {

      repakagedUnit.PropertyEstate = this.propertView.PropertyEstate;
      repakagedUnit.PropertyBlock = this.propertView.PropertyBlock;
      repakagedUnit.PropertyFloor = this.propertView.PropertyFloor;
      repakagedUnit.MapSnapshot = this.propertView.MapSnapshot;
      repakagedUnit.PropertyId = this.propertView.PropertyId;
      repakagedUnit.PropertyName = this.propertView.PropertyName ? this.propertView.PropertyName : 'Not Available'
      repakagedUnit.PropertyJson = this.propertyMap;
      repakagedUnit.PropertyType = 3;
      repakagedUnit.PropertyStatus = this.propertView.property_status;
      repakagedUnit.PropertyAmount = this.getRandomInt(1111111, 999999);

      if (params === 1) {
        this.addToCartProcess(repakagedUnit);
      } else {
        this.actionToFavourite(repakagedUnit)
      }
    }
  }

  /**
   * It takes a repackaged unit as a parameter, sets the payment method to 2, and then displays a
   * confirmation message to the user. If the user confirms, it calls the addToFavorite function
   * @param {any} repakagedUnit - This is the unit that is being added to the favourites.
   */
  public actionToFavourite(repakagedUnit: any) {
    repakagedUnit.PaymentMethod = 2;
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to bookmark this property!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, bookmark it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.addToFavorite(repakagedUnit);
      }
    })
  }


  /**
   * The function takes in a repackaged unit, and then displays a modal to the user, asking if they would
   * like to proceed with the application, if they click yes, another modal is displayed asking if they
   * would like to make an outright payment or apply for a loan/mortgage, if they click yes, the function
   * is called again with the payment method set to 1, if they click no, the function is called again
   * with the payment method set to 2
   * @param {any} repakagedUnit - This is the unit that is being added to the cart.
   */
  public addToCartProcess(repakagedUnit: any) {
    Swal.fire({
      title: 'Property Purchase Request',
      text: "Would you like to Proceed with this Application!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Continue!',
      cancelButtonText: 'No, do it later.'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Property Payment',
          text: "How Would you like to make payments?",
          icon: 'info',
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Outright Payment!',
          cancelButtonText: 'Lets do it later',
          denyButtonText: 'Apply for Loan/Mortgage',
        }).then((result) => {
          if (result.isConfirmed) {
            repakagedUnit.PaymentMethod = 1;
            this.addToCart(repakagedUnit, 1);
          } else if (result.isDenied) {
            repakagedUnit.PaymentMethod = 2;
            this.addToCart(repakagedUnit, 2);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Toast.fire({
              icon: 'error',
              title: 'We are sorry to see you cancel, and hope you try again.'
            })

          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Toast.fire({
          icon: 'error',
          title: 'Opps! We are sad to see you cancel, but we have payment Options to help you make a purchase'
        })
      }
    })
  }


  /**
   * It takes in a UnitMap and UnitInfo object, and returns a repackagedUnit object
   * @param {any} UnitMap - This is the object that contains the unit map.
   * @param {any} UnitInfo - This is the object that contains the information about the property.
   * @param {any} [params=1] - 1 = Add to Cart
   */
  public packageUnitForExport_(UnitMap: any, UnitInfo: any, params: any = 1) {
    let repakagedUnit: any = {};

    if (Object.keys(UnitInfo).length !== 0 && Object.keys(UnitMap).length !== 0) {

      repakagedUnit.PropertyEstate = UnitInfo.PropertyEstate
      repakagedUnit.PropertyBlock = UnitInfo.PropertyBlock
      repakagedUnit.PropertyFloor = UnitInfo.PropertyFloor
      repakagedUnit.PropertyId = UnitInfo.PropertyId
      repakagedUnit.PropertyName = UnitInfo.PropertyName ? UnitInfo.PropertyName : 'Not Available'
      repakagedUnit.PropertyJson = UnitMap;
      repakagedUnit.PropertyType = 3
      repakagedUnit.PaymentMethod = 1;
      repakagedUnit.PropertyStatus = UnitInfo.property_status;
      repakagedUnit.PropertyAmount = this.getRandomInt(1111111, 999999);

      if (params === 1) {
        this.addToCart(repakagedUnit, 1);
      } else {
        this.addToFavorite(repakagedUnit);
      }
    }
  }

  /**
   * It adds a property to the cart
   * @param {any} property - This is the property object that is being added to the cart.
   * @param {any} action - 1 - Outright payment
   * @returns a boolean value.
   */
  public addToCart(property: any, action: any): void {
    if (!this.isAuthenticated) {
      this.notificationService.showErrorMessage('Login is required to perform this action');
      return;
    }
    this.submitted = true;
    this.loading = true;
    let cartItemExit: boolean = false

    if (this.userCarts instanceof Array && this.userCarts.length > 0) {
      this.userCarts.forEach((element) => {
        if (element.PropertyId === property.PropertyId) {
          this.notificationService.showErrorMessage('Item has already added to cart');
          cartItemExit = true;
          return;
        }
      });
    }


    if (!cartItemExit) {
      this.openSidebar()
      this.storeService.addToCart(JSON.stringify(property))
        .subscribe((cartItem: any) => {
          this.broadcastService.emitGetCart();

          switch (action) {
            case 1:
              // Outright payment
              this.router.navigate([`/property-search/checkout-option-outright-payment/${cartItem.data}`]);
              break;
            case 2:
              // Loans payments
              this.router.navigate([`/property-search/checkout-option-loan-application/${cartItem.data}`]);
              break;

            default:
              // Mortgage
              this.router.navigate([`/property-search/checkout-option-mortgage-application/${cartItem.data}`]);
              break;
          }

          // this.notificationService.showSuccessMessage('Successfully added to application listing');
          this.userCarts.push(property);

          setTimeout(() => {
            this.saveToLocalStorage(this.userCarts, this.sessionStorageCarts)
            // this.notificationService.showSuccessMessage('Added to Application Listing');
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

  private initMap(): void {
    //console.log('map-called');

    const data = this.ESTATE_MAPSOURCE;

    const coordinates = data.features[0].geometry.coordinates;
    const coord = coordinates[0][0][0];
    // console.log('center', coordinates[0][0])
    this.ESTATE_INFO = this.ESTATE_MAPSOURCE.features[0].properties
    //  console.log('ESTATE_MAPSOURCE', this.EstateInfo)

    const mbAttr = 'Marketplace &copy; Integration by <a href="https://houseafrica.io/">HouseAfrica</a>';
    const template = '<div id="popup-form">\
      <H3">Unit info:</H3>\
      <table class="popup-table">\
        <tr class="popup-table-row">\
          <th class="popup-table-header">Name:</th>\
          <td id="value-arc" class="popup-table-data"></td>\
        </tr>\
        <tr class="popup-table-row">\
          <th class="popup-table-header">Size:</th>\
          <td id="value-speed" class="popup-table-data"></td>\
        </tr>\
      </table>\
      <div>\
      <button id="button-submit" class="balloon-btn grey" type="button"><i class="fa fa-info"></i>&nbsp;Details</button>\
      <button id="button-favourite" class="balloon-btn" type="button"><i class="fa fa-star"></i></button>\
      </div>\
    </div>';


    this.map = L.map('estateMap').setView([coord[1], coord[0]], 7);

    // Set up the OSM layer  
    this.map.createPane('HA_Street_Layer');
    this.map.createPane('HA_Street_Hybrid');
    this.map.createPane('HA_Street_Sat');
    this.map.createPane('HA_Street_Terrain');
    this.map.createPane('HA_Estate_Blocks');
    this.map.createPane('HA_Units');
    this.map.createPane('Ha_DevTiles');


    const googleStreets = tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      pane: 'HA_Street_Layer',
      minZoom: 5,
      maxZoom: 25,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: mbAttr,
    });

    const googleHybrid = tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      pane: 'HA_Street_Hybrid',
      minZoom: 5,
      maxZoom: 25,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: mbAttr,
    });

    const googleSat = tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      pane: 'HA_Street_Sat',
      minZoom: 5,
      maxZoom: 25,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: mbAttr,
    });


    const googleTerrain = tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      pane: 'HA_Street_Terrain',
      minZoom: 5,
      maxZoom: 25,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: mbAttr,
    });

    const baseLayers = {
      Sattelite: googleSat,
      Streets: googleStreets,
      Hybrid: googleHybrid,
      Terrian: googleTerrain
    };




    /**
    * It returns a color based on the status of the property.
    * @param {any} color_status - The status of the property.
    * @returns The color of the status of the property.
    * Edit ranges and colors to match your data; see http://colorbrewer.org
    * Any values not listed in the ranges below displays as the last color
    */
    function getColor(color_status: any) {
      switch (color_status) {
        case 'Uncliamed': return '#FF0000';
        case 'Unavailable': return '#7CFC00';
        case 'Litigation': return '#FF0000';
        case 'Unreleased': return '#7d7d7d';
        case 'Available for Resale': return '#0e4382';
        case 'Sold': return '#ac0e0b';
        case 'Available': return '#338a0e';
        case "Available for Rental": return "#00ADCD";
        case "Reserved": return "#cab60e";
        case "Pending": return "#d06200";
        case "Sold": return "#ac0e0b";
        case "Granted": return "#ffafc8";
        case "Bankable": return "#ee0e0b";
        case "Transferred": return "#ac0ec3";
        case "Rented": return "#ac0e0b";
        case "Mortagage": return "#6900C3";
        default: return "black";

      }
    }


    /**
     * The function style() takes a feature as an argument and returns an object with the following
     * properties: fillColor, weight, opacity, color, fillOpacity, smoothFactor, and interactive
     * @param {any} feature - any - this is the feature that is being styled.
     * @returns A function that returns an object.
     * Edit the getColor property to match data column header in your GeoJson file
     */

    function style(feature: any) {
      return {
        fillColor: getColor(feature.properties.property_status),
        weight: 2,
        opacity: 0.6,
        color: 'white',
        fillOpacity: 1,
        smoothFactor: 0.5,
        interactive: true,
      };
    }


    /**
     * The function takes an event as an argument, resets the highlight, sets the marker to the event
     * target, sets the properties to the event target's feature properties, sets the color to the
     * property status, and then sets the marker style
     * @param {any} e - any - this is the event that is triggered when the user clicks on a marker.
     * This highlights the layer on hover, also for mobile
     */
    function highlightFeature(e: any) {
      resetHighlight(e);
      var marker = e.target,
        properties = e.target.feature.properties;
      var color = getColor(properties.property_status)
      marker.setStyle({
        weight: 10,
        color: 'white',
        opacity: 0.6,
        fillOpacity: 0.65,
        fillColor: color
      });
    }


    /**
     * The function is called when a user clicks on a marker on the map. It opens a popup with a form.
     * The form has two buttons: one to submit the form and one to add the property to the user's
     * favorites
     * @param {any} e - any - This is the event object that is passed to the function.
     */
    function layerClickHandler(e: any) {
      var marker = e.target;
      var properties = e.target.feature.properties;
      var allFeatures = e.target.feature

      if (marker.hasOwnProperty('_popup')) {
        marker.unbindPopup();
      }

      marker.bindPopup(template);
      marker.openPopup();

      L.DomUtil.get('value-arc').textContent = properties.property_name;
      L.DomUtil.get('value-speed').textContent = properties.property_title;

      var buttonSubmit = L.DomUtil.get('button-submit');
      L.DomEvent.addListener(buttonSubmit, 'click', async (e) => {
        await EventService.fire("DisplayPropertyInfo", allFeatures);
        //Add Add sidebar to the map
        marker.closePopup();
      });

      var buttonFavorite = L.DomUtil.get('button-favourite');
      L.DomEvent.addListener(buttonFavorite, 'click', async (e) => {
        await EventService.fire("AddToFavorite", allFeatures);
        marker.closePopup();
      });

    }




    /**
     * The function is called on each feature in the GeoJSON file. It adds a mouseover, mouseout, and
     * click event listener to each feature
     * @param {any} feature - the feature that was clicked on
     * @param {any} layer - the layer that was clicked
     * This instructs highlight and reset functions on hover movement
     */
    function onEachFeature(feature: any, layer: any) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: layerClickHandler
      });
    }

    // Creates an info box on the map
    var info = L.control({ position: 'topleft' });
    info.onAdd = function (map: any) {
      this._div = L.DomUtil.create('div', 'estateInfo');
      this._div.style.padding = '10px';
      this._div.style.display = 'flex';
      this._div.style.flexDirection = 'column';
      this._div.style.alignItems = 'flex-start'
      this._div.style.margin = '5px';
      this._div.style.borderRadius = "5px";
      this._div.style.backgroundColor = "white";
      this._div.style.marginTop = '10px';
      this._div.style.fontWeight = 'bold';
      this._div.style.color = '#000';

      this.update();
      return this._div;
    };

    // Edit info box text and variables (such as props.density2010) to match those in your GeoJSON data
    info.update = function (props: any) {
      this._div.innerHTML = '<h3>Zoom Closer to Explore Estate and view available units</h3>';
      var value = props && props.percent ? props.percent + '%' : 'No data'
      this._div.innerHTML += (props
        ? '<b>' + props.property_name + '</b><br />' + props.property_title + '</b><br />'
        + (props.property_price ? 'Most recent data: ' + props.property_price : '')
        : 'OR Click over Block Units');
    };
    info.addTo(this.map);


    let legend = new L.Control({ position: 'topright' });
    legend.onAdd = function (map: any) {
      let labels = ['Available', 'Sold', 'Unreleased', 'Available for Resale'];
      var legendDiv = document.createElement('div');
      legendDiv.id = 'legendDiv';
      legendDiv.style.padding = '10px';
      legendDiv.style.display = 'flex';
      legendDiv.style.flexDirection = 'column';
      legendDiv.style.alignItems = 'flex-start'
      legendDiv.style.margin = '5px';
      legendDiv.style.borderRadius = "3px 3px 3px 3px";
      legendDiv.style.backgroundColor = "white";
      legendDiv.style.marginTop = '10px';

      var legend = document.createElement('div');
      legend.innerHTML = '<span>Status &nbsp; &nbsp; <i class="fa fa-angle-double-right" style="font-size: 140%; cursor: pointer;" id="legendToggler"></i></span>';
      legend.style.fontWeight = "bold";
      legendDiv.appendChild(legend);

      for (var l in labels) {
        var color = getColor(labels[l]);
        var legEl = document.createElement('div');
        legEl.innerHTML = '<span><i class="fa fa-circle" style="color: ' + color + ';opacity:0.8;" ></i> &nbsp; ' + labels[l] + '</span>';
        legEl.style.marginTop = "10px";
        legEl.className = "legEl";
        legendDiv.appendChild(legEl);
      }
      return legendDiv;
    };


    const estateLayer = L.geoJson(this.ESTATE_MAPSOURCE, {
      pane: 'HA_Estate_Blocks',
      attribution: this.EstateInfo?.PropertyTitle ? this.EstateInfo?.PropertyTitle.toUpperCase() : 'HA ESTATES',
      interactive: true,
      layerName: 'estateLayer',
      style: function (feature: any) {
        switch (feature.properties.group) {
          case 'Estate': return {
            stroke: true,
            color: "#ffffff",
            weight: 5,
            opacity: 1,
            fill: true,
            fillColor: "transparent",
            fillOpacity: 1,
            smoothFactor: 0.5,
            interactive: true,
          };
          case 'Block': return {
            stroke: true,
            color: "#ffffff",
            weight: 5,
            opacity: 1,
            fill: true,
            fillColor: "#f2f2f2",
            fillOpacity: 1,
            smoothFactor: 0.5,
            interactive: true,
          };
        }

      },
      onEachFeature: function (feature: any, layer: any) {
        layer.on({
          mouseover: function () {
            this.setStyle({
              'fillColor': feature.properties.group === 'Estate' ? '#b45501' : "#808080",
            });

            if (feature.properties.group !== 'Estate') {
              layer.bindTooltip('Click to load units').openTooltip();
            }

          },
          mouseout: function () {
            this.setStyle({
              'fillColor': feature.properties.group === 'Estate' ? 'transparent' : "#f2f2f2",
            });

            if (feature.properties.group !== 'Estate') {
              layer.unbindTooltip();
            }

          },
          click: (e: any) => {
            if (feature.properties.group !== 'Estate') {
              // var layer = e.target;
              // this.map.fitBounds(layer.getBounds());
              // console.log('Clicked on ', layer.feature.properties.property_name); //country info from geojson
              // alert('Clicked on ' + feature.properties.name)
              // const coordinates = feature.geometry.coordinates;
              // const coord = coordinates[0][0][0]
              // this.map.flyTo(coord[1], coord[0], 5);
              //zoom in
            }
          }
        });

        if (feature.properties.group === 'Estate') {
          layer.bindTooltip(feature.properties.property_name, { permanent: true, direction: 'center', className: 'estateLabel' });
        }
      }
    }).addTo(this.map);



    const estateUnitsLayer = L.geoJson(this.ESTATE_BLOCK_UNITS, {
      pane: 'HA_Units',
      attribution: 'HA ESTATE UNIT NAME',
      interactive: true,
      layerName: 'estateLayer',
      style: style,
      onEachFeature: onEachFeature
    })

    /**
        * The function resets the style of the estateUnitsLayer to the style function
        * @param {any} e - the event object
        * This resets the highlight after hover moves away
        */
    function resetHighlight(e: any) {
      estateUnitsLayer.setStyle(style);
      info.update();
    }

    // console.log('this.EstateInfo.MapSnapshot', this.EstateInfo.MapSnapshot)

    const ImageMapOverlay = this.EstateInfo?.MapSnapshot !== null ? this.EstateInfo.MapSnapshot : this.svgElement

    //if (ImageMapOverlay !== null) {
    let svgElementBounds = estateLayer.getBounds();
    const imageOverlay = L.imageOverlay(ImageMapOverlay, svgElementBounds, {
      pane: 'Ha_DevTiles'
    })

    const overlaysGroup = L.layerGroup([imageOverlay])
    overlaysGroup.addTo(this.map);
    // }
    /**
     * use this for a single image overlay
     * "Development Tiles": development_tiles,
     *  use this for a collection of image 
     * oveerlays stored in a overlayGroup
     * "Development Tiles": overlaysGroup
     */

    const controlLayers = {
      "Dev-Tiles": imageOverlay
    }


    this.map.getPane('HA_Street_Layer').style.zIndex = 500;
    this.map.getPane('HA_Street_Hybrid').style.zIndex = 501;
    this.map.getPane('HA_Street_Sat').style.zIndex = 502;
    this.map.getPane('HA_Street_Terrain').style.zIndex = 503;
    this.map.getPane('HA_Estate_Blocks').style.zIndex = 504;
    this.map.getPane('Ha_DevTiles').style.zIndex = 650;
    this.map.getPane('HA_Units').style.zIndex = 655;

    L.control.layers(baseLayers, controlLayers).addTo(this.map);
    googleHybrid.addTo(this.map);

    //if (ImageMapOverlay !== null) {
    imageOverlay.bringToBack();
    // imageOverlay.bringToFront();
    //}

    this.map.fitBounds(imageOverlay.getBounds());

    this.map.on('popupclose', (e) => {
      // setTimeout(function(){
      //     if(LS.Send.IsDragging == false){
      //         map.removeLayer(LS.Send.Marker);
      //     }
      // },300);
    });

    this.map.on('zoomend', (e) => {
      // console.log('map.getZoom()-1', this.map.getZoom())
      if (this.map.getZoom() >= 7 && this.map.getZoom() <= 16) {
        if (this.simpCounter == 0 || this.simpCounter == 2) {
          this.map.removeLayer(estateUnitsLayer);
          // REMOVING PREVIOUS INFO BOX
          if (legend !== undefined) {
            legend.remove(this.map)
          }

          if (info !== undefined) {
            info.addTo(this.map)
          }
          this.simpCounter = 1;
        }
      }
      else if (this.map.getZoom() >= 17) {
        if (this.simpCounter == 0 || this.simpCounter == 1) {
          this.map.addLayer(estateUnitsLayer);
          // development_tiles.bringToBack();
          if (legend !== undefined) {
            legend.addTo(this.map);
          }

          if (info !== undefined) {
            info.remove(this.map)
          }
          //console.log('Showing units -1')
          this.simpCounter = 2;
        }
      }
      else if (this.map.getZoom() <= 7) {
        if (this.simpCounter == 1 || this.simpCounter == 2) {
          //console.log('Showing units')
          this.simpCounter = 0;
        }
      }
    });

  }



  /**
   * It returns an observable that emits the current position of the user, and completes
   * @returns An observable that returns the current position of the user.
   */
  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  /**
   * It takes a GeoJSON object, rewinds it, and deletes the crs property
   * @param {any} geoJsonObj - The GeoJSON object that you want to patch.
   * @returns A stringified version of the geoJsonObj with the crs property deleted.
   */

  public patchGeoJson(geoJsonObj: any) {
    const patchedJson: any = rewind(JSON.parse(geoJsonObj));
    delete patchedJson.crs;
    return JSON.stringify(patchedJson)
  }

  public close() {
    console.log('Close');
  }


  /**
   * It takes in a JSON object and returns a JSON object with the same keys but with the values of the
   * keys being the values of the keys in the JSON object passed in
   * @param {any} Metadata - This is the metadata object returned from the blockchain.
   * @returns a blockListing object.
   */
  public resolveObjectAndMerge(Metadata: any) {
    var blockListing: any = {}
    blockListing.payment_plans = Metadata?.payment_plans ? Metadata?.payment_plans.FieldValue : 'Not Available';
    blockListing.property_address = Metadata?.property_address ? Metadata?.property_address.FieldValue : 'Not Available';
    blockListing.property_amenities = Metadata?.property_amenities ? Metadata?.property_amenities.FieldValue : 'Not Available';
    blockListing.property_bathroom_count = Metadata?.property_bathroom_count ? Metadata?.property_bathroom_count.FieldValue : 1;
    blockListing.property_bedroom_count = Metadata?.property_bedroom_count ? Metadata?.property_bedroom_count.FieldValue : 1;
    blockListing.property_country = Metadata?.property_country ? Metadata?.property_country.FieldValue : 'Nigeria';
    blockListing.property_description = Metadata?.property_description ? Metadata?.property_description.FieldValue : 'Not Available';
    blockListing.property_feature_photo = Metadata?.property_feature_photo ? Metadata?.property_feature_photo.FieldValue : 'Not Available';
    blockListing.property_features = Metadata?.property_features ? Metadata?.property_features.FieldValue : 'Not Available';
    blockListing.property_floor_plan = Metadata?.property_floor_plan ? Metadata?.property_floor_plan.FieldValue : 'Not Available';
    blockListing.property_lga = Metadata?.property_lga ? Metadata?.property_lga.FieldValue : 'Not Available';
    blockListing.property_name = Metadata?.property_name ? Metadata?.property_name.FieldValue : 'Not Available';
    blockListing.property_parking_space_count = Metadata?.property_parking_space_count ? Metadata?.property_parking_space_count.FieldValue : 1;
    blockListing.property_payment_plans = Metadata?.property_payment_plans ? Metadata?.property_payment_plans.FieldValue : 'Not Available';
    blockListing.property_photos = Metadata?.property_photos ? Metadata?.property_photos.FieldValue : 'Not Available';
    blockListing.property_price = Metadata?.property_price ? parseFloat(Metadata?.property_price.FieldValue) : (Math.floor(Math.random() * (Math.floor(9999999) - Math.ceil(2222222) + 1)) + Math.ceil(2222222));
    blockListing.property_sittingroom_count = Metadata?.property_sittingroom_count ? Metadata?.property_sittingroom_count.FieldValue : 1;
    blockListing.property_size = Metadata?.property_size ? Metadata?.property_size.FieldValue : 'Not Available';
    blockListing.property_state = Metadata?.property_state ? Metadata?.property_state.FieldValue : 'Not Available';
    blockListing.property_status = Metadata?.property_status ? Metadata?.property_status.FieldValue : 'Available';
    blockListing.property_title = Metadata?.property_title ? Metadata?.property_title.FieldValue : 'Not Available';
    blockListing.property_title_photos = Metadata?.property_title_photos ? Metadata?.property_title_photos.FieldValue : 'Not Available';
    blockListing.property_type = Metadata?.property_type ? Metadata?.property_type.FieldValue : 'Land';
    blockListing.property_video_url = Metadata?.property_video_url ? Metadata?.property_video_url.FieldValue : 'Not Available';
    // console.log(blockListing);
    return blockListing
  }

  /**
   * It takes a list of properties, formats them into a GeoJSON object and returns a list of formatted
   * properties
   * @param {any} propertyObjectListing - This is the data that is returned from the API call.
   * @returns An array of objects.
   */
  public formatLoadedData(propertyObjectListing: any) {
    let propertyObj = [];
    if (propertyObjectListing instanceof Array && propertyObjectListing.length > 0) {
      propertyObjectListing.forEach((property: any) => {
        var objectElement: any = {};
        const unitsData = rewind(JSON.parse(property.EntityGeometry));
        objectElement = property;
        objectElement.Metadata = this.resolveObjectAndMerge(property.Metadata);
        objectElement.Entity = this.patchGeoJson(property.EntityGeometry);
        propertyObj.push(objectElement);

        let properties = Object.assign(unitsData.features[0].properties, objectElement.Metadata);
        properties.group = 'unit'
        properties.PropertyFloor = property.PropertyFloor ? property.PropertyFloor : 0;
        properties.PropertyId = property.PropertyId;
        properties.LinkedEntity = property.LinkedEntity;
        properties.MapSnapshot = property.MapSnapshot;
        properties.id = property.PropertyId;
        properties.PropertyName = property.PropertyTitle;
        properties.PropertyEstate = property.PropertyEstate;
        properties.PropertyBlock = property.PropertyBlock;
        properties.BlockChainAddress = property.BlockChainAddress;
        properties.PropertyUUID = property.PropertyUUID;
        properties.DateCreated = property.DateCreated

        unitsData.features[0].properties = properties;
        this.ESTATE_BLOCK_UNITS.features.push(unitsData.features[0]);
        this.changeDectection.detectChanges()
      });

      return propertyObj
    }
    return [];
  }

  public saveBlockAndUnits(propObjListing: any) {
    //console.log('saveBlockAndUnits', propObjListing)
    if (JSON.stringify(propObjListing) !== "[]") {
      sessionStorage.setItem(`${this.STORAGE_NAME}${this.EstateName}`, JSON.stringify(propObjListing));
    }
  }


  public removeBlockAndUnit(propObjListing: any) {
    sessionStorage.removeItem(propObjListing);
  }


  /**
   * It loops through the block data and fetches the block units and then returns the block data with the
   * block units
   * @param {any} BlockParam - This is the array of block objects that are returned from the API.
   * @returns An array of objects
   */
  public loopBlockAndUnit(BlockParam: any) {
    try {
      var blockParamsListing = []
      if (BlockParam instanceof Array && BlockParam.length > 0) {

        BlockParam.forEach(async (property: any) => {
          var objectElement: any = {}
          const blockUnitInfo: any = await this.storeService.fetchBlockUnitsAsPromise(property.PropertyId);
          if (blockUnitInfo instanceof Object) {
            const blockData = rewind(JSON.parse(property.EntityGeometry));
            objectElement = property;
            objectElement.Metadata = this.resolveObjectAndMerge(property.Metadata);
            objectElement.Entity = this.patchGeoJson(property.EntityGeometry);
            objectElement.BlockUnit = blockUnitInfo.contentData.length > 0 ? this.formatLoadedData(blockUnitInfo.contentData) : []
            blockParamsListing.push(objectElement);


            let properties = Object.assign(blockData.features[0].properties, objectElement.Metadata);
            properties.group = 'Block'
            blockData.features[0].properties = properties;
            this.ESTATE_MAPSOURCE.features.push(blockData.features[0]);
            this.changeDectection.detectChanges();
          }

        });

        return blockParamsListing;
      }
      return blockParamsListing;

    } catch (error) {
      console.log('error', error)
    }

  }


  /* Checking if the property is in the session storage. If it is not, it will fetch the property from
  the server and save it in the session storage. If it is, it will return the property from the
  session storage. */
  async checkPropertyObj(EstateID: any) {

    try {
      const propertyListing = sessionStorage.getItem(`${this.STORAGE_NAME}-${this.EstateName}`);
      // console.log(propertyListing)
      if (propertyListing === null || propertyListing === undefined) {
        const blockListingInfo: any = await this.storeService.fetchEstateBlockAsPromise(EstateID);

        if (blockListingInfo) {
          // console.log('result', result)
          if (blockListingInfo.contentData instanceof Array && blockListingInfo.contentData.length > 0) {
            const BlockAndUnits = this.loopBlockAndUnit(blockListingInfo.contentData);
            this.EstateBlockAndUnits = BlockAndUnits

          }
        }

        setTimeout(() => {
          this.ESTATE_BLOCK_MAP = {};
          this.ESTATE_BLOCK_MAP.Estate = this.ESTATE_MAPSOURCE;
          this.ESTATE_BLOCK_MAP.units = this.ESTATE_BLOCK_UNITS;
          this.isMapLoading = false;
          this.changeDectection.detectChanges();
          this.saveBlockAndUnits(this.ESTATE_BLOCK_MAP);
          this.initMap();
        }, 5000);


      } else {

        const savedProp = JSON.parse(propertyListing);
        if (savedProp instanceof Object && Object.keys(savedProp).length !== 0) {
          this.ESTATE_MAPSOURCE = this.ESTATE_BLOCK_MAP.Estate
          this.ESTATE_BLOCK_UNITS = this.ESTATE_BLOCK_MAP.units;

          setTimeout(() => {
            this.isMapLoading = false;
            this.changeDectection.detectChanges();
            this.initMap();
          }, 5000);


        } else {
          this.removeBlockAndUnit(`${this.STORAGE_NAME}-${this.EstateName}`)
        }
      }
    } catch (error) {
      return this.EstateBlockAndUnits = []
    }
  }

  /**
   * It returns the estate object from the session storage
   * @param {any} PropertyID - This is the ID of the property you want to return.
   * @returns The EstateInfo, EstateName, ESTATE_MAPSOURCE, and ESTATE_BLOCK_UNITS
   */
  public returnEstatePropertyObj(PropertyID: any) {
    const propertyListing = sessionStorage.getItem('HA_ESTATE_LISTING');
    // console.log(propertyListing)
    if (propertyListing === null || propertyListing === undefined) {
      console.log('Got No Estate')
      this.router.navigate([`/property-search`]);
      //return
    } else {
      const propertyObjListing = JSON.parse(propertyListing);
      if (propertyObjListing instanceof Array && propertyObjListing.length > 0) {
        propertyObjListing.forEach((propertyInfo) => {
          if (propertyInfo.PropertyId === PropertyID) {
            let estateData = JSON.parse(propertyInfo.Entity)
            this.EstateInfo = propertyInfo
            this.EstateName = `hae-${propertyInfo.PropertyTitle}`;
            this.ESTATE_MAPSOURCE = {};
            this.ESTATE_MAPSOURCE.name = this.EstateName;
            this.ESTATE_MAPSOURCE.type = "FeatureCollection";
            this.ESTATE_MAPSOURCE.features = [];


            let properties = Object.assign(estateData.features[0].properties, propertyInfo.Metadata);
            properties.group = "Estate"
            estateData.features[0].properties = properties;
            this.ESTATE_MAPSOURCE.features.push(estateData.features[0]);
            this.ESTATE_BLOCK_UNITS = {
              "name": "estate_block_unit",
              "type": "FeatureCollection",
              "features": []
            };
            return;
          }
        });
      }
    }

  }

  //show user Amount Charge
  // User Accepts , Do Charge else retur false
  // Check if user has Required Amount in Account
  // Yes Perform Deduction No Display TopUP  Call to action
  // Show Tab Information

  /**
   * It takes an action as a parameter, and depending on the action, it calls the processPropertyAction
   * function with the appropriate charge, description and action
   * @param {any} action - This is the action that will be performed after the user has paid for the
   * service.
   */
  public showInfoAndCharge(action: any) {
    switch (action) {
      case 'SHOW-PROPERTY-INFO':

        this.processPropertyAction(PROPERTY_INFO_CHARGE, 'VIEW PROPERTY INFO', action);
        break;
      case 'SHOW-PROPERTY-STREETVIEW':
        this.processPropertyAction(PROPERTY_STREETVIEW_CHARGE, 'VIEW PROPERTY STREETVIEW', action);
        break;
      case 'SHOW-PROPERTY-DOCUMENT':
        this.processPropertyAction(PROPERTY_DOCUMENTS_CHARGE, 'VIEW PROPERTY DOCUMENT', action);
        break;
      case 'SHOW-PROPERTY-FLOORPLANS':
        this.processPropertyAction(PROPERTY_FLOOR_PLAN_CHARGE, 'VIEW PROPERTY FLOORPLANS', action);
        break;
      case 'SHOW-PROPERTY-HISTORY':
        this.processPropertyAction(PROPERTY_HISTORY_CHARGE, 'VIEW PROPERTY HISTORY', action);
        break;
      case 'SHOW-ESTATE-INFO':
        this.processPropertyAction(PROPERTY_ESTATE_CHARGE, 'VIEW ESTATE INFO', action);
        break;

      default:
        break;
    }

  }


  /**
   * It checks the account balance and deducts the amount from the account
   * @param {any} amountToDeduct - This is the amount to be deducted from the user's account.
   * @param {any} accountNaration - This is the account naration that will be used to identify the
   * transaction.
   * @param {any} actionRefence - This is the reference to the action you want to perform.
   */
  public processPropertyAction(amountToDeduct: any, accountNaration: any, actionRefence: any) {
    Swal.fire({
      title: 'Property Information Request',
      text: `Would you like to Proceed with this Request? Request Cost ${amountToDeduct} Units(s)!`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Continue!',
      cancelButtonText: 'No, do it later.'
    }).then((result) => {
      if (result.isConfirmed) {
        //check account balance and deduct
        this.getAccounts(amountToDeduct, accountNaration, actionRefence);

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Toast.fire({
          icon: 'error',
          title: 'We are sorry to see you cancel, and hope you try again.'
        })
        this.openSidebar();
      }
    })
  }

  public claimProperty(PropertyInfo: any, action: any = 'Estate') {
    // console.log('PropertyInfo', PropertyInfo)
    Swal.fire({
      title: 'Claim Property Request',
      text: `You would be contacted via Your details in the next 24hrs concerning this property. Note that you would be required to provide proof of ownership`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Continue!',
      cancelButtonText: 'No, do it later.'
    }).then((result) => {
      if (result.isConfirmed) {
        //check account balance and deduct
        // this.claimPropertyRequest(PropertyInfo, claimerEmail, claimerPhone);

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Toast.fire({
          icon: 'error',
          title: 'Your Last request was not processed, Because you cancelled.'
        })
        // this.openSidebar();
      }
    })
  }


}
