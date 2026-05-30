import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionUtil } from '../../../Core/common/CommonMethods/encryptdecrypt';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-update-products',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-update-products.component.html',
  styleUrl: './add-update-products.component.css'
})

export class AddUpdateProductsComponent implements OnInit {
  productForm!: FormGroup;
  selectedFile: File | null = null;
  isUpdateMode: boolean = false;
  selectedProductType: string = 'sales';
  productIdTobeUpdate: number = 0;
  productImagePreview: string | ArrayBuffer | null = null;
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private toasterService = inject(ToastrService);
  private router = inject(Router);
  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productId: [0],
      productName: ['', Validators.required],
      productType: ['', Validators.required],
      description: ['', Validators.required],
      isFeatured: [false],
      promoPrice: [0],
      quantityInCases: [0, [Validators.required, Validators.min(0)]],
      quantityInCartons: [0, [Validators.required, Validators.min(0)]],
      //priceDistributor: [0],
      quantity:[0,[Validators.required, Validators.min(0)]],
      pricePerCaseForRetailer: [0],
      pricePerCartonForRetailer: [0],
      pricePerCaseDistributor: [0],
      pricePerCartonDistributor: [0],
      productBase64: [''],
      productImageName: [''],

      // Nested Product Promotion
      productPromotion: this.fb.group({
        promotionId: [0],
        productId: [0],
        promoStartDate: [Date],
        promoEndDate: [Date],
        promoDetails: ['']
      }),

