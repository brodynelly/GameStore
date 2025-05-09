import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators'; // Import `map` and `switchMap`

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
  }getGames(): Observable<any> {
    if (this.dynamicApiUrl) {
      console.log('Using cached dynamic API URL:', this.dynamicApiUrl); // Log the cached API URL
      return this.http.get(this.dynamicApiUrl).pipe(
        map((response) => {
          console.log('Response from dynamic API:', response); // Log the response
          return response;
        })
      );
    } else {
      console.log('Fetching dynamic port from static server...'); // Log the start of the process
      return this.getDynamicPort().pipe(
        switchMap((dynamicPort) => {
          this.dynamicApiUrl = `http://localhost:${dynamicPort}/api/games`; // Construct the dynamic API URL
          console.log('Constructed dynamic API URL:', this.dynamicApiUrl); // Log the constructed API URL
          return this.http.get(this.dynamicApiUrl).pipe(
            map((response) => {
              console.log('Response from dynamic API:', response); // Log the response
              return response;
            })
          );
        })
      );
    }
  }
}