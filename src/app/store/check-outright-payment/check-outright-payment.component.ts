import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
import { StoreService } from 'app/shared/services/store.service';
import { NavigationService } from 'app/shared/services/navigation.service'

@Component({
  selector: 'app-check-outright-payment',
  templateUrl: './check-outright-payment.component.html',
  styleUrls: ['./check-outright-payment.component.scss']
})
export class CheckOutrightPaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  public propertyID: any = 0;
  public numberOfProperties = 0
  public balance = 0;
  public subtotal = 0;
  public PROPERTY_INFO: any = {};
  public loading = true;
  public isMapLoading = true;
  public map: any;
  constructor(private route: ActivatedRoute, private storeService: StoreService, private navigation: NavigationService, private router: Router) {
    this.isMapLoading = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.propertyID = params['id'];
      this.storeService.fetchCartItem(params['id']).subscribe((response: any) => {
        console.log('response.data.records', response.data);
        if (response.data instanceof Object && Object.keys(response.data).length !== 0) {
          // save to loal store
          let cartItem = response.data
          this.subtotal += cartItem.PropertyAmount ? parseFloat(cartItem.PropertyAmount) : 0;
          this.balance += 3000
          this.numberOfProperties += 1
          if (cartItem?.PropertyJson) {
            cartItem.PropertyJson = JSON.parse(cartItem.PropertyJson);
          }


          this.PROPERTY_INFO = cartItem;

          if (this.PROPERTY_INFO instanceof Object && Object.keys(this.PROPERTY_INFO).length !== 0) {
            this.isMapLoading = false;
            setTimeout(() => {
              this.initMap();
            }, 1000);
          }
        } else {
          this.PROPERTY_INFO = {};
        }
        this.loading = false;
        // this.changeDectection.detectChanges();

      }, (error) => {
        this.loading = false;
        // this.changeDectection.detectChanges();
        console.log('do Error', error)
        //this.router.navigate([`/user-dashboard`]);
      });

    });
  }

  ngAfterViewInit(): void {

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

  }

  public callToAction(param: any) {
    switch (param) {
      case 'PAYNOW':
        this.updateApplicationProcess(this.PROPERTY_INFO)
        break;

      default:
        let timerInterval: any;
        Swal.fire({
          title: 'Auto close alert!',
          html: 'I will close in <b></b> milliseconds.',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            let b: any = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer')
            this.router.navigate([`/user-dashboard`]);
          }
        })
        break;
    }

  }

  public updateApplicationProcess(propertyItem: any) {

    Swal.fire({
      title: 'Ouright Payment',
      text: `You have choosing to make an outright payment for this property, Please allow 24hrs to book for inspection and follow up contact with our team. Do you wish to continue?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Continue!',
      cancelButtonText: 'No, do it later.'
    }).then((result) => {
      if (result.isConfirmed) {
        const propertyInfo: any = propertyItem;
        propertyInfo.ApplicationStatus = 'PENDING';
        this.storeService.updateCartItem(JSON.stringify(propertyInfo)).subscribe((response: any) => {
          // console.log('response.data.records', response.data);
          this.router.navigate([`/property-search/checkout/${this.propertyID}`]);

        }, (error) => {
          console.log('error', error)
          Swal.fire(
            'Unable to process request',
            'Error Caught processing your request, Please try again later.',
            'error'
          )
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Outright Payment Cancelled',
          text: "What would you want to do?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Previous Page!',
          cancelButtonText: 'Dashboard.'
        }).then((result) => {
          if (result.isConfirmed) {
            this.navigation.back()
          } else {
            this.router.navigate([`/user-dashboard`]);
          }
        })
      }
    })


  }


  private initMap(): void {
    //console.log('map-called');
    const ESTATE_AND_UNIT_INFO = this.PROPERTY_INFO.PropertyJson;

    const coordinates = ESTATE_AND_UNIT_INFO.features[0].geometry.coordinates;
    const coord = coordinates[0][0][0]
    //console.log('center', coordinates)
    //console.log('ESTATE_MAPSOURCE', this.ESTATE_MAPSOURCE.features[0].properties)
    const mbAttr = 'Marketplace &copy; Integration by <a href="https://houseafrica.io/">HouseAfrica</a>';
    const mbUrl =
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

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

    this.map = L.map('unitMap', {
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
    var estateLayer = new L.geoJson(ESTATE_AND_UNIT_INFO, {
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
            fillColor: "transparent",
            fillOpacity: 1,
            smoothFactor: 0.5,
            interactive: true,
          };
          case 'unit': return {
            stroke: true,
            color: "yellow",
            weight: 5,
            opacity: 1,
            fill: true,
            fillColor: "yellow",
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
              'fillColor': feature.properties.group === 'Estate' ? 'transparent' : feature.properties.group === 'Block' ? 'transparent' : "yellow",
            });

            if (feature.properties.group !== 'unit') {
              // layer.bindTooltip('Your property').openTooltip();
            }

          },
          mouseout: function () {
            this.setStyle({
              'fillColor': feature.properties.group === 'Estate' ? 'transparent' : feature.properties.group === 'Block' ? 'transparent' : "yellow",
            });

            if (feature.properties.group !== 'unit') {
              // layer.unbindTooltip();
            }

          },
          click: (e) => {
            if (feature.properties.group !== 'unit') {
              var layer = e.target;
              this.map.fitBounds(layer.getBounds());
              // console.log('Clicked on ', layer.feature.properties.property_name); //country info from geojson
              // alert('Clicked on ' + feature.properties.name)
              // const coordinates = feature.geometry.coordinates;
              // const coord = coordinates[0]
              //this.map.flyTo(coord[1], coord[0], 5);
              //zoom in
            }
          }
        });

        // if (feature.properties.group === 'unit') {
        //   layer.bindTooltip(feature.properties.property_name, { permanent: true, direction: 'center', className: 'estateLabel' });
        // }
      }
    }).addTo(this.map);
    // controlLayers.addOverlay(estateLayer, 'MapLayer');
    this.map.fitBounds(estateLayer.getBounds());

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

      //marker.bindPopup(template);
      marker.openPopup();

      L.DomUtil.get('value-arc').textContent = properties.property_name;
      L.DomUtil.get('value-speed').textContent = properties.property_title;

      // var buttonSubmit = L.DomUtil.get('button-submit');
      // L.DomEvent.addListener(buttonSubmit, 'click', async (e) => {
      //   await EventService.fire("DisplayPropertyInfo", allFeatures);

      //   //Add Add sidebar to the map

      //   marker.closePopup();
      // });


    }

    // This resets the highlight after hover moves away
    function resetHighlight(e: any) {
      // estateUnitsLayer.setStyle(style);
      // info.update();
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

    // this.map.on('zoomend', (e) => {
    //   // console.log('map.getZoom()-1', this.map.getZoom())
    //   if (this.map.getZoom() >= 7 && this.map.getZoom() <= 16) {
    //     if (this.simpCounter == 0 || this.simpCounter == 2) {
    //       this.map.removeLayer(estateUnitsLayer);
    //       // REMOVING PREVIOUS INFO BOX
    //       if (legend !== undefined) {
    //         legend.remove(this.map)
    //       }

    //       if (info !== undefined) {
    //         info.addTo(this.map)
    //       }

    //       //console.log('Showing removing units')
    //       this.simpCounter = 1;
    //     }
    //   }
    //   else if (this.map.getZoom() >= 17) {
    //     if (this.simpCounter == 0 || this.simpCounter == 1) {
    //       this.map.addLayer(estateUnitsLayer);
    //       if (legend !== undefined) {
    //         legend.addTo(this.map);
    //       }

    //       if (info !== undefined) {
    //         info.remove(this.map)
    //       }
    //       //console.log('Showing units -1')
    //       this.simpCounter = 2;
    //     }
    //   }
    //   else if (this.map.getZoom() <= 7) {
    //     if (this.simpCounter == 1 || this.simpCounter == 2) {
    //       //console.log('Showing units')
    //       this.simpCounter = 0;
    //     }
    //   }
    // });

  }




}
