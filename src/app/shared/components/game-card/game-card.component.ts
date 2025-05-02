import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  get isInCart(): boolean {
    return this.cartService.isInCart(this.game.id);
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      // If not logged in, navigate to login (would add a toast in a real app)
      alert('Please log in to add items to your cart');
      return;
    }

    if (!this.isInCart) {
      this.cartService.addToCart(this.game);
    }
  }
}