import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../Services/account.service';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { routes } from '../../../app.routes';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionUtil } from '../../../Core/common/CommonMethods/encryptdecrypt';
interface Store {
  storeId: number;
  storeName: string;
  isActive: boolean;
}
@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  addUserForm!: FormGroup;
  stores: Store[] = []; // Replace with actual store type 
  dropdownOpen = false;
  user: JwtPayload | null = null;
  userRoles: string[] = [];
  filteredStores: any[] = [];
  storeSearch: string = '';
  private accountService = inject(AccountService) // Replace with actual service type
  public authService = inject(AuthService) // Replace with actual service type
  public toasterService = inject(ToastrService) // Replace with actual service type
  public route = inject(ActivatedRoute); // Replace with actual service type
  public router = inject(Router); // Replace with actual service type
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.addUserForm = this.fb.group({
      userPermissionId: [0],
      userId: [0],
      storeId: [0, Validators.required],
      storeName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userClassification: [''],
      type: ['', Validators.required],
      canViewOrderHistory: [false],
      canOrderSalesProducts: [false],
      canOrderPromoProducts: [false],
      canViewPromoOrderHistory: [false],
      mfaEnabled: [false],
      isAdmin: [false]
    });
    this.authService.user$.subscribe((user) => {
      if (user?.role) {
        this.user = user;
        this.userRoles = user.role;
        this.addUserForm.patchValue({
          storeId: user.StoreId,
          storeName: user.StoreName,
          type: user.Type,
          userClassification: this.capitalizeFirst(user.UserClassification ?? '')

        });
      }
      this.route.paramMap.subscribe(params => {
        const email = EncryptionUtil.decrypt(params.get('email')!);
        if (email) {
          // this.userId = +id;
          this.loadUser(email); // fetch user and patch form
        }
      });
    });

    this.getAllStores(''); // Fetch all stores initially
  }


  loadUser(email: any) {
    this.accountService.getUserByEmail(email).subscribe((response: any) => {
      if (response.statusCode === 200 && response.data) {
        const user = response.data;
        this.addUserForm.patchValue({
          userPermissionId: user.userPermissionId,
          userId: user.userId,
          storeId: user.storeId,
          storeName: user.storeName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password, // Don't pre-fill password
          userClassification: this.capitalizeFirst(user.userClassification),
          canViewOrderHistory: user.canViewOrderHistory,
          canOrderSalesProducts: user.canOrderSalesProducts,
          canOrderPromoProducts: user.canOrderPromoProducts,
          canViewPromoOrderHistory: user.canViewPromoOrderHistory,
          mfaEnabled: user.mfaEnabled,
          isAdmin: user.isAdmin,
          type: user.type
        });
      } else {
        this.toasterService.error(response.message || 'User not found.');
      }
    });
  }
  onFocus() {
    if (!this.userRoles.includes('IsAdmin')) {
      this.dropdownOpen = true;
    }
  }
  capitalizeFirst(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  getAllStores(searchTerm: string) {
    const filterModel = {
      pageNumber: 1,
      pageSize: 1000,
      searchStoreTerm: searchTerm
    }
    this.accountService.getAllStore(filterModel).subscribe(response => {
      if (response.statusCode === 200) {
        
        this.stores = response.data as Store[];
        // this.filteredStores = [...this.stores]; // Initialize filtered stores
      }
    });


  }
  filterStores() {
    this.dropdownOpen = true; // Open dropdown on input
    const search = this.addUserForm.get('storeName')?.value.toLowerCase();
    this.getAllStores(search); // Fetch stores based on search term
  }

  selectStore(store: any) {
    this.storeSearch = store.storeName;                 // show name in input
    this.addUserForm.patchValue({ storeId: store.storeId, storeName: this.storeSearch }); // set storeId in form
    this.dropdownOpen = false;                     // close dropdown
  }

  closeDropdown() {
    setTimeout(() => this.dropdownOpen = false, 200); // small delay so click registers
  }
  onAddUser() {

    if (this.addUserForm.valid) {
      const user = this.addUserForm.value;
      if (user.userId > 0) {
        this.accountService.updateUser(user).subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.addUserForm.reset();
            this.toasterService.success(response.message);
            this.router.navigate(['/dashboard/account/users']); // Navigate to users list after update
          } else {
            this.toasterService.error(response.message);
          }
        })
      }
      else {

        this.accountService.addUser(user).subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.router.navigate(['/dashboard/account/users']); // Navigate to users list after update

            this.addUserForm.reset();
            this.getAllStores(''); // Refresh store list
            this.toasterService.success(response.message);
          } else {
            this.toasterService.error(response.message);
          }
        })
      }

    }
  }
}
