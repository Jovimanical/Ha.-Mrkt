import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-generic-image-loading-component',
  templateUrl: './generic-image-loading-component.component.html',
  styleUrls: ['./generic-image-loading-component.component.css']
})
export class GenericImageLoadingComponentComponent {
  @Input() imageLoading: boolean = false;
  @Input() imageLoaded: boolean = false;
  @Input() imageUrl: string = '';
  @Input() imageLoadingUrl: string = '';
  @Input() noImageUrl: string = '';
  @Input() alt: string = '';
  @Input() imageId: string = '';
  @Input() imageHeight: string = '';
  @Input() imageWidth: string = '';
  @Input() imageClass: string = '';

  onImageLoaded() {
    this.imageLoading = false;
  }

  handleEmptyImage() {
    this.imageLoading = false;
    this.imageUrl = this.noImageUrl;
  }
}
