import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GameService } from '../../core/services/game.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Game } from '../../core/models/game.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: '<div class="product-detail-container"><div class="container"><div class="back-link"><a routerLink="/catalog" class="btn-link"><span class="material-icons">arrow_back</span>Back to Catalog</a></div><ng-container *ngIf="!isLoading && game; else loadingTemplate"><div class="product-detail fade-in"><div class="product-image-container"><img [src]="game.imageUrl" [alt]="game.title" class="product-image"><div class="product-badge" *ngIf="game.inStock">In Stock</div></div><div class="product-info"><div class="product-header"><h1 class="product-title">{{ game.title }}</h1><div class="product-rating"><div class="rating-stars"><span class="material-icons" *ngFor="let star of getStars(game.rating)">{{ star === "full" ? "star" : (star === "half" ? "star_half" : "star_border") }}</span></div><span class="rating-number">{{ game.rating.toFixed(1) }}</span></div></div><div class="product-developer"><span class="label">Developer:</span> {{ game.developer }}</div><div class="product-genres"><span class="genre-tag" *ngFor="let genre of game.genres">{{ genre }}</span></div><div class="product-description"><p>{{ game.description }}</p></div><div class="product-meta"><div class="meta-item"><span class="label">Release Date:</span><span>{{ formatDate(game.releaseDate) }}</span></div></div><div class="product-action"><div class="product-price">${{ game.price }}</div><button class="btn btn-primary add-to-cart-btn" [disabled]="isInCart" [class.in-cart]="isInCart" (click)="addToCart(game)"><span class="material-icons">{{ isInCart ? "check" : "add_shopping_cart" }}</span>{{ isInCart ? "Added to Cart" : "Add to Cart" }}</button></div></div></div></ng-container><ng-template #loadingTemplate><div class="loading-container"><div class="spinner"></div><p>Loading game details...</p></div></ng-template><div class="error-message" *ngIf="errorMessage"><p>{{ errorMessage }}</p><a routerLink="/catalog" class="btn btn-primary">Return to Catalog</a></div></div></div>',
  styles: [`
    .product-detail-container {
      padding: var(--space-xl) 0;
    }

    .back-link {
      margin-bottom: var(--space-md);
    }

    .btn-link {
      display: inline-flex;
      align-items: center;
      color: var(--primary-600);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .btn-link:hover {
      color: var(--primary-700);
    }

    .btn-link .material-icons {
      margin-right: var(--space-xs);
    }

    .product-detail {
      display: flex;
      gap: var(--space-xl);
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .product-image-container {
      flex: 1;
      position: relative;
      max-width: 500px;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-badge {
      position: absolute;
      top: var(--space-md);
      right: var(--space-md);
      background-color: var(--success-500);
      color: white;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
      font-weight: 500;
    }

    .product-info {
      flex: 1;
      padding: var(--space-xl);
      display: flex;
      flex-direction: column;
    }

    .product-header {
      margin-bottom: var(--space-md);
    }

    .product-title {
      font-size: 2.5rem;
      color: var(--neutral-900);
      margin-bottom: var(--space-sm);
    }

    .product-rating {
      display: flex;
      align-items: center;
    }

    .rating-stars {
      display: flex;
      color: var(--accent-500);
      margin-right: var(--space-sm);
    }

    .rating-number {
      color: var(--neutral-600);
      font-weight: 500;
    }

    .product-developer {
      margin-bottom: var(--space-md);
      color: var(--neutral-700);
    }

    .label {
      font-weight: 500;
      color: var(--neutral-900);
    }

    .product-genres {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
      margin-bottom: var(--space-md);
    }

    .genre-tag {
      background-color: var(--primary-100);
      color: var(--primary-700);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
    }

    .product-description {
      margin-bottom: var(--space-md);
      line-height: 1.6;
      color: var(--neutral-800);
      flex: 1;
    }

    .product-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      margin-bottom: var(--space-md);
      color: var(--neutral-700);
    }

    .product-action {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-top: var(--space-md);
    }

    .product-price {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-700);
    }

    .add-to-cart-btn {
      display: flex;
      align-items: center;
      padding: var(--space-sm) var(--space-lg);
    }

    .add-to-cart-btn .material-icons {
      margin-right: var(--space-sm);
    }

    .add-to-cart-btn.in-cart {
      background-color: var(--success-600);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-xxl);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: var(--primary-600);
      animation: spin 1s ease-in-out infinite;
      margin-bottom: var(--space-md);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      text-align: center;
      padding: var(--space-xxl);
      color: var(--error-700);
    }

    .error-message p {
      margin-bottom: var(--space-md);
      font-size: 1.2rem;
    }

    @media (max-width: 992px) {
      .product-detail {
        flex-direction: column;
      }

      .product-image-container {
        max-width: 100%;
        height: 300px;
      }

      .product-title {
        font-size: 2rem;
      }
    }

    @media (max-width: 576px) {
      .product-title {
        font-size: 1.5rem;
      }

      .product-action {
        flex-direction: column;
        align-items: flex-start;
      }

      .add-to-cart-btn {
        width: 100%;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gameService = inject(GameService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  game: Game | null = null;
  isLoading = true;
  errorMessage = '';

  get isInCart(): boolean {
    return this.game ? this.cartService.isInCart(this.game.id) : false;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];

      if (isNaN(id)) {
        this.errorMessage = 'Invalid game ID';
        this.isLoading = false;
        return;
      }

      this.loadGame(id);
    });
  }

  loadGame(id: number): void {
    this.isLoading = true;

    this.gameService.getGameById(id).subscribe({
      next: (game) => {
        if (game) {
          this.game = game;
        } else {
          this.errorMessage = 'Game not found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load game details';
        this.isLoading = false;
        console.error('Error loading game:', error);
      }
    });
  }

  addToCart(game: Game): void {
    if (!this.authService.isLoggedIn()) {
      // Redirect to login if not logged in
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    if (!this.isInCart) {
      this.cartService.addToCart(game);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStars(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];

    // Calculate full stars
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }

    // Calculate half stars
    if (rating % 1 >= 0.5) {
      stars.push('half');
    }

    // Fill remaining with empty stars
    while (stars.length < 5) {
      stars.push('empty');
    }

    return stars;
  }
}