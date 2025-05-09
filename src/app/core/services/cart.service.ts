import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartItem } from '../models/cart-item.model';
import { Game } from '../models/game.model';
import { AuthService } from './auth.service';
import { switchMap, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private staticPortUrl = 'http://localhost:3000'; // Static server URL
  private dynamicApiUrl: string | null = null; // Dynamic backend API URL
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private cartTotalSubject = new BehaviorSubject<number>(0);
  public cartTotal$ = this.cartTotalSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadCart();

    // Subscribe to auth state changes to sync cart
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.syncCartWithBackend().subscribe();
      } else {
        this.clearCart();
      }
    });
  }

  // Fetch the dynamic port from the static server
  private getDynamicPort(): Observable<number> {
    return this.http.get<{ dynamicPort: number }>(`${this.staticPortUrl}`).pipe(
      map((response) => {
        console.log('Response from static server:', response); // Log the response
        if (!response.dynamicPort) {
          throw new Error('Dynamic port not found in response');
        }
        console.log('Extracted dynamic port:', response.dynamicPort); // Log the extracted dynamic port
        return response.dynamicPort; // Return the dynamic port
      })
    );
  }

  // Ensure the dynamic API URL is set
  private ensureDynamicApiUrl(): Observable<string> {
    if (this.dynamicApiUrl) {
      return new Observable((observer) => {
        observer.next(this.dynamicApiUrl);
        observer.complete();
      });
    } else {
      return this.getDynamicPort().pipe(
        map((dynamicPort) => {
          this.dynamicApiUrl = `http://localhost:${dynamicPort}/api/cart`;
          console.log('Constructed dynamic API URL:', this.dynamicApiUrl); // Log the constructed API URL
          return this.dynamicApiUrl;
        })
      );
    }
  }

  private getHeaders(): HttpHeaders {
    const user = this.authService.getCurrentUser();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'user-id': user?.id?.toString() || '',
    });
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

    // Sync with backend if user is logged in
    if (this.authService.isLoggedIn()) {
      this.syncCartWithBackend().subscribe();
    }
  }

  private updateCartState(): void {
    this.cartItemsSubject.next([...this.cartItems]);
    this.updateTotals();
  }

  private updateTotals(): void {
    const total = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
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

  addToCart(game: Game): Observable<any> {
    const existingItem = this.cartItems.find((item) => item.id === game.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        id: game.id,
        title: game.title,
        price: game.price,
        imageUrl: game.imageUrl,
        quantity: 1,
      });
    }

    this.saveCart();

    // If user is logged in, sync with backend
    if (this.authService.isLoggedIn()) {
      return this.ensureDynamicApiUrl().pipe(
        switchMap((apiUrl) =>
          this.http.post(
            apiUrl,
            { gameId: game.id, quantity: 1 },
            { headers: this.getHeaders() }
          )
        ),
        tap((response: any) => {
          if (response && response.cart) {
            this.cartItems = response.cart;
            this.updateCartState();
          }
        })
      );
    }

    return of(null);
  }

  removeFromCart(gameId: number): Observable<any> {
    this.cartItems = this.cartItems.filter((item) => item.id !== gameId);
    this.saveCart();

    // If user is logged in, sync with backend
    if (this.authService.isLoggedIn()) {
      return this.ensureDynamicApiUrl().pipe(
        switchMap((apiUrl) =>
          this.http.delete(`${apiUrl}/${gameId}`, { headers: this.getHeaders() })
        ),
        tap((response: any) => {
          if (response && response.cart) {
            this.cartItems = response.cart;
            this.updateCartState();
          }
        })
      );
    }

    return of(null);
  }

  updateQuantity(gameId: number, quantity: number): Observable<any> {
    const item = this.cartItems.find((item) => item.id === gameId);

    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(gameId);
      } else {
        item.quantity = quantity;
        this.saveCart();

        // If user is logged in, sync with backend
        if (this.authService.isLoggedIn()) {
          return this.ensureDynamicApiUrl().pipe(
            switchMap((apiUrl) =>
              this.http.put(
                apiUrl,
                { gameId, quantity },
                { headers: this.getHeaders() }
              )
            ),
            tap((response: any) => {
              if (response && response.cart) {
                this.cartItems = response.cart;
                this.updateCartState();
              }
            })
          );
        }
      }
    }

    return of(null);
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem('cart');
    this.updateCartState();
  }

  isInCart(gameId: number): boolean {
    return this.cartItems.some((item) => item.id === gameId);
  }

  // Sync cart with backend
  syncCartWithBackend(): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return of(null);
    }

    return this.ensureDynamicApiUrl().pipe(
      switchMap((apiUrl) =>
        this.http.get<CartItem[]>(apiUrl, { headers: this.getHeaders() })
      ),
      tap((items) => {
        this.cartItems = items;
        this.updateCartState();
      })
    );
  }
}