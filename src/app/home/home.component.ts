import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameService } from '../core/services/game.service';
import { GameCardComponent } from '../shared/components/game-card/game-card.component';
import { Game } from '../core/models/game.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, GameCardComponent],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container hero-content">
          <div class="hero-text fade-in">
            <h1 class="hero-title">Discover Amazing Indie Games</h1>
            <p class="hero-subtitle">Explore a curated collection of the best indie games from talented developers around the world.</p>
            <div class="hero-buttons">
              <a routerLink="/catalog" class="btn btn-primary">Browse Games</a>
              <a routerLink="/auth/register" class="btn btn-outline">Sign Up</a>
            </div>
          </div>
          <div class="hero-image slide-in-right">
            <!-- Placeholder for hero image -->
            <div class="hero-image-placeholder">
              <span class="material-icons hero-icon">sports_esports</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Featured Games Section -->
      <section class="featured-games">
        <div class="container">
          <h2 class="section-title">Featured Games</h2>
          <p class="section-subtitle">Check out these popular titles from our collection</p>
          
          <div class="games-grid">
            <div class="game-card-container slide-in-bottom" *ngFor="let game of featuredGames">
              <app-game-card [game]="game"></app-game-card>
            </div>
          </div>
          
          <div class="text-center mt-4">
            <a routerLink="/catalog" class="btn btn-secondary">View All Games</a>
          </div>
        </div>
      </section>
      
      <!-- How It Works Section -->
      <section class="how-it-works">
        <div class="container">
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle">Simple steps to find and purchase your next favorite game</p>
          
          <div class="steps-container">
            <div class="step fade-in">
              <div class="step-icon">
                <span class="material-icons">search</span>
              </div>
              <h3 class="step-title">Discover</h3>
              <p class="step-description">Browse our extensive collection of indie games across various genres.</p>
            </div>
            
            <div class="step fade-in">
              <div class="step-icon">
                <span class="material-icons">add_shopping_cart</span>
              </div>
              <h3 class="step-title">Select</h3>
              <p class="step-description">Add your favorite games to your shopping cart with a single click.</p>
            </div>
            
            <div class="step fade-in">
              <div class="step-icon">
                <span class="material-icons">credit_card</span>
              </div>
              <h3 class="step-title">Purchase</h3>
              <p class="step-description">Securely checkout and instantly receive access to your games.</p>
            </div>
            
            <div class="step fade-in">
              <div class="step-icon">
                <span class="material-icons">gamepad</span>
              </div>
              <h3 class="step-title">Play</h3>
              <p class="step-description">Download and start playing your new games right away!</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Genre Section -->
      <section class="genres">
        <div class="container">
          <h2 class="section-title">Explore by Genre</h2>
          <p class="section-subtitle">Find games that match your interests</p>
          
          <div class="genres-grid">
            <a routerLink="/catalog" [queryParams]="{genre: 'Adventure'}" class="genre-card">
              <div class="genre-icon">
                <span class="material-icons">explore</span>
              </div>
              <h3 class="genre-title">Adventure</h3>
            </a>
            
            <a routerLink="/catalog" [queryParams]="{genre: 'RPG'}" class="genre-card">
              <div class="genre-icon">
                <span class="material-icons">auto_stories</span>
              </div>
              <h3 class="genre-title">RPG</h3>
            </a>
            
            <a routerLink="/catalog" [queryParams]="{genre: 'Strategy'}" class="genre-card">
              <div class="genre-icon">
                <span class="material-icons">psychology</span>
              </div>
              <h3 class="genre-title">Strategy</h3>
            </a>
            
            <a routerLink="/catalog" [queryParams]="{genre: 'Action'}" class="genre-card">
              <div class="genre-icon">
                <span class="material-icons">flash_on</span>
              </div>
              <h3 class="genre-title">Action</h3>
            </a>
            
            <a routerLink="/catalog" [queryParams]="{genre: 'Puzzle'}" class="genre-card">
              <div class="genre-icon">
                <span class="material-icons">extension</span>
              </div>
              <h3 class="genre-title">Puzzle</h3>
            </a>
            
            <a routerLink="/catalog" [queryParams]="{genre: 'Simulation'}" class="genre-card">
              <div class="genre-icon">
                <span class="material-icons">smartphone</span>
              </div>
              <h3 class="genre-title">Simulation</h3>
            </a>
          </div>
        </div>
      </section>
      
      <!-- Newsletter Section -->
      <section class="newsletter">
        <div class="container">
          <div class="newsletter-container">
            <div class="newsletter-content">
              <h2 class="newsletter-title">Stay Updated</h2>
              <p class="newsletter-text">Subscribe to our newsletter to receive updates on new games, exclusive offers, and more!</p>
            </div>
            
            <form class="newsletter-form">
              <input type="email" class="form-control" placeholder="Your email address" required>
              <button type="submit" class="btn btn-accent">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      overflow-x: hidden;
    }
    
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%);
      color: white;
      padding: var(--space-xxl) 0;
      min-height: 500px;
      display: flex;
      align-items: center;
    }
    
    .hero-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .hero-text {
      flex: 1;
      max-width: 600px;
    }
    
    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: var(--space-md);
      line-height: 1.2;
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
      margin-bottom: var(--space-lg);
      opacity: 0.9;
      line-height: 1.6;
    }
    
    .hero-buttons {
      display: flex;
      gap: var(--space-md);
    }
    
    .hero-buttons .btn {
      padding: var(--space-sm) var(--space-xl);
    }
    
    .hero-buttons .btn-outline {
      border-color: white;
      color: white;
    }
    
    .hero-buttons .btn-outline:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .hero-image {
      flex: 1;
      max-width: 500px;
      margin-left: var(--space-lg);
    }
    
    .hero-image-placeholder {
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .hero-icon {
      font-size: 5rem;
      opacity: 0.7;
    }
    
    /* Featured Games Section */
    .featured-games {
      padding: var(--space-xxl) 0;
      background-color: var(--neutral-100);
    }
    
    .section-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: var(--space-sm);
      text-align: center;
      color: var(--neutral-900);
    }
    
    .section-subtitle {
      font-size: 1.1rem;
      margin-bottom: var(--space-xl);
      text-align: center;
      color: var(--neutral-600);
    }
    
    .games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }
    
    .game-card-container {
      height: 100%;
    }
    
    /* How It Works Section */
    .how-it-works {
      padding: var(--space-xxl) 0;
      background-color: white;
    }
    
    .steps-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: var(--space-xl);
      margin-top: var(--space-xl);
    }
    
    .step {
      text-align: center;
      padding: var(--space-md);
    }
    
    .step-icon {
      width: 80px;
      height: 80px;
      background-color: var(--primary-50);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-md);
    }
    
    .step-icon .material-icons {
      font-size: 2.5rem;
      color: var(--primary-600);
    }
    
    .step-title {
      font-size: 1.3rem;
      color: var(--neutral-900);
      margin-bottom: var(--space-sm);
    }
    
    .step-description {
      color: var(--neutral-600);
      line-height: 1.5;
    }
    
    /* Genres Section */
    .genres {
      padding: var(--space-xxl) 0;
      background-color: var(--neutral-100);
    }
    
    .genres-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: var(--space-md);
      margin-top: var(--space-xl);
    }
    
    .genre-card {
      background-color: white;
      border-radius: var(--radius-md);
      padding: var(--space-md);
      text-align: center;
      box-shadow: var(--shadow-sm);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      text-decoration: none;
      color: var(--neutral-900);
    }
    
    .genre-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }
    
    .genre-icon {
      width: 60px;
      height: 60px;
      background-color: var(--primary-50);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-md);
    }
    
    .genre-icon .material-icons {
      font-size: 2rem;
      color: var(--primary-600);
    }
    
    .genre-title {
      font-size: 1.1rem;
    }
    
    /* Newsletter Section */
    .newsletter {
      padding: var(--space-xxl) 0;
      background-color: white;
    }
    
    .newsletter-container {
      background-color: var(--secondary-50);
      padding: var(--space-xl);
      border-radius: var(--radius-lg);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
    }
    
    .newsletter-content {
      flex: 1;
      min-width: 300px;
      margin-right: var(--space-lg);
      margin-bottom: var(--space-md);
    }
    
    .newsletter-title {
      font-size: 1.8rem;
      margin-bottom: var(--space-sm);
      color: var(--neutral-900);
    }
    
    .newsletter-text {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .newsletter-form {
      display: flex;
      gap: var(--space-sm);
      flex: 1;
      min-width: 300px;
    }
    
    .newsletter-form .form-control {
      flex: 1;
    }
    
    @media (max-width: 992px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-image {
        display: none;
      }
      
      .hero-text {
        text-align: center;
        max-width: 100%;
      }
      
      .hero-buttons {
        justify-content: center;
      }
      
      .newsletter-container {
        flex-direction: column;
        text-align: center;
      }
      
      .newsletter-content {
        margin-right: 0;
      }
    }
    
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
      
      .section-title {
        font-size: 1.8rem;
      }
      
      .steps-container {
        grid-template-columns: 1fr;
      }
      
      .newsletter-form {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent {
  private gameService = inject(GameService);
  featuredGames: Game[] = [];
  
  constructor() {
    this.gameService.getGames().subscribe(games => {
      // Just get 4 games for featured section
      this.featuredGames = games.slice(0, 4);
    });
  }
}