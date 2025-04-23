import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled">
      <div class="container navbar-container">
        <a routerLink="/" class="navbar-brand">
          <span class="brand-text">Game Store</span>
        </a>
        
        <div class="nav-toggle" (click)="toggleMenu()">
          <span class="material-icons">{{ isMenuOpen ? 'close' : 'menu' }}</span>
        </div>
        
        <div class="navbar-menu" [class.open]="isMenuOpen">
          <div class="navbar-start">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="navbar-item">Home</a>
            <a routerLink="/catalog" routerLinkActive="active" class="navbar-item">Games</a>
          </div>
          
          <div class="navbar-end">
            <a routerLink="/cart" routerLinkActive="active" class="navbar-item cart-link">
              <span class="material-icons">shopping_cart</span>
              <span class="cart-count" *ngIf="cartCount > 0">{{ cartCount }}</span>
            </a>
            
            <ng-container *ngIf="isLoggedIn; else authLinks">
              <a class="navbar-item user-link">
                <span class="material-icons">person</span>
                <span class="username">{{ username }}</span>
              </a>
              <a class="navbar-item" (click)="logout()">Logout</a>
            </ng-container>
            
            <ng-template #authLinks>
              <a routerLink="/auth/login" routerLinkActive="active" class="navbar-item">Login</a>
              <a routerLink="/auth/register" routerLinkActive="active" class="navbar-item register-btn">Register</a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: var(--primary-600);
      color: white;
      z-index: 1000;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    .navbar.scrolled {
      background-color: var(--primary-700);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      padding: 0 var(--space-md);
    }
    
    .navbar-brand {
      display: flex;
      align-items: center;
      color: white;
      font-weight: 700;
      font-size: 1.5rem;
      text-decoration: none;
    }
    
    .brand-text {
      margin-left: var(--space-xs);
    }
    
    .navbar-menu {
      display: flex;
      flex: 1;
      justify-content: space-between;
      margin-left: var(--space-lg);
    }
    
    .navbar-start, .navbar-end {
      display: flex;
      align-items: center;
    }
    
    .navbar-item {
      color: white;
      padding: var(--space-sm) var(--space-md);
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.3s ease;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    
    .navbar-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .navbar-item.active {
      position: relative;
    }
    
    .navbar-item.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background-color: var(--secondary-400);
      border-radius: var(--radius-full);
    }
    
    .cart-link {
      position: relative;
    }
    
    .cart-count {
      position: absolute;
      top: -5px;
      right: 2px;
      background-color: var(--accent-600);
      color: white;
      font-size: 0.75rem;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .register-btn {
      background-color: var(--secondary-500);
      border-radius: var(--radius-md);
      margin-left: var(--space-sm);
    }
    
    .register-btn:hover {
      background-color: var(--secondary-600);
    }
    
    .user-link {
      color: var(--accent-100);
    }
    
    .username {
      margin-left: var(--space-xs);
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .nav-toggle {
      display: none;
      cursor: pointer;
    }
    
    @media (max-width: 768px) {
      .navbar-container {
        height: 56px;
      }
      
      .navbar-menu {
        position: fixed;
        top: 56px;
        left: 0;
        width: 100%;
        height: 0;
        background-color: var(--primary-700);
        flex-direction: column;
        overflow: hidden;
        transition: height 0.3s ease;
        margin-left: 0;
      }
      
      .navbar-menu.open {
        height: auto;
        padding-bottom: var(--space-md);
      }
      
      .navbar-start, .navbar-end {
        flex-direction: column;
        width: 100%;
      }
      
      .navbar-item {
        width: 100%;
        padding: var(--space-md);
      }
      
      .navbar-item.active::after {
        display: none;
      }
      
      .nav-toggle {
        display: block;
      }
      
      .register-btn {
        margin-left: 0;
        margin-top: var(--space-xs);
      }
    }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  
  isLoggedIn = false;
  username = '';
  cartCount = 0;
  scrolled = false;
  isMenuOpen = false;
  
  constructor() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username || '';
    });
    
    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
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