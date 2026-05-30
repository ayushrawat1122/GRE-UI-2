import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
 private http = inject(HttpClient);
  private apiUrl: string = environment.baseUrl;


   private addProductUrl: string = 'Product/CreateProduct';
   private updateProductUrl: string = 'Product/UpdateProduct';
   private getProductByIdUrl: string = 'Product/GetProductById';
  constructor() { }

  addProduct(productObject:any){
    return this.http.post<any>(`${this.apiUrl + this.addProductUrl}`,productObject);
  }
  updateProduct(productObject:any){
    return this.http.post<any>(`${this.apiUrl + this.updateProductUrl}`,productObject);
  }
  getProductById(productId: number) {
    return this.http.post<any>(`${this.apiUrl + this.getProductByIdUrl}`,productId);
  }
}
