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
  //imports: [CommonModule, FormsModule, RouterLink, GameCardComponent],
  imports: [CommonModule, FormsModule, GameCardComponent],
  templateUrl: `./catalog-list.component.html`,
  styleUrls: [`./catalog-list.component.css`]
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