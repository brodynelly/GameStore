import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  private cartTotalSubject = new BehaviorSubject<number>(0);
  public cartTotal$ = this.cartTotalSubject.asObservable();
  
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();
  
  constructor() {
    // Load cart from localStorage if available
    this.loadCart();
  }
  
  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(this.cartItems);
      this.updateTotals();
    }
  }
  
  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.updateTotals();
  }
  
  private updateTotals(): void {
    const total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.cartTotalSubject.next(total);
    
    const count = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountSubject.next(count);
  }
  
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }
  
  getCartTotal(): Observable<number> {
    return this.cartTotal$;
  }
  
  getCartCount(): Observable<number> {
    return this.cartCount$;
  }
  
  addToCart(game: Game): void {
    const existingItem = this.cartItems.find(item => item.id === game.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        id: game.id,
        title: game.title,
        price: game.price,
        imageUrl: game.imageUrl,
        quantity: 1
      });
    }
    
    this.cartItemsSubject.next([...this.cartItems]);
    this.saveCart();
  }
  
  removeFromCart(gameId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== gameId);
    this.cartItemsSubject.next([...this.cartItems]);
    this.saveCart();
  }
  
  updateQuantity(gameId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.id === gameId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(gameId);
      } else {
        item.quantity = quantity;
        this.cartItemsSubject.next([...this.cartItems]);
        this.saveCart();
      }
    }
  }
  
  clearCart(): void {
    this.cartItems = [];
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cart');
    this.updateTotals();
  }
  
  isInCart(gameId: number): boolean {
    return this.cartItems.some(item => item.id === gameId);
  }
}