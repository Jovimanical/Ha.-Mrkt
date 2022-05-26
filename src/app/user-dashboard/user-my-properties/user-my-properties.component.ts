import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'angular4-events';
import { StoreService } from 'app/shared/services/store.service';

@Component({
  selector: 'app-user-my-properties',
  templateUrl: './user-my-properties.component.html',
  styleUrls: ['./user-my-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMyPropertiesComponent implements OnInit {
  public PageName = "My Properties"
  public myProperties: Array<any> = [];
  public isLoading: boolean = true;
  constructor(
    private storeService: StoreService,
    public changeDectection: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventsService,
  ) { }

  ngOnInit(): void {
    this.storeService.fetchUserListing().subscribe((response: any) => {
      // console.log('response.data.records', response.data.records);
      if (response.data.records instanceof Array && response.data.records.length > 0) {
        // save to loal store
        response.data.records.forEach((element: any) => {
          // this.subtotal += element.PropertyAmount ? parseFloat(element.PropertyAmount) : 0;
          if (element?.PropertyJson) {
            element.PropertyJson = JSON.parse(element.PropertyJson);
          }

          this.myProperties.push(element);
        });
      } else {
        this.myProperties = [];
      }
      this.isLoading = false;
      this.changeDectection.detectChanges();

    }, (error) => {
      this.isLoading = false;
      this.changeDectection.detectChanges();
    });
  }

  async callToAction(params: any) {
    const { value: choice } = await Swal.fire({
      icon: 'info',
      title: 'What Would you want to do with your property?',
      input: 'radio',
      inputOptions: {
        'RENT': 'Rent',
        'RESALE': 'Resell',
        'LEASE': 'Lease',
        'TRANSFER': 'Transfer'
      },
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to choose an action or click CANCEL!'
        }
      }
    })

    if (choice) {
      Swal.fire({
        title: 'Do you want to proceed?',
        html: `You selected: ${choice}`,       
        showCancelButton: true,
        confirmButtonText: 'Yes Proceed',
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          // console.log('${choice}', choice, params)
          // Swal.fire('Saved!', '', 'success')

          switch (choice) {
            case 'TRANSFER':
              this.router.navigate([`/user-dashboard/user-transfer-property/${params.PropertyId}`]);
              setTimeout(() => {
                this.eventService.publish("TRANSFER:PROPERTY", params);
              }, 1000);

              break;
            case 'LEASE':

              this.router.navigate([`/user-dashboard/user-lease-property/${params.PropertyId}`]);
              setTimeout(() => {
                this.eventService.publish("LEASE:PROPERTY", params);
              }, 1000);
              break;
            case 'RESALE':

              this.router.navigate([`/user-dashboard/user-resell-property/${params.PropertyId}`]);
              setTimeout(() => {
                this.eventService.publish("RESALE:PROPERTY", params);
              }, 1000);
              break;

            default:

              this.router.navigate([`/user-dashboard/user-rent-property/${params.PropertyId}`]);
              setTimeout(() => {
                this.eventService.publish("RENT:PROPERTY", params);
              }, 500);
              break;
          }
        } else if (result.isDenied) {
          Swal.fire('Request was canceled', '', 'info')
        }
      })
    }

  }

}
