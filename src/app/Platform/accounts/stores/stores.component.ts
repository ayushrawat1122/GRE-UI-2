import { Component, inject } from '@angular/core';
import { ConfirmationModalComponent } from '../../../Core/common/confirmation-modal/confirmation-modal.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../Services/account.service';
import { EncryptionUtil } from '../../../Core/common/CommonMethods/encryptdecrypt';
import { Router } from '@angular/router';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { PaginationComponent } from '../../../Core/common/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Store {
  storeId: number;
  storeName: string;
  territoryId: number;
  territory?: Territory;   // Territory linked to this store
  addressId?: number;
  isActive: boolean;
  isDeleted: boolean;
  dateAdded: string;
  dateLastUpdated: string;
}
export interface Territory {
  territoryId: number;
  territoryName: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  isActive: boolean;
  isDeleted: boolean;
}
export class FilterStore {
  pageNumber: number = 1;
  pageSize: number = 5;
  searchStoreTerm: string = '';

}
@Component({
  selector: 'app-stores',
  imports: [MatTooltipModule,ConfirmationModalComponent, CommonModule, PaginationComponent,FormsModule],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.css'
})
export class StoresComponent {
  selectedStore: any;
  stores: any[] = [];
  searchTerm: string = '';
  filterModel: FilterStore = new FilterStore();
  totalRecords: number = 0;
  pageSize: number = 5;
  page = 1;
  pages: number[] = [];
  user:JwtPayload | null = null;
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toastrService = inject(ToastrService)
  private authService = inject(AuthService);
  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user?.role) {
        this.user = user;
       
      }
    });
    this.loadStores(this.filterModel);
  }

  loadStores(filterModel: any) {
    this.accountService.getAllStore(filterModel).subscribe((res: any) => {
      if (res && res.statusCode === 200) {
        this.stores = res.data;
        this.totalRecords = res.data[0].totalRecords;
      } else {
        this.toastrService.error(res.message);
      }
    });
  }


onSearchChange(){
  this.filterModel.searchStoreTerm = this.searchTerm;
  this.loadStores(this.filterModel)
}




  handleDelete(confirmed: boolean) {
    if (confirmed && this.selectedStore) {

      this.accountService.deleteStore(this.selectedStore.storeId)
        .subscribe({
          next: () => {
            this.toastrService.success('Territory deleted successfully');
            this.loadStores(this.filterModel); // Refresh list
          },
          error: (err) => {
            this.toastrService.error('Failed to delete territory');
          }
        });
    }
  }
  getTerritoryDays(territory: Territory): string {
    const days: string[] = [];

    if (territory.monday) days.push('Mon');
    if (territory.tuesday) days.push('Tue');
    if (territory.wednesday) days.push('Wed');
    if (territory.thursday) days.push('Thu');
    if (territory.friday) days.push('Fri');
    if (territory.saturday) days.push('Sat');
    if (territory.sunday) days.push('Sun');

    if (days.length === 7) {
      return 'Daily';
    }

    return days.length > 0 ? days.join(', ') : 'No Delivery Days';
  }

  toggleActive(store: Store) {
    store.isActive = !store.isActive;

    this.accountService.updateStoreStatus(store.storeId, store.isActive)
      .subscribe((res: any) => {
        if (res && res.statusCode === 200) {
          this.toastrService.success(res.message);
        }
        else {
          this.toastrService.error(res.message || 'Failed to update territory status');
          store.isActive = !store.isActive; // Revert change on failure 
        }
      });
  }
  onUpdateStore(storeId: any) {
    this.router.navigate(['/dashboard/account/update-store', EncryptionUtil.encrypt(storeId)]);
  }
  setSelectedStore(store: any) {
    this.selectedStore = store;
  }
  onPageChanged(event: any) {
    this.page = event;
    this.filterModel.pageNumber = this.page;
    this.loadStores(this.filterModel)
  }
  onPageSizeChange(event: any) {
    this.pageSize = event;
    this.filterModel.pageNumber = 1; // reset to first page
    this.filterModel.pageSize = this.pageSize;
    this.loadStores(this.filterModel)
  }


  navigateToAddStore(){
    this.router.navigate(['/dashboard/account/add-store']);
  }
}
