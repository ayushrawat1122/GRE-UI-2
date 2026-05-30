import { Component, inject } from '@angular/core';
import { SalesReportFilterModel, SalesReportModel, SalesReportModelNoPagination } from '../../../Core/common/CommonModels/ProductModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesReportService } from '../Services/sales-report.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PaginationComponent } from '../../../Core/common/pagination/pagination.component';
import { forkJoin } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sales-report',
  imports: [MatTooltipModule,CommonModule, FormsModule,PaginationComponent],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.css'
})


export class SalesReportComponent {
  salesRecordsList: SalesReportModel[] = [];
  salesRecordsListNoPagination: SalesReportModelNoPagination[] = [];
  filterModel: SalesReportFilterModel = new SalesReportFilterModel();
  territoriesList: any[] = [];
  storeList: any[] = [];
  productList: any[] = [];
  searchTerritoryTerm: string = '';
  searchStoreTerm: string = '';
  searchProductTerm: string = '';
  dropdownOpen: boolean = false;
  dropdownStoreOpen: boolean = false;
  dropdownProductOpen: boolean = false;
  searchproductTerm: string = '';
  today: string = new Date().toISOString().split('T')[0];
  selectedReport: number = 1 ;
  selectedTerritories: any[] = [];
  selectedProducts: any[] = [];
  selectedStores: any[] = [];
  dateRange:string=''
  private salesReportService = inject(SalesReportService);
  private toasterService = inject(ToastrService);
  page: number = 1;
    pageSize: number = 5;
    pages: number[] = [];
    totalRecords: number = 0;
  /**
   *
   */
  constructor() {
    this.loadAllDropdowns();
    // this.getAllProducts(this.searchProductTerm);
    // this.getAllStores(this.searchStoreTerm);
    // this.getAllTerritories(this.searchTerritoryTerm);
    // this.getSalesReport();
  }

  getSalesReport() {
    this.salesReportService.getSalesReport(this.filterModel).subscribe((res: any) => {
      if (res && res.statusCode == 200) {
        this.salesRecordsList = res.data as SalesReportModel[];
        this.dateRange = res.data[0].dateRange;
        this.totalRecords= res.data[0].totalRecords;
        this.filterModel.FromDate = this.formatDateForInput(res.data[0].fromDate);
this.filterModel.ToDate = this.formatDateForInput(res.data[0].toDate);
        // this.updatePagination();
      }
      else {
        this.salesRecordsList = [];
      }
    });
  }

