import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ILoginDto } from '../../shared/auth/login.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((authStatus) => {
      if (authStatus) {
        this.authService.isAdmin$.subscribe((isAdmin) => {
          if (isAdmin) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/access-simulation']);
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.username && this.password) {
      const loginDto: ILoginDto = {
        username: this.username,
        password: this.password,
      };
      this.authService.login(loginDto).subscribe(
        (response) => {},
        (error) => {
          this.showSuccessMessage('Login failed! Wrong username or password!');
        }
      );
    } else {
      this.errorMessage = 'Please fill in both username and password!';
    }
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success'],
    });
  }
}
