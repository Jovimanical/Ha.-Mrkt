import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StoreService } from 'app/shared/services/store.service';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-store-maplayout',
  templateUrl: './store-maplayout.component.html',
  styleUrls: ['./store-maplayout.component.scss']
})
export class StoreMaplayoutComponent implements OnInit {
  public map: mapboxgl.Map;
  public style = 'mapbox://styles/mapbox/satellite-v9';//'mapbox://styles/mapbox/outdoors-v9';
  public lat = 9.077751;
  public lng = 8.6774567;
  public message = 'HA MarketPlace!';
  public STORAGE_NAME = 'HABlockUnits';
  public EstateName: string = ''
  public EstateInfo: any = {}
  public EstateBlockAndUnits: any;

  // data
  source: any;
  markers: any;
  constructor(private storeService: StoreService) {
    mapboxgl.accessToken = environment.MAPBOX_ACCESS_TOKEN.accessToken;
  }

  ngOnInit(): void {
    this.initializeMap();
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
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 5,
      center: [this.lng, this.lat]
    });

    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      // Add a data source containing GeoJSON data.

      this.map.addSource('maine', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            // These coordinates outline Maine.
            'coordinates': [
              [
                [-67.13734, 45.13745],
                [-66.96466, 44.8097],
                [-68.03252, 44.3252],
                [-69.06, 43.98],
                [-70.11617, 43.68405],
                [-70.64573, 43.09008],
                [-70.75102, 43.08003],
                [-70.79761, 43.21973],
                [-70.98176, 43.36789],
                [-70.94416, 43.46633],
                [-71.08482, 45.30524],
                [-70.66002, 45.46022],
                [-70.30495, 45.91479],
                [-70.00014, 46.69317],
                [-69.23708, 47.44777],
                [-68.90478, 47.18479],
                [-68.2343, 47.35462],
                [-67.79035, 47.06624],
                [-67.79141, 45.70258],
                [-67.13734, 45.13745]
              ]
            ]
          }
        }
      });

      // Add a new layer to visualize the polygon.
      this.map.addLayer({
        'id': 'maine',
        'type': 'fill',
        'source': 'maine', // reference the data source
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
        'source': 'maine',
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 3
        }
      });
    });
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
    blockListing.property_price = Metadata.property_price ? parseFloat(Metadata.property_price.FieldValue) : (Math.floor(Math.random() * (Math.floor(9999999) - Math.ceil(2222222) + 1)) + Math.ceil(2222222));
    blockListing.property_sittingroom_count = Metadata.property_sittingroom_count ? Metadata.property_sittingroom_count.FieldValue : 1;
    blockListing.property_size = Metadata.property_size ? Metadata.property_size.FieldValue : 'Not Available';
    blockListing.property_state = Metadata.property_state ? Metadata.property_state.FieldValue : 'Not Available';
    blockListing.property_status = Metadata.property_status ? Metadata.property_status.FieldValue : 'Available';
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
      var objectElement: any = {}
      objectElement = property;
      objectElement.Metadata = this.resolveObjectAndMerge(property.Metadata);
      objectElement.Entity = property.Entity.EntityGeometry;
      propertyObj.push(objectElement);
    });
    return propertyObj
  }

  public savePropertyObj(propObjListing: any) {
    localStorage.setItem(`${this.STORAGE_NAME}-${this.EstateName}`, JSON.stringify(propObjListing));
  }


  public loopBlockAndUnit(BlockParam: any) {
    var blockParamsListing = []

    BlockParam.forEach(async (property: any) => {
      var objectElement: any = {}
      const blockUnitInfo: any = await this.storeService.fetchBlockUnitsAsPromise(property.PropertyId);
      objectElement = property;
      objectElement.Metadata = this.resolveObjectAndMerge(property.Metadata);
      objectElement.Entity = property.Entity.EntityGeometry;
      objectElement.BlockUnit = blockUnitInfo.contentData.length > 0 ? this.formatLoadedData(blockUnitInfo.contentData) : []
      blockParamsListing.push(objectElement);
    });

    //saveTOLocalStore    
    this.savePropertyObj(blockParamsListing);

    return blockParamsListing;

  }


  async checkPropertyObj(EstateID: any) {

    try {
      const propertyListing = localStorage.getItem(`${this.STORAGE_NAME}-${this.EstateName}`);
      // console.log(propertyListing)
      if (propertyListing === null || propertyListing === undefined) {
        const blockListingInfo: any = await this.storeService.fetchEstateBlockAsPromise(EstateID)
        if (blockListingInfo) {
          // console.log('result', result)
          if (blockListingInfo.contentData instanceof Array && blockListingInfo.contentData.length > 0) {
            this.EstateBlockAndUnits = this.formatLoadedData(blockListingInfo.contentData)
            console.log('this.propertyListing', this.EstateBlockAndUnits)
            // this.createProductRows();
          }
          return this.EstateBlockAndUnits = []
        }
      } else {

        return this.EstateBlockAndUnits = JSON.parse(propertyListing);
      }
    } catch (error) {
      console.log('checkPropertyObj', error);
      return this.EstateBlockAndUnits = []
    }
  }





}
