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
  template: `
    <div class="cart-container">
      <div class="container">
        <h1 class="cart-title">Shopping Cart</h1>
        
        <ng-container *ngIf="cartItems.length > 0; else emptyCart">
          <div class="cart-content">
            <div class="cart-items">
              <div class="cart-item fade-in" *ngFor="let item of cartItems">
                <div class="item-image">
                  <img [src]="item.imageUrl" [alt]="item.title">
                </div>
                
                <div class="item-details">
                  <h3 class="item-title">{{item.title}}</h3>
                  <div class="item-price">{{item.price | currency}}</div>
                </div>
                
                <div class="item-quantity">
                  <button class="qty-btn" (click)="updateQuantity(item.id, item.quantity - 1)" [disabled]="item.quantity <= 1">
                    <span class="material-icons">remove</span>
                  </button>
                  <input type="number" class="qty-input" [(ngModel)]="item.quantity" (change)="updateQuantity(item.id, item.quantity)" min="1">
                  <button class="qty-btn" (click)="updateQuantity(item.id, item.quantity + 1)">
                    <span class="material-icons">add</span>
                  </button>
                </div>
                
                <div class="item-total">{{item.price * item.quantity | currency}}</div>
                
                <button class="remove-btn" (click)="removeItem(item.id)">
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </div>
            
            <div class="cart-sidebar">
              <div class="cart-summary">
                <h2 class="summary-title">Order Summary</h2>
                
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>{{cartTotal | currency}}</span>
                </div>
                
                <div class="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                
                <div class="summary-row">
                  <span>Tax</span>
                  <span>{{cartTotal * 0.07 | currency}}</span>
                </div>
                
                <div class="summary-divider"></div>
                
                <div class="summary-row total">
                  <span>Total</span>
                  <span>{{(cartTotal + (cartTotal * 0.07)) | currency}}</span>
                </div>
                
                <button class="btn btn-primary checkout-btn" (click)="checkout()">
                  Proceed to Checkout
                </button>
                
                <a routerLink="/catalog" class="btn-link continue-shopping">
                  <span class="material-icons">arrow_back</span>
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </ng-container>
        
        <ng-template #emptyCart>
          <div class="empty-cart">
            <span class="material-icons empty-cart-icon">shopping_cart</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any games to your cart yet.</p>
            <a routerLink="/catalog" class="btn btn-primary">Browse Games</a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      padding: var(--space-xl) 0;
    }
    
    .cart-title {
      font-size: 2.5rem;
      margin-bottom: var(--space-xl);
      color: var(--neutral-900);
    }
    
    .cart-content {
      display: flex;
      gap: var(--space-xl);
    }
    
    .cart-items {
      flex: 2;
    }
    
    .cart-sidebar {
      flex: 1;
    }
    
    .cart-item {
      display: flex;
      align-items: center;
      background-color: white;
      border-radius: var(--radius-md);
      padding: var(--space-md);
      margin-bottom: var(--space-md);
      box-shadow: var(--shadow-sm);
      position: relative;
    }
    
    .item-image {
      width: 80px;
      height: 80px;
      margin-right: var(--space-md);
    }
    
    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--radius-sm);
    }
    
    .item-details {
      flex: 2;
      margin-right: var(--space-md);
    }
    
    .item-title {
      font-size: 1.2rem;
      margin-bottom: var(--space-xs);
      color: var(--neutral-900);
    }
    
    .item-price {
      color: var(--neutral-600);
    }
    
    .item-quantity {
      display: flex;
      align-items: center;
      margin-right: var(--space-md);
    }
    
    .qty-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--neutral-100);
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    
    .qty-btn:hover {
      background-color: var(--neutral-200);
    }
    
    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .qty-input {
      width: 50px;
      height: 32px;
      padding: 0 var(--space-xs);
      text-align: center;
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius-sm);
      margin: 0 var(--space-xs);
    }
    
    .item-total {
      font-weight: 700;
      color: var(--primary-700);
      min-width: 80px;
      text-align: right;
      margin-right: var(--space-md);
    }
    
    .remove-btn {
      background: none;
      border: none;
      color: var(--neutral-500);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.3s ease;
    }
    
    .remove-btn:hover {
      color: var(--error-600);
    }
    
    .cart-summary {
      background-color: white;
      border-radius: var(--radius-md);
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);
    }
    
    .summary-title {
      font-size: 1.5rem;
      margin-bottom: var(--space-lg);
      color: var(--neutral-900);
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-md);
      color: var(--neutral-700);
    }
    
    .summary-row.total {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--neutral-900);
    }
    
    .summary-divider {
      height: 1px;
      background-color: var(--neutral-300);
      margin: var(--space-md) 0;
    }
    
    .checkout-btn {
      width: 100%;
      padding: var(--space-md);
      margin-bottom: var(--space-md);
    }
    
    .continue-shopping {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-600);
      text-decoration: none;
    }
    
    .continue-shopping .material-icons {
      margin-right: var(--space-xs);
    }
    
    .empty-cart {
      text-align: center;
      padding: var(--space-xxl) 0;
    }
    
    .empty-cart-icon {
      font-size: 5rem;
      color: var(--neutral-400);
      margin-bottom: var(--space-md);
    }
    
    .empty-cart h2 {
      font-size: 2rem;
      margin-bottom: var(--space-sm);
      color: var(--neutral-800);
    }
    
    .empty-cart p {
      color: var(--neutral-600);
      margin-bottom: var(--space-lg);
    }
    
    @media (max-width: 992px) {
      .cart-content {
        flex-direction: column;
      }
      
      .cart-sidebar {
        width: 100%;
      }
    }
    
    @media (max-width: 768px) {
      .cart-item {
        flex-wrap: wrap;
      }
      
      .item-details {
        flex: 1 0 calc(100% - 100px);
        margin-bottom: var(--space-sm);
      }
      
      .item-quantity {
        order: 3;
        margin-right: auto;
      }
      
      .item-total {
        order: 4;
      }
      
      .remove-btn {
        order: 5;
      }
    }
    
    @media (max-width: 576px) {
      .cart-title {
        font-size: 2rem;
      }
    }
  `]
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