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

  getProducts(): Observable<Array<Product>> {
    return this.http.get<Array<Product>>(`${environment.API_URL}/marketplace/properties/1/30`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.API_URL}/marketplace/properties/${id}`);
  }

  addToCart(addToCart: AddToCart) {
    return this.http.put(`${environment.API_URL}/shopping-cart/add`, addToCart);
  }

  fetchCart() {
    return this.http.get<Cart>(`${environment.API_URL}/shopping-cart/list/1/30`);
  }

  getLastCompletedCart() {
    return this.http.get<Cart>(`${environment.API_URL}/shopping-cart/last-completed`);
  }

  removeFromCart(id: number): Observable<Cart> {
    return this.http.delete<Cart>(`${environment.API_URL}/shopping-cart/remove` + id);
  }

  checkout(checkout: Checkout): Observable<void> {
    return this.http.post<void>(`${environment.API_URL}/shopping-cart/checkout`, checkout);
  }
}