  formatDateForInput(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
    loadAllDropdowns() {
  forkJoin({
    products: this.getAllProducts(this.searchProductTerm),
    stores: this.getAllStores(this.searchStoreTerm),
    territories: this.getAllTerritories(this.searchTerritoryTerm)
  }).subscribe(result => {
    // Products
    if (result.products && result.products.statusCode === 200) {
      this.productList = result.products.data;
      this.selectedProducts = [...this.productList];
      this.filterModel.ProductIds = this.selectedProducts.map(p => p.productId).join(',');
      
    }

    // Stores
    if (result.stores && result.stores.statusCode === 200) {
      this.storeList = result.stores.data;
      this.selectedStores = [...this.storeList];
      this.filterModel.StoreIds = this.selectedStores.map(s => s.storeId).join(',');
    }

    // Territories
    if (result.territories && result.territories.statusCode === 200) {
      this.territoriesList = result.territories.data;
      this.selectedTerritories = [...this.territoriesList];
      this.filterModel.TerritoryIds = this.selectedTerritories.map(t => t.territoryId).join(',');
    }

    // Finally load sales report
    this.getSalesReport();
  });
}


  // getSalesReportNoPagination() {
  //   this.filterModel.NoPagination=true;
  //   this.salesReportService.getSalesReport(this.filterModel).subscribe((res: any) => {
  //     if (res && res.statusCode == 200) {
        
  //       this.salesRecordsListNoPagination = res.data as SalesReportModelNoPagination[];
  //     }
  //     else {
  //       this.salesRecordsListNoPagination = [];
  //             this.toasterService.error('No data to export!');

  //     }
  //   });
  //   this.filterModel.NoPagination=false;
  // }

  // getAllTerritories(searchTerm: string) {
  //   this.salesReportService.getActiveTerritories(searchTerm).subscribe((res: any) => {
  //     if (res && res.statusCode == 200) {
  //       this.territoriesList = res.data;
  //       this.selectedTerritories = [...this.territoriesList];
  //     }
  //     else {
  //       this.territoriesList = [];
  //     }

  //   });
  // }
   getAllTerritories(searchTerm: string) {
    return this.salesReportService.getActiveTerritories(searchTerm);
  }

    // toggleTerritory(territory: any) {
    //   const index = this.selectedTerritories.findIndex(t => t.territoryId === territory.territoryId);

    //   if (index > -1) {
    //     this.selectedTerritories.splice(index, 1); // unselect
    //   } else {
    //     this.selectedTerritories.push(territory); // select
    //   }
    //   this.filterModel.TerritoryIds = this.selectedTerritories.map(t => t.territoryId).join(',');
    //   this.getSalesReport()
    // }

    
    toggleTerritory(territory: any) {
  const index = this.selectedTerritories.findIndex(
    t => t.territoryId === territory.territoryId
  );

  if (index > -1) {
    // Unselect
    this.selectedTerritories.splice(index, 1);
  } else {
    // Select
    this.selectedTerritories.push(territory);
  }

  // update filter model
  this.filterModel.TerritoryIds = this.selectedTerritories
    .map(t => t.territoryId)
    .join(',');

  this.getSalesReport();
}

//   toggleTerritory(territory: any) {
//   if (this.isTerritorySelected(territory)) {
//     this.selectedTerritories = this.selectedTerritories.filter(
//       t => t.territoryId !== territory.territoryId
//     );
//   } else {
//     this.selectedTerritories.push(territory);
//   }
// }
  isTerritorySelected(territory: any): boolean {
    return this.selectedTerritories.some(t => t.territoryId === territory.territoryId);
  }
  isProductSelected(product: any): boolean {
    return this.selectedProducts.some(p => p.productId === product.productId);
  }
  toggleProduct(product: any) {
  const index = this.selectedProducts.findIndex(
    p => p.productId === product.productId
  );

  if (index > -1) {
    // Unselect
    this.selectedProducts.splice(index, 1);
  } else {
    // Select
    this.selectedProducts.push(product);
  }

  // Update filter model
  this.filterModel.ProductIds = this.selectedProducts
    .map(p => p.productId)
    .join(',');

  this.getSalesReport();
}

  toggleStore(store: any) {
    const index = this.selectedStores.findIndex(s => s.storeId === store.storeId);

    if (index > -1) {
      this.selectedStores.splice(index, 1); // unselect
    } else {
      this.selectedStores.push(store); // select
    }

    this.filterModel.StoreIds = this.selectedStores.map(s => s.storeId).join(',');
  }

  isStoreSelected(store: any): boolean {
    return this.selectedStores.some(s => s.storeId === store.storeId);
  }
  // getAllStores(seachTerm: string) {
  //   this.salesReportService.getActiveStores(seachTerm).subscribe((res: any) => {
  //     if (res && res.statusCode == 200) {
  //       this.storeList = res.data;
  //       // this.selectedStores = this.storeList
  //     }
  //     else {
  //       this.storeList = [];
  //     }
  //   });
  // }
  getAllStores(seachTerm: string) {
    return this.salesReportService.getActiveStores(seachTerm);
  }
  // getAllProducts(searchTerm: string) {
  //   this.salesReportService.getActiveProducts(searchTerm).subscribe((res: any) => {
  //     if (res && res.statusCode == 200) {
  //       this.productList = res.data;
  //       this.selectedProducts = [...this.productList];
  //     }
  //     else {
  //       this.productList = [];
  //     }
  //   });
  // }
 getAllProducts(searchTerm: string) {
  // Return the Observable directly
  return this.salesReportService.getActiveProducts(searchTerm);
}

  filterTerritories() {
    const searchTerm = this.searchTerritoryTerm
    this.getAllTerritories(searchTerm);
    this.dropdownOpen = true;
  }
  closeDropdown() {
    setTimeout(() => this.dropdownOpen = false, 200);
  }
  closeStoreDropdown() {
    setTimeout(() => this.dropdownStoreOpen = false, 200);

  }
  selectTerritory(territory: any) {
    this.filterModel.TerritoryIds = territory.territoryId;
    this.searchTerritoryTerm = territory.territoryName;
    this.getSalesReport();
    this.dropdownOpen = false;
  }
  filterStores() {
    const searchTerm = this.searchStoreTerm
    this.getAllStores(searchTerm);
    this.dropdownStoreOpen = true;
  }
  selectStore(store: any) {
    this.filterModel.StoreIds = store.storeId;
    this.searchStoreTerm = store.storeName;
    this.getSalesReport();
    this.dropdownStoreOpen = false;
  }
  filterproduct() {
    const searchTerm = this.searchProductTerm
    this.getAllProducts(searchTerm);
    this.dropdownProductOpen = true;
  }
  closeProductDropdown() {
    setTimeout(() => this.dropdownProductOpen = false, 200);

  }
  get isInvalidDateRange(): boolean {
    const { FromDate, ToDate } = this.filterModel;
    if (!FromDate || !ToDate) return false; // incomplete range is not invalid
    return new Date(FromDate) > new Date(ToDate);
  }

  // Call this on FromDate or ToDate change
  dateChange(): void {
    const { FromDate, ToDate } = this.filterModel;

    // Do not call API if ToDate is not selected
    if (!ToDate) return;

    // Check for invalid date range
    if (this.isInvalidDateRange) {
      this.toasterService.error('Invalid date range selected. Please select a valid range.');
      this.filterModel.FromDate = null;
      this.filterModel.ToDate = null;
      return;
    }

    // Call API only when both dates are valid
    this.getSalesReport();
  }

  selectProduct(product: any) {
    this.filterModel.ProductIds = product.productId;
    this.searchProductTerm = product.productName;
    this.getSalesReport();
    this.dropdownProductOpen = false;
  }
  resetFilter() {
    this.filterModel.FromDate = null;
    this.filterModel.ToDate = null;
    this.filterModel.TerritoryIds = null;
    this.filterModel.StoreIds = null;
    this.filterModel.ProductIds = null;

    this.searchTerritoryTerm = '';
    this.searchStoreTerm = '';
    this.searchProductTerm = '';

    this.getSalesReport();
  }

  //   downloadExcel(): void {
  //     if (!this.salesRecordsList || this.salesRecordsList.length === 0) {
  //       alert('No data to export!');
  //       return;
  //     }

  //     // Convert JSON to worksheet
  //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.salesRecordsList);

  //     // Create workbook and add worksheet
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'SalesReport');

