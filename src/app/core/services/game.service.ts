import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private staticPortUrl = 'http://localhost:3000'; // Static server URL
  private dynamicApiUrl: string | null = null; // Dynamic backend API URL

  constructor(private http: HttpClient) {}

  // Fetch the dynamic port from the static server
  private getDynamicPort(): Observable<number> {
    return this.http.get<{ dynamicPort: number }>(`${this.staticPortUrl}`).pipe(
      map((response) => {
        console.log('Response from static server:', response); // Log the response
        if (!response.dynamicPort) {
          throw new Error('Dynamic port not found in response');
        }
        console.log('Extracted dynamic port:', response.dynamicPort); // Log the extracted dynamic port
        return response.dynamicPort; // Return the dynamic port
      })
    );
  }

  // Ensure the dynamic API URL is set
  private ensureDynamicApiUrl(): Observable<string> {
    if (this.dynamicApiUrl) {
      return new Observable((observer) => {
        observer.next(this.dynamicApiUrl);
        observer.complete();
      });
    } else {
      return this.getDynamicPort().pipe(
        map((dynamicPort) => {
          this.dynamicApiUrl = `http://localhost:${dynamicPort}/api/games`;
          console.log('Constructed dynamic API URL:', this.dynamicApiUrl); // Log the constructed API URL
          return this.dynamicApiUrl;
        })
      );
    }
  }

  // Fetch all games
  getGames(): Observable<Game[]> {
    return this.ensureDynamicApiUrl().pipe(
      switchMap((apiUrl) => this.http.get<Game[]>(apiUrl))
    );
  }

  // Fetch a game by ID
  getGameById(id: number): Observable<Game | undefined> {
    return this.ensureDynamicApiUrl().pipe(
      switchMap((apiUrl) => this.http.get<Game>(`${apiUrl}/${id}`))
    );
  }

  // Search games by query
  searchGames(query: string): Observable<Game[]> {
    return this.ensureDynamicApiUrl().pipe(
      switchMap((apiUrl) => this.http.get<Game[]>(`${apiUrl}?search=${query}`))
    );
  }

  // Fetch games by genre
  getGamesByGenre(genre: string): Observable<Game[]> {
    return this.ensureDynamicApiUrl().pipe(
      switchMap((apiUrl) => this.http.get<Game[]>(`${apiUrl}?genre=${genre}`))
    );
  }
}