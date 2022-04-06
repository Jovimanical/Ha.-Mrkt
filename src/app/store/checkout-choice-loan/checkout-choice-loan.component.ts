import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
import * as moment from 'moment';
import { StoreService } from 'app/shared/services/store.service';


@Component({
  selector: 'app-checkout-choice-loan',
  templateUrl: './checkout-choice-loan.component.html',
  styleUrls: ['./checkout-choice-loan.component.scss']
})
export class CheckoutChoiceLoanComponent implements OnInit, AfterViewInit, OnDestroy {

  public propertyID: any = 0;
  public numberOfProperties = 0
  public balance = 0;
  public subtotal = 0; 
  public InsuranceFees = 0;  
  public downPayment = 0; 
  public serviceCharge = 0; 
  public TotalPayment = 0;
  public PROPERTY_INFO: any = {};
  public loading = true;
  public isMapLoading = true;
  public map: any;
  constructor(private route: ActivatedRoute, private storeService: StoreService, private router: Router) {
    this.isMapLoading = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.propertyID = params['id'];
      this.storeService.fetchCartItem(params['id']).subscribe((response: any) => {
        // console.log('response.data.records', response.data);
        if (response.data instanceof Object && Object.keys(response.data).length !== 0) {
          // save to loal store
          let cartItem = response.data
          this.subtotal += cartItem.PropertyAmount ? parseFloat(cartItem.PropertyAmount) : 0;
          this.downPayment += this.subtotal * 0.2;
          this.InsuranceFees += this.subtotal * 0.1;
          this.balance += 3000
          this.serviceCharge += this.subtotal * 0.075
          this.TotalPayment += this.InsuranceFees + this.downPayment + this.subtotal + this.serviceCharge
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
      case 1:
        this.updateApplicationProcess(this.PROPERTY_INFO)
        break;

      default:
        let timerInterval: any;
        Swal.fire({
          title: 'User Application schedule for later!',
          html: 'redirecting you to dashboard in <b></b> milliseconds.',
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
    const propertyInfo: any = propertyItem;
    propertyInfo.ApplicationStatus = 'DRAFT';
    this.storeService.updateCartItem(JSON.stringify(propertyInfo)).subscribe((response: any) => {
       console.log('response.data.records', response.data);
      this.router.navigate([`/listings/checkout-application-requirements/${this.propertyID}`]);

    }, (error) => {

    });
  }


  private initMap(): void {
    //console.log('map-called');
    const ESTATE_AND_UNIT_INFO = this.PROPERTY_INFO.PropertyJson;
    const coordinates = ESTATE_AND_UNIT_INFO.features[0].geometry.coordinates;
    const coord = coordinates[0]
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
          click: (e: { target: any; }) => {
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


    this.map.on('popupclose', (e: any) => {

    });


  }


  public sn(num: any) {

    num = num.toString();
    var len = num.length;
    var rnum: any = "";
    var test = "";
    var j = 0;
    var i: any;

    var b = num.substring(0, 1);
    if (b == "-") {
      rnum = "-";
    }

    for (i = 0; i <= len; i++) {

      b = num.substring(i, i + 1);

      if (b == "0" || b == "1" || b == "2" || b == "3" || b == "4" || b == "5" || b == "6" || b == "7" || b == "8" || b == "9" || b == ".") {
        rnum = rnum + "" + b;

      }

    }

    if (rnum == "" || rnum == "-") {
      rnum = 0;
    }

    rnum = Number(rnum);

    return rnum;

  }



  public fns(num: number, places: number, comma: number, type: number, show: number) {

    var sym_1 = "$";
    var sym_2 = "";
    var isNeg = 0;

    if (num < 0) {
      num = num * -1;
      isNeg = 1;
    }

    var myDecFact = 1;
    var myPlaces = 0;
    var myZeros = "";
    var decimal: any;
    var fillZeroes: any;
    var finNum: any
    while (myPlaces < places) {
      myDecFact = myDecFact * 10;
      myPlaces = Number(myPlaces) + Number(1);
      myZeros = myZeros + "0";
    }

    var onum = Math.round(num * myDecFact) / myDecFact;

    var integer: any = Math.floor(onum);

    if (Math.ceil(onum) == integer) {
      decimal = myZeros;
    } else {
      decimal = Math.round((onum - integer) * myDecFact)
    }
    decimal = decimal.toString();
    var z: any;
    if (decimal.length < places) {
      fillZeroes = places - decimal.length;
      for (z = 0; z < fillZeroes; z++) {
        decimal = "0" + decimal;
      }
    }

    if (places > 0) {
      decimal = "." + decimal;
    }

    if (comma == 1) {
      integer = integer.toString();
      var tmpnum = "";
      var tmpinteger = "";
      var y = 0;
      var x: any;

      for (x = integer.length; x > 0; x--) {
        tmpnum = tmpnum + integer.charAt(x - 1);
        y = y + 1;
        if (y == 3 && x > 1) {
          tmpnum = tmpnum + ",";
          y = 0;
        }
      }

      for (x = tmpnum.length; x > 0; x--) {
        tmpinteger = tmpinteger + tmpnum.charAt(x - 1);
      }


      finNum = tmpinteger + "" + decimal;
    } else {
      finNum = integer + "" + decimal;
    }

    if (isNeg == 1) {
      if (type == 1 && show == 1) {
        finNum = "-" + sym_1 + "" + finNum + "" + sym_2;
      } else {
        finNum = "-" + finNum;
      }
    } else {
      if (show == 1) {
        if (type == 1) {
          finNum = sym_1 + "" + finNum + "" + sym_2;
        } else
          if (type == 2) {
            finNum = finNum + "%";
          }

      }

    }

    return finNum;
  }


  public amortizationInline(form: any) {
    if ((<any>window).document.calc.principal.value == "" || (<any>window).document.calc.principal.value == 0) {
    } else {

      var vinlineamortinsert = (<any>window).document.getElementById("inlineamortinsert");
      vinlineamortinsert.innerHTML = " <center> <table border='0' cellpadding='2' cellspacing='0' bordercolor='#EEEEEE' id='tableName' width='100%'> <tbody> <tr class='yearend'> <th scope='col'><strong>Payment #</strong></th><th scope='col'><strong>Date</strong></th> <th scope='col'><strong>Payment</strong></th> <th scope='col'><strong>Principal</strong></th> <th scope='col'><strong>Interest</strong></th> <th scope='col'><strong>Balance</strong></th> </tr> </tbody> <tbody id='amort_sched'> </tbody> </table> </center>";


      var Vyear = Number((<any>window).document.calc.loanyear.value);
      var Vday = Number((<any>window).document.calc.loanday.value);
      var Vmonth = Number((<any>window).document.calc.loanmonth.selectedIndex);

      var startdate = moment([Vyear, Vmonth - 1, Vday]);
      while (!startdate.isValid()) {
        Vday = Vday - 1;
        startdate = moment([Vyear, Vmonth - 1, Vday]);
      }

      var v_principal = this.sn((<any>window).document.calc.principal.value);
      var v_rate = this.sn((<any>window).document.calc.interest_rate.value);
      var v_term = this.sn((<any>window).document.calc.num_years.value);
      var Vloantermtype = (<any>window).document.calc.loantermtype.options[(<any>window).document.calc.loantermtype.selectedIndex].value;
      v_term = Number(v_term) / Number(Vloantermtype);
      var v_interval = this.sn((<any>window).document.calc.ppy.value)

      var v_npr = v_term * v_interval;

      var v_payment = this.sn((<any>window).document.calc.payment.value);

      var v_prin = v_principal;
      var v_int = v_rate;
      v_int /= 100;
      v_int /= v_interval;

      var v_int_port = 0;
      var v_accum_int = 0;
      var v_prin_port = 0;
      var v_accum_prin = 0;
      var v_count = 0;
      var v_pmt_row = "";
      var v_pmt_num = 0;


      var v_display_pmt_amt = 0;

      var v_accum_year_prin = 0;
      var v_accum_year_int = 0;
      var v_year = 1;
      var currentdate: any = 0;

      currentdate = moment(startdate);

      if (v_interval > 53) {
        startdate.add(365.25 / v_interval, 'days');
      } else if (v_interval > 25) {
        startdate.add(365.25 / v_interval, 'days');
      } else if (v_interval == 24 && v_count % 5 == 0) {
        startdate.add(16, 'days');
      } else if (v_interval == 24 && v_count % 5 !== 0) {
        startdate.add(15, 'days');
      } else if (v_interval == 1) {
        startdate.add(1, 'years');
      } else if (v_interval == 6 || v_interval == 3 || v_interval == 4 || v_interval == 2) {
        startdate.add(Math.round(12 / v_interval), 'months');
        while (Vday > 28 && moment(startdate).date() < Vday && moment(startdate).date() < moment(startdate).daysInMonth()) {
          startdate.add((1), 'days');
        }
      } else if (v_interval == 12) {
        startdate.add(Math.round(12 / v_interval), 'months');
        while (Vday > 28 && moment(startdate).date() < Vday && moment(startdate).date() < moment(startdate).daysInMonth()) {
          startdate.add((1), 'days');
        }
      } else {
        startdate.add(365.25 / v_interval, 'days');
      }


      while (v_count < v_npr) {

        if (v_count < (v_npr - 1)) {
          v_int_port = v_prin * v_int;
          v_int_port *= 100;
          v_int_port = Math.round(v_int_port);
          v_int_port /= 100;

          v_accum_int = Number(v_accum_int) + Number(v_int_port);
          v_accum_year_int = Number(v_accum_year_int) + Number(v_int_port);

          v_prin_port = Number(v_payment) - Number(v_int_port);
          v_prin_port *= 100;
          v_prin_port = Math.round(v_prin_port);
          v_prin_port /= 100;

          v_accum_prin = Number(v_accum_prin) + Number(v_prin_port);
          v_accum_year_prin = Number(v_accum_year_prin) + Number(v_prin_port);

          v_prin = Number(v_prin) - Number(v_prin_port);

          v_display_pmt_amt = Number(v_prin_port) + Number(v_int_port);

        } else {

          v_int_port = v_prin * v_int;
          v_int_port *= 100;
          v_int_port = Math.round(v_int_port);
          v_int_port /= 100;

          v_accum_int = Number(v_accum_int) + Number(v_int_port);
          v_accum_year_int = Number(v_accum_year_int) + Number(v_int_port);

          v_prin_port = v_prin;

          v_accum_prin = Number(v_accum_prin) + Number(v_prin_port);
          v_accum_year_prin = Number(v_accum_year_prin) + Number(v_prin_port);
          v_prin = 0;
          v_display_pmt_amt = Number(v_prin_port) + Number(v_int_port);

        }



        v_pmt_num = Number(v_pmt_num) + Number(1);
        v_count = Number(v_count) + Number(1);

        currentdate = moment(startdate);
        if (v_interval > 53) {
          startdate.add(365.25 / v_interval, 'days');
        } else if (v_interval > 25) {
          startdate.add(365.25 / v_interval, 'days');
        } else if (v_interval == 24 && v_count % 5 == 0) {
          startdate.add(16, 'days');
        } else if (v_interval == 24 && v_count % 5 !== 0) {
          startdate.add(15, 'days');
        } else if (v_interval == 1) {
          startdate.add(1, 'years');
        } else if (v_interval == 6 || v_interval == 3 || v_interval == 4 || v_interval == 2) {
          startdate.add(Math.round(12 / v_interval), 'months');
          while (Vday > 28 && moment(startdate).date() < Vday && moment(startdate).date() < moment(startdate).daysInMonth()) {
            startdate.add((1), 'days');
          }
        } else if (v_interval == 12) {
          startdate.add(Math.round(12 / v_interval), 'months');
          while (Vday > 28 && moment(startdate).date() < Vday && moment(startdate).date() < moment(startdate).daysInMonth()) {
            startdate.add((1), 'days');
          }
        } else {
          startdate.add(365.25 / v_interval, 'days');
        }




        var tbody = (<any>window).document.getElementById('amort_sched');
        var row = (<any>window).document.createElement('tr');
        var cell1 = (<any>window).document.createElement('td');
        cell1.style.textAlign = "right";
        cell1.style.fontSize = "medium";
        cell1.innerHTML = '' + v_pmt_num + '';
        row.appendChild(cell1);
        var cell2 = (<any>window).document.createElement('td');
        cell2.style.textAlign = "right";
        cell2.style.fontSize = "medium";
        cell2.innerHTML = '' + currentdate.format('ll') + '';
        row.appendChild(cell2);
        var cell3 = (<any>window).document.createElement('td');
        cell3.style.textAlign = "right";
        cell3.style.fontSize = "medium";
        cell3.innerHTML = '' + this.fns(v_display_pmt_amt, 2, 1, 1, 1) + '';
        row.appendChild(cell3);
        var cell4 = (<any>window).document.createElement('td');
        cell4.style.textAlign = "right";
        cell4.style.fontSize = "medium";
        cell4.innerHTML = '' + this.fns(v_prin_port, 2, 1, 1, 1) + '';
        row.appendChild(cell4);
        var cell5 = (<any>window).document.createElement('td');
        cell5.style.textAlign = "right";
        cell5.style.fontSize = "medium";
        cell5.innerHTML = '' + this.fns(v_int_port, 2, 1, 1, 1) + '';
        row.appendChild(cell5);
        var cell6 = (<any>window).document.createElement('td');
        cell6.style.textAlign = "right";
        cell6.style.fontSize = "medium";
        cell6.innerHTML = '' + this.fns(v_prin, 2, 1, 1, 1) + '';
        row.appendChild(cell6);
        tbody.appendChild(row);



        if (v_pmt_num % v_interval == 0 && v_pmt_num < v_npr) {

          var tbody = (<any>window).document.getElementById('amort_sched');

          var row = (<any>window).document.createElement('tr');
          row.setAttribute('class', 'yearend');
          (<any>window).document.body.appendChild(row);
          var cell1 = (<any>window).document.createElement('td');
          cell1.style.textAlign = "right";
          cell1.style.fontSize = "medium";
          cell1.innerHTML = '';
          row.appendChild(cell1);
          var cell2 = (<any>window).document.createElement('td');
          cell2.style.textAlign = "right";
          cell2.style.fontSize = "medium";
          cell2.innerHTML = 'Year ' + v_year + '';
          row.appendChild(cell2);
          var cell3 = (<any>window).document.createElement('td');
          cell3.style.textAlign = "right";
          cell3.style.fontSize = "medium";
          cell3.innerHTML = '' + this.fns(v_accum_year_int + v_accum_year_prin, 2, 1, 1, 1) + '';
          row.appendChild(cell3);
          var cell4 = (<any>window).document.createElement('td');
          cell4.style.textAlign = "right";
          cell4.style.fontSize = "medium";
          cell4.innerHTML = '' + this.fns(v_accum_year_prin, 2, 1, 1, 1) + '';
          row.appendChild(cell4);
          var cell5 = (<any>window).document.createElement('td');
          cell5.style.textAlign = "right";
          cell5.style.fontSize = "medium";
          cell5.innerHTML = '' + this.fns(v_accum_year_int, 2, 1, 1, 1) + '';
          row.appendChild(cell5);
          var cell6 = (<any>window).document.createElement('td');
          cell6.style.textAlign = "right";
          cell6.style.fontSize = "medium";
          cell6.innerHTML = '' + this.fns(v_prin, 2, 1, 1, 1) + '';
          row.appendChild(cell6);
          tbody.appendChild(row);


          v_year += 1;
          v_accum_year_prin = 0;
          v_accum_year_int = 0;

        }

        if (v_pmt_num == v_npr) {

          var tbody = (<any>window).document.getElementById('amort_sched');

          var row = (<any>window).document.createElement('tr');
          row.setAttribute('class', 'yearend');
          (<any>window).document.body.appendChild(row);
          var cell1 = (<any>window).document.createElement('td');
          cell1.style.textAlign = "right";
          cell1.style.fontSize = "medium";
          cell1.innerHTML = '';
          row.appendChild(cell1);
          var cell2 = (<any>window).document.createElement('td');
          cell2.style.textAlign = "right";
          cell2.style.fontSize = "medium";
          cell2.innerHTML = 'Year ' + v_year + '';
          row.appendChild(cell2);
          var cell3 = (<any>window).document.createElement('td');
          cell3.style.textAlign = "right";
          cell3.style.fontSize = "medium";
          cell3.innerHTML = '' + this.fns(v_accum_year_int + v_accum_year_prin, 2, 1, 1, 1) + '';
          row.appendChild(cell3);
          var cell4 = (<any>window).document.createElement('td');
          cell4.style.textAlign = "right";
          cell4.style.fontSize = "medium";
          cell4.innerHTML = '' + this.fns(v_accum_year_prin, 2, 1, 1, 1) + '';
          row.appendChild(cell4);
          var cell5 = (<any>window).document.createElement('td');
          cell5.style.textAlign = "right";
          cell5.style.fontSize = "medium";
          cell5.innerHTML = '' + this.fns(v_accum_year_int, 2, 1, 1, 1) + '';
          row.appendChild(cell5);
          var cell6 = (<any>window).document.createElement('td');
          cell6.style.textAlign = "right";
          cell6.style.fontSize = "medium";
          cell6.innerHTML = '' + this.fns(v_prin, 2, 1, 1, 1) + '';
          row.appendChild(cell6);
          tbody.appendChild(row);

        }




        if (v_count > 10000 * v_interval) {
          break;

        } else {

          continue;

        }

      }

      var v_int_text = "";

      if (v_interval == 12) {
        v_int_text = "Monthly";
      } else
        if (v_interval == 4) {
          v_int_text = "Quarterly";
        } else
          if (v_interval == 52) {
            v_int_text = "Weekly";
          } else
            if (v_interval == 26) {
              v_int_text = "Bi-weekly";
            } else
              if (v_interval == 1) {
                v_int_text = "Daily";
              } else
                if (v_interval == 24) {
                  v_int_text = "Semi-monthly";
                } else
                  if (v_interval == 2) {
                    v_int_text = "Semi-Annually";
                  } else
                    if (v_interval == 1) {
                      v_int_text = "Annually";
                    }



    }
  }


  public amortizationPrintable(form: any) {

    if ((<any>window).document.calc.principal.value == "" || (<any>window).document.calc.principal.value == 0) {

    } else {

      var Vyear = Number((<any>window).document.calc.loanyear.value);
      var Vday = Number((<any>window).document.calc.loanday.value);
      var Vmonth = Number((<any>window).document.calc.loanmonth.selectedIndex);

      var startdate = moment([Vyear, Vmonth - 1, Vday]);
      while (!startdate.isValid()) {
        Vday = Vday - 1;
        startdate = moment([Vyear, Vmonth - 1, Vday]);
      }

      var v_principal = this.sn((<any>window).document.calc.principal.value);
      var v_rate = this.sn((<any>window).document.calc.interest_rate.value);
      var v_term = this.sn((<any>window).document.calc.num_years.value);
      var Vloantermtype = (<any>window).document.calc.loantermtype.options[(<any>window).document.calc.loantermtype.selectedIndex].value;
      v_term = Number(v_term) / Number(Vloantermtype);
      var v_interval = this.sn((<any>window).document.calc.ppy.value)

      var v_npr = v_term * v_interval;

      var v_payment = this.sn((<any>window).document.calc.payment.value);

      var v_prin = v_principal;
      var v_int = v_rate;
      v_int /= 100;
      v_int /= v_interval;

      var v_int_port = 0;
      var v_accum_int = 0;
      var v_prin_port = 0;
      var v_accum_prin = 0;
      var v_count = 0;
      var v_pmt_row = "";
      var v_pmt_num = 0;


      var v_display_pmt_amt = 0;

      var v_accum_year_prin = 0;
      var v_accum_year_int = 0;

      var v_year = 1;

      var currentdate: any = moment(startdate);
      if (v_interval > 53) {
        startdate.add(365.25 / v_interval, 'days');
      } else if (v_interval > 25) {
        startdate.add(365.25 / v_interval, 'days');
      } else if (v_interval == 24 && v_count % 5 == 0) {
        startdate.add(16, 'days');
      } else if (v_interval == 24 && v_count % 5 !== 0) {
        startdate.add(15, 'days');
      } else if (v_interval == 1) {
        startdate.add(1, 'years');
      } else if (v_interval == 6 || v_interval == 3 || v_interval == 4 || v_interval == 2) {
        startdate.add(Math.round(12 / v_interval), 'months');
        while (Vday > 28 && moment(startdate).date() < Vday && moment(startdate).date() < moment(startdate).daysInMonth()) {
          startdate.add((1), 'days');
        }
      } else if (v_interval == 12) {
        startdate.add(Math.round(12 / v_interval), 'months');
        while (Vday > 28 && moment(startdate).date() < Vday && moment(startdate).date() < moment(startdate).daysInMonth()) {
          startdate.add((1), 'days');
        }
      } else {
        startdate.add(365.25 / v_interval, 'days');
      }


      while (v_count < v_npr) {

        if (v_count < (v_npr - 1)) {

          v_int_port = v_prin * v_int;
          v_int_port *= 100;
          v_int_port = Math.round(v_int_port);
          v_int_port /= 100;

          v_accum_int = Number(v_accum_int) + Number(v_int_port);
          v_accum_year_int = Number(v_accum_year_int) + Number(v_int_port);

          v_prin_port = Number(v_payment) - Number(v_int_port);
          v_prin_port *= 100;
          v_prin_port = Math.round(v_prin_port);
          v_prin_port /= 100;

          v_accum_prin = Number(v_accum_prin) + Number(v_prin_port);
          v_accum_year_prin = Number(v_accum_year_prin) + Number(v_prin_port);

          v_prin = Number(v_prin) - Number(v_prin_port);

          v_display_pmt_amt = Number(v_prin_port) + Number(v_int_port);

        } else {

          v_int_port = v_prin * v_int;
          v_int_port *= 100;
          v_int_port = Math.round(v_int_port);
          v_int_port /= 100;

          v_accum_int = Number(v_accum_int) + Number(v_int_port);
          v_accum_year_int = Number(v_accum_year_int) + Number(v_int_port);

          v_prin_port = v_prin;

          v_accum_prin = Number(v_accum_prin) + Number(v_prin_port);
          v_accum_year_prin = Number(v_accum_year_prin) + Number(v_prin_port);

          v_prin = 0;

          //pmtAmt = Number(intPort) + Number(prinPort);
          v_display_pmt_amt = Number(v_prin_port) + Number(v_int_port);
        }

        currentdate = moment(startdate);
        if (v_interval > 53) {
          startdate.add(365.25 / v_interval, 'days');
        } else if (v_interval > 25) {
          startdate.add(365.25 / v_interval, 'days');
        } else if (v_interval == 24 && v_count % 5 == 0) {
          startdate.add(16, 'days');
        } else if (v_interval == 24 && v_count % 5 !== 0) {
          startdate.add(15, 'days');
        } else if (v_interval == 1) {
          startdate.add(1, 'years');
        } else if (v_interval == 6 || v_interval == 3 || v_interval == 4 || v_interval == 2) {
          startdate.add(Math.round(12 / v_interval), 'months');
          while (Vday > 28 && moment(startdate).date() < Vday && moment(startdate).date() < moment(startdate).daysInMonth()) {
            startdate.add((1), 'days');
          }
        } else if (v_interval == 12) {
          startdate.add(Math.round(12 / v_interval), 'months');
          while (Vday > 28 && moment(startdate).date() < Vday && moment(startdate).date() < moment(startdate).daysInMonth()) {
            startdate.add((1), 'days');
          }
        } else {
          startdate.add(365.25 / v_interval, 'days');
        }

        v_count = Number(v_count) + Number(1);
        v_pmt_num = Number(v_pmt_num) + Number(1);

        v_pmt_row += "<tr><td align=right>";
        v_pmt_row += "<small>" + v_pmt_num + "</small></td>";
        v_pmt_row += "<td><small>" + currentdate.format('ll') + "</small></td>";
        v_pmt_row += "<td align=right>$" + this.fns(v_display_pmt_amt, 2, 1, 0, 0) + "";
        v_pmt_row += "</td><td align=right>$" + this.fns(v_prin_port, 2, 1, 0, 0) + "";
        v_pmt_row += "</td><td align=right>";
        v_pmt_row += "$" + this.fns(v_int_port, 2, 1, 0, 0) + "";
        v_pmt_row += "</td><td align=right>";
        v_pmt_row += "$" + this.fns(v_prin, 2, 1, 0, 0) + "</td></tr>";


        if (v_pmt_num % v_interval == 0) {

          v_pmt_row += "<tr bgcolor='#dddddd'><td align=left>";
          v_pmt_row += "</td><td align=left>Year " + v_year + "</td>";
          v_pmt_row += "<td>$" + this.fns((v_accum_year_prin + v_accum_year_int), 2, 1, 0, 0) + "";
          v_pmt_row += "</td><td align=right>";
          v_pmt_row += "$" + this.fns(v_accum_year_prin, 2, 1, 0, 0) + "";
          v_pmt_row += "</td><td align=right>";
          v_pmt_row += "$" + this.fns(v_accum_year_int, 2, 1, 0, 0) + "</td>";
          v_pmt_row += "<td align=right>";
          v_pmt_row += "$" + this.fns(v_prin, 2, 1, 0, 0) + "</td></tr>";

          v_year += 1;
          v_accum_year_prin = 0;
          v_accum_year_int = 0;

        }

        if (v_count > 10000 * v_interval) {
          break;

        } else {

          continue;

        }

      }

      var v_int_text = "";

      if (v_interval == 12) {
        v_int_text = "Monthly";
      } else
        if (v_interval == 4) {
          v_int_text = "Quarterly";
        } else
          if (v_interval == 52) {
            v_int_text = "Weekly";
          } else
            if (v_interval == 26) {
              v_int_text = "Bi-weekly";
            } else
              if (v_interval == 1) {
                v_int_text = "Daily";
              } else
                if (v_interval == 24) {
                  v_int_text = "Semi-monthly";
                } else
                  if (v_interval == 2) {
                    v_int_text = "Semi-Annually";
                  } else
                    if (v_interval == 1) {
                      v_int_text = "Annually";
                    }

      var part1 = "<head><title>Amortization Schedule</title></head>";

      part1 += "<";
      part1 += "bo";
      part1 += "d";
      part1 += "y ";
      part1 += "bgcolor= '#FFFFFF'>";


      part1 += "<br /><br /><center><big><strong>";
      part1 += "Amortization Schedule</strong></big></center>";

      var part2 = "<center><table border=1 cellpadding=2 cellspacing=0><tr><td colspan=6>";
      part2 += "Principal: " + this.fns(v_principal, 2, 1, 1, 1) + "<br>";
      part2 += "Interest Rate: " + this.fns(v_rate, 2, 0, 2, 1) + "<br>";
      part2 += "Payment Interval: " + v_int_text + "<br>";
      part2 += "# of Payments: " + Math.ceil(v_npr) + "<br>";
      part2 += "Payment: " + this.fns(v_payment, 2, 1, 1, 1) + "</td></tr>";
      part2 += "<tr><td colspan=6><center><strong>Schedule of Payments</strong><br>";
      part2 += "<small><small>Please allow for slight rounding differences.";
      part2 += "</small></small></center></td></tr>";
      part2 += "<tr bgcolor='silver'><td align='center'><strong>Pmt #</strong>";
      part2 += "</td>";
      part2 += "<td align='center'><strong>Date</strong></td>";
      part2 += "<td align='center'><strong>Payment</strong></td>";
      part2 += "<td align='center'><strong>Principal</strong></td>";
      part2 += "<td align='center'><strong>Interest</strong></td>";
      part2 += "<td align='center'><strong>Balance</strong></td></tr>";

      var part3 = ("" + v_pmt_row + "");

      var part4 = "<tr><td><small><strong>Grand Total</strong></small></td><td> </td>";
      part4 += "<td align=right></td>";
      part4 += "<td align=right><small><strong>$" + this.fns(v_accum_prin, 2, 1, 0, 0) + "</strong>";
      part4 += "</small></td><td align=right>";
      part4 += "<small><strong>$" + this.fns(v_accum_int, 2, 1, 0, 0) + "</strong></small>";
      part4 += "</td><td> </td></tr></table><br><center>";
      part4 += "<form method='post'><input type='button' value='Close Window' onClick='window.close()'></form>";
      part4 += "</center></body></html>";

      var schedule = (part1 + "" + part2 + "" + part3 + part4 + "");
      // var reportWin: any = window.open("", "", "width=800,height=600,toolbar=yes,menubar=yes,scrollbars=yes");
      // reportWin.(<any>window).document.write(schedule);
      // reportWin.(<any>window).document.close();
    }
  }

  public computePrice(form: any) {
    var Vprincipal = this.sn((<any>window).document.calc.principal.value);
    var Vdown = this.sn((<any>window).document.calc.down.value);
    var Vdt = (<any>window).document.calc.dt.options[(<any>window).document.calc.dt.selectedIndex].value;
    var Vsalestax = this.sn((<any>window).document.calc.salestax.value) / 100;

    if (Vprincipal == 0 || Vprincipal == "") {
      var Vprincipal = this.sn((<any>window).document.calc.price.value);
    }


    if (Vdt == 1) {
      var Vprice = Number(Vprincipal) + Number(Vdown);
      (<any>window).document.calc.price.value = Number(Vprice);
    } else {
      var Vprice = Number(Vprincipal) * 100 / (100 - Number(Vdown));
      (<any>window).document.calc.price.value = Number(Vprice);
    }
  }

  public figForm(form: any) {
    var Vprice = this.sn((<any>window).document.calc.price.value);
    var Vdown = this.sn((<any>window).document.calc.down.value);

    if (Vprice == 0 || Vprice == "") {
      var Vprice = this.sn((<any>window).document.calc.principal.value) + Vdown;
      (<any>window).document.calc.price.value = Number(Vprice);
    }

    var Vdt = (<any>window).document.calc.dt.options[(<any>window).document.calc.dt.selectedIndex].value;

    var Vsalestax = Number(Vprice) * this.sn((<any>window).document.calc.salestax.value) * 0.01;
    var Vfst = (<any>window).document.calc.fst.options[(<any>window).document.calc.fst.selectedIndex].value;

    var Vloanfees = this.sn((<any>window).document.calc.loanfees.value);
    var Vfaf = (<any>window).document.calc.faf.options[(<any>window).document.calc.faf.selectedIndex].value;

    var Vtradein = this.sn((<any>window).document.calc.tradein.value);

    if (Vdt == 1) {
      var Vprincipal = Number(Vprice) - Number(Vtradein) + (Number(Vfst) * Number(Vsalestax)) + (Number(Vfaf) * Number(Vloanfees)) - Number(Vdown);
      (<any>window).document.calc.principal.value = Number(Vprincipal);
    } else {
      var Vdownpay = Number(Vprice) * Number(Vdown) * 0.01;
      var Vprincipal = Number(Vprice) - Number(Vtradein) + (Number(Vfst) * Number(Vsalestax)) + (Number(Vfaf) * Number(Vloanfees)) - Number(Vdownpay);
      (<any>window).document.calc.principal.value = Number(Vprincipal);
    }

  }

  public computeForm(form: any) {
    var Vprincipal = this.sn((<any>window).document.calc.principal.value);
    var Vloanfees = this.sn((<any>window).document.calc.loanfees.value);
    var Vfaf = (<any>window).document.calc.faf.options[(<any>window).document.calc.faf.selectedIndex].value;
    var Vsalestax = this.sn((<any>window).document.calc.salestax.value) / 100;
    var Vprice = this.sn((<any>window).document.calc.price.value);
    if (Vprice == 0 || Vprice == "") {
      var Vsalestaxamount = Number(Vsalestax) * Number(Vprincipal);
    } else {
      var Vsalestaxamount = Number(Vsalestax) * Number(Vprice);
    }

    var Vfst = (<any>window).document.calc.fst.options[(<any>window).document.calc.fst.selectedIndex].value;
    var i = this.sn((<any>window).document.calc.interest_rate.value);
    var Vnum_years = this.sn((<any>window).document.calc.num_years.value);
    var Vppy = this.sn((<any>window).document.calc.ppy.value);
    var Vloantermtype = (<any>window).document.calc.loantermtype.options[(<any>window).document.calc.loantermtype.selectedIndex].value;
    var Vtradein = this.sn((<any>window).document.calc.tradein.value);
    var Vdown = this.sn((<any>window).document.calc.down.value);
    var Vdt = (<any>window).document.calc.dt.options[(<any>window).document.calc.dt.selectedIndex].value;
    if (Vdt == 1) {
      var Vdownpay = Number(Vdown);
    } else {
      var Vdownpay = Number(Vprice) * Number(Vdown) * 0.01;
    }

    if (Vprincipal == 0) {
    } else
      if (Vnum_years == 0) {
      } else
        if (Vppy == 0) {
        } else {

          if (Vppy == 12) {
            var Vpaymenttype = "Monthly";
          }
          else if (Vppy == 365) {
            var Vpaymenttype = "Daily";
          }
          else if (Vppy == 52) {
            var Vpaymenttype = "Weekly";
          }
          else if (Vppy == 26) {
            var Vpaymenttype = "Bi-weekly";
          }
          else if (Vppy == 24) {
            var Vpaymenttype = "Semi-monthly";
          }
          else if (Vppy == 6) {
            var Vpaymenttype = "Bi-monthly";
          }
          else if (Vppy == 4) {
            var Vpaymenttype = "Quarterly";
          }
          else if (Vppy == 2) {
            var Vpaymenttype = "Semi-annual";
          }
          else if (Vppy == 1) {
            var Vpaymenttype = "Annual";
          }
          else {
            var Vpaymenttype = "";
          }

          i = i / 100.0;
          var num_pmts = Vnum_years * Vppy / Vloantermtype;
          num_pmts = Math.round(num_pmts)
          if (num_pmts == 0) { num_pmts = 1; }
          i /= Vppy;

          (<any>window).document.calc.numberofpayments.value = num_pmts;

          if (i == 0 || i == "") {
            (<any>window).document.calc.paymentio.value = this.fns(0, 2, 1, 1, 1);
            var Vpayment = (Vprincipal / (Vppy * Vnum_years / Vloantermtype));
            (<any>window).document.calc.payment.value = this.fns(Vpayment, 2, 1, 1, 1);
            (<any>window).document.calc.totalint.value = this.fns(0, 2, 1, 1, 1);
            var Vtotalrepay = Vprincipal;
            (<any>window).document.calc.totalrepay.value = this.fns(Vtotalrepay, 2, 1, 1, 1);
            (<any>window).document.calc.paymentiototal.value = this.fns(0, 2, 1, 1, 1);
            (<any>window).document.calc.totalrepayio.value = this.fns(Vtotalrepay, 2, 1, 1, 1);

          } else {
            var Vpaymentio = Vprincipal * i;
            (<any>window).document.calc.paymentio.value = this.fns(Vpaymentio, 2, 1, 1, 1);
            var Vpaymentiototal = Vpaymentio * Vppy * Vnum_years / Vloantermtype;
            (<any>window).document.calc.paymentiototal.value = this.fns(Vpaymentiototal, 2, 1, 1, 1);
            var Vtotalrepayio = Vpaymentiototal + Vprincipal;
            (<any>window).document.calc.totalrepayio.value = this.fns(Vtotalrepayio, 2, 1, 1, 1);

            var pow = 1;
            for (var j = 0; j < num_pmts; j++) {
              pow = pow * (1 + i);
            }
            var Vpayment = (Vprincipal * pow * i) / (pow - 1);
            (<any>window).document.calc.payment.value = this.fns(Vpayment, 2, 1, 1, 1);
            var Vtotalint = Number(Vpayment * num_pmts) - Number(Vprincipal);
            (<any>window).document.calc.totalint.value = this.fns(Vtotalint, 2, 1, 1, 1);
            var Vtotalrepay: any = Number(Vprincipal) + Number(Vtotalint);
            (<any>window).document.calc.totalrepay.value = this.fns(Vtotalrepay, 2, 1, 1, 1);
          }


          var Vfullcost = Number(Vtotalrepay) + Number(Vtradein) + Number(Vdownpay);
          if (Vfaf == 0) {
            Vfullcost = Number(Vfullcost) + Number(Vloanfees);
          }
          if (Vfst == 0) {
            Vfullcost = Number(Vfullcost) + Number(Vsalestaxamount);
          }
          (<any>window).document.calc.fullcost.value = this.fns(Vfullcost, 2, 1, 1, 1);

          var paymenttypeinresults = (<any>window).document.getElementById("whatisyourfrequencykeneth");
          paymenttypeinresults.innerHTML = "<font color='#86B854'><strong>" + Vpaymenttype + "</strong></font>";

        }
  }

  public shareMe(form: any) {
    var Vprincipal = this.sn((<any>window).document.calc.principal.value);
    var i = this.sn((<any>window).document.calc.interest_rate.value);
    var Vterm = this.sn((<any>window).document.calc.num_years.value);
    var Vtermtype = (<any>window).document.calc.loantermtype.options[(<any>window).document.calc.loantermtype.selectedIndex].value;
    var Vfreq = this.sn((<any>window).document.calc.ppy.value);
    var Vprice = this.sn((<any>window).document.calc.price.value);
    var Vdown = this.sn((<any>window).document.calc.down.value);
    var Vdt = (<any>window).document.calc.dt.options[(<any>window).document.calc.dt.selectedIndex].value;
    var Vsalestax = this.sn((<any>window).document.calc.salestax.value);
    var Vfst = (<any>window).document.calc.fst.options[(<any>window).document.calc.fst.selectedIndex].value;
    var Vloanfees = this.sn((<any>window).document.calc.loanfees.value);
    var Vfaf = (<any>window).document.calc.faf.options[(<any>window).document.calc.faf.selectedIndex].value;
    var Vtradein = this.sn((<any>window).document.calc.tradein.value);
    var Vyear = Number((<any>window).document.calc.loanyear.value);
    var Vday = Number((<any>window).document.calc.loanday.value);
    var Vmonth = Number((<any>window).document.calc.loanmonth.selectedIndex);

    var sharemeresults = (<any>window).document.getElementById("sharemeplease");
    sharemeresults.innerHTML = " <div style='border: 3px dashed #86B854 ; margin: 0pt 0pt 20px; border-radius: 15px; padding: 15px; width: 90%; background-color:#F5F5F5; text-align:center; font-weight:bold; word-break: break-all;'> <h3><img src='https://calculator.me/pic/goal.png' width='24' height='24'> Link to Share Your Calculation</h3> <a rel='nofollow' href='https://calculator.me/loan/a?prin=" + Vprincipal + "&ir=" + i + "&term=" + Vterm + "&termtype=" + Vtermtype + "&freq=" + Vfreq + "&pp=" + Vprice + "&dp=" + Vdown + "&dptype=" + Vdt + "&tradein=" + Vtradein + "&stax=" + Vsalestax + "&fstax=" + Vfst + "&appfee=" + Vloanfees + "&fappfee=" + Vfaf + "&od=" + Vday + "&om=" + Vmonth + "&oy=" + Vyear + "'>https://calculator.me/loan/a?prin=" + Vprincipal + "&ir=" + i + "&term=" + Vterm + "&termtype=" + Vtermtype + "&freq=" + Vfreq + "&pp=" + Vprice + "&dp=" + Vdown + "&dptype=" + Vdt + "&tradein=" + Vtradein + "&stax=" + Vsalestax + "&fstax=" + Vfst + "&appfee=" + Vloanfees + "&fappfee=" + Vfaf + "&od=" + Vday + "&om=" + Vmonth + "&oy=" + Vyear + "</a></div>";
  }

  public changefreq(form: any) {

    var Vloantermtype = (<any>window).document.calc.loantermtype.options[(<any>window).document.calc.loantermtype.selectedIndex].value;
    if (Vloantermtype > 1) {
      (<any>window).document.calc.ppy.value = Vloantermtype;
      (<any>window).document.calc.querySelector('#ppytype [value="' + Vloantermtype + '"]').selected = true;
    } else {
      (<any>window).document.calc.ppy.value = 12;
      (<any>window).document.calc.querySelector('#ppytype [value="12"]').selected = true;
      //      (<any>window).document.calc.getElementById('ppytype').value = 12;
    }
  }

  public changefreq2(form: any) {
    var Vppytype = (<any>window).document.calc.ppytype.options[(<any>window).document.calc.ppytype.selectedIndex].value;
    (<any>window).document.calc.ppy.value = Vppytype;
  }

  public clear_results(form: any) {

    (<any>window).document.calc.paymentio.value = "";
    (<any>window).document.calc.paymentiototal.value = "";
    (<any>window).document.calc.totalrepayio.value = "";
    (<any>window).document.calc.payment.value = "";
    (<any>window).document.calc.totalint.value = "";
    (<any>window).document.calc.totalrepay.value = "";
    (<any>window).document.calc.numberofpayments.value = "";
    var vwhatisyourfrequencykeneth = (<any>window).document.getElementById("whatisyourfrequencykeneth");
    vwhatisyourfrequencykeneth.innerHTML = " ";
    var vinlineamortinsert = (<any>window).document.getElementById("inlineamortinsert");
    vinlineamortinsert.innerHTML = " ";
    var sharemeresults = (<any>window).document.getElementById("sharemeplease");
    sharemeresults.innerHTML = " ";

  }

}
