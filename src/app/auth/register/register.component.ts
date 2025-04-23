import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card fade-in">
        <div class="auth-header">
          <h1 class="auth-title">Create an Account</h1>
          <p class="auth-subtitle">Join our community and discover amazing indie games!</p>
        </div>
        
        <div class="auth-alert error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="form-control" 
              [class.is-invalid]="username?.invalid && (username?.dirty || username?.touched)"
              placeholder="Choose a username"
            >
            <div class="invalid-feedback" *ngIf="username?.errors?.['required'] && (username?.dirty || username?.touched)">
              Username is required
            </div>
            <div class="invalid-feedback" *ngIf="username?.errors?.['minlength'] && (username?.dirty || username?.touched)">
              Username must be at least 3 characters
            </div>
          </div>
          
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
                placeholder="Create a strong password"
              >
              <button type="button" class="password-toggle" (click)="togglePasswordVisibility()">
                <span class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <div class="invalid-feedback" *ngIf="password?.errors?.['required'] && (password?.dirty || password?.touched)">
              Password is required
            </div>
            <div class="invalid-feedback" *ngIf="password?.errors?.['minlength'] && (password?.dirty || password?.touched)">
              Password must be at least 6 characters
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword" 
              class="form-control" 
              [class.is-invalid]="confirmPassword?.invalid || registerForm.errors?.['passwordMismatch']"
              placeholder="Confirm your password"
            >
            <div class="invalid-feedback" *ngIf="confirmPassword?.errors?.['required'] && (confirmPassword?.dirty || confirmPassword?.touched)">
              Please confirm your password
            </div>
            <div class="invalid-feedback" *ngIf="registerForm.errors?.['passwordMismatch'] && (confirmPassword?.dirty || confirmPassword?.touched)">
              Passwords do not match
            </div>
          </div>
          
          <div class="form-terms">
            <input type="checkbox" id="terms" formControlName="acceptTerms">
            <label for="terms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
            <div class="invalid-feedback" *ngIf="acceptTerms?.invalid && (acceptTerms?.dirty || acceptTerms?.touched)">
              You must accept the terms and conditions
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary submit-btn" [disabled]="registerForm.invalid || isLoading">
            <span class="spinner" *ngIf="isLoading"></span>
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
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
    
    .form-terms {
      display: flex;
      align-items: flex-start;
      margin-bottom: var(--space-md);
      font-size: 0.9rem;
    }
    
    .form-terms input {
      margin-top: 3px;
      margin-right: var(--space-xs);
    }
    
    .form-terms label {
      color: var(--neutral-600);
    }
    
    .form-terms a {
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
      left: calc(50% - 55px);
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
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  registerForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPassword = false;
  
  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }
  
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get acceptTerms() { return this.registerForm.get('acceptTerms'); }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  onSubmit() {
    if (this.registerForm.invalid) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const { username, email, password } = this.registerForm.value;
    
    this.authService.register(username, email, password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}