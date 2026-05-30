import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserPromoCartItem } from '../../../Core/common/CommonModels/ProductModel';

@Injectable({
  providedIn: 'root'
})
export class PromoProductsService {

  private http = inject(HttpClient);

  private apiUrl: string = environment.baseUrl;
  private getAllProductsUrl: string = 'Product/GetAllProducts';
  private addOrGetCartItemsUrl: string = 'Order/AddOrGetPromoCartItems';
  private getPromoCartItemsUrl: string = 'Order/GetPromoCartItems';
  private orderPromoProductUrl: string = 'Order/OrderPromoProducts';

  private getOrderHistoryUrl: string = 'Order/OrderHistory';
  private checkPromoInventoryUrl: string = 'Order/CheckPromoInventory';

  private getPromoOrderHistoryUrl: string = 'Order/PromoOrderHistory';

  constructor() { }

  getAllProducts(filterModel: any) {
    return this.http.post<any>(`${this.apiUrl + this.getAllProductsUrl}`, filterModel);
  }
 
addOrGetPromoCartItems(cartItems: UserPromoCartItem[]) {
    return this.http.post(`${this.apiUrl + this.addOrGetCartItemsUrl}`, cartItems);
  }

   getPromoCartItems(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + this.getPromoCartItemsUrl}`);
  }

  orderPromoProducts(addressId:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.orderPromoProductUrl}`,addressId);
  }

  getPromoOrderHistory(filterModel:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.getPromoOrderHistoryUrl}`, filterModel);
  }

  checkPromoInventory(checkPromoInventoryObj:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.checkPromoInventoryUrl}`,checkPromoInventoryObj);
  }
    
}
