import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (this.isValidSession(user)) {
        this.currentUserSubject.next(user);
      } else {
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(user => {
        const userToStore = { ...user };
        delete userToStore.password;
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        this.currentUserSubject.next(userToStore);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { username, email, password }).pipe(
      tap(user => {
        const userToStore = { ...user };
        delete userToStore.password;
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        this.currentUserSubject.next(userToStore);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private isValidSession(user: User): boolean {
    return !!user && !!user.token;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Uncomment and use if you implement profile endpoint on the backend
  // fetchUserProfile(): Observable<User> {
  //   return this.http.get<User>(`${this.apiUrl}/profile`);
  // }
}
