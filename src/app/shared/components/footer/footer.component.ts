import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h2 class="footer-title">Game Store</h2>
            <p class="footer-description">
              Discover the best indie games from talented developers around the world.
            </p>
          </div>

          <div class="footer-section">
            <h3 class="footer-heading">Navigation</h3>
            <ul class="footer-links">
              <li><a routerLink="/" class="footer-link">Home</a></li>
              <li><a routerLink="/catalog" class="footer-link">Games</a></li>
              <li><a routerLink="/cart" class="footer-link">Cart</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3 class="footer-heading">Account</h3>
            <ul class="footer-links">
              <li><a routerLink="/auth/login" class="footer-link">Login</a></li>
              <li><a routerLink="/auth/register" class="footer-link">Register</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3 class="footer-heading">Contact</h3>
            <ul class="footer-links">
              <li><a href="mailto:info&#64;gamestore.com" class="footer-link">info&#64;gamestore.com</a></li>
              <li><span class="footer-text">123 Game Street, Digital City</span></li>
              <li><span class="footer-text">+1 (555) 123-4567</span></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copyright">
            &copy; 2025 Game Store. All rights reserved.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <span class="material-icons">facebook</span>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <span class="material-icons">twitter</span>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <span class="material-icons">instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--neutral-800);
      color: var(--neutral-200);
      padding: var(--space-xl) 0 var(--space-lg);
    }

    .footer-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: var(--space-xl);
    }

    .footer-section {
      flex: 1;
      min-width: 200px;
      margin-bottom: var(--space-lg);
      padding-right: var(--space-lg);
    }

    .footer-title {
      color: white;
      font-size: 1.5rem;
      margin-bottom: var(--space-sm);
    }

    .footer-description {
      color: var(--neutral-400);
      line-height: 1.6;
    }

    .footer-heading {
      color: white;
      font-size: 1.2rem;
      margin-bottom: var(--space-md);
      position: relative;
    }

    .footer-heading::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: var(--primary-400);
    }

    .footer-links {
      list-style: none;
      padding: 0;
    }

    .footer-links li {
      margin-bottom: var(--space-sm);
    }

    .footer-link {
      color: var(--neutral-400);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-link:hover {
      color: var(--primary-400);
    }

    .footer-text {
      color: var(--neutral-400);
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--space-md);
      border-top: 1px solid var(--neutral-700);
    }

    .copyright {
      color: var(--neutral-500);
      font-size: 0.9rem;
    }

    .social-links {
      display: flex;
    }

    .social-link {
      color: var(--neutral-400);
      margin-left: var(--space-md);
      transition: color 0.3s ease;
    }

    .social-link:hover {
      color: var(--primary-400);
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
      }

      .footer-section {
        width: 100%;
        padding-right: 0;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }

      .social-links {
        margin-top: var(--space-md);
        justify-content: center;
      }

      .social-link {
        margin: 0 var(--space-sm);
      }
    }
  `]
})
export class FooterComponent {}