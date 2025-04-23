import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private games: Game[] = [
    {
      id: 1,
      title: 'Cosmic Odyssey',
      price: 29.99,
      description: 'Embark on an epic journey through the cosmos, exploring uncharted planets and encountering mysterious alien civilizations.',
      shortDescription: 'A space exploration adventure game with stunning visuals.',
      imageUrl: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=600&h=400&fit=crop&q=80',
      developer: 'Nova Studios',
      releaseDate: '2023-07-15',
      genres: ['Adventure', 'Sci-Fi', 'Open World'],
      rating: 4.8,
      inStock: true
    },
    {
      id: 2,
      title: 'Phantom Realm',
      price: 24.99,
      description: 'Delve into a haunting world where reality and illusion blur. Solve intricate puzzles and uncover the dark secrets of the Phantom Realm.',
      shortDescription: 'A haunting puzzle game set in a mysterious realm.',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop&q=80',
      developer: 'Twilight Games',
      releaseDate: '2023-10-31',
      genres: ['Puzzle', 'Horror', 'Mystery'],
      rating: 4.6,
      inStock: true
    },
    {
      id: 3,
      title: 'Pixie Forest',
      price: 19.99,
      description: 'A charming adventure through an enchanted forest filled with magical creatures. Help the pixies restore balance to their world.',
      shortDescription: 'A whimsical adventure in a magical forest.',
      imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=400&fit=crop&q=80',
      developer: 'Whimsy Works',
      releaseDate: '2023-04-22',
      genres: ['Adventure', 'Family', 'Fantasy'],
      rating: 4.5,
      inStock: true
    },
    {
      id: 4,
      title: 'Tech Revolution',
      price: 34.99,
      description: 'Build and manage your own tech company, compete with rivals, and revolutionize the digital world with innovative products.',
      shortDescription: 'A business simulation game set in the tech industry.',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop&q=80',
      developer: 'Simulation Masters',
      releaseDate: '2023-08-10',
      genres: ['Simulation', 'Strategy', 'Business'],
      rating: 4.3,
      inStock: true
    },
    {
      id: 5,
      title: 'Neon Knights',
      price: 27.99,
      description: 'Fight for control in a cyberpunk city where corporations rule and hackers are the new rebels. Fast-paced combat in a neon-lit dystopia.',
      shortDescription: 'A cyberpunk action game with fast-paced combat.',
      imageUrl: 'https://images.unsplash.com/photo-1605979257913-1704eb7b6246?w=600&h=400&fit=crop&q=80',
      developer: 'Cyber Studios',
      releaseDate: '2023-06-05',
      genres: ['Action', 'Cyberpunk', 'RPG'],
      rating: 4.7,
      inStock: true
    },
    {
      id: 6,
      title: 'Ancient Legends',
      price: 39.99,
      description: 'Immerse yourself in a vast open world inspired by ancient mythologies. Slay legendary beasts and become a hero of old.',
      shortDescription: 'An open-world RPG based on ancient mythologies.',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&q=80',
      developer: 'Mythic Games',
      releaseDate: '2023-01-20',
      genres: ['RPG', 'Open World', 'Fantasy'],
      rating: 4.9,
      inStock: true
    },
    {
      id: 7,
      title: 'Ocean Deep',
      price: 22.99,
      description: 'Explore the mysteries of the ocean in this visually stunning underwater adventure. Discover new species and ancient ruins.',
      shortDescription: 'An underwater exploration adventure with stunning visuals.',
      imageUrl: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=600&h=400&fit=crop&q=80',
      developer: 'Aquatic Arts',
      releaseDate: '2023-03-17',
      genres: ['Adventure', 'Exploration', 'Educational'],
      rating: 4.4,
      inStock: true
    },
    {
      id: 8,
      title: 'Speed Demons',
      price: 32.99,
      description: 'Push your racing skills to the limit in this high-octane racing game featuring customizable vehicles and dynamic tracks.',
      shortDescription: 'A high-speed racing game with customizable vehicles.',
      imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=400&fit=crop&q=80',
      developer: 'Velocity Studios',
      releaseDate: '2023-09-08',
      genres: ['Racing', 'Sports', 'Multiplayer'],
      rating: 4.2,
      inStock: true
    }
  ];

  constructor() { }

  getGames(): Observable<Game[]> {
    // Simulate API call with delay
    return of(this.games).pipe(delay(800));
  }

  getGameById(id: number): Observable<Game | undefined> {
    // Simulate API call with delay
    return of(this.games.find(game => game.id === id)).pipe(delay(500));
  }

  searchGames(query: string): Observable<Game[]> {
    query = query.toLowerCase();
    return of(this.games.filter(game =>
      game.title.toLowerCase().includes(query) ||
      game.description.toLowerCase().includes(query) ||
      game.developer.toLowerCase().includes(query) ||
      game.genres.some(genre => genre.toLowerCase().includes(query))
    )).pipe(delay(300));
  }

  getGamesByGenre(genre: string): Observable<Game[]> {
    return of(this.games.filter(game =>
      game.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    )).pipe(delay(300));
  }
}