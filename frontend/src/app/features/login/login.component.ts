import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ILoginDto, ILoginResponse } from '../../shared/auth/login.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.username && this.password) {
      const loginDto: ILoginDto = {
        username: this.username,
        password: this.password,
      };

      this.authService.login(loginDto).subscribe({
        next: (response: ILoginResponse) => {
          console.log('Login Successful!');

          // Store tokens in localStorage
          localStorage.setItem('accessToken', response.access);
          localStorage.setItem('refreshToken', response.refresh);

          // Navigate to the dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed!', error);
          this.errorMessage = 'Invalid username or password';
        },
      });
    } else {
      this.errorMessage = 'Please fill in both username and password!';
    }
  }
}
