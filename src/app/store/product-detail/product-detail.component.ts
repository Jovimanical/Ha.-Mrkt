import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import rewind from '@mapbox/geojson-rewind';
import * as L from 'leaflet';
import * as leafletImage from 'leaflet-image';
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
  public style = 'mapbox://styles/mapbox/satellite-v9';//'mapbox://styles/mapbox/outdoors-v9';
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
          this.getAccounts();
        } else {
          this.notLoggedInConfirmation()
        }
      }, (error) => {
        // console.log('getAccounts - Error', error)
        if (error.error.message === 'Error : Expired token') {
          console.log('getAccounts call logout')
          // this.userService.logout();
        }
        // show payment Modal
      });
    } else {
      this.notLoggedInConfirmation()
    }

    // this.userService.authenticationChanged$
    //   .subscribe((isAuthenticated: any) => {
    //     if (isAuthenticated !== null) {
    //       this.isAuthenticated = isAuthenticated;
    //       this.getAccounts();
    //     }
    //     else {

    //     }
    //   });

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
      this.getAccounts();
    });

  }

  ngAfterViewInit(): void {
    // subscribe to event with name "DisplayPropertyInfo"
    EventService.on("DisplayPropertyInfo", async (propertyFeature) => {
      // this.router.navigate([`/listings/marketplace/${this.EstateInfo.PropertyTitle}/unit/${propertyFeature.properties.id}`]);
      this.openSidebar();
      setTimeout(() => {
        // create estate with single unit
        let RepakageUnit = this.ESTATE_MAPSOURCE;
        RepakageUnit.features.push(propertyFeature);
        // this.eventService.publish("ShowProperty", propertyFeature.properties);
        // this.eventService.publish("UnitOptions", RepakageUnit);
        // console.log("Did something!", propertyFeature);

        this.propertyMap = RepakageUnit;
        this.propertView = propertyFeature.properties
        this.totalRooms = this.propertView.property_bathroom_count + this.propertView.property_bedroom_count + this.propertView.property_sittingroom_count
        this.showView = false;

        const coordinates = propertyFeature.geometry.coordinates;
        const coord = coordinates[0][0][0]
        this.locationUnitLat = coord[0];
        this.locationUnitLong = coord[1];
        // this.initializeStreetView(coord[0], coord[1])

      }, 500);
    });

    // subscribe to event with name "DoEnquire"
    EventService.on("DoEnquire", async (propertyFeature) => {
      this.router.navigate([`/listings/marketplace/${this.EstateInfo.PropertyTitle}/unit/${propertyFeature.properties.id}/#enquire`]);
      setTimeout(() => {
        // create estate with single unit
        let RepakageUnit = this.ESTATE_MAPSOURCE;
        RepakageUnit.features.push(propertyFeature);
        this.eventService.publish("ShowProperty", propertyFeature.properties);
        this.eventService.publish("UnitOptions", RepakageUnit);
        //console.log("Did something!");
      }, 500);
    });


    // subscribe to event with name "AddToFavorite"
    EventService.on("AddToFavorite", async (propertyFeature) => {
      let RepakageUnit = this.ESTATE_MAPSOURCE;
      RepakageUnit.features.push(propertyFeature);
      setTimeout(() => {
        // create estate with single unit
        // this.packageUnitForExport(RepakageUnit, propertyFeature.properties, 0);
      }, 500);
    });

    EventService.on("AddToCart", async (propertyFeature) => {
      let RepakageUnit = this.ESTATE_MAPSOURCE;
      RepakageUnit.features.push(propertyFeature);
      setTimeout(() => {
        // create estate with single unit
        // this.packageUnitForExport(RepakageUnit, propertyFeature.properties, 1);
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
    EventService.off("DisplayPropertyInfo", "SomeKey");
    EventService.off("DoEnquire", "SomeKey");
    EventService.off("AddToFavorite", "SomeKey");
    EventService.off("AddToCart", "SomeKey");
  }


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
          title: 'You would be redirected to the previous page ...'
        })
        setTimeout(() => {
          this.navigation.back()
        }, 3000);
      }
    });
  }


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
          title: 'You would be redirected to the previous page ...'
        })
        setTimeout(() => {
          this.navigation.back()
        }, 3000);
      }
    })
  }

  public generateReference(): string {
    let date = new Date();
    return 'HA-Ref' + Math.floor((Math.random() * 1000000000) + 1) + date.getTime().toString();
  }

  async makeAccountDeductions(amountDeductable: number) {
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
          transactionHistory.transaction_type = 'PROPERTY SEARCH DEDUCTION'
          transactionHistory.sender_Account = this.userInfo.mobile
          transactionHistory.receiver_Account = 'HOUSEAFRICA001'
          transactionHistory.trx = this.generateReference();
          transactionHistory.details = 'DEDUCTION FOR USER PROPERTY SEARCH';
          transactionHistory.created_at = new Date()
          transactionHistory.updated_at = new Date()

          const addTHistory = await this.storeService.addTransactionHistory(JSON.stringify(transactionHistory));
          if (addTHistory) {
            // this.createOrder()
          }


        }
      }
    } catch (error) {
      console.error('Error Deduce Amount', error)
      Toast.fire({
        icon: 'error',
        title: 'We are unable to make deductions for search, you would be redirected to previous page ...'
      })
      setTimeout(() => {
        this.navigation.back()
      }, 3000);

    }

  }

  private getAccounts(): void {
    this.accountService.getUserAccounts()
      .subscribe((accounts: any) => {
        // console.log('accounts', accounts.data.records[0])
        // We're just supporting one account right now. Grab the first result.
        if (accounts?.data.records instanceof Array && accounts.data.records.length > 0) {
          const account = accounts.data.records[0];
          this.userAccount = accounts.data.records[0];

          if (account.account_point === "0") {
            this.insufficentBalanceConfirmation()
            return;
          } else {
            this.totalBalance = account.account_point !== "0" ? parseInt(account.account_point, 10) : 0;
            this.broadcastService.emitPointBalanceUpdated(this.totalBalance);
            this.makeAccountDeductions(1);
          }
        } else {
          this.accountRetry()
        }
      }, (error) => {
        // console.log('getAccounts - Error', error)
        if (error.error.message === 'Error : Expired token') {
          console.log('getAccounts call logout')
          // this.userService.logout();
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

  public loadFavorite() {
    const bookmarks = localStorage.getItem(this.sessionStorageBookmarks);
    if (bookmarks === null || bookmarks === undefined) {
      this.userBookMarks = [];
    } else {
      this.userBookMarks = JSON.parse(bookmarks);
    }
  }

  public loadUserCart() {
    const carts = localStorage.getItem(this.sessionStorageCarts);
    if (carts === null || carts === undefined) {
      this.userCarts = [];
    } else {
      this.userCarts = JSON.parse(carts);
    }
  }

  public saveToLocalStorage(propObjListing: any, tableName: any) {
    //console.log('saveBlockAndUnits', propObjListing)
    if (JSON.stringify(propObjListing) !== "[]") {
      localStorage.setItem(tableName, JSON.stringify(propObjListing));
    }
  }

  public addToFavorite(property: any): void {
    if (!this.isAuthenticated) {
      this.notificationService.showErrorMessage('Login is required to perform this action');
      return;
    }

    this.submitted = true;
    let alreadyExit: boolean = false

    if (this.userBookMarks instanceof Array && this.userBookMarks.length > 0) {
      this.userBookMarks.forEach((element) => {
        if (element.LinkedEntity === property.LinkedEntity) {
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

  public initializeStreetView(latitude: any, longitude: any) {


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
      repakagedUnit.PropertyStatus = this.propertView.property_status;
      repakagedUnit.PropertyAmount = this.getRandomInt(1111111, 999999);

      if (params === 1) {
        this.addToCartProcess(repakagedUnit);
      } else {
        this.actionToFavourite(repakagedUnit)
      }
    }
  }

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


  public packageUnitForExport_(UnitMap: any, UnitInfo: any, params: any = 1) {
    let repakagedUnit: any = {};

    if (Object.keys(UnitInfo).length !== 0 && Object.keys(UnitMap).length !== 0) {

      repakagedUnit.EntityParent = UnitInfo.EntityParent
      repakagedUnit.LinkedEntity = UnitInfo.LinkedEntity
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
        if (element.LinkedEntity === property.LinkedEntity) {
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
              this.router.navigate([`/listings/checkout-option-outright-payment/${cartItem.data}`]);
              break;
            case 2:
              // Loans payments
              this.router.navigate([`/listings/checkout-option-loan-application/${cartItem.data}`]);
              break;

            default:
              // Mortgage
              this.router.navigate([`/listings/checkout-option-mortgage-application/${cartItem.data}`]);
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
    const coord = coordinates[0]
    //console.log('center', coordinates)
    this.ESTATE_INFO = this.ESTATE_MAPSOURCE.features[0].properties
    //console.log('ESTATE_MAPSOURCE', this.ESTATE_MAPSOURCE.features[0].properties)
    const mbAttr = 'Marketplace &copy; Integration by <a href="https://houseafrica.io/">HouseAfrica</a>';
    const mbUrl =
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

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

    const streets = L.tileLayer(mbUrl, {
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      maxZoom: 50,
      attribution: mbAttr
    });

    const sattelite = L.tileLayer(mbUrl, {
      id: "mapbox/satellite-v9",
      tileSize: 512,
      zoomOffset: -1,
      maxZoom: 25,
      attribution: mbAttr
    });

    this.map = L.map('estateMap', {
      center: [coord[1], coord[0]],
      minZoom: 5,
      maxZoom: 50,
      zoom: 7,
      layers: [sattelite]
    });

    const baseLayers = {
      Streets: streets,
      Sattelite: sattelite
    };

    var controlLayers = L.control.layers(baseLayers).addTo(this.map);
    var estateLayer = new L.geoJson(this.ESTATE_MAPSOURCE, {
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
          click: (e) => {
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
    // controlLayers.addOverlay(estateLayer, 'MapLayer');

    var estateUnitsLayer = L.geoJson(this.ESTATE_BLOCK_UNITS, {
      style: style,
      onEachFeature: onEachFeature
    })
    // .addTo(this.map);
    // 

    this.map.fitBounds(estateLayer.getBounds());




    // Edit ranges and colors to match your data; see http://colorbrewer.org
    // Any values not listed in the ranges below displays as the last color
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

    // Edit the getColor property to match data column header in your GeoJson file
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

    // This highlights the layer on hover, also for mobile
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

      // var buttonEnquire = L.DomUtil.get('button-enquire');
      // L.DomEvent.addListener(buttonEnquire, 'click', async (e) => {
      //   await EventService.fire("DoEnquire", allFeatures);
      //   marker.closePopup();
      // });

      var buttonFavorite = L.DomUtil.get('button-favourite');
      L.DomEvent.addListener(buttonFavorite, 'click', async (e) => {
        await EventService.fire("AddToFavorite", allFeatures);
        marker.closePopup();
      });

      // var buttonAddToCart = L.DomUtil.get('button-cart');
      // L.DomEvent.addListener(buttonAddToCart, 'click', async (e) => {
      //   await EventService.fire("AddToCart", allFeatures);
      //   marker.closePopup();
      // });

    }

    // This resets the highlight after hover moves away
    function resetHighlight(e: any) {
      estateUnitsLayer.setStyle(style);
      info.update();
    }

    // This instructs highlight and reset functions on hover movement
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

    estateLayer.on("click", (event: any) => {
      if (event.layer.feature.properties.group === 'Block') {
        this.map.fitBounds(event.layer.getBounds());
        //zoom in
      }
    })


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


  public patchGeoJson(geoJsonObj: any) {
    const patchedJson: any = rewind(JSON.parse(geoJsonObj));
    delete patchedJson.crs;
    return JSON.stringify(patchedJson)
  }

  public close() {
    console.log('Close');
  }


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

  public formatLoadedData(propertyObjectListing: any) {
    let propertyObj = [];
    if (propertyObjectListing instanceof Array && propertyObjectListing.length > 0) {
      propertyObjectListing.forEach((property: any) => {
        var objectElement: any = {};
        const unitsData = rewind(JSON.parse(property.Entity.EntityGeometry));
        objectElement = property;
        objectElement.Metadata = this.resolveObjectAndMerge(property.Metadata);
        objectElement.Entity = this.patchGeoJson(property.Entity.EntityGeometry);
        propertyObj.push(objectElement);

        let properties = Object.assign(unitsData.features[0].properties, objectElement.Metadata);
        properties.group = 'unit'
        properties.PropertyFloor = property.PropertyFloor ? property.PropertyFloor : 0;
        properties.PropertyId = property.PropertyId;
        properties.LinkedEntity = property.LinkedEntity;
        properties.EntityParent = property.EntityParent;
        properties.id = property.LinkedEntity;
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
      localStorage.setItem(`${this.STORAGE_NAME}${this.EstateName}`, JSON.stringify(propObjListing));
    }
  }


  public removeBlockAndUnit(propObjListing: any) {
    localStorage.removeItem(propObjListing);
  }


  public loopBlockAndUnit(BlockParam: any) {
    try {
      var blockParamsListing = []
      if (BlockParam instanceof Array && BlockParam.length > 0) {

        BlockParam.forEach(async (property: any) => {
          var objectElement: any = {}
          const blockUnitInfo: any = await this.storeService.fetchBlockUnitsAsPromise(property.PropertyId);
          const blockData = rewind(JSON.parse(property.Entity.EntityGeometry));
          objectElement = property;
          objectElement.Metadata = this.resolveObjectAndMerge(property.Metadata);
          objectElement.Entity = this.patchGeoJson(property.Entity.EntityGeometry);
          objectElement.BlockUnit = blockUnitInfo.contentData.length > 0 ? this.formatLoadedData(blockUnitInfo.contentData) : []
          blockParamsListing.push(objectElement);


          let properties = Object.assign(blockData.features[0].properties, objectElement.Metadata);
          properties.group = 'Block'
          blockData.features[0].properties = properties;
          this.ESTATE_MAPSOURCE.features.push(blockData.features[0]);
          this.changeDectection.detectChanges();
        });

        return blockParamsListing;
      }
      return blockParamsListing;

    } catch (error) {
      console.log('error', error)
    }

  }


  async checkPropertyObj(EstateID: any) {

    try {
      const propertyListing = localStorage.getItem(`${this.STORAGE_NAME}-${this.EstateName}`);
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

  public returnEstatePropertyObj(PropertyID: any) {
    const propertyListing = localStorage.getItem('HA_ESTATE_LISTING');
    // console.log(propertyListing)
    if (propertyListing === null || propertyListing === undefined) {
      console.log('Got No Estate')
      return
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

}
