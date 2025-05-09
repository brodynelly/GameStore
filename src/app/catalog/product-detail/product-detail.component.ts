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
  templateUrl: './product-detail.component.html',
  styleUrls: [`./product-detail.component.css`]
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

  // get isInCart(): boolean {
  //   return this.game ? this.cartService.isInCart(this.game.id) : false;
  // }

  isInCart = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
  
      if (isNaN(id)) {
        this.errorMessage = 'Invalid game ID';
        this.isLoading = false;
        return;
      }
  
      this.loadGame(id);
  
      // Subscribe to cart state
      this.cartService.getCartItems().subscribe(cartItems => {
        this.isInCart = cartItems.some(item => item.id === id);
      });
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
        this.errorMessage = error.error?.message || 'Failed to load game details';
        this.isLoading = false;
        console.error('Error loading game:', error);
      }
    });
  }

  isAddingToCart = false;

  addToCart(game: Game): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    if (!this.isInCart) {
      this.isAddingToCart = true;
      this.cartService.addToCart(game.id).subscribe({
        next: () => {
          this.isAddingToCart = false;
        },
        error: (err) => {
          this.isAddingToCart = false;
          console.error('Failed to add game to cart:', err);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
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