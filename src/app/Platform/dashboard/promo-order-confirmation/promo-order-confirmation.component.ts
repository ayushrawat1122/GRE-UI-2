import { Component, inject, ViewChild } from '@angular/core';
import { PromoProductsService } from '../Services/promo-products.service';
import { PromoOrderStateService } from '../Services/promo-order-state.service';
import { PromoProduct } from '../promo-products/promo-products.component';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderConfirmModalComponent } from '../../../Core/common/order-confirm-modal/order-confirm-modal.component';
import { Addresses } from '../../accounts/add-update-store/add-update-store.component';
import { AccountService } from '../../accounts/Services/account.service';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-promo-order-confirmation',
  imports: [CommonModule, FormsModule, RouterLink, OrderConfirmModalComponent,MatTooltipModule ],
  templateUrl: './promo-order-confirmation.component.html',
  styleUrl: './promo-order-confirmation.component.css'
})
export class PromoOrderConfirmationComponent {

  private promoProductsService = inject(PromoProductsService);
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private promoOrderStateService = inject(PromoOrderStateService);
  user:JwtPayload | null = null;
  private toasterService = inject(ToastrService);
  addresses:Addresses[]=[];
  selectedAddressId: number | null = null;  
  modalRef: any; // Bootstrap modal reference

  private router = inject(Router);
  cartItems = this.promoOrderStateService.cart$;
  isConfirmed: boolean = false;
showConfirmValidation: boolean = false; 
showAddressValidation: boolean = false; 
  selectedProductModal?: PromoProduct;
 @ViewChild('successModal') successModal!: OrderConfirmModalComponent;
  orderType:string='Promo'


  totalAmount$ = this.cartItems.pipe(
    map(items =>
      items.reduce((sum, p) => sum + (p.subtotal || 0), 0)
    )
  );
  constructor() {
    this.getCartItems();
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user?.role) {
        
      }
    });
    this.loadAddresses();
  }


  getCartItems() {
    this.promoProductsService.getPromoCartItems().subscribe((res: any) => {
      if (res.statusCode == 200 && res.data && res.data.length > 0) {
        // console.log('simple', res.data);
        this.promoOrderStateService.clearCart();
        res.data.forEach((item: PromoProduct) => {
          item.sizeName = item.sizeName;
          item.subtotal = item.subtotal || 0;
        });
        this.promoOrderStateService.setCart(res.data as PromoProduct[]);
      }

    })
  }
  loadAddresses(){
    this.accountService.getAllAddresses(this.user?.StoreId).subscribe((res: any) => {
      if(res !=null){
        this.addresses = res as Addresses[];
      } else {

        //this.toaster.error('No addresses found');
      }
    });
  }

  submitOrder() {
    this.showConfirmValidation = false;
  this.showAddressValidation = false;

  // Validation for address
  if (!this.selectedAddressId) {
    this.showAddressValidation = true;
  }

  // Validation for confirmation checkbox
  if (!this.isConfirmed) {
    this.showConfirmValidation = true;
  }

  // If any validation fails, stop here
  if (this.showConfirmValidation || this.showAddressValidation) {
    return;
  }
    // console.log(this.isConfirmed);
      
    this.promoProductsService.orderPromoProducts(this.selectedAddressId).subscribe((res: any) => {
      if (res.statusCode == 200) {
               this.successModal.show();

        // this.toasterService.success(res.message);
        this.promoOrderStateService.clearCart();
        this.getCartItems();
        // this.router.navigate(['/dashboard/promo-products']);
      }
      else {
        this.router.navigate(['/dashboard/promo-products']);
      }
      this.isConfirmed = false;
    this.showConfirmValidation = false;
    });
  }


  openProductDetailModal(product: PromoProduct) {
    this.selectedProductModal = {
      ...product,
      productBase64: `data:image/jpeg;base64,${product.productBase64}`,
    };

    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      // Only initialize once
      if (!this.modalRef) {
        this.modalRef = new (window as any).bootstrap.Modal(modalElement, {
          keyboard: true
        });
      }
      this.modalRef.show();
    }
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
      
    }
  }
  onSuccessModalClosed(): void {
  this.router.navigate(['/dashboard/home']);
}
}
