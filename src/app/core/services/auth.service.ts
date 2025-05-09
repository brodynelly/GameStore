import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, tap, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private staticPortUrl = 'http://localhost:3000'; // Static server URL
  private dynamicApiUrl: string | null = null; // Dynamic backend API URL
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

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
          this.dynamicApiUrl = `http://localhost:${dynamicPort}/api/auth`;
          console.log('Constructed dynamic API URL:', this.dynamicApiUrl); // Log the constructed API URL
          return this.dynamicApiUrl;
        })
      );
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.ensureDynamicApiUrl().pipe(
      switchMap((apiUrl) =>
        this.http.post<User>(`${apiUrl}/login`, { email, password }).pipe(
          tap((user) => {
            const userToStore = { ...user };
            delete userToStore.password;
            localStorage.setItem('currentUser', JSON.stringify(userToStore));
            this.currentUserSubject.next(userToStore);
          })
        )
      )
    );
  }

  register(username: string, email: string, password: string): Observable<User> {
    return this.ensureDynamicApiUrl().pipe(
      switchMap((apiUrl) =>
        this.http.post<User>(`${apiUrl}/register`, { username, email, password }).pipe(
          tap((user) => {
            const userToStore = { ...user };
            delete userToStore.password;
            localStorage.setItem('currentUser', JSON.stringify(userToStore));
            this.currentUserSubject.next(userToStore);
          })
        )
      )
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Fetch user profile from backend
  fetchUserProfile(): Observable<User> {
    return this.ensureDynamicApiUrl().pipe(
      switchMap((apiUrl) => this.http.get<User>(`${apiUrl}/profile`))
    );
  }
}