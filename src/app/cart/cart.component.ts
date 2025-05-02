import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../core/services/cart.service';
import { CartItem } from '../core/models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: `./cart.component.html`,
  styleUrls: [`./cart.component.css`]
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  
  cartItems: CartItem[] = [];
  cartTotal = 0;
  
  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
    
    this.cartService.getCartTotal().subscribe(total => {
      this.cartTotal = total;
    });
  }
  
  updateQuantity(gameId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(gameId);
      return;
    }
    
    this.cartService.updateQuantity(gameId, quantity);
  }
  
  removeItem(gameId: number): void {
    this.cartService.removeFromCart(gameId);
  }
  
  clearCart(): void {
    this.cartService.clearCart();
  }
  
  checkout(): void {
    alert('Checkout functionality would be implemented here in a complete application.');
  }
}