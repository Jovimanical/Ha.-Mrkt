import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
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
  constructor(private storeService: StoreService, public changeDectection: ChangeDetectorRef,) { }

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

}
