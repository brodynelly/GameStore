import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUserSubject.next(JSON.parse(storedUser));
        }
    }

    // Ensure this method is called after login
    setCurrentUser(user: User): void {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('token');
        return !!token; // Check if token exists
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }
}