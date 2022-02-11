import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import rewind from '@mapbox/geojson-rewind';
import { environment } from '../../../environments/environment';
import { NotificationService } from 'app/shared/services/notification.service';
import { BroadcastService } from 'app/core/broadcast.service';
import { MobileService } from 'app/core/mobile.service';
import { Subscription } from 'rxjs';
import { StoreService } from 'app/shared/services/store.service';



@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  public quantity = 1;
  public loading = false;
  public submitted = false;
  public mobile = false;
  public map: mapboxgl.Map;
  public style = 'mapbox://styles/mapbox/satellite-v9';//'mapbox://styles/mapbox/outdoors-v9';
  public lat = 9.077751;
  public lng = 8.6774567;
  public STORAGE_NAME = 'ha_marketplace_';
  public EstateName: string = ''
  public EstateInfo: any = null
  public EstateBlockAndUnits: Array<any> = [];
  public EstateMapSouce: any;
  private watcher: Subscription;

  // data
  public source: any;
  public markers: any;


  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDectection: ChangeDetectorRef,
    private notificationService: NotificationService,
    private broadcastService: BroadcastService,
    private mobileService: MobileService) {
    mapboxgl.accessToken = environment.MAPBOX_ACCESS_TOKEN.accessToken;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const PropertyID = params['id'];
      this.returnEstatePropertyObj(PropertyID);
      setTimeout(() => {
        this.checkPropertyObj(PropertyID);
      }, 500)
    });

    this.mobile = this.mobileService.isMobile();
    this.watcher = this.mobileService.mobileChanged$
      .subscribe(isMobile => this.mobile = isMobile);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeMap();
    }, 5000);

  }


  private initializeMap() {
    /// locate the user
    // if (navigator.geolocation) {
    //    navigator.geolocation.getCurrentPosition(position => {
    //     this.lat = position.coords.latitude;
    //     this.lng = position.coords.longitude;
    //     this.map.flyTo({
    //       center: [this.lng, this.lat]
    //     })
    //   });
    // }
    this.buildMap()
    const layerList = (<any>window).document.getElementById('menu');
    const inputs = layerList.getElementsByTagName('input');
    for (const input of inputs) {
      input.onclick = (layer: any) => {
        const layerId = layer.target.id;
        this.style = `mapbox://styles/mapbox/${layerId}`;
        this.map.setStyle(this.style);
        this.buildMap()
      };
    }

  }




  buildMap() {
    console.log('map-called');

    this.map = new mapboxgl.Map({
      container: 'estateMap',
      style: this.style,
      zoom: 5,
      center: [this.lng, this.lat]
    });

    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      const data = JSON.parse(this.EstateInfo.Entity);// rewind(JSON.parse('{ "type": "FeatureCollection", "name": "PALMGROVE_HAVEN ESTATE BOUNDARY", "features": [{ "type": "Feature", "properties": { "id": null, "PALMGROVE": "HAVEN ESTATE BOUNDARY" }, "geometry": { "type": "MultiPolygon", "coordinates": [[[[6.96469289759868, 4.991927164409412], [6.964550500009216, 4.991630062084359], [6.964332042813202, 4.991222351376575], [6.964106961408866, 4.990818259890458], [6.963875315739172, 4.990417895242365], [6.963637167495256, 4.990021364056136], [6.963392580100007, 4.9896287719347], [6.963141618691156, 4.989240223431936], [6.962884350103953, 4.988855822024852], [6.962620842853345, 4.988475670086006], [6.962351167115748, 4.988099868856255], [6.962075394710348, 4.987728518417787], [6.961793599079974, 4.987361717667469], [6.961505855271542, 4.986999564290514], [6.96121223991607, 4.986642154734455], [6.961859060717777, 4.986078307579015], [6.962515538693158, 4.98552573411597], [6.963181477374119, 4.984984599717307], [6.963856677461199, 4.984455066331556], [6.964540936883224, 4.983937292435351], [6.965234050857771, 4.983431432985991], [6.965935811952465, 4.982937639375064], [6.96569806085697, 4.982578447119955], [6.965176500081051, 4.981741721884361], [6.961368007767871, 4.983971023946484], [6.961258601253502, 4.984033781383563], [6.958388880100952, 4.98570218061607], [6.959123408092267, 4.986907030395274], [6.959183220334345, 4.986960875678063], [6.959813656247458, 4.987968819434314], [6.962799812093265, 4.992778485033118], [6.962914382552619, 4.992854992964397], [6.964259093224757, 4.992169918091826], [6.96469289759868, 4.991927164409412]]]] } }] }'));

      this.map.addSource(`${this.EstateName}`, {
        type: 'geojson',
        data: data,
      });

      this.map.addLayer({
        'id': `${this.EstateName}`,
        'type': 'fill',
        'source': `${this.EstateName}`, // reference the data source
        'layout': {},
        'paint': {
          'fill-color': '#0080ff', // blue color fill
          'fill-opacity': 0.5
        }
      });
      // Add a black outline around the polygon.
      this.map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': `${this.EstateName}`,
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 3
        }
      });

      const coordinates = data.features[0].geometry.coordinates;
      this.map.jumpTo({ 'center': coordinates[0][0][0], 'zoom': 14 });
      this.map.setPitch(30);


      setTimeout(() => {
        console.log('chhhjj', this.EstateBlockAndUnits)

        if (this.EstateBlockAndUnits instanceof Array && this.EstateBlockAndUnits.length > 0) {

          this.EstateBlockAndUnits.forEach((propertyBlock: any) => {
            this.map.addLayer({
              'id': `blocks-${propertyBlock.PropertyId}-ha`,
              'type': 'line',
              'source': JSON.parse(propertyBlock.Entity),
              'paint': {
                'line-color': 'yellow',
                'line-opacity': 0.75,
                'line-width': 5
              }
            });
          });
        }
      }, 500);

    });
  }


  public patchGeoJson(geoJsonObj: any) {
    const patchedJson: any = rewind(JSON.parse(geoJsonObj));
    delete patchedJson.crs;
    return JSON.stringify(patchedJson)
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  // addToCart(): void {
  //   this.submitted = true;
  //   if ((this.product.sizes && this.product.sizes.length && !this.selectedSize) || !this.quantity) {
  //     return;
  //   }
  //   this.loading = true;
  //   const model: AddToCart = {
  //     productId: this.product.productId,
  //     size: this.selectedSize,
  //     quantity: this.quantity
  //   };
  //   this.storeService.addToCart(model)
  //     .subscribe(() => {
  //       this.broadcastService.emitGetCart();
  //       this.router.navigate(['/store/cart']);
  //       this.notificationService.showSuccessMessage('Successfully added to cart');
  //       this.loading = false;
  //       this.submitted = false;
  //     }, errors => {
  //       this.notificationService.showErrorMessage(errors.error.errorDescription);
  //       this.loading = false;
  //       this.submitted = false;
  //     });
  // }




  public resolveObjectAndMerge(Metadata: any) {
    var blockListing: any = {}
    blockListing.payment_plans = Metadata.payment_plans ? Metadata.payment_plans.FieldValue : 'Not Available';
    blockListing.property_address = Metadata.property_address ? Metadata.property_address.FieldValue : 'Not Available';
    blockListing.property_amenities = Metadata.property_amenities ? Metadata.property_amenities.FieldValue : 'Not Available';
    blockListing.property_bathroom_count = Metadata.property_bathroom_count ? Metadata.property_bathroom_count.FieldValue : 'Not Available';
    blockListing.property_bedroom_count = Metadata.property_bedroom_count ? Metadata.property_bedroom_count.FieldValue : 'Not Available';
    blockListing.property_country = Metadata.property_country ? Metadata.property_country.FieldValue : 'Not Available';
    blockListing.property_description = Metadata.property_description ? Metadata.property_description.FieldValue : 'Not Available';
    blockListing.property_feature_photo = Metadata.property_feature_photo ? Metadata.property_feature_photo.FieldValue : 'Not Available';
    blockListing.property_features = Metadata.property_features ? Metadata.property_features.FieldValue : 'Not Available';
    blockListing.property_floor_plan = Metadata.property_floor_plan ? Metadata.property_floor_plan.FieldValue : 'Not Available';
    blockListing.property_lga = Metadata.property_lga ? Metadata.property_lga.FieldValue : 'Not Available';
    blockListing.property_name = Metadata.property_name ? Metadata.property_name.FieldValue : 'Not Available';
    blockListing.property_parking_space_count = Metadata.property_parking_space_count ? Metadata.property_parking_space_count.FieldValue : 'Not Available';
    blockListing.property_payment_plans = Metadata.property_payment_plans ? Metadata.property_payment_plans.FieldValue : 'Not Available';
    blockListing.property_photos = Metadata.property_photos ? Metadata.property_photos.FieldValue : 'Not Available';
    blockListing.property_price = Metadata.property_price ? Metadata.property_price.FieldValue : 'Not Available';
    blockListing.property_sittingroom_count = Metadata.property_sittingroom_count ? Metadata.property_sittingroom_count.FieldValue : 'Not Available';
    blockListing.property_size = Metadata.property_size ? Metadata.property_size.FieldValue : 'Not Available';
    blockListing.property_state = Metadata.property_state ? Metadata.property_state.FieldValue : 'Not Available';
    blockListing.property_status = Metadata.property_status ? Metadata.property_status.FieldValue : 'Not Available';
    blockListing.property_title = Metadata.property_title ? Metadata.property_title.FieldValue : 'Not Available';
    blockListing.property_title_photos = Metadata.property_title_photos ? Metadata.property_title_photos.FieldValue : 'Not Available';
    blockListing.property_type = Metadata.property_type ? Metadata.property_type.FieldValue : 'Not Available';
    blockListing.property_video_url = Metadata.property_video_url ? Metadata.property_video_url.FieldValue : 'Not Available';

    // console.log(blockListing);
    return blockListing
  }

  public formatLoadedData(propertyObjectListing: any) {
    let propertyObj = [];
    propertyObjectListing.forEach((property: any) => {
      var objectElement: any = {}
      objectElement = property;
      objectElement.Metadata = this.resolveObjectAndMerge(property.Metadata);
      objectElement.Entity = this.patchGeoJson(property.Entity.EntityGeometry);
      propertyObj.push(objectElement);
    });
    this.changeDectection.detectChanges()
    return propertyObj
  }

  public saveBlockAndUnits(propObjListing: any) {
    console.log('saveBlockAndUnits', propObjListing)
    if (JSON.stringify(propObjListing) !== "[]") {
      console.log('Java')
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
          objectElement = property;
          objectElement.Metadata = this.resolveObjectAndMerge(property.Metadata);
          objectElement.Entity = this.patchGeoJson(property.Entity.EntityGeometry);
          objectElement.BlockUnit = blockUnitInfo.contentData.length > 0 ? this.formatLoadedData(blockUnitInfo.contentData) : []
          blockParamsListing.push(objectElement);
        });
        this.changeDectection.detectChanges()
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
            this.saveBlockAndUnits(BlockAndUnits);
          }
          this.changeDectection.detectChanges()
        }

      } else {

        const savedProp = JSON.parse(propertyListing);
        if (savedProp !== []) {
          return this.EstateBlockAndUnits = savedProp;
        } else {
          this.removeBlockAndUnit(`${this.STORAGE_NAME}-${this.EstateName}`)
        }
      }
    } catch (error) {
      //console.log('checkPropertyObj', error);
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
            this.EstateInfo = propertyInfo
            this.EstateName = `hae_${propertyInfo.PropertyTitle}`;
            return;
          }
        });
      }
    }

  }

}
