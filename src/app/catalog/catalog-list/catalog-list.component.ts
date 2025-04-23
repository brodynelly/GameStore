import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GameService } from '../../core/services/game.service';
import { GameCardComponent } from '../../shared/components/game-card/game-card.component';
import { Game } from '../../core/models/game.model';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GameCardComponent],
  template: `
    <div class="catalog-container">
      <div class="container">
        <header class="catalog-header">
          <h1 class="catalog-title">Game Catalog</h1>
          <p class="catalog-subtitle">Find your next favorite game from our collection</p>
        </header>
        
        <div class="catalog-filters">
          <div class="search-bar">
            <span class="material-icons search-icon">search</span>
            <input 
              type="text" 
              class="form-control search-input" 
              placeholder="Search games..." 
              [(ngModel)]="searchQuery"
              (input)="onSearchChange()"
            >
            <button *ngIf="searchQuery" class="clear-search" (click)="clearSearch()">
              <span class="material-icons">close</span>
            </button>
          </div>
          
          <div class="filter-controls">
            <div class="filter-group">
              <label for="genre-filter">Genre:</label>
              <select id="genre-filter" class="form-control" [(ngModel)]="selectedGenre" (change)="applyFilters()">
                <option value="">All Genres</option>
                <option *ngFor="let genre of genres" [value]="genre">{{ genre }}</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="sort-by">Sort By:</label>
              <select id="sort-by" class="form-control" [(ngModel)]="sortBy" (change)="applyFilters()">
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="catalog-content">
          <ng-container *ngIf="!isLoading; else loadingTemplate">
            <ng-container *ngIf="filteredGames.length > 0; else noGamesTemplate">
              <div class="games-grid">
                <div class="game-card-container fade-in" *ngFor="let game of filteredGames">
                  <app-game-card [game]="game"></app-game-card>
                </div>
              </div>
            </ng-container>
            
            <ng-template #noGamesTemplate>
              <div class="no-results">
                <span class="material-icons no-results-icon">search_off</span>
                <h3>No games found</h3>
                <p>Try adjusting your search or filters</p>
                <button class="btn btn-primary" (click)="resetFilters()">Reset Filters</button>
              </div>
            </ng-template>
          </ng-container>
          
          <ng-template #loadingTemplate>
            <div class="loading-spinner">
              <div class="spinner"></div>
              <p>Loading games...</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .catalog-container {
      padding: var(--space-xl) 0;
    }
    
    .catalog-header {
      text-align: center;
      margin-bottom: var(--space-xl);
    }
    
    .catalog-title {
      font-size: 2.5rem;
      color: var(--neutral-900);
      margin-bottom: var(--space-sm);
    }
    
    .catalog-subtitle {
      color: var(--neutral-600);
      font-size: 1.1rem;
    }
    
    .catalog-filters {
      margin-bottom: var(--space-xl);
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
    }
    
    .search-bar {
      flex: 1;
      min-width: 280px;
      position: relative;
    }
    
    .search-icon {
      position: absolute;
      left: var(--space-sm);
      top: 50%;
      transform: translateY(-50%);
      color: var(--neutral-500);
    }
    
    .search-input {
      padding-left: 40px;
      height: 48px;
    }
    
    .clear-search {
      position: absolute;
      right: var(--space-sm);
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--neutral-500);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .filter-controls {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
    }
    
    .filter-group {
      min-width: 180px;
      display: flex;
      flex-direction: column;
    }
    
    .filter-group label {
      margin-bottom: var(--space-xs);
      color: var(--neutral-700);
      font-weight: 500;
    }
    
    .games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-lg);
    }
    
    .game-card-container {
      height: 100%;
    }
    
    .no-results {
      text-align: center;
      padding: var(--space-xxl) 0;
      color: var(--neutral-600);
    }
    
    .no-results-icon {
      font-size: 4rem;
      color: var(--neutral-400);
      margin-bottom: var(--space-md);
    }
    
    .no-results h3 {
      font-size: 1.5rem;
      margin-bottom: var(--space-sm);
      color: var(--neutral-800);
    }
    
    .no-results p {
      margin-bottom: var(--space-md);
    }
    
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-xxl) 0;
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
    
    @media (max-width: 768px) {
      .catalog-title {
        font-size: 2rem;
      }
      
      .catalog-filters {
        flex-direction: column;
      }
      
      .filter-controls {
        width: 100%;
      }
      
      .filter-group {
        width: 100%;
      }
    }
  `]
})
export class CatalogListComponent implements OnInit {
  private gameService = inject(GameService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  games: Game[] = [];
  filteredGames: Game[] = [];
  genres: string[] = [];
  isLoading = true;
  
  searchQuery = '';
  selectedGenre = '';
  sortBy = 'name-asc';
  
  ngOnInit(): void {
    // Get query params
    this.route.queryParams.subscribe(params => {
      if (params['genre']) {
        this.selectedGenre = params['genre'];
      }
      
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      
      // Load games
      this.loadGames();
    });
  }
  
  loadGames(): void {
    this.isLoading = true;
    
    this.gameService.getGames().subscribe(games => {
      this.games = games;
      
      // Extract unique genres
      const genreSet = new Set<string>();
      games.forEach(game => {
        game.genres.forEach(genre => genreSet.add(genre));
      });
      this.genres = Array.from(genreSet).sort();
      
      // Apply any filters from URL
      this.applyFilters();
      this.isLoading = false;
    });
  }
  
  applyFilters(): void {
    // Filter by search query and genre
    let result = [...this.games];
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(game => 
        game.title.toLowerCase().includes(query) || 
        game.description.toLowerCase().includes(query) ||
        game.developer.toLowerCase().includes(query) ||
        game.genres.some(genre => genre.toLowerCase().includes(query))
      );
    }
    
    if (this.selectedGenre) {
      result = result.filter(game => 
        game.genres.some(genre => genre === this.selectedGenre)
      );
    }
    
    // Sort the results
    switch (this.sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    this.filteredGames = result;
    
    // Update URL params
    this.updateUrlParams();
  }
  
  onSearchChange(): void {
    // Debounce search (in a real app, would use rxjs debounceTime)
    setTimeout(() => {
      this.applyFilters();
    }, 300);
  }
  
  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }
  
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedGenre = '';
    this.sortBy = 'name-asc';
    this.applyFilters();
  }
  
  private updateUrlParams(): void {
    const queryParams: any = {};
    
    if (this.searchQuery) {
      queryParams.search = this.searchQuery;
    }
    
    if (this.selectedGenre) {
      queryParams.genre = this.selectedGenre;
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
}