  //     // Generate buffer
  //     const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  // const today = new Date();
  // const dateStr = today.toISOString().split('T')[0];
  //     // Save file
  //     const blob = new Blob([wbout], { type: 'application/octet-stream' });
  //     saveAs(blob, `SalesReport${dateStr}.xlsx`);
  //   }
  // downloadExcel(): void {
  //   this.getSalesReportNoPagination();
  //   // if (!this.salesRecordsListNoPagination || this.salesRecordsListNoPagination.length === 0) {
  //   //   this.toasterService.error('No data to export!');
  //   //   return;
  //   // }

  //   const today = new Date();
  //   const dateStr = today.toISOString().split('T')[0];

  //   // ✅ Create header row (your custom headings)
  //   let headers = [
  //     "Territory",
  //     "Store",
  //     "Product",
  //     "Quantity",
  //     "Unit Price",
  //     "Subtotal",
  //     "Order Date"
  //   ];
  //   let data: (string | number)[][] = [];
  //   if (this.selectedReport == 1) {

  //     headers = [
  //       "Territory",
  //       "Store",
  //       "Product",
  //       "Cartons",
  //       "Cases",
  //       "Total Sales"

  //     ]

  //     // ✅ Convert your data to row format
  //    data = this.salesRecordsListNoPagination.map(x => [
  //       x.territoryName,
  //       x.storeName,
  //       x.productName,
  //       x.cartons,
  //       x.cases,
  //       x.totalSales
  //     ]);
  //   }
  //   else if (this.selectedReport == 2) {
  //     headers = [
  //       "Territory",
  //       "Product",
  //       "Sales",
  //       "Total Sales",
  //       "Sales Percentage"

  //     ]

  //     // ✅ Convert your data to row format
  //    data = this.salesRecordsListNoPagination.map(x => [
  //       x.territoryName,
  //       x.productName,
  //       x.totalSales,
  //       x.globalTotal,
  //       x.salesPercentage
  //     ]);
    
