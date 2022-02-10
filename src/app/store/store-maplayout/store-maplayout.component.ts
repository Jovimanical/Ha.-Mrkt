import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
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

  // data
  source: any;
  markers: any;
  constructor() {
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
      input.onclick = (layer:any) => {
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

}
