import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { StoreService } from 'app/shared/services/store.service';
import { EventsService } from 'angular4-events';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-resell-property',
  templateUrl: './user-resell-property.component.html',
  styleUrls: ['./user-resell-property.component.scss']
})
export class UserResellPropertyComponent implements OnInit, OnDestroy {
  public customerAssetForm: FormGroup;
  public hasExistingCustomerAsset: boolean = false;
  public isLoading: boolean = true;
  public propertyInfo: any;
  public propertyActionSub: any;

  constructor(
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private eventService: EventsService,
  ) { }

  ngOnInit(): void {
    this.propertyActionSub = this.eventService.subscribe("RESALE:PROPERTY", async (data: any) => {
      if (data instanceof Object && Object.keys(data).length !== 0) {
        this.propertyInfo = data
      }
    });

    this.storeService.getKYCUserAssets().subscribe((results: any) => {
      if (results.data !== null) {
        //  results.data.records
        this.processExistingAssets()
      } else {
        this.processExistingAssets()
      }
      this.isLoading = false
    }, (error) => {
      console.log('Error', error)
      this.isLoading = false
    });
  }

  ngOnDestroy(): void {
    this.propertyActionSub.unsubscribe();
  }



  public processExistingAssets() {
    this.customerAssetForm = this.formBuilder.group({
      id: [this.propertyInfo?.id ? this.propertyInfo.id : 0, Validators.required],
      currentPrice: [this.propertyInfo?.PropertyAmount ? this.propertyInfo?.PropertyAmount : 0, Validators.required],
      newPriceOrValue: ['', Validators.required],
    });
  }

  get f() {
    return this.customerAssetForm.controls;
  }


  async onSubmitAssets() {
    // console.log(this.customerAssetForm.value);
    try {
      if (this.customerAssetForm.valid) {
        // console.log('this.model', this.model);
        // console.log('this.form', this.form);
        // const addUpdateAssets: any = await this.storeService.updateKYCUserAssets(JSON.stringify(this.customerAssetForm.value));
        // if (addUpdateAssets instanceof Object && addUpdateAssets.status === 'success') {
        //   this.router.navigate([`/user-dashboard/user-properties/`]);
        // }

        this.router.navigate([`/user-dashboard/user-properties/`]);

      }
    } catch (error) {
      console.log('submit', error)
    }
  }

  public goToNextStep() {
    this.customerAssetForm.reset()
    this.router.navigate([`/user-dashboard/user-properties/`]);
  }


}
