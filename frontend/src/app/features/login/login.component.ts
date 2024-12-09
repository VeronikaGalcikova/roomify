import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ILoginDto } from '../../shared/auth/login.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((authStatus) => {
      if (authStatus) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit() {
    if (this.username && this.password) {
      const loginDto: ILoginDto = {
        username: this.username,
        password: this.password,
      };
      this.authService.login(loginDto)
    } else {
      this.errorMessage = 'Please fill in both username and password!';
    }
  }
}
