import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from 'app/shared/models/product.model';
import { StoreService } from 'app/shared/services/store.service';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  public spinnerStyle = Spinkit;
  public productRows: Product[][] = [];
  public propertyListing: Array<any> = [];

  constructor(private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute) {
    this.propertyListing = []
  }

  ngOnInit() {
    this.storeService.getProducts()
      .subscribe((result: any) => {
        if (result.data instanceof Array && result.data.length > 0) {
          this.propertyListing = result.data;
          this.createProductRows();
        }
      });
  }

  public openProductDetail(id: number) {
    this.router.navigate(['products', id], { relativeTo: this.route });
  }

  /**
   * Create an array of arrays, where each inner array contains three products
   */
  private createProductRows(): void {
    const rowSize = 3;
    const numGroups = Math.ceil(this.propertyListing.length / rowSize);
    for (let i = 0; i < numGroups; i++) {
      const currentIndex = i * rowSize;
      const remainder = this.propertyListing.slice(currentIndex).length;
      const take = remainder > rowSize ? rowSize : remainder;
      const group = this.propertyListing.slice(currentIndex, currentIndex + take);
      this.productRows[i] = [...group];
    }
  }

  /**
   * Generate a list of numbers from 0 to count - 1
   * @param {number} count - The number of indexes to generate.
   * @returns An array of numbers.
   */
  public generateFake(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }
}
