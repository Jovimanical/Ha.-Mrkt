import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy, } from '@angular/core';
import { EventsService } from 'angular4-events';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'app/shared/services/store.service';
import { environment } from '../../../environments/environment';
import { NotificationService } from 'app/shared/services/notification.service';
import { BroadcastService } from 'app/core/broadcast.service';

declare var $: any;
declare var google: any;

@Component({
  selector: 'app-product-block-listing',
  templateUrl: './product-block-listing.component.html',
  styleUrls: ['./product-block-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductBlockListingComponent implements OnInit, AfterViewInit, OnDestroy {
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
    private storeService: StoreService
  ) {
    this.showView = true
  }

  ngOnInit(): void {
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

    this.route.params.subscribe(params => {
      this.unitName = params['id'];
      this.propertyUnitName = `ha-unit${this.unitName}`
      this.estateName = params['estate'].replace('-', ' ');
      this.getEstateUnit(this.unitName)
    });
  }

  ngAfterViewInit(): void {
    this.checkPropertyObj()
    this.loadUserCart();
    this.loadFavorite();

    this.single_map = (<any>window).document.getElementById("singleMap");
    if (typeof this.single_map != "undefined" && this.single_map != null) {
      google.maps.event.addDomListener(window, "load", this.singleMap);
    }

  }

  ngOnDestroy(): void {
    this.propertyListing.unsubscribe();
  }

  public loadUserCart() {
    const carts = localStorage.getItem(this.sessionStorageCarts);
    if (carts === null || carts === undefined) {
      this.userCarts = [];
    } else {
      this.userCarts = JSON.parse(carts);
    }
  }

  public loadFavorite() {
    const bookmarks = localStorage.getItem(this.sessionStorageBookmarks);
    if (bookmarks === null || bookmarks === undefined) {
      this.userBookMarks = [];
    } else {
      this.userBookMarks = JSON.parse(bookmarks);
    }
  }



  public saveToLocalStorage(propObjListing: any, tableName: any) {
    //console.log('saveBlockAndUnits', propObjListing)
    if (JSON.stringify(propObjListing) !== "[]") {
      localStorage.setItem(tableName, JSON.stringify(propObjListing));
    }
  }

  public addToFavorite(property: any): void {
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

      this.userBookMarks.push(property);
      this.loading = true;


      this.storeService.addToBookmark(JSON.stringify(property))
        .subscribe(() => {
          //this.broadcastService.emitGetCart();
          //this.router.navigate(['/store/cart']);
          this.notificationService.showSuccessMessage('Successfully added to cart');
          setTimeout(() => {
            this.saveToLocalStorage(this.userBookMarks, this.sessionStorageBookmarks)
            this.notificationService.showSuccessMessage('Item added to bookmark');
            this.loading = false;
          }, 1000);
          this.loading = false;
          this.submitted = false;
        }, errors => {
          this.notificationService.showErrorMessage(errors.error.message);
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
      localStorage.setItem(this.propertyUnitName, JSON.stringify(propObjListing));
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
      this.userCarts.push(property);

      this.storeService.addToCart(JSON.stringify(property))
        .subscribe(() => {
          this.broadcastService.emitGetCart();
          this.router.navigate(['/store/cart']);
          this.notificationService.showSuccessMessage('Successfully added to cart');
          setTimeout(() => {
            this.saveToLocalStorage(this.userCarts, this.sessionStorageCarts)
            this.notificationService.showSuccessMessage('Added to Cart');
            this.loading = false;
          }, 1000);
          this.loading = false;
          this.submitted = false;
        }, errors => {
          this.notificationService.showErrorMessage(errors.error.message);
          this.loading = false;
          this.submitted = false;
        });
    }
  }

  public checkPropertyObj() {
    const propertyListing = localStorage.getItem('HA_ESTATE_LISTING');
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

  public singleMap() {
    var myLatLng = {
      lng: $("#singleMap").data("longitude"),
      lat: $("#singleMap").data("latitude"),
    };
    var single_map = new google.maps.Map(document.getElementById("singleMap"), {
      zoom: 12,
      center: myLatLng,
      scrollwheel: false,
      zoomControl: false,
      fullscreenControl: true,
      mapTypeControl: false,
      scaleControl: false,
      panControl: false,
      navigationControl: false,
      streetViewControl: true,
      styles: [
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ visibility: "on" }, { color: "#ffffff" }],
        },
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [
            { gamma: "0.00" },
            { weight: "0.01" },
            { visibility: "on" },
            { color: "#8c8c8c" },
          ],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels.text",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels.text.fill",
          stylers: [{ color: "#898989" }],
        },
        {
          featureType: "administrative.neighborhood",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#ffffff" }, { weight: "4.00" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ color: "#ffffff" }],
        },
        {
          featureType: "landscape.man_made",
          elementType: "geometry.fill",
          stylers: [{ visibility: "simplified" }, { color: "#ffffff" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "labels.text.fill",
          stylers: [{ color: "#8d8d8d" }],
        },
        {
          featureType: "landscape.natural.terrain",
          elementType: "geometry.stroke",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [{ color: "#cef8d5" }, { visibility: "on" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ visibility: "on" }, { color: "#60b36c" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.stroke",
          stylers: [{ visibility: "on" }, { color: "#ffffff" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [
            { saturation: "-100" },
            { lightness: "32" },
            { visibility: "on" },
          ],
        },
        {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: [{ color: "#f3f3f3" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#e1e1e1" }],
        },
        {
          featureType: "road",
          elementType: "labels.text",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ visibility: "on" }, { lightness: "63" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#f3f3f3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#e1e1e1" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit.station",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ visibility: "on" }, { color: "#eeeeee" }],
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [{ color: "#cce4ff" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ visibility: "on" }, { color: "#6095a5" }],
        },
      ],
    });
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: single_map,
      icon: "images/marker-single.png",
      draggarble: false,
    });
    if ($(".mapC_vis").length > 0) {
      var datainfotitle = $("#singleMap").data("infotitle"),
        datainfotext = $("#singleMap").data("infotext");
      var information = new google.maps.InfoWindow({
        content:
          "<div class='info-window-content'><h1>" +
          datainfotitle +
          "</h1> <p>" +
          datainfotext +
          "</p></div>",
      });
      marker.addListener("click", function () {
        information.open(single_map, marker);
      });
    }
    var scrollEnabling = $(".scrollContorl");
    $(scrollEnabling).click(function (e) {
      e.preventDefault();
      $(this).toggleClass("enabledsroll");

      if ($(this).is(".enabledsroll")) {
        single_map.setOptions({
          scrollwheel: true,
        });
      } else {
        single_map.setOptions({
          scrollwheel: false,
        });
      }
    });
    var zoomControlDiv: any = (<any>window).document.createElement("div");
    var zoomControl = new ZoomControl(zoomControlDiv, single_map);
    function ZoomControl(controlDiv, single_map) {
      zoomControlDiv.index = 1;
      single_map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(
        zoomControlDiv
      );
      controlDiv.style.padding = "5px";
      var controlWrapper = (<any>window).document.createElement("div");
      controlDiv.appendChild(controlWrapper);
      var zoomInButton = (<any>window).document.createElement("div");
      zoomInButton.className = "mapzoom-in";
      controlWrapper.appendChild(zoomInButton);
      var zoomOutButton = (<any>window).document.createElement("div");
      zoomOutButton.className = "mapzoom-out";
      controlWrapper.appendChild(zoomOutButton);
      google.maps.event.addDomListener(zoomInButton, "click", function () {
        single_map.setZoom(single_map.getZoom() + 1);
      });
      google.maps.event.addDomListener(zoomOutButton, "click", function () {
        single_map.setZoom(single_map.getZoom() - 1);
      });
    }
    if ($(".mapC_vis2").length > 0) {
      var input = (<any>window).document.getElementById("pac-input");
      var searchBox = new google.maps.places.SearchBox(input);
      single_map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      single_map.addListener("bounds_changed", function () {
        searchBox.setBounds(single_map.getBounds());
      });
      var infowindow = new google.maps.InfoWindow({});
      var markers = [];
      searchBox.addListener("places_changed", function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }
        markers.forEach(function (marker) {
          marker.setMap(null);
        });
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          var icon = {
            url: place.icon,
            size: new google.maps.Size(31, 31),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
          };
          var marker = new google.maps.Marker({
            map: single_map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
          });
          markers.push(marker);
          (function (marker, place) {
            marker.addListener("click", function () {
              var content = "<h1>" + place.name + "</h1>";
              content += "<p>" + place.formatted_address + "</p>";
              if (place.formatted_phone_number) {
                content +=
                  "<p>Phone:&nbsp;" + place.formatted_phone_number + "</p>";
              }
              infowindow.setContent(content);
              infowindow.open(single_map, marker);
            });
          })(marker, place);

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        single_map.fitBounds(bounds);
        single_map.setZoom(12);
      });
    }
    $(".single-map-item").on("click", function (e) {
      e.preventDefault();
      google.maps.event.trigger(single_map, "resize");
      $(".map-modal-wrap").fadeIn(400);
      single_map.setZoom(12);
      var $that = $(this),
        newln = $that.data("newlatitude"),
        newlg = $that.data("newlongitude"),
        newtitle = $that
          .parents(".geodir-category-listing")
          .find(".title-sin_item a")
          .text(),
        newtitleAdress = $that
          .parents(".geodir-category-listing")
          .find(".geodir-category-location a span")
          .text(),
        latlng = new google.maps.LatLng(newln, newlg);
      marker.setPosition(latlng);
      single_map.panTo(latlng);
      $(".map-modal-container h3 span").text(newtitle);
      var information2 = new google.maps.InfoWindow({
        content:
          "<div class='info-window-content'><h1>" +
          newtitle +
          "</h1> <p>" +
          newtitleAdress +
          "</p></div>",
      });
      marker.addListener("click", function () {
        information2.open(single_map, marker);
      });
    });

    $(".map-modal-close , .map-modal-wrap-overlay").on("click", function () {
      $(".map-modal-wrap").fadeOut(400);
      single_map.setZoom(14);
      single_map.getStreetView().setVisible(false);
    });
  }


}
