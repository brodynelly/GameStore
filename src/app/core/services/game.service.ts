import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:4000/api/games';

  constructor(private http: HttpClient) {}

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl);
  }

  getGameById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/games/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching game:', error);
        return throwError(() => new Error('Failed to fetch game details'));
      })
    );
  }

  searchGames(query: string): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}?search=${query}`);
  }

  getGamesByGenre(genre: string): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}?genre=${genre}`);
  }
}