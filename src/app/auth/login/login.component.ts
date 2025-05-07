import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.services'; // Use UserService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: `./login.component.html`,
  styleUrls: [`./login.component.css`]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService); // Inject UserService
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Changed to username
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
  onSubmit() {
    if (this.loginForm.invalid) return;
  
    this.isLoading = true;
    this.errorMessage = '';
  
    const { username, password } = this.loginForm.value;
    console.log('Login attempt:', { username, password });
  
    this.userService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/']); // Redirect to home or another page
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = err.message || 'Login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}