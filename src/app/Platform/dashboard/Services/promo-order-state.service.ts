import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PromoProduct } from '../promo-products/promo-products.component';

@Injectable({
  providedIn: 'root'
})
export class PromoOrderStateService {


  private cartSubject = new BehaviorSubject<PromoProduct[]>([]);
    public cart$ = this.cartSubject.asObservable();
  
    addOrUpdateProduct(product: PromoProduct): void {
       
      if (!product || !product.productId) {
      return;
    }
  
      const cart = this.cartSubject.value;
      const index = cart.findIndex(p => p.productId === product.productId);
  
      if ((product.productQuantity || 0)) {
        if (index >= 0) {
          cart[index] = product;
        } else {
          cart.push(product);
        }
      } else {
        // Remove from cart if quantities are zero
        if (index >= 0) cart.splice(index, 1);
      }
  
      this.cartSubject.next([...cart]); // trigger update
    }
  
    getCart(): PromoProduct[] {
      return this.cartSubject.value;
    }
    setCart(products: PromoProduct[]): void {
    this.cartSubject.next(products);
  }
  
    clearCart(): void {
      this.cartSubject.next([]);
    }
  
}
