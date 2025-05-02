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
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  featuredGames: Game[] = [];
  
  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => {
      this.featuredGames = games.slice(0, 4); // Example: Show 4 featured games
    });
  }
}