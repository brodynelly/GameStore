import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card fade-in">
        <div class="auth-header">
          <h1 class="auth-title">Login</h1>
          <p class="auth-subtitle">Welcome back! Please login to continue.</p>
        </div>
        
        <div class="auth-alert error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control" 
              [class.is-invalid]="email?.invalid && (email?.dirty || email?.touched)"
              placeholder="your.email@example.com"
            >
            <div class="invalid-feedback" *ngIf="email?.errors?.['required'] && (email?.dirty || email?.touched)">
              Email is required
            </div>
            <div class="invalid-feedback" *ngIf="email?.errors?.['email'] && (email?.dirty || email?.touched)">
              Please enter a valid email address
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-field">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                formControlName="password" 
                class="form-control" 
                [class.is-invalid]="password?.invalid && (password?.dirty || password?.touched)"
                placeholder="Your password"
              >
              <button type="button" class="password-toggle" (click)="togglePasswordVisibility()">
                <span class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <div class="invalid-feedback" *ngIf="password?.errors?.['required'] && (password?.dirty || password?.touched)">
              Password is required
            </div>
          </div>
          
          <div class="form-options">
            <div class="remember-me">
              <input type="checkbox" id="remember" formControlName="rememberMe">
              <label for="remember">Remember me</label>
            </div>
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>
          
          <button type="submit" class="btn btn-primary submit-btn" [disabled]="loginForm.invalid || isLoading">
            <span class="spinner" *ngIf="isLoading"></span>
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/register">Register</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px - 200px); /* Adjust based on navbar and footer height */
      padding: var(--space-xl) var(--space-md);
    }
    
    .auth-card {
      background-color: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 480px;
      padding: var(--space-xl);
    }
    
    .auth-header {
      margin-bottom: var(--space-lg);
      text-align: center;
    }
    
    .auth-title {
      font-size: 2rem;
      color: var(--neutral-900);
      margin-bottom: var(--space-sm);
    }
    
    .auth-subtitle {
      color: var(--neutral-600);
    }
    
    .auth-alert {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-sm);
      margin-bottom: var(--space-md);
      font-size: 0.9rem;
    }
    
    .auth-alert.error {
      background-color: var(--error-50);
      color: var(--error-700);
      border-left: 3px solid var(--error-500);
    }
    
    .auth-form {
      margin-bottom: var(--space-lg);
    }
    
    .form-group {
      margin-bottom: var(--space-md);
    }
    
    .form-group label {
      display: block;
      margin-bottom: var(--space-xs);
      color: var(--neutral-700);
      font-weight: 500;
    }
    
    .password-field {
      position: relative;
    }
    
    .password-toggle {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--neutral-500);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .password-toggle:hover {
      color: var(--neutral-700);
    }
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
      font-size: 0.9rem;
    }
    
    .remember-me {
      display: flex;
      align-items: center;
    }
    
    .remember-me input {
      margin-right: var(--space-xs);
    }
    
    .forgot-password {
      color: var(--primary-600);
    }
    
    .submit-btn {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      position: relative;
    }
    
    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      position: absolute;
      left: calc(50% - 30px);
      top: calc(50% - 10px);
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .auth-footer {
      text-align: center;
      color: var(--neutral-600);
      font-size: 0.9rem;
    }
    
    .auth-footer a {
      color: var(--primary-600);
      font-weight: 500;
    }
    
    @media (max-width: 576px) {
      .auth-card {
        padding: var(--space-lg) var(--space-md);
      }
      
      .auth-title {
        font-size: 1.5rem;
      }
      
      .form-options {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-sm);
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPassword = false;
  
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }
  
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  
  onSubmit() {
    if (this.loginForm.invalid) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: () => {
        // Navigate to returnUrl or home
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        this.isLoading = false;
      }
    });
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}