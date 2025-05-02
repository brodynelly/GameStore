import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart-item.model';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private cartTotalSubject = new BehaviorSubject<number>(0);
  public cartTotal$ = this.cartTotalSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.updateCartState();
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.updateCartState();
  }

  private updateCartState(): void {
    this.cartItemsSubject.next([...this.cartItems]);
    this.updateTotals();
  }

  private updateTotals(): void {
    const total = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);

    this.cartTotalSubject.next(total);
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

    this.saveCart();
  }

  removeFromCart(gameId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== gameId);
    this.saveCart();
  }

  updateQuantity(gameId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.id === gameId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(gameId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem('cart');
    this.updateCartState();
  }

  isInCart(gameId: number): boolean {
    return this.cartItems.some(item => item.id === gameId);
  }

  // New functionality: Sync cart with backend
  syncCartWithBackend(): Observable<any> {
    return this.http.post(this.apiUrl, { cart: this.cartItems });
  }
}