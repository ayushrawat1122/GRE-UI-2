import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AccountService } from '../Services/account.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from '../../../Core/common/confirmation-modal/confirmation-modal.component';
import { Router } from '@angular/router';
import { EncryptionUtil } from '../../../Core/common/CommonMethods/encryptdecrypt';
import { PaginationComponent } from '../../../Core/common/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  
}
export class FilterTerritory {
  pageNumber:number=1;
  pageSize:number = 5;
  searchTerritoryTerm:string='';
  
}
export class UserFilterModel {
  pageNumber:number=1;
  pageSize:number = 5;
  searchTerm:string='';
  
}

@Component({
  selector: 'app-territories',
  imports: [MatTooltipModule,CommonModule, ConfirmationModalComponent,PaginationComponent,FormsModule],
  templateUrl: './territories.component.html',
  styleUrl: './territories.component.css'
})
export class TerritoriesComponent {
territories: Territory[] = [];
selectedTerritory: any;
searchTerm: string = '';
filterModel:FilterTerritory = new FilterTerritory();
totalRecords:number=0;
pageSize:number=5;
page = 1;
pages: number[] = [];

private accountService = inject(AccountService);
private toastrService = inject(ToastrService);
private router = inject(Router);
  ngOnInit(): void {
    this.loadTerritories(this.filterModel);
  }
  loadTerritories(filterModel:any) {
    
    this.accountService.getAllTerritories(filterModel).subscribe((res: any) => {
      if (res && res.statusCode === 200) {
       
        this.territories = res.data;
        this.totalRecords = res.data[0].totalRecords
      } else {
        this.toastrService.error(res.message);
      }
    });
  }
  // Removed duplicate onUpdateTerritory method

  setSelectedTerritory(territory: any) {
    this.selectedTerritory = territory;
  }

  handleDelete(confirmed: boolean) {
    if (confirmed && this.selectedTerritory) {
      // Call API to delete the territory
      this.accountService.deleteTerritory(this.selectedTerritory.territoryId)
        .subscribe({
          next: () => {
            this.toastrService.success('Territory deleted successfully');
            this.loadTerritories(this.filterModel); // Refresh list
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


  toggleActive(territory: Territory) {
    territory.isActive = !territory.isActive;

  this.accountService.updateTerritoryStatus(territory.territoryId, territory.isActive)
    .subscribe((res:any)=>{
      if(res && res.statusCode === 200){
        this.toastrService.success(res.message);
      }
      else{
        this.toastrService.error(res.message || 'Failed to update territory status');
        territory.isActive = !territory.isActive; // Revert change on failure 
      }
    });
}

onUpdateTerritory(territoryId: any) {
    this.router.navigate(['/dashboard/account/update-territory', EncryptionUtil.encrypt(territoryId)]);
  }
  onPageChanged(event:any){
    
    this.page = event;
    this.filterModel.pageNumber=this.page;
    this.loadTerritories(this.filterModel)
  }
  onPageSizeChange(event:any){
     this.pageSize = event;
  this.filterModel.pageNumber = 1; // reset to first page
  this.filterModel.pageSize = this.pageSize;
    this.loadTerritories(this.filterModel)
  }

  // updatePagination() {
  //   this.totalRecords = Math.ceil(this.territories.length / this.pageSize);
  //   this.pages = Array.from({ length: this.totalRecords }, (_, i) => i + 1);
  // }
  onSearchChange(){
    this.filterModel.searchTerritoryTerm = this.searchTerm;
    this.loadTerritories(this.filterModel)
  }
  navigateToAddTerritory(){
    this.router.navigate(['/dashboard/account/add-territories']);
  }
}
