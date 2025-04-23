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
  template: '<div class="game-card card"><div class="game-image-container"><img [src]="game.imageUrl" [alt]="game.title" class="game-image"><div class="game-rating"><span class="material-icons">star</span><span>{{ game.rating }}</span></div></div><div class="game-info"><h3 class="game-title">{{ game.title }}</h3><p class="game-developer">{{ game.developer }}</p><p class="game-description">{{ game.shortDescription }}</p><div class="game-meta"><div class="game-genres"><span class="game-genre" *ngFor="let genre of game.genres.slice(0, 2)">{{ genre }}</span></div><div class="game-price">${{ game.price }}</div></div><div class="game-actions"><a routerLink="/catalog/{{ game.id }}" class="btn-outline details-btn">More Info</a><button class="btn-primary add-btn" (click)="addToCart()" [disabled]="isInCart" [class.in-cart]="isInCart"><span class="material-icons">{{ isInCart ? "check" : "add_shopping_cart" }}</span>{{ isInCart ? "Added" : "Add to Cart" }}</button></div></div></div>',
  styles: [`
    .game-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .game-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .game-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .game-card:hover .game-image {
      transform: scale(1.05);
    }

    .game-rating {
      position: absolute;
      top: var(--space-sm);
      right: var(--space-sm);
      background-color: rgba(0, 0, 0, 0.7);
      color: var(--accent-400);
      border-radius: var(--radius-sm);
      padding: 2px var(--space-xs);
      display: flex;
      align-items: center;
      font-weight: 500;
    }

    .game-rating .material-icons {
      font-size: 16px;
      margin-right: 2px;
    }

    .game-info {
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .game-title {
      font-size: 1.2rem;
      margin-bottom: var(--space-xs);
      color: var(--neutral-900);
    }

    .game-developer {
      color: var(--neutral-600);
      font-size: 0.9rem;
      margin-bottom: var(--space-sm);
    }

    .game-description {
      color: var(--neutral-700);
      font-size: 0.95rem;
      margin-bottom: var(--space-md);
      line-height: 1.4;
      flex: 1;
    }

    .game-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .game-genres {
      display: flex;
      gap: var(--space-xs);
    }

    .game-genre {
      background-color: var(--primary-100);
      color: var(--primary-700);
      padding: 2px var(--space-xs);
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
    }

    .game-price {
      font-weight: 700;
      color: var(--primary-700);
      font-size: 1.1rem;
    }

    .game-actions {
      display: flex;
      gap: var(--space-sm);
    }

    .details-btn, .add-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xs) var(--space-sm);
      font-size: 0.9rem;
    }

    .details-btn:hover {
      background-color: var(--primary-50);
    }

    .add-btn .material-icons {
      font-size: 16px;
      margin-right: var(--space-xs);
    }

    .add-btn.in-cart {
      background-color: var(--success-600);
    }

    .add-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `]
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