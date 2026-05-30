import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl: string = environment.baseUrl;


  private changeUserNameUrl: string = 'User/ChangeUserName';
  private getStoresUrl: string = 'Store/GetAllStores';
  private changePasswordUrl: string = 'User/ChangeUserPassword';
  private addUserUrl: string = 'User/CreateUser';
  private addStoreUrl: string = 'Store/AddStore';
  private updateStoreUrl: string = 'Store/UpdateStore';
  private updateUserUrl: string = 'User/UpdateUser';
  private getUsersUrl: string = 'User/GetAllUsersOfStore';
  private getUserByEmailUrl: string = 'User/GetUserByEmail';
  private deleteUserUrl: string = 'User/DeleteUser';
  private deleteStoreUrl: string = 'Store/DeleteStore';
  private deleteTerritoryUrl: string = 'Store/DeleteTerritory';
  private createTerritoryUrl: string = 'Store/AddTerritory';
  private updateTerritoryUrl: string = 'Store/UpdateTerritory';
  private activeOrInActiveTerritoryUrl: string = 'Store/ActiveOrInActiveTerritory';
  private activeOrInActiveStoreUrl: string = 'Store/ActiveOrInActiveStore';
  private getTerritoryUrl: string = 'Store/GetAllTerritories';
  private getStoreUrl: string = 'Store/GetAllStores';
  private getTerritoryByIdUrl: string = 'Store/GetTerritoryById?id=';
  private getStoreByIdUrl: string = 'Store/GetStoreById?id=';
  private getAddressesByStoreIdUrl: string = 'Store/GetAddressesByStoreId?id=';
  private deleteAddressByAddressIdUrl: string = 'Store/DeleteAddressById?id=';
  private updateBillToShipToAddressUrl: string = 'Store/UpdateBillToShipToAddress';
  constructor() { }


  changeUserName(user:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.changeUserNameUrl}`,user);
  }

  changePassword(passwordObject:any) : Observable<any>{
        return this.http.post<any>(`${this.apiUrl + this.changePasswordUrl}`,passwordObject);

  }
  addUser(userObject:any) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl + this.addUserUrl}`,userObject);
  }
  updateUser(userObject:any) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl + this.updateUserUrl}`,userObject);
  }

  getAllStore(filterModel:any): Observable<any> {
    
    return this.http.post<any>(`${this.apiUrl + this.getStoreUrl}`, filterModel );
  }

  getAllUser(filterModel:any): Observable<any> {
    
    return this.http.post<any>(`${this.apiUrl + this.getUsersUrl}`,filterModel );
  }

  getUserByEmail(email:string): Observable<any> {
    const emailObject = {
      email: email  
    }
    return this.http.post<any>(`${this.apiUrl + this.getUserByEmailUrl}`, emailObject);
  }
  deleteUser(userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.deleteUserUrl}`,userId);
  }

  createTerritory(territoryObject:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.createTerritoryUrl}`,territoryObject);
  }
  getAllTerritories(filterModel:any): Observable<any> {
    
    return this.http.post<any>(`${this.apiUrl + this.getTerritoryUrl}`,filterModel);
  }
  getAllstores(searchtTerm:any): Observable<any> {
    const filterObject = {
      searchStoreTerm: searchtTerm
    };
    return this.http.post<any>(`${this.apiUrl + this.getTerritoryUrl}`,filterObject);
  }
  getTerritoryById(id:any): Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl + this.getTerritoryByIdUrl + id}`);
  }
  getStoreById(id:any): Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl + this.getStoreByIdUrl + id}`);
  }
  updateTerritory(territoryObject:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.updateTerritoryUrl}`,territoryObject);
  }
  deleteTerritory(territoryId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.deleteTerritoryUrl}`,territoryId);
  } 
  deleteStore(storeId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl + this.deleteStoreUrl}`,storeId);
  } 

  updateTerritoryStatus(territoryId: number, isActive: boolean): Observable<any> {
    const statusObject = {
      territoryId: territoryId,
      isActive: isActive
    };
    return this.http.post<any>(`${this.apiUrl + this.activeOrInActiveTerritoryUrl}`, statusObject);
  }
  updateStoreStatus(storeId: number, isActive: boolean): Observable<any> {
    const statusObject = {
      storeId: storeId,
      isActive: isActive
    };
    return this.http.post<any>(`${this.apiUrl + this.activeOrInActiveStoreUrl}`, statusObject);
  }

   addStore(storeObject:any) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl + this.addStoreUrl}`,storeObject);
  }
   updateStore(storeObject:any) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl + this.updateStoreUrl}`,storeObject);
  }
  getAllAddresses(storeId:any): Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl+ this.getAddressesByStoreIdUrl + storeId}` );
  }
  deleteAddress(addressid:any): Observable<any> {
    
    return this.http.delete<any>(`${this.apiUrl+ this.deleteAddressByAddressIdUrl + addressid}` );
  }
  updateAddressTypeIsBillToIsShipTo(billToShilpToObject:any): Observable<any>{
        return this.http.post<any>(`${this.apiUrl + this.updateBillToShipToAddressUrl}`,billToShilpToObject);

  }
}
