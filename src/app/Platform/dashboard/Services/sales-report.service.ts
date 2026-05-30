import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesReportService {
  private http = inject(HttpClient);

  private apiUrl: string = environment.baseUrl;

  private getProductSalesReportUrl: string = 'SalesReports/GetProductSalesReport';
  private getActiveTerritoriesUrl: string = 'Store/GetAllTerritoriesByActive';
  private getActiveStoreUrl: string = 'Store/GetAllActiveStores';
  private getActiveProductsUrl: string = 'Product/GetAllActiveSalesProducts';

  

  constructor() { }

  getSalesReport(filterModel:any) {
    return this.http.post<any>(`${this.apiUrl + this.getProductSalesReportUrl}`, filterModel);
  }
  getActiveTerritories(searchTerm:any) {
    return this.http.get<any>(`${this.apiUrl + this.getActiveTerritoriesUrl}?searchTerritoryTerm=${searchTerm}`);
  }
  getActiveStores(searchTerm:any) {
    return this.http.get<any>(`${this.apiUrl + this.getActiveStoreUrl}?searchTerm=${searchTerm}`);
  }
  getActiveProducts(searchTerm:any) {
    return this.http.get<any>(`${this.apiUrl + this.getActiveProductsUrl}?searchTerm=${searchTerm}`);
  }
}
