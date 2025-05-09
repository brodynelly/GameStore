import { Component, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: [`./navbar.component.css`]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  
  isLoggedIn = false;
  userEmail = '';
  cartCount = 0;
  scrolled = false;
  isMenuOpen = false;
  
  private subscriptions: Subscription[] = [];
  
  ngOnInit() {
    // Subscribe to auth state changes
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.isLoggedIn = !!user;
        this.userEmail = user?.email || '';
        console.log('Auth state changed:', { isLoggedIn: this.isLoggedIn, userEmail: this.userEmail });
      })
    );
    
    // Subscribe to cart count changes
    this.subscriptions.push(
      this.cartService.getCartCount().subscribe(count => {
        this.cartCount = count;
        console.log('Cart count updated:', count);
      })
    );
  }
  
  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > 20;
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
  }
}