import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private users: User[] = [
    { id: 1, username: 'user1', email: 'user1@example.com', password: 'password1' },
    { id: 2, username: 'user2', email: 'user2@example.com', password: 'password2' }
  ];
  
  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }
  
  login(email: string, password: string): Observable<User> {
    const user = this.users.find(u => 
      (u.email === email) && u.password === password
    );
    
    if (!user) {
      return throwError(() => new Error('Invalid email or password'));
    }
    
    return of(user).pipe(
      delay(800),
      tap(u => {
        const userToStore = { ...u };
        delete userToStore.password;
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        this.currentUserSubject.next(userToStore);
      })
    );
  }
  
  register(username: string, email: string, password: string): Observable<User> {
    // Check if user already exists
    if (this.users.some(user => user.email === email)) {
      return throwError(() => new Error('User with this email already exists'));
    }
    
    // Create new user
    const newUser: User = {
      id: this.users.length + 1,
      username,
      email,
      password
    };
    
    // Add to users array (in a real app, this would be an API call)
    this.users.push(newUser);
    
    // Log in the new user
    return this.login(email, password);
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
}