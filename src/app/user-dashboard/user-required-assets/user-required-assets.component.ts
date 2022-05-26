import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { StoreService } from 'app/shared/services/store.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-user-required-assets',
  templateUrl: './user-required-assets.component.html',
  styleUrls: ['./user-required-assets.component.scss']
})
export class UserRequiredAssetsComponent implements OnInit {
  public customerAssetForm: FormGroup;
  public existingCustomerAsset: Array<any> = [];
  public hasExistingCustomerAsset: boolean = false;
  public isLoading: boolean = true;
  constructor(
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.storeService.getKYCUserAssets().subscribe((results: any) => {
      if (results.data !== null) {
        this.existingCustomerAsset = results.data.records;
        this.hasExistingCustomerAsset = true;
        this.processExistingAssets(results.data.records)
      } else {
        this.processExistingAssets([])
      }
      this.isLoading = false
    }, (error) => {
      console.log('Error', error)
      this.isLoading = false
    });
  }


  public processExistingAssets(existingCustomerAsset: any) {
    this.customerAssetForm = this.formBuilder.group({
      assetname: 'ADD_NEW_OR_UPDATE_ASSETS_LIST',
      customerAssets: this.formBuilder.array([]),
    });


    // checks if existingCustomerAsset is an array

    if (existingCustomerAsset instanceof Array && existingCustomerAsset.length > 0) {
      existingCustomerAsset.forEach((assetParam: any) => {
        this.customerAssets().push(this.existingAssets(assetParam));
      });
    } else {
      this.addAssets();
    }

  }

  public customerAssets(): FormArray {
    return this.customerAssetForm.get("customerAssets") as FormArray;
  }

  public newAssets(): FormGroup {
    return this.formBuilder.group({
      id: [0, Validators.required],
      assetType: ['', Validators.required],
      description: ['', Validators.required],
      value: ['', Validators.required]
    })
  }

  public existingAssets(assets: any): FormGroup {
    return this.formBuilder.group({
      id: [assets.id, Validators.required],
      assetType: [assets.assetType, Validators.required],
      description: [assets.description, Validators.required],
      value: [assets.value, Validators.required],
      createdAt: [assets.createdAt]
    })
  }

  public addAssets() {
    this.customerAssets().push(this.newAssets());
  }

  public removeAssets(i: number, param: any) {
    if (param.value.id !== 0) {
      this.storeService.removeFromUserAsset(param.value.id).subscribe((assetRemoved) => {
        console.log('assetRemoved', assetRemoved)
        this.customerAssets().removeAt(i);
      })
    } else {
      this.customerAssets().removeAt(i);
    }
    
  }

  async onSubmitAssets() {
    // console.log(this.customerAssetForm.value);
    try {
      if (this.customerAssetForm.valid) {
        // console.log('this.model', this.model);
        // console.log('this.form', this.form);
        const addUpdateAssets: any = await this.storeService.updateKYCUserAssets(JSON.stringify(this.customerAssetForm.value));
        if (addUpdateAssets instanceof Object && addUpdateAssets.status === 'success') {
          this.router.navigate([`/user-dashboard/user-required-liability/`]);
        }

      }
    } catch (error) {
      console.log('submit', error)
    }
  }

  public goToNextStep() {
    this.router.navigate([`/user-dashboard/user-required-liability/`]);
  }


}

