import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { User } from 'app/core/user/user.model';
import { Order } from 'app/admin-dashboard/orders/order.model';

@Injectable()
export class UserDashboardService {

  constructor(private http: HttpClient) { }

  getUserListing(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/listing/count`)
      .pipe(map(res => res.data));
  }

  getUserReviews(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/product-reviews/count`).pipe(map(res => res.data));
  }

  getUserViews(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/property-views/count`).pipe(map(res => res.data));
  }

  getUserWishlist(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/wishlists/count`).pipe(map(res => res.data));
  }

  getUserActivity(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/wishlists/count`).pipe(map(res => res.data));
  }

  getUserMessages(): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/wishlists/count`).pipe(map(res => res.data));
  }





  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.API_URL}/admin/users`);
  }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/admin/users/${id}`);
  }

  updateUser(model: any): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/admin/users`, model);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.API_URL}/admin/orders`);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${environment.API_URL}/admin/orders/${id}`);
  }

  setOrderToShipped(id: number, trackingLink: string): Observable<Order> {
    return this.http.put<Order>(`${environment.API_URL}/admin/orders/${id}?trackingLink=${trackingLink}`, {});
  }

  removeItemFromOrder(id: number, cartProductId: number): Observable<Order> {
    return this.http.delete<Order>(`${environment.API_URL}/admin/orders/${id}/items?cartProductId=${cartProductId}`);
  }

  cancelOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL}/admin/orders/${id}`);
  }
}
