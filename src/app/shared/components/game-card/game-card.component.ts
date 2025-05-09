import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Game } from '../../../core/models/game.model';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game-card.component.html',
  styleUrls: [`./game-card.component.css`]
})
export class GameCardComponent {
  @Input() game!: Game;

  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  get isInCart(): boolean {
    return this.cartService.isInCart(this.game.id);
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      // Redirect to login if not logged in
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.cartService.addToCart(this.game.id).subscribe({
      next: (response) => {
        console.log('Game added to cart:', response);
      },
      error: (err) => {
        console.error('Failed to add game to cart:', err);
      }
    });
  }
}