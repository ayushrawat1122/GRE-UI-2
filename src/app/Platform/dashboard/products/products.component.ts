  import { Component, inject, OnInit } from '@angular/core';
  import { DashboardService } from '../dashboard.service';
  import { ToastrService } from 'ngx-toastr';
  import { CommonModule } from '@angular/common';
  import { FormsModule, NgForm } from '@angular/forms';
  import { OrderStateService } from '../order-state.service';
  import { Router, RouterLink } from '@angular/router';
  import { map, take } from 'rxjs/operators';
  import { OrderPriceValidating, UserCartItem } from '../../../Core/common/CommonModels/ProductModel';
  import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
  import { EncryptionUtil } from '../../../Core/common/CommonMethods/encryptdecrypt';
  import { PaginationComponent } from '../../../Core/common/pagination/pagination.component';
  import { ConfirmationModalComponent } from '../../../Core/common/confirmation-modal/confirmation-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';


  export interface Product {
    productId: number;
    productName: string;
    productType: string;
    description: string;
    productPricePerCase: number;
    productPricePerCarton: number;
    isActive: boolean;
    productBase64: string;
    productPrice: number
    isFeatured: boolean;
    orderCases: number;
    orderCartons: number;
    subtotal: number;
    actualSubTotal?: number;
    pricePerCaseForRetailer: number;
    pricePerCartonForRetailer: number;
    pricePerCaseDistributor: number;
    pricePerCartonDistributor: number;
    caseInventoryErrorMessage ?: string;
    cartonInventoryErrorMessage ?: string;
  }
  @Component({
    selector: 'app-products',
    imports: [CommonModule, FormsModule,MatTooltipModule, RouterLink, ConfirmationModalComponent, PaginationComponent],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css'
  })
  export class ProductsComponent implements OnInit {
    searchTerm: string = '';
    page: number = 1;
    pageSize: number = 5;
    pages: number[] = [];
    totalRecords: number = 0;
    productType: string = "sales";
    products: Product[] = [];
    pagedProducts: Product[] = [];
    filteredProducts: Product[] = [];

    user: JwtPayload | null = null;
    selectedProductModal?: Product;
    TotalAmount: number = 0;
    isConfirmed: boolean = false;
    cart: Product[] = [];
    actualCart: UserCartItem[] = [];
    savedCartLength: number = 0;
    showConfirmValidation: boolean = false;

    private dashboardService = inject(DashboardService);
    private authService = inject(AuthService);
    private toaster = inject(ToastrService);
    private orderStateService = inject(OrderStateService);
    private router = inject(Router);




    constructor() {
    }
    
    ngOnInit(): void {
      this.authService.user$.pipe(take(1)).subscribe(user => {
        this.user = user;
      });
      this.orderStateService.cart$.subscribe(items => {
        this.cart = items;
      });
      this.getProducts();
      this.getCartItems();
      
    }
    getProducts() {
      const filterModel = {
        productType: this.productType,
        userClassification: "",
        // pageNumber: this.page,
        // pageSize: this.pageSize
      }
      this.dashboardService.getAllProducts(filterModel).subscribe((res: any) => {
        if (res.statusCode == 200) {
          const freshProducts = res.data as Product[];
          this.totalRecords = res.data[0].totalRecords;
          const cart = this.orderStateService.getCart();

          // Merge cart values into fresh products
          const mergedProducts = freshProducts.map(p => {
            const match = cart.find(c => c.productId === p.productId);
            return {
              ...p,
              orderCases: match?.orderCases || 0,
              orderCartons: match?.orderCartons || 0,
              subtotal: match?.subtotal || 0
            };
          });

          this.products = mergedProducts;
          this.filteredProducts = [...this.products];
          this.updatePagedProducts();
          this.calculateTotal();
        }
        else {
          this.toaster.error(res.message);
        }
      })
    }

    openProductDetailModal(product: Product) {
      this.selectedProductModal = product;
      
      this.dashboardService.getProductDescription(product.productId).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.selectedProductModal = {
            ...this.selectedProductModal,
            description: res.data.description,
            productBase64: `data:image/jpeg;base64,${res.data.productBase64}`
          } as Product;
          const modal = new (window as any).bootstrap.Modal(document.getElementById('exampleModal')!);
          modal.show();
        }
      }
    );

      // @ts-ignore
      // this.selectedProductModal = {
      //   ...this.selectedProductModal,
      //   productBase64: `data:image/jpeg;base64,${this.selectedProductModal?.productBase64}`,
      // }
    }

    onPageChanged(newPage: number) {
      
      this.page = newPage;
      this.updatePagedProducts();
    }

    onPageSizeChange(newSize: number) {
      
      this.pageSize = newSize;
      this.page = 1;
      this.updatePagination();
      this.updatePagedProducts();


    }
    updatePagination() {
      this.totalRecords = Math.ceil(this.filteredProducts.length / this.pageSize);
      this.pages = Array.from({ length: this.totalRecords }, (_, i) => i + 1);
    }

    updatePagedProducts() {
      
      const start = (this.page - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.pagedProducts = this.filteredProducts.slice(start, end);

      //this.pagination.setPagination(this.filteredProducts.length);

    }


    onCartonsInput(event: any, product: Product) {
  const value = parseInt(event.target.value, 10);
if (isNaN(value) || value === 0) {
    product.orderCartons = 0;
    product.cartonInventoryErrorMessage = '';
    this.updateSubtotal(product);
    return;
  }

  if (!isNaN(value) && value >= 5 && value % 5 === 0) {
    product.orderCartons = value;
      product.cartonInventoryErrorMessage = ''; // ✅ ADD THIS

    this.updateSubtotal(product);
    // this.checkInventory(product, value, 'orderCartons').subscribe((isValid:any) => {
    // });
  } else {
    product.cartonInventoryErrorMessage = 'Cartons must be at least 5 and in multiples of 5.';
    this.updateSubtotal(product);
  }
}



  updateSubtotal(product: Product) {
  const cases = product.orderCases || 0;
  const cartons = product.orderCartons || 0;

  // Only add if valid
  if (!product.caseInventoryErrorMessage && !product.cartonInventoryErrorMessage &&
      (cases > 0 || cartons > 0)) {
    product.subtotal = +(cases * product.productPricePerCase + cartons * product.productPricePerCarton).toFixed(2);
  } else {
    product.subtotal = 0;
  }

  this.orderStateService.addOrUpdateProduct(product);
  this.calculateTotal();
}
onCasesInput(event: any, product: Product) {
  const value = Number(event.target.value);

  if (!isNaN(value) && value >= 0) {
    // Assign value temporarily
    product.orderCases = value;

    // Call async inventory check
    // this.dashboardService.checkInventory({
    //   productId: product.productId,
    //   quantity: value,
    //   field: 'orderCases'
    // }).subscribe((res: any) => {
    //   if (res.statusCode === 200) {
    //     if (!res.data) {
    //       // Inventory insufficient
    //       product.caseInventoryErrorMessage = res.message || 'Not enough cases in inventory.';
    //     } else {
    //       // Quantity valid
    //       product.caseInventoryErrorMessage = '';
    //     }
    //   }

    //   // Update subtotal after inventory validation
    // });
    this.updateSubtotal(product);
  } else {
    // Invalid numeric input
    product.orderCases = 0;
    product.caseInventoryErrorMessage = 'Please enter a valid number of cases.';
    this.updateSubtotal(product);
  }
}


//     checkInventory(product: Product, quantity: number, field: 'orderCases' | 'orderCartons') {
//   const checkInventoryObject = {
//     productId: product.productId,
//     quantity: quantity,
//     field: field
//   };

//   return this.dashboardService.checkInventory(checkInventoryObject).pipe(
//     take(1),
//     map((res: any) => {
//       if (res.statusCode == 200 && !res.data) {
//         if (field === 'orderCases') {
//           product.caseInventoryErrorMessage = res.message;
//         } else {
//           product.cartonInventoryErrorMessage = res.message;
//         }
//         return false;
//       } else {
//         if (field === 'orderCases') product.caseInventoryErrorMessage = '';
//         else product.cartonInventoryErrorMessage = '';
//         return true;
//       }
//     })
//   );
// }

    calculateTotal(): void {
      this.TotalAmount = this.products
        .filter(p => (p.orderCases || 0) > 0 || (p.orderCartons || 0) > 0)
        .reduce((sum, p) => sum + (p.subtotal || 0), 0);
    }

    //   goToConfirmation(): void {
    //     
    //     const invalidCartonItem = this.cart.find(item => item.orderCartons < 5 && item.orderCartons > 0 && item.orderCartons % 5 !== 0);

    //   if (invalidCartonItem) {
    //     this.toaster.error('Cartons must be in multiples of 5.');
    //     return;
    //   }




    //   this.actualCart = this.cart.map(item => {
    //     return {
    //       productId: item.productId,
    //       orderCases: item.orderCases,
    //       orderCartons: item.orderCartons
    //     } as UserCartItem;
    //   });

    //   this.dashboardService.addOrGetCartItems(this.actualCart).subscribe((res: any) => {
    //     if (res.statusCode === 200) {
    //       const serverCart = res.data as OrderPriceValidating[];
    //       let allValid = true;

    //       serverCart.forEach(item => {
    //         const product = this.cart.find(p => p.productId === item.ProductId);
    //         if (product) {
    //           const isCasesEqual = product.orderCases === item.OrderCases;
    //           const isCartonsEqual = product.orderCartons === item.OrderCartons;
    //           const isPricePerCaseEqual = product.productPricePerCase === item.PricePerCase;
    //           const isPricePerCartonEqual = product.productPricePerCarton === item.PricePerCarton;

    //           const calculatedSubtotal = +(item.OrderCases * item.PricePerCase + item.OrderCartons * item.PricePerCarton).toFixed(2);
    //           const isSubtotalEqual = +product.subtotal.toFixed(2) === calculatedSubtotal;

    //           const isProductValid = isCasesEqual && isCartonsEqual && isPricePerCaseEqual && isPricePerCartonEqual && isSubtotalEqual;

    //           if (!isProductValid) {
    //             allValid = false;


    //           } else {
    //             product.orderCases = item.OrderCases;
    //             product.orderCartons = item.OrderCartons;
    //             product.subtotal = calculatedSubtotal;
    //             this.orderStateService.addOrUpdateProduct(product);
    //             // Apply backend-validated values (optional)
    //           }
    //         }
    //       });

    //       if (allValid) {
    //         // Navigate if all validations passed
    //         this.router.navigateByUrl('/dashboard/order-confirmation');
    //       } else {
    //         this.toaster.error(res.message);
    //       }
    //     } else {
    //       this.toaster.error(res.message);
    //     }
    //   });
    // }



    goToConfirmation(form: NgForm): void {
      // ✅ Confirm checkbox validation
      if (!this.isConfirmed) {
        this.showConfirmValidation = true;
        return;
      } else {
        this.showConfirmValidation = false;
      }

      const invalidCartonItem = this.cart.find(item => 
    // Quantity is > 0 but less than 5 or not multiple of 5
    (item.orderCartons > 0 && (item.orderCartons < 5 || item.orderCartons % 5 !== 0)) 
    // OR inventory error exists
    || !!item.cartonInventoryErrorMessage
  );

  // Check for invalid cases
  const invalidCaseItem = this.cart.find(item => 
    // Quantity cannot be negative
    (item.orderCases < 0) 
    // OR inventory error exists
    || !!item.caseInventoryErrorMessage
  );
      
      
      if (invalidCartonItem) {
        // this.toaster.error('Cartons must be in multiples of 5.');
        return;
      }
      if (invalidCaseItem) {
        // this.toaster.error('Please correct the case quantities.');
        return;
      }

      this.actualCart = this.cart.map(item => {
        return {
          productId: item.productId,
          orderCases: item.orderCases,
          orderCartons: item.orderCartons
        } as UserCartItem;
      });

      this.dashboardService.addOrGetCartItems(this.actualCart).subscribe((res: any) => {
        if (res.statusCode === 200) {
          const serverCart = res.data as OrderPriceValidating[];
          let allValid = true;

          serverCart.forEach(item => {
            const product = this.cart.find(p => p.productId === item.ProductId);
            if (product) {
              const isCasesEqual = product.orderCases === item.OrderCases;
              const isCartonsEqual = product.orderCartons === item.OrderCartons;
              const isPricePerCaseEqual = product.productPricePerCase === item.PricePerCase;
              const isPricePerCartonEqual = product.productPricePerCarton === item.PricePerCarton;

              const calculatedSubtotal = +(item.OrderCases * item.PricePerCase + item.OrderCartons * item.PricePerCarton).toFixed(2);
              const isSubtotalEqual = +product.subtotal.toFixed(2) === calculatedSubtotal;

              const isProductValid = isCasesEqual && isCartonsEqual && isPricePerCaseEqual && isPricePerCartonEqual && isSubtotalEqual;

              if (!isProductValid) {
                allValid = false;
              } else {
                product.orderCases = item.OrderCases;
                product.orderCartons = item.OrderCartons;
                product.subtotal = calculatedSubtotal;
                this.orderStateService.addOrUpdateProduct(product);
              }
            }
          });

          if (allValid) {
            this.router.navigateByUrl('/dashboard/order-confirmation');

            // ✅ RESET after successful confirmation
            this.isConfirmed = false;                    // Uncheck the box
            this.showConfirmValidation = false;          // Hide validation
            form.resetForm({ isConfirmed: false });      // Reset form state if needed
          } else {
            this.toaster.error(res.message);
          }
        } else {
          this.toaster.error(res.message);
        }
      });
    }

    getCartItems() {
      this.dashboardService.getCartItems().subscribe((res: any) => {
        if (res.statusCode == 200 && res.data && res.data.length > 0) {
          this.savedCartLength = res.data.length;
        }
        else {
          this.savedCartLength = 0;
        }

      })
    }

    onFocus(product: any, field: 'orderCases' | 'orderCartons') {
      if (product[field] === 0 || product[field] === null) {
        product[field] = ''; // Clear for better UX
      }
    }

    onBlur(product: any, field: 'orderCases' | 'orderCartons') {
      if (product[field] === '' || product[field] === null) {
        product[field] = 0; // Reset to 0 if left empty
      }
    }

    allowOnlyNumbers(event: KeyboardEvent) {
      const allowedKeys = [
        'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'
      ];

      // Allow digits and control keys only
      if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault(); // Block letters and other keys
      }
    }
    setSelectedProduct(product: any) {
      this.selectedProductModal = product;
    }
    onUpdateProduct(productId: any) {

      const encryptedProductId = EncryptionUtil.encrypt(productId);

      this.router.navigate(['/dashboard/account/update-product', encryptedProductId]);
    }


    handleDelete(confirmed: boolean) {
      if (confirmed && this.selectedProductModal) {

        this.dashboardService.deleteProduct(this.selectedProductModal.productId)
          .subscribe((res: any) => {
            if (res && res.statusCode === 200) {
              this.toaster.success(res.message);
              this.getProducts(); // Refresh list
            }
          });
      }
    }
    onSearchTermChange(searchTerm: string) {
      this.page = 1; // Reset to first page
      const term = searchTerm.trim().toLowerCase();

      if (!term) {
        this.filteredProducts = [...this.products];
      } else {
        this.filteredProducts = this.products.filter(product =>
          product.productName.toLowerCase().includes(term) ||
          (product.description && product.description.toLowerCase().includes(term))
        );
      }

      this.updatePagination();
      this.updatePagedProducts();
    }
    toggleActive(product: Product) {
      
      this.dashboardService.activeOrInActiveProduct(product.productId, !product.isActive).subscribe((res: any) => {
        if (res.statusCode === 200) {
          product.isActive = !product.isActive; // Update local state
          this.toaster.success(res.message);
        } else {
          this.toaster.error(res.message);
        }
      });
    }




  }