  //   }
  //   else if (this.selectedReport == 3) {
  //     headers = [
  //       "Territory",  
  //       "Store",
  //       "Total Sales"]

  //       data = this.salesRecordsListNoPagination.map(x => [
  //       x.territoryName,
  //       x.storeName,
  //       x.totalSales,
       
  //     ]);
  //     }


  //   // ✅ Combine header + data
  //   const worksheetData = [headers, ...data];

  //   // ✅ Create worksheet with custom layout
  //   const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);

  //   // ✅ Create workbook
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'SalesReport');

  //   // ✅ Export
  //   const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   const blob = new Blob([wbout], { type: 'application/octet-stream' });
  //   saveAs(blob, `SalesReport${dateStr}.xlsx`);
  // }

  

  onSelectChange(event: any) {
    const selectedValue = event.target.value;
    this.selectedReport = selectedValue;
    this.filterModel.ReportTypeId = selectedValue
    this.filterModel.TerritoryIds = null;
    this.filterModel.StoreIds = null;
    this.filterModel.ProductIds = null;
    this.filterModel.FromDate = null;
    this.filterModel.ToDate = null;
    this.page=1;
    this.pageSize=5;
    this.totalRecords=0;

    this.filterModel.PageNumber=1;
    this.filterModel.pageSize=5;
    this.loadAllDropdowns();
    // this.selectedProducts = [];
    // this.selectedTerritories = [];
    // this.salesRecordsList = []
    // Do whatever you want here
  }
  downloadExcel(): void {
  this.filterModel.NoPagination = true;

  this.salesReportService.getSalesReport(this.filterModel).subscribe({
    next: (res: any) => {
      this.filterModel.NoPagination = false;

      if (!res || res.statusCode !== 200 || !res.data || res.data.length === 0) {
        this.toasterService.error('No data to export!');
        this.salesRecordsListNoPagination = [];
        return;
      }

      this.salesRecordsListNoPagination = res.data as SalesReportModelNoPagination[];

      // Excel export starts here
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];

      let headers: string[] = [];
      let data: (string | number)[][] = [];

      if (this.selectedReport == 1) {
        headers = ["Territory",  "Product", "Cartons", "Cases", "Total Sales"];
        data = this.salesRecordsListNoPagination.map(x => [
          x.territoryName,
          x.productName,
          x.cartons,
          x.cases,
          x.totalSales
        ]);
      } else if (this.selectedReport == 2) {
        headers = ["Territory", "Product", "Sales", "Total Sales", "Sales Percentage"];
        data = this.salesRecordsListNoPagination.map(x => [
          x.territoryName,
          x.productName,
          x.totalSales,
          x.globalTotal,
          x.salesPercentage
        ]);
      } else if (this.selectedReport == 3) {
        headers = ["Territory", "Store", "Total Sales"];
        data = this.salesRecordsListNoPagination.map(x => [
          x.territoryName,
          x.storeName,
          x.totalSales
        ]);
      }

      // Create worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

      // Style headers
      const range = XLSX.utils.decode_range(ws['!ref']!);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cell_address]) continue;
        ws[cell_address].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }

      // Create workbook and export
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `SalesReport${dateStr}.xlsx`);
    },
    error: err => {
      this.filterModel.NoPagination = false;
      console.error(err);
      this.toasterService.error('Failed to fetch data for Excel!');
    }
  });
}

   onPageChanged(newPage: number) {
      
      this.page = newPage;
      this.filterModel.PageNumber=this.page;
      this.getSalesReport();
    }
    onPageSizeChange(newSize: number) {
       const oldStartIndex = (this.page - 1) * this.pageSize;

  this.pageSize = newSize;
  this.page = 1;
  this.filterModel.PageNumber = this.page;
  this.filterModel.pageSize = newSize;

  // Calculate new page number so the user stays around the same position
  this.page = Math.floor(oldStartIndex / this.pageSize) + 1;
      this.filterModel.pageSize=this.pageSize;
      this.updatePagination();
      this.getSalesReport();


    }
    updatePagination() {
      this.totalRecords = Math.ceil(this.salesRecordsList.length / this.pageSize);
      this.pages = Array.from({ length: this.totalRecords }, (_, i) => i + 1);
    }

}
