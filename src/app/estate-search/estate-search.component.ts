import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import rewind from '@mapbox/geojson-rewind';
import { StoreService } from 'app/shared/services/store.service';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-estate-search',
  templateUrl: './estate-search.component.html',
  styleUrls: ['./estate-search.component.scss']
})
export class EstateSearchComponent implements OnInit, AfterViewInit {
  public spinnerStyle = Spinkit;
  public propertyListing: Array<any> = [];

  constructor(private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute) {
    this.propertyListing = []
  }

  ngOnInit() {
    this.checkPropertyObj();
  }

  ngAfterViewInit(): void {

  }



  public openProductDetail(id: any) {
    this.router.navigate(['products', id], { relativeTo: this.route });
  }





  public resolveObjectAndMerge(Metadata: any) {
    var blockListing: any = {}
    blockListing.payment_plans = Metadata.payment_plans ? Metadata.payment_plans.FieldValue : 'Not Available';
    blockListing.property_address = Metadata.property_address ? Metadata.property_address.FieldValue : 'Not Available';
    blockListing.property_amenities = Metadata.property_amenities ? Metadata.property_amenities.FieldValue : 'Not Available';
    blockListing.property_bathroom_count = Metadata.property_bathroom_count ? Metadata.property_bathroom_count.FieldValue : 1;
    blockListing.property_bedroom_count = Metadata.property_bedroom_count ? Metadata.property_bedroom_count.FieldValue : 1;
    blockListing.property_country = Metadata.property_country ? Metadata.property_country.FieldValue : 'Nigeria';
    blockListing.property_description = Metadata.property_description ? Metadata.property_description.FieldValue : 'Not Available';
    blockListing.property_feature_photo = Metadata.property_feature_photo ? Metadata.property_feature_photo.FieldValue : 'Not Available';
    blockListing.property_features = Metadata.property_features ? Metadata.property_features.FieldValue : 'Not Available';
    blockListing.property_floor_plan = Metadata.property_floor_plan ? Metadata.property_floor_plan.FieldValue : 'Not Available';
    blockListing.property_lga = Metadata.property_lga ? Metadata.property_lga.FieldValue : 'Not Available';
    blockListing.property_name = Metadata.property_name ? Metadata.property_name.FieldValue : 'Not Available';
    blockListing.property_parking_space_count = Metadata.property_parking_space_count ? Metadata.property_parking_space_count.FieldValue : 1;
    blockListing.property_payment_plans = Metadata.property_payment_plans ? Metadata.property_payment_plans.FieldValue : 'Not Available';
    blockListing.property_photos = Metadata.property_photos ? Metadata.property_photos.FieldValue : 'Not Available';
    blockListing.property_price = Metadata.property_price ? Metadata.property_price.FieldValue : (Math.floor(Math.random() * (Math.floor(9999999) - Math.ceil(2222222) + 1)) + Math.ceil(2222222));
    blockListing.property_sittingroom_count = Metadata.property_sittingroom_count ? Metadata.property_sittingroom_count.FieldValue : 1;
    blockListing.property_size = Metadata.property_size ? Metadata.property_size.FieldValue : 'Not Available';
    blockListing.property_state = Metadata.property_state ? Metadata.property_state.FieldValue : 'Not Available';
    blockListing.property_status = Metadata.property_status ? Metadata.property_status.FieldValue : 'Not Available';
    blockListing.property_title = Metadata.property_title ? Metadata.property_title.FieldValue : 'Not Available';
    blockListing.property_title_photos = Metadata.property_title_photos ? Metadata.property_title_photos.FieldValue : 'Not Available';
    blockListing.property_type = Metadata.property_type ? Metadata.property_type.FieldValue : 'Land';
    blockListing.property_video_url = Metadata.property_video_url ? Metadata.property_video_url.FieldValue : 'Not Available';

    // console.log(blockListing);
    return blockListing
  }

  public patchGeoJson(geoJsonObj: any) {
    const patchedJson: any = rewind(JSON.parse(geoJsonObj));
    delete patchedJson.crs;
    return JSON.stringify(patchedJson)
  }

  public formatLoadedData(propertyObjectListing: any) {
    let propertyObj = [];
    propertyObjectListing.forEach((property: any) => {
      var objectElement: any = {}
      objectElement = property;
      objectElement.Metadata = this.resolveObjectAndMerge(property.Metadata);
      objectElement.Entity = this.patchGeoJson(property.Entity[0].EntityGeometry);
      propertyObj.push(objectElement);
    });
    return propertyObj
  }

  public savePropertyObj(propObjListing: any) {
    localStorage.setItem('HA_ESTATE_LISTING', JSON.stringify(propObjListing));
  }


  public checkPropertyObj() {
    const propertyListing = localStorage.getItem('HA_ESTATE_LISTING');
    // console.log(propertyListing)
    if (propertyListing === null || propertyListing === undefined) {
      this.storeService.listAllEstate()
        .subscribe((result: any) => {
          // console.log('result', result)
          if (result.contentData instanceof Array && result.contentData.length > 0) {
            this.propertyListing = this.formatLoadedData(result.contentData)
            // console.log('this.propertyListing', this.propertyListing)
            // this.createProductRows();
            this.savePropertyObj(this.propertyListing)
          }
        }, (error: any) => {
          return this.propertyListing = []
        });
    } else {

      return this.propertyListing = JSON.parse(propertyListing);
    }

  }




}
