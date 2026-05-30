import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  private apiUrl: string = environment.baseUrl;

  private getOrderHistoryUrl: string = 'Order/OrderHistory';
  private getOrderStatusUrl: string = 'Order/GetAllOrderStatus';
  private getPromoOrderHistoryDetailUrl: string = 'Order/PromoOrderHistoryDetial';
  private getOrderHistoryDetailUrl: string = 'Order/OrderHistoryDetial';
  private ordersStatusChangeUrl: string = 'Order/ChangeOrderstatus';


  constructor() { }




  getOrderHistory(filterModel:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.getOrderHistoryUrl}`, filterModel);
  }
  getOrderStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + this.getOrderStatusUrl}`);
  }
  getOrderHistoryDetails(orderId:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.getOrderHistoryDetailUrl}`, orderId);
  }
  getPromoOrderHistoryDetails(orderId:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.getPromoOrderHistoryDetailUrl}`, orderId);
  }
  changeOrderStatus(orderStatusObject:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.ordersStatusChangeUrl}`, orderStatusObject);
  }

}
