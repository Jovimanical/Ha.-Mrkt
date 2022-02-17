import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import EventService from "eventservice";

@Component({
  selector: 'app-product-block-listing',
  templateUrl: './product-block-listing.component.html',
  styleUrls: ['./product-block-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductBlockListingComponent implements OnInit {
  public propertView: any = {}
  public showView: boolean = true;
  public totalRooms: number = 0;
  constructor(public changeDectection: ChangeDetectorRef,) { }

  ngOnInit(): void {
    // subscribe to event with name "SomeEventName"
    EventService.on("ShowProperty", async (data: any) => {
      if (data instanceof Object && Object.keys(data).length !== 0) {
        // console.log('ShowProperty', data);
        this.propertView = data
        this.totalRooms = this.propertView.property_bathroom_count + this.propertView.property_bedroom_count + this.propertView.property_sittingroom_count
        this.showProps();
      }
    });
  }

  public showProps() {
    setTimeout(() => {
      this.showView = false;
      this.changeDectection.detectChanges()
      console.log('this.propertView', this.propertView, this.showView);

    }, 1000);
  }

}
