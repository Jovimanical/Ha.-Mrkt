import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order } from './order.model';
import { environment } from 'environments/environment';

@Injectable()
export class OrdersService {

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.API_URL}/orders/list/1/30`);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${environment.API_URL}/orders/${id}`);
  }

  cancelOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL}/orders/cancel/${id}`);
  }
}