      // Nested Product Promotion Limit
      productPromotionLimit: this.fb.group({
        limitId: [0],
        productId: [0],
        minQuantity: [0],
        maxQuantity: [0]
      })
    });

    this.route.paramMap.subscribe(params => {
      const id = EncryptionUtil.decrypt(params.get('id')!);
      this.productIdTobeUpdate = Number(id);
      if (id) {
        this.isUpdateMode = true;
        this.productService.getProductById(Number(id)).subscribe((res: any) => {
          if (res.statusCode === 200) {
            const product = res.data;

            if (product.productType == 'promo' || product.productType == 'Promo') {

              this.productForm.patchValue({
                ...product,
                productBase64: product.productBase64,

                productImageName: product.productImageName,
                productPromotion: {
                  promotionId: product.productPromotion.promotionId || 0,
                  productId: product.productId,
                  promoStartDate: product.productPromotion.promoStartDate
                    ? product.productPromotion.promoStartDate.split('T')[0]
                    : null,   // Convert to yyyy-MM-dd
                  promoEndDate: product.productPromotion.promoEndDate
                    ? product.productPromotion.promoEndDate.split('T')[0]
                    : null,
                  promoDetails: product.productPromotion.promoDetails || ''
                },
                productPromotionLimit: product.productPromotionLimit || {
                  limitId: product.productPromotionLimit?.limitId || 0,
                  productId: product.productId,
                  minQuantity: product.productPromotionLimit?.minQuantity || 0,
                  maxQuantity: product.productPromotionLimit?.maxQuantity || 0
                }
              });
              const mimeType = 'image/jpeg'; // or 'image/png' depending on your data
              this.productImagePreview = `data:${mimeType};base64,${product.productBase64}`;


            }
            else {
              this.productForm.patchValue({
                ...product,
                productBase64: product.productBase64,
              });
              const mimeType = 'image/jpeg'; // or 'image/png' depending on your data
              this.productImagePreview = `data:${mimeType};base64,${product.productBase64}`;
            }
            if (product.productType) {
              this.selectedProductType = product.productType;
            }
          }
        });
      }


    });

    this.productForm.get('productType')?.valueChanges.subscribe((type) => {
      const promoPriceCtrl = this.productForm.get('promoPrice');
      //const priceDistributorCtrl = this.productForm.get('priceDistributor');

      const caseRetailerCtrl = this.productForm.get('pricePerCaseForRetailer');
      const cartonRetailerCtrl = this.productForm.get('pricePerCartonForRetailer');
      const caseDistributorCtrl = this.productForm.get('pricePerCaseDistributor');
      const cartonDistributorCtrl = this.productForm.get('pricePerCartonDistributor');
      const casesQualityCtrl = this.productForm.get('quantityInCases');
      const cartonsQualityCtrl = this.productForm.get('quantityInCartons');
      const qualityCtrl = this.productForm.get('quality');
      const promoGroup = this.productForm.get('productPromotion') as FormGroup;
      const promoLimitGroup = this.productForm.get('productPromotionLimit') as FormGroup;

      if (type === 'promo') {
        promoPriceCtrl?.setValidators([Validators.required, Validators.min(0.01)]);
        //priceDistributorCtrl?.setValidators([Validators.required, Validators.min(0.01)]);
        casesQualityCtrl?.clearValidators();
        cartonsQualityCtrl?.clearValidators();
        caseRetailerCtrl?.clearValidators();
        cartonRetailerCtrl?.clearValidators();
        caseDistributorCtrl?.clearValidators();
        cartonDistributorCtrl?.clearValidators();

        this.productForm.get('quality')?.setValidators([Validators.required]);
        promoGroup.get('promoStartDate')?.setValidators([Validators.required]);
        promoGroup.get('promoEndDate')?.setValidators([Validators.required]);
        promoGroup.get('promoDetails')?.setValidators([Validators.required]);

        promoLimitGroup.get('minQuantity')?.setValidators([Validators.required, Validators.min(1)]);
        promoLimitGroup.get('maxQuantity')?.setValidators([Validators.required, Validators.min(1)]);
      }
      else if (type === 'sales') {
        caseRetailerCtrl?.setValidators([Validators.required, Validators.min(0.01)]);
        cartonRetailerCtrl?.setValidators([Validators.required, Validators.min(0.01)]);
        caseDistributorCtrl?.setValidators([Validators.required, Validators.min(0.01)]);
        cartonDistributorCtrl?.setValidators([Validators.required, Validators.min(0.01)]);
        casesQualityCtrl?.setValidators([Validators.required, Validators.min(0)]);
        cartonsQualityCtrl?.setValidators([Validators.required, Validators.min(0)]);
        promoPriceCtrl?.clearValidators();
        this.productForm.get('quality')?.clearValidators();
        //priceDistributorCtrl?.clearValidators();  
        cartonsQualityCtrl
        promoPriceCtrl?.clearValidators();
        //priceDistributorCtrl?.clearValidators();

        promoGroup.get('promoStartDate')?.clearValidators();
        promoGroup.get('promoEndDate')?.clearValidators();
        promoGroup.get('promoDetails')?.clearValidators();

        promoLimitGroup.get('minQuantity')?.clearValidators();
        promoLimitGroup.get('maxQuantity')?.clearValidators();
      }

      // Update all validations
      promoPriceCtrl?.updateValueAndValidity();
      //priceDistributorCtrl?.updateValueAndValidity();

      casesQualityCtrl?.updateValueAndValidity();
        cartonsQualityCtrl?.updateValueAndValidity();
      caseRetailerCtrl?.updateValueAndValidity();
      cartonRetailerCtrl?.updateValueAndValidity();
      caseDistributorCtrl?.updateValueAndValidity();
      cartonDistributorCtrl?.updateValueAndValidity();
      promoGroup.updateValueAndValidity();
      promoLimitGroup.updateValueAndValidity();
    });

  }

  onFileSelected(event: any) {

    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the prefix "data:image/...;base64," if present
        let base64String = (reader.result as string).split(',')[1];

        this.productForm.patchValue({
          productBase64: base64String,
          productImageName: file.name
        });
        this.productImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  // Save Product
  onSaveProduct(): void {

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (this.productForm.get('productId')?.value > 0) {
      const productData = this.productForm.value;
      this.productService.updateProduct(productData).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.toasterService.success(res.message);
          if (this.selectedProductType == 'promo') {
            this.router.navigate(['/dashboard/promo-products']);
          } else {
            this.router.navigate(['/dashboard/products']);
          }
        }
      });
    }
    else {

      const productData = this.productForm.value;
      this.productService.addProduct(productData).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.toasterService.success(res.message);
          this.productForm.reset();
          if (this.selectedProductType == 'promo') {
            this.router.navigate(['/dashboard/promo-products']);
          } else {
            this.router.navigate(['/dashboard/products']);
          }
        }
      });



    }


    // if (this.isUpdateMode) {
    //   // this.productService.updateProduct(productData).subscribe(res => {
    //   // });
    // } else {
    //  
    // }
  }
  onPriceInput(event: any, controlName: string): void {
    let value = event.target.value.replace(/[^0-9.]/g, '');

    // Remove leading zeros
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }
    if (value.startsWith('0') && value.length > 1 && !value.startsWith('0.')) {
      value = value.replace(/^0+/, '');
      event.target.value = value;
      this.productForm.get(controlName)?.setValue(value, { emitEvent: false });
    }
  }

  // Edit existing product (prefill form)
  editProduct(product: any): void {
    this.isUpdateMode = true;
    this.productForm.patchValue(product);
  }
  onImageUpload(event: any) {

  }
  onProductTypeChange(event: any) {
    this.selectedProductType = event.target.value;

    this.productForm.markAsUntouched();
  }
  onNumericInput(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    // Remove any non-digit and non-decimal characters
    input.value = input.value.replace(/[^0-9.]/g, '');

    // Optional: prevent multiple decimals
    const parts = input.value.split('.');
    if (parts.length > 2) {
      input.value = parts[0] + '.' + parts[1];
    }

    // Update the form control value
    this.productForm.get(controlName)?.setValue(input.value);
  }

}
