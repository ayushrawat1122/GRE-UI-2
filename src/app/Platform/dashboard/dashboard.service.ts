import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserCartItem } from '../../Core/common/CommonModels/ProductModel';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  private apiUrl: string = environment.baseUrl;

  private getAllNewsLetterUrl: string = 'Newsletter/GetAllNewsLetters';
  private getFeaturedProductUrl: string = 'Product/GetFeaturedProduct';
  private getCartItemsUrl: string = 'Order/GetCartItems';
  private getAllProductsUrl: string = 'Product/GetAllProducts';
  private getProductDescriptionAndImageUrl: string = 'Product/GetProductDescriptionById';
  private addOrGetCartItemsUrl: string = 'Order/AddOrGetGetCartItems';
  private orderProductUrl: string = 'Order/OrderProducts';
  private deleteProductsUrl: string = 'Product/DeleteProduct';
  private activeOrInActiveProductUrl: string = 'Product/ChangeProductStatus';
  private checkInventoryUrl: string = 'Order/CheckSalesInventory';


  constructor() { }

  getNewLetters(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + this.getAllNewsLetterUrl}`);
  }
 deleteProduct(productId: number) {
    return this.http.put<any>(`${this.apiUrl + this.deleteProductsUrl}`, productId);
  }
  getAllProducts(filterModel: any) {
    return this.http.post<any>(`${this.apiUrl + this.getAllProductsUrl}`, filterModel);
  }
  getProductDescription(productId: any) {
    return this.http.post<any>(`${this.apiUrl + this.getProductDescriptionAndImageUrl}`, productId );
  }
  getFeaturedProduct(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + this.getFeaturedProductUrl}`);
  }
  addOrGetCartItems(cartItems: UserCartItem[]) {
    return this.http.post(`${this.apiUrl + this.addOrGetCartItemsUrl}`, cartItems);
  }
  getCartItems(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl + this.getCartItemsUrl}`);
  }

  orderProducts(billToId: number, shipToId: number): Observable<any> {
    const orderData = {
      BillToAddressId: billToId,
      ShipToAddressId: shipToId
    };
    return this.http.post<any>(`${this.apiUrl + this.orderProductUrl}`, orderData);
  }
  activeOrInActiveProduct(productId:number,isActive:boolean): Observable<any> {
      
    const obj = {
      productId: productId,
      isActive: isActive
    };
    return this.http.post<any>(`${this.apiUrl + this.activeOrInActiveProductUrl}`, obj);
  }
  checkInventory(checkInventoryObj:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.checkInventoryUrl}`,checkInventoryObj);
  }
}
