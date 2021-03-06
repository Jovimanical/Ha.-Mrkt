import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import rewind from '@mapbox/geojson-rewind';
import { Product } from 'app/shared/models/product.model';
import { StoreService } from 'app/shared/services/store.service';
import { Spinkit } from 'ng-http-loader';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, AfterViewInit {
  public spinnerStyle = Spinkit;
  public productRows: Product[][] = [];
  public propertyListing: Array<any> = [];
  public pageOffSet: number = 0;
  public pageLimit: number = 20;
  public total: number = 200;
  public isLoading: boolean = true;

  constructor(private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute) {
    this.propertyListing = []
  }

  ngOnInit() {
    this.checkPropertyObj();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initIsotope();
    }, 2000);
  }

  /**
   * The function above is used to initialize the isotope plugin
   */
  public initIsotope() {
    if ($(".gallery-items").length) {
      var agf = $(".gallery-items").isotope({
        singleMode: true,
        columnWidth: ".grid-sizer, .grid-sizer-second, .grid-sizer-three",
        itemSelector: ".gallery-item, .gallery-item-second, .gallery-item-three",
        layoutMode: 'fitRows',
        transformsEnabled: true,
        transitionDuration: "700ms",
        resizable: true
      });
      agf.imagesLoaded(function () {
        agf.isotope("layout");
      });
      $(".gallery-filters").on("click", "a.gallery-filter", function (af) {
        af.preventDefault();
        var brec = $(this).attr("data-filter");
        agf.isotope({
          filter: brec
        });
        $(".gallery-filters a").removeClass("gallery-filter-active");
        $(this).addClass("gallery-filter-active");
      });
    }
  }

  /**
   * We're using the router to navigate to the product detail page, and we're passing in the id of the
   * product we want to display
   * @param {any} id - any - The id of the product we want to navigate to.
   */

  public openProductDetail(id: any) {
    this.router.navigate(['products', id], { relativeTo: this.route });
  }


  /**
   * Generate a list of numbers from 0 to count - 1
   * @param {number} count - The number of indexes to generate.
   * @returns An array of numbers.
   */
  public generateFake(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }


  /**
   * It takes in a metadata object and returns a blockListing object
   * @param {any} Metadata - This is the metadata object returned from the blockchain.
   * @returns a blockListing object.
   */
  public resolveObjectAndMerge(Metadata: any) {
    var blockListing: any = {}
    blockListing.payment_plans = Metadata?.payment_plans ? Metadata.payment_plans.FieldValue : 'Not Available';
    blockListing.property_address = Metadata?.property_address ? Metadata.property_address.FieldValue : 'Not Available';
    blockListing.property_amenities = Metadata?.property_amenities ? Metadata.property_amenities.FieldValue : 'Not Available';
    blockListing.property_bathroom_count = Metadata?.property_bathroom_count ? Metadata.property_bathroom_count.FieldValue : 1;
    blockListing.property_bedroom_count = Metadata?.property_bedroom_count ? Metadata.property_bedroom_count.FieldValue : 1;
    blockListing.property_country = Metadata?.property_country ? Metadata.property_country.FieldValue : 'Nigeria';
    blockListing.property_description = Metadata?.property_description ? Metadata.property_description.FieldValue : 'Not Available';
    blockListing.property_feature_photo = Metadata?.property_feature_photo ? Metadata.property_feature_photo.FieldValue : 'Not Available';
    blockListing.property_features = Metadata?.property_features ? Metadata.property_features.FieldValue : 'Not Available';
    blockListing.property_floor_plan = Metadata?.property_floor_plan ? Metadata.property_floor_plan.FieldValue : 'Not Available';
    blockListing.property_lga = Metadata?.property_lga ? Metadata.property_lga.FieldValue : 'Not Available';
    blockListing.property_name = Metadata?.property_name ? Metadata.property_name.FieldValue : 'Not Available';
    blockListing.property_parking_space_count = Metadata?.property_parking_space_count ? Metadata.property_parking_space_count.FieldValue : 1;
    blockListing.property_payment_plans = Metadata?.property_payment_plans ? Metadata.property_payment_plans.FieldValue : 'Not Available';
    blockListing.property_photos = Metadata?.property_photos ? Metadata.property_photos.FieldValue : 'Not Available';
    blockListing.property_price = Metadata?.property_price ? parseFloat(Metadata.property_price.FieldValue) : (Math.floor(Math.random() * (Math.floor(9999999) - Math.ceil(2222222) + 1)) + Math.ceil(2222222));
    blockListing.property_sittingroom_count = Metadata?.property_sittingroom_count ? Metadata.property_sittingroom_count.FieldValue : 'Not Available';
    blockListing.property_size = Metadata?.property_size ? Metadata.property_size.FieldValue : 'Not Available';
    blockListing.property_state = Metadata?.property_state ? Metadata.property_state.FieldValue : 'Not Available';
    blockListing.property_status = Metadata?.property_status ? Metadata.property_status.FieldValue : 'Available';
    blockListing.property_title = Metadata?.property_title ? Metadata.property_title.FieldValue : 'Not Available';
    blockListing.property_title_photos = Metadata?.property_title_photos ? Metadata.property_title_photos.FieldValue : 'Not Available';
    blockListing.property_type = Metadata?.property_type ? Metadata.property_type.FieldValue : 'Land';
    blockListing.property_video_url = Metadata?.property_video_url ? Metadata.property_video_url.FieldValue : 'Not Available';

    // console.log(blockListing);
    return blockListing
  }

  /**
   * A function that formats the data gotten from the server and saves it in the session storage.
   * */
  public patchGeoJson(geoJsonObj: any) {
    const patchedJson: any = rewind(JSON.parse(geoJsonObj));
    delete patchedJson.crs;
    return JSON.stringify(patchedJson)
  }

  /* A function that formats the data gotten from the server and saves it in the session storage. */
  public formatLoadedData(propertyObjectListing: any) {
    let propertyObj = [];
    propertyObjectListing.forEach((property: any) => {
      var objectElement: any = {}
      objectElement = property;
      objectElement.Metadata = this.resolveObjectAndMerge(property.Metadata);
      objectElement.Entity = this.patchGeoJson(property.EntityGeometry);
      propertyObj.push(objectElement);
    });
    return propertyObj
  }

  public savePropertyObj(propObjListing: any) {
    sessionStorage.setItem('HA_ESTATE_LISTING', JSON.stringify(propObjListing));
  }


  /**
   * It checks if the property listing is in the session storage, if it is, it returns the property
   * listing, if it isn't, it fetches the property listing from the server and saves it in the session
   * storage
   * @returns The propertyListing array is being returned.
   */
  public checkPropertyObj() {
    const propertyListing = sessionStorage.getItem('HA_ESTATE_LISTING');
    if (propertyListing === null || propertyListing === undefined) {
      this.storeService.listAllEstate()
        .subscribe((result: any) => {
          if (result.contentData instanceof Array && result.contentData.length > 0) {
            this.propertyListing = this.formatLoadedData(result.contentData)
            this.savePropertyObj(this.propertyListing)
            this.pageOffSet += 1
            this.isLoading = false;
          }
        }, (error: any) => {
          this.propertyListing = []
          this.isLoading = false;
        });
    } else {
      this.propertyListing = JSON.parse(propertyListing);
      this.isLoading = false;
    }
  }


  public paginateListing() {

    this.storeService.listAllEstate()
      .subscribe((result: any) => {
        if (result.contentData instanceof Array && result.contentData.length > 0) {

          const addListingToCount: Array<any> = this.formatLoadedData(result.contentData);
          addListingToCount.forEach(element => {
            this.propertyListing.push(element);
          });
          this.savePropertyObj(this.propertyListing)
          this.pageOffSet++
        }
      }, (error: any) => {
        return
      });
  }

  public pageChanged(event: any) {
    console.log('Event', event)

  }



}
