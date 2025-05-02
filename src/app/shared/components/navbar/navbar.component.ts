import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: [`./navbar.component.css`]
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