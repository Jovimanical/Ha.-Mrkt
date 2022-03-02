import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { AddToCart } from '../models/addToCart.model';
import { Cart } from '../models/cart.model';
import { Checkout } from '../models/checkout.model';

@Injectable()
export class StoreService {

  constructor(private http: HttpClient) { }

  public listAllEstate(): Observable<Array<any>> {
    // return this.http.get<Array<Product>>(`${environment.API_URL}/marketplace/properties/1/30`);
    return this.http.get<Array<any>>(`https://rest.sytemap.com/v1/properties/user-property/list-all-properties?resourceId=1&offset=0&limit=10`);

  }


  public fetchEstateBlockAsPromise(estateNo: any): Promise<any> {
    return this.http
      .get(`https://rest.sytemap.com/v1/properties/user-property/view-property-children?resourceId=${estateNo}&floorLevel=0`)
      .toPromise();
  }


  public fetchBlockUnitsAsPromise(blockNo: any) {
    return this.http
      .get(`https://rest.sytemap.com/v1/properties/user-property/view-property-children?resourceId=${blockNo}&floorLevel=0`)
      .toPromise();
  }

  public fetchSingleUnitsAsPromise(UnitNo: any): Promise<any> {
    var formdata = new FormData();
    formdata.append("resourceId", UnitNo);
    return this.http
      .post(`https://rest.sytemap.com/v1/properties/user-property/view-property-metadata`, formdata)
      .toPromise();
  }



  public getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.API_URL}/marketplace/properties/${id}`);
  }

  public addToCart(addToCart: any) {
    return this.http.post(`${environment.API_URL}/shopping-cart/add/`, addToCart);
  }

  public addToBookmark(addBookmark: any) {
    return this.http.post(`${environment.API_URL}/wishlists/add/`, addBookmark);
  }

  public addToListing(listing: any):Promise<any>{
    return this.http.post(`${environment.API_URL}/estate-listings/add/`, listing).toPromise();
  }

  public fetchCart() {
    return this.http.get<Cart>(`${environment.API_URL}/shopping-cart/list/1/30`);
  }

  public fetchBookmarks() {
    return this.http.get<Cart>(`${environment.API_URL}/wishlists/list/1/30`);
  }


  public removeFromBookMark(id: number): Observable<Cart> {
    return this.http.delete<Cart>(`${environment.API_URL}/wishlists/remove/${id}`);
  }

  public clearCompletedCart() :Promise<any>{
    return this.http.get<any>(`${environment.API_URL}/shopping-cart/last-completed`).toPromise();
  }

  public removeFromCart(id: number): Observable<Cart> {
    return this.http.delete<Cart>(`${environment.API_URL}/shopping-cart/remove/${id}`);
  }

  public checkout(checkout: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/orders/add/`, checkout).toPromise();
  }


  public addKYCPersonalInfo(personalInfo: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/kyc-personal-info/add/`, personalInfo)
      .toPromise();
  }

  public addKYCEmploymentStatus(employerStatus: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/kyc-employment-status/add/`, employerStatus)
      .toPromise();
  }


  public getUserKYCPersonalInfo(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/kyc-personal-info/list/1/30`);
  }

  public getUserKYCEmploymentStatus(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/kyc-employment-status/list/1/30`);
  }

  public getUserKYCRequiredDocs(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/kyc-documents/list/1/30`);
  }



}
