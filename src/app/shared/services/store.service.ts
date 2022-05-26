import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { AddToCart } from '../models/addToCart.model';
import { Checkout } from '../models/checkout.model';
import { Cart } from '../models/cart.model';


@Injectable()
export class StoreService {

  constructor(private http: HttpClient) { }

  public listAllEstate(pageOffset: any = 1, pageLimit: any = 20): Observable<Array<any>> {
    return this.http.get<Array<any>>(`https://rest.sytemap.com/v1/properties/user-property/list-all-properties?resourceId=1&offset=${pageOffset}&limit=${pageLimit}`);
  }


  public fetchEstateBlockAsPromise(estateNo: any): Promise<any> {
    return this.http
      .get(`https://rest.sytemap.com/v1/properties/user-property/view-property-children?resourceId=${estateNo}&propertyType=estate&floorLevel=0`)
      .toPromise();
  }


  public fetchBlockUnitsAsPromise(blockNo: any) {
    return this.http
      .get(`https://rest.sytemap.com/v1/properties/user-property/view-property-children?resourceId=${blockNo}&propertyType=block&floorLevel=0`)
      .toPromise();
  }

  public fetchSingleUnitsAsPromise(UnitNo: any): Promise<any> {
    let formdata = new FormData();
    formdata.append("resourceId", UnitNo);
    formdata.append("propertyType", "unit");

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

  public addToListing(listing: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/estate-listings/add/`, listing).toPromise();
  }

  public fetchCart() {
    return this.http.get<Cart>(`${environment.API_URL}/shopping-cart/list/1/30`);
  }

  public fetchUserListing() {
    return this.http.get<any>(`${environment.API_URL}/estate-listings/user-listings/list/1/30`);
  }

  public fetchCartItem(cartItem: any) {
    return this.http.get<Cart>(`${environment.API_URL}/shopping-cart/show/${cartItem}`);
  }

  public fetchBookmarks() {
    return this.http.get<Cart>(`${environment.API_URL}/wishlists/list/1/30`);
  }


  public removeFromBookMark(id: number): Observable<Cart> {
    return this.http.delete<Cart>(`${environment.API_URL}/wishlists/remove/${id}`);
  }

  public clearCompletedCart(): Promise<any> {
    return this.http.get<any>(`${environment.API_URL}/shopping-cart/last-completed`).toPromise();
  }

  public removeFromCart(id: number): Observable<Cart> {
    return this.http.delete<Cart>(`${environment.API_URL}/shopping-cart/remove/${id}`);
  }

  public updateCartItem(propertyItem: any): Observable<Cart> {
    return this.http.put<any>(`${environment.API_URL}/shopping-cart/update/`, propertyItem);
  }

  public checkout(checkout: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/orders/add/`, checkout).toPromise();
  }

  public addTransactionHistory(transaction: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/transactions/add/`, transaction).toPromise();
  }


  public addKYCPersonalInfo(personalInfo: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/kyc-personal-info/add/`, personalInfo)
      .toPromise();
  }

  public updateKYCPersonalInfo(personalInfo: any): Promise<any> {
    return this.http.put(`${environment.API_URL}/kyc-personal-info/update/`, personalInfo)
      .toPromise();
  }

  public addKYCEmploymentStatus(employerStatus: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/kyc-employment-status/add/`, employerStatus)
      .toPromise();
  }

  public updateKYCEmploymentStatus(employerStatus: any): Promise<any> {
    return this.http.put(`${environment.API_URL}/kyc-employment-status/update/`, employerStatus)
      .toPromise();
  }

  public addKYCUserAssets(Assets: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/kyc-customer-assets/add/`, Assets)
      .toPromise();
  }

  public updateKYCUserAssets(Assets: any): Promise<any> {
    return this.http.put(`${environment.API_URL}/kyc-customer-assets/update/`, Assets)
      .toPromise();
  }

  public addKYCUserLiability(Liability: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/kyc-customer-liabilities/add/`, Liability)
      .toPromise();
  }

  public updateKYCUserLiability(Liability: any): Promise<any> {
    return this.http.put(`${environment.API_URL}/kyc-customer-liabilities/update/`, Liability)
      .toPromise();
  }

  public addKYCUserExtraIncome(ExtraIncome: any): Promise<any> {
    return this.http.post(`${environment.API_URL}/kyc-customer-other-income/add/`, ExtraIncome)
      .toPromise();
  }

  public updateKYCUserExtraIncome(ExtraIncome: any): Promise<any> {
    return this.http.put(`${environment.API_URL}/kyc-customer-other-income/update/`, ExtraIncome)
      .toPromise();
  }

  public getUserKYCPersonalInfo(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/kyc-personal-info/list/1/30`).pipe(catchError(error => of(error)));
  }

  public getUserKYCEmploymentStatus(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/kyc-employment-status/list/1/30`).pipe(catchError(error => of(error)));
  }

  public getUserKYCRequiredDocs(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/kyc-documents/list/1/30`).pipe(catchError(error => of(error)));
  }

  public getKYCUserAssets(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/kyc-customer-assets/list/1/30`).pipe(catchError(error => of(error)));
  }

  public removeFromUserAsset(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/kyc-customer-assets/remove/${id}`);
  }


  public getUserLiability(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/kyc-customer-liabilities/list/1/30`).pipe(catchError(error => of(error)));
  }

  public removeFromUserLiability(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/kyc-customer-liabilities/remove/${id}`);
  }


  public getUserExtraIncome(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/kyc-customer-other-income/list/1/30`).pipe(catchError(error => of(error)));
  }

  public removeFromUserExtraIncome(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/kyc-customer-other-income/remove/${id}`);
  }




}
