import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import rewind from '@mapbox/geojson-rewind';
import * as L from 'leaflet';
import { environment } from '../../../environments/environment';
import { NotificationService } from 'app/shared/services/notification.service';
import { BroadcastService } from 'app/core/broadcast.service';
import { MobileService } from 'app/core/mobile.service';
import { Subscription } from 'rxjs';
import { Observable, Subscriber } from 'rxjs';
import { StoreService } from 'app/shared/services/store.service';



@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit, OnDestroy, AfterViewInit {
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
  public ESTATE_BLOCK_MAP: any;
  public ESTATE_BLOCK_UNITS: any;
  private watcher: Subscription;
  public simpCounter = 0;
  public isMapLoading = true;

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
    private mobileService: MobileService
  ) {
    mapboxgl.accessToken = environment.MAPBOX_ACCESS_TOKEN.accessToken;
    this.isMapLoading = true;
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
    if (this.map) {
      //to remove any initiallization of a previous map
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
  }

  private initMap(): void {
    console.log('map-called');
    const data = this.ESTATE_MAPSOURCE;
    const coordinates = data.features[0].geometry.coordinates;
    const coord = coordinates[0][0][0]
    // console.log('center', coordinates[0][0][0])
    const mbAttr = "";
    const mbUrl =
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

    const streets = L.tileLayer(mbUrl, {
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      attribution: mbAttr
    });

    const sattelite = L.tileLayer(mbUrl, {
      id: "mapbox/satellite-v9",
      tileSize: 512,
      zoomOffset: -1,
      attribution: mbAttr
    });

    this.map = L.map('estateMap', {
      center: [coord[1], coord[0]],
      minZoom: 5,
      maxZoom: 50,
      zoom: 7,
      layers: [streets]
    });

    var baseLayers = {
      Streets: streets,
      Sattelite: sattelite
    };

    var controlLayers = L.control.layers(baseLayers).addTo(this.map);
    var estateLayer = new L.geoJson(this.ESTATE_MAPSOURCE, {
      style: function (feature) {
        switch (feature.properties.group) {
          case 'Estate': return {
            stroke: true,
            color: "#ffffff",
            weight: 5,
            opacity: 1,
            fill: true,
            fillColor: "#f0d1b1",
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
      onEachFeature: function (feature, layer) {
        layer.on({
          mouseover: function () {
            this.setStyle({
              'fillColor': feature.properties.group === 'Estate' ? '#b45501' : "#808080",
            });
          },
          mouseout: function () {
            this.setStyle({
              'fillColor': feature.properties.group === 'Estate' ? '#f0d1b1' : "#f2f2f2",
            });
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


    var estateUnitsLayer = L.geoJson(this.ESTATE_BLOCK_UNITS, {
      style: style,
      onEachFeature: onEachFeature
    })
    // .addTo(this.map);
    // controlLayers.addOverlay(estateUnitsLayer, 'Estate Units');

    this.map.fitBounds(estateLayer.getBounds());

    estateLayer.on("click", (event) => {
      if (event.layer.feature.properties.group === 'Block') {
        this.map.fitBounds(event.layer.getBounds());
        //zoom in
      }
    })

    this.map.on('zoomend', (e) => {
      // console.log('map.getZoom()-1', this.map.getZoom())
      if (this.map.getZoom() >= 7 && this.map.getZoom() <= 16) {
        if (this.simpCounter == 0 || this.simpCounter == 2) {
          this.map.removeLayer(estateUnitsLayer);
          //console.log('Showing removing units')
          this.simpCounter = 1;
        }
      }
      else if (this.map.getZoom() >= 17) {
        if (this.simpCounter == 0 || this.simpCounter == 1) {
          this.map.addLayer(estateUnitsLayer);
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


    // Edit ranges and colors to match your data; see http://colorbrewer.org
    // Any values not listed in the ranges below displays as the last color
    function getColor(color_status) {
      switch (color_status) {
        case 'sold': return '#FF0000';
        case 'available': return '#7CFC00';
        case '1': return '#FF0000';
        case '': return '#7CFC00';
        default:
          return "#f2f2f2";
      }
    }

    // Edit the getColor property to match data column header in your GeoJson file
    function style(feature) {
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
    function highlightFeature(e) {
      resetHighlight(e);
      var layer = e.target;
      var color = getColor(layer.feature.properties.property_status)
      layer.setStyle({
        weight: 10,
        color: 'white',
        opacity: 0.6,
        fillOpacity: 0.65,
        fillColor: color
      });
      // info.update(layer.feature.properties);
      layer.bindPopup('<h1>' + layer.feature.properties.property_name + '</h1><p>name: ' + layer.feature.properties.property_title + '</p>');
    }

    // This resets the highlight after hover moves away
    function resetHighlight(e) {
      estateUnitsLayer.setStyle(style);
      info.update();
    }

    // This instructs highlight and reset functions on hover movement
    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: highlightFeature
      });
    }

    // Creates an info box on the map
    var info = L.control({ position: 'topleft' });
    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    // Edit info box text and variables (such as props.density2010) to match those in your GeoJSON data
    info.update = function (props) {
      this._div.innerHTML = '<h3>Zoom Closer to view available units</h3>';
      var value = props && props.percent ? props.percent + '%' : 'No data'
      this._div.innerHTML += (props
        ? '<b>' + props.property_name + '</b><br />' + props.property_title + '</b><br />'
        + (props.property_price ? 'Most recent data: ' + props.property_price : '')
        : 'Hover over Block Units');
    };
    info.addTo(this.map);

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
    blockListing.property_status = Metadata.property_status ? Metadata.property_status.FieldValue : 'available';
    blockListing.property_title = Metadata.property_title ? Metadata.property_title.FieldValue : 'Not Available';
    blockListing.property_title_photos = Metadata.property_title_photos ? Metadata.property_title_photos.FieldValue : 'Not Available';
    blockListing.property_type = Metadata.property_type ? Metadata.property_type.FieldValue : 'Land';
    blockListing.property_video_url = Metadata.property_video_url ? Metadata.property_video_url.FieldValue : 'Not Available';

    // console.log(blockListing);
    return blockListing
  }

  public formatLoadedData(propertyObjectListing: any) {
    let propertyObj = [];
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
      unitsData.features[0].properties = properties;
      this.ESTATE_BLOCK_UNITS.features.push(unitsData.features[0]);
      this.changeDectection.detectChanges()
    });

    return propertyObj
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
          // console.log('ESTATE_MAPSOURCE', this.ESTATE_MAPSOURCE)
          // console.log('ESTATE_BLOCK_UNITS', this.ESTATE_BLOCK_UNITS)

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
            const estateData = JSON.parse(propertyInfo.Entity)
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
