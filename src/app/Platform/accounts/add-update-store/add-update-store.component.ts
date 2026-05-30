import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../Services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionUtil } from '../../../Core/common/CommonMethods/encryptdecrypt';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { appConfig } from '../../../app.config';
export interface Store {
  storeId: number;
  storeName: string;
  territoryId: number;
  territoryName?: string;
  addressId?: number;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
export interface Addresses {
  addressId?: number;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  billTo?: boolean;
  shipTo?: boolean
}
@Component({
  selector: 'app-add-update-store',
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule, FormsModule],
  templateUrl: './add-update-store.component.html',
  styleUrl: './add-update-store.component.css'
})
export class AddUpdateStoreComponent {
  addAddressMode: boolean = false;
  storeForm: FormGroup;
  territories: any[] = [];
  filteredTerritories: any[] = [];
  dropdownOpen = false;
  searchTerritory: string = '';
  billToAddresses: Addresses[] = [];
  shipToAddresses: Addresses[] = [];
  storeUpdateId: number = 0;
  selectedBillTo: any;
  selectedShipTo: any;
  private authService = inject(AuthService);
  user: JwtPayload | null = null;
  userRoles: string[] = [];
  //  public authService = inject(AuthService)
  public toasterService = inject(ToastrService)
  private accountService = inject(AccountService)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  constructor(
    private fb: FormBuilder
  ) {
    this.storeForm = this.fb.group({
      storeId: [0],
      storeName: ['', Validators.required],
      territoryId: [null, Validators.required],
      territoryName: [''],  // Holds the typed text
      addressId: [0],
      streetAddress: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],
      billTo: [false],
      shipTo: [false]
    });

    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user?.role) {
        this.userRoles = user.role;
        // Ensure storeId is a number
      }
    });

  }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const id = EncryptionUtil.decrypt(params.get('id')!);
      this.storeUpdateId = Number(id);
      if (id) {
        // this.userId = +id;
        this.getStoreById(id); // fetch user and patch form
      }
      if (Number(this.user?.StoreId) == 0) {

        this.loadAllAddresses(Number(id));
      }
      else {
        this.loadAllAddresses(Number(this.user?.StoreId));
      }
    });
    this.loadTerritories(this.searchTerritory);
    // if(Number(this.user?.StoreId) == 0){

    // }
    // else{

    //   this.loadAllAddresses();
    // }
    //     this.territories = [
    //   { territoryId: 1, territoryName: 'Kashipur', monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true },
    //   { territoryId: 2, territoryName: 'Haridwar', monday: true, tuesday: false, wednesday: true, thursday: false, friday: true, saturday: false, sunday: true },
    //   { territoryId: 3, territoryName: 'Dehradun', monday: false, tuesday: true, wednesday: false, thursday: true, friday: false, saturday: true, sunday: false },
    //   { territoryId: 4, territoryName: 'Rishikesh', monday: true, tuesday: true, wednesday: true, thursday: false, friday: false, saturday: true, sunday: false },
    //   { territoryId: 5, territoryName: 'Roorkee', monday: false, tuesday: false, wednesday: true, thursday: true, friday: true, saturday: false, sunday: true }
    // ];

    // this.filteredTerritories = [...this.territories];

  }
  selectBillTo(address: any) {
    this.selectedBillTo = address;

    this.storeForm.get('billTo')?.setValue(address);
    const isBillToShipToObject = {
      addressId: address.addressId,
      storeId: this.storeUpdateId,
      IsBillTo: true,
      IsShipTo: false
    }
    this.updateAddressType(isBillToShipToObject);
  }


  selectShipTo(address: any) {
    this.selectedShipTo = address;
    this.storeForm.get('shipTo')?.setValue(address);
    const isBillToShipToObject = {
      addressId: address.addressId,
      storeId: this.storeUpdateId,
      IsBillTo: false,
      IsShipTo: true
    }
    this.updateAddressType(isBillToShipToObject);
  }

  updateAddressType(isBillToShipToObject: any) {
    this.accountService.updateAddressTypeIsBillToIsShipTo(isBillToShipToObject).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.toasterService.success(res.message);
      }
      else {
        this.toasterService.error(res.message);
      }
    });
  }

  addAddress() {
    this.addAddressMode = true;
    this.storeForm.patchValue({
      addressId: 0,
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      billTo: false,
      shipTo: false
    });
  }

  loadAllAddresses(storeId?: number) {
    this.accountService.getAllAddresses(storeId).subscribe((res: any) => {
      if (res != null) {
        this.billToAddresses = res as Addresses[];
        this.shipToAddresses = res as Addresses[];
        const billTo = this.billToAddresses.find(a => a.billTo);
        const shipTo = this.shipToAddresses.find(a => a.shipTo);

        // 🔹 Set in form (IMPORTANT)
        if (billTo) {
          this.storeForm.get('billTo')?.setValue(billTo);
        }

        if (shipTo) {
          this.storeForm.get('shipTo')?.setValue(shipTo);
        }
      } else {
        this.toasterService.error('No addresses found');
      }
    });
  }
  loadTerritories(searchTerritory: string) {
    const obj = {
      pageNumber: 1,
      pageSize: 1000,
      searchTerritoryTerm: searchTerritory
    };

    this.accountService.getAllTerritories(obj).subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.territories = res.data;
        this.filteredTerritories = res.data;
      } else {
        this.toasterService.error('No territories found');
      }
    });
  }

  editAddress(address: Addresses) {
    // Load address data into form for editing
    this.addAddressMode = true;
    this.storeForm.patchValue({
      addressId: address.addressId,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      billTo: address.billTo,
      shipTo: address.shipTo
    });
  }

  removeAddress(address: Addresses) {
    this.accountService.deleteAddress(address.addressId).subscribe((res: any) => {
      if (res == true) {
        this.toasterService.success('Address deleted successfully');
        if (Number(this.user?.StoreId) == 0) {

          this.loadAllAddresses(Number(this.storeUpdateId));
        }
        else {
          this.loadAllAddresses(Number(this.user?.StoreId));
        }
        // this.loadAllAddresses(); // Refresh the address list  
      } else {
        this.toasterService.error('Failed to delete address');
      }
    });
  }
  filterTerritories() {
    const searchTerm = this.storeForm.get('territoryName')?.value?.toLowerCase() || '';
    this.loadTerritories(searchTerm);
    this.dropdownOpen = true;
  }

  selectTerritory(territory: any) {
    this.storeForm.patchValue({
      territoryId: territory.territoryId,
      territoryName: territory.territoryName
    });
    this.dropdownOpen = false;
  }

  closeDropdown() {
    setTimeout(() => this.dropdownOpen = false, 200);
  }

  patchStoreForm(store: Store) {
    this.storeForm.patchValue({
      storeId: store.storeId,
      storeName: store.storeName,
      territoryId: store.territoryId,
      territoryName: store.territoryName,
      addressId: store.addressId,
      streetAddress: store.streetAddress,
      city: store.city,
      state: store.state,
      postalCode: store.postalCode,
      country: store.country
    });
  }

  onSaveStore() {
    if (this.storeForm.valid) {

      let storeData = { ...this.storeForm.value };

      if (storeData.billTo && typeof storeData.billTo === 'object' && !Array.isArray(storeData.billTo)) {
        delete storeData.billTo;
      }

      if (storeData.shipTo && typeof storeData.shipTo === 'object' && !Array.isArray(storeData.shipTo)) {
        delete storeData.shipTo;
      }
      if (storeData.storeId > 0) {
        this.accountService.updateStore(storeData).subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.toasterService.success(response.message || 'Store updated successfully');
            if (Number(this.user?.StoreId) === 0) {

              this.router.navigate(['/dashboard/account/stores']); // Navigate to stores list after update
            }
            else {
              const encStoreId = EncryptionUtil.encrypt(Number(this.user?.StoreId)); // Ensure storeId is a number
              this.addAddressMode = false
              this.router.navigate(['/dashboard/account/my-store', encStoreId]);
            }
          } else {
            this.toasterService.error(response.message || 'Failed to update store');
          }
        });

      }
      else {

        this.accountService.addStore(storeData).subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.router.navigate(['/dashboard/account/stores']); // Navigate to stores list after update

            this.toasterService.success(response.message || 'Store saved successfully');
            this.storeForm.reset({ storeId: 0 });
          } else {
            this.toasterService.error(response.message || 'Failed to save store');
          }
        });
      }
    }
    else {
      this.storeForm.markAllAsTouched();
      return;

    }



    // Call your service API to save or update store
    // this.storeService.saveStore(storeData).subscribe(...)
  }

  getStoreById(id: any) {
    this.accountService.getStoreById(id).subscribe((response: any) => {
      if (response.statusCode === 200 && response.data) {
        const store = response.data;
        this.patchStoreForm(store);
      } else {
        this.toasterService.error(response.message || 'Store not found.');
      }
    });
  }
}
