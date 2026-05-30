import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './products/products.component';

@Injectable({
  providedIn: 'root'
})
export class OrderStateService {

   private cartSubject = new BehaviorSubject<Product[]>([]);
  public cart$ = this.cartSubject.asObservable();

  addOrUpdateProduct(product: Product): void {
     
    if (!product || !product.productId) {
    return;
  }

    const cart = this.cartSubject.value;
    const index = cart.findIndex(p => p.productId === product.productId);

    if ((product.orderCases || 0) > 0 || (product.orderCartons || 0) > 0) {
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

  getCart(): Product[] {
    return this.cartSubject.value;
  }
  setCart(products: Product[]): void {
  this.cartSubject.next(products);
}

  clearCart(): void {
    this.cartSubject.next([]);
  }

  
}
