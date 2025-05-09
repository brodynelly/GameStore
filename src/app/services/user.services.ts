import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4000/api/auth'; // Backend API URL for authentication

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    console.log('Login API called with:', { username, password });
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Login failed'));
      })
    );
  }

  getProtectedData(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Token used in request:', token); // Debugging
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Token used in request:', token);
    return this.http.get(`${this.apiUrl}/protected-route`, { headers });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password }).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => new Error(error.error?.message || 'Registration failed'));
      })
    );
  }
}