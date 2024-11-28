import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  IRegistrationDto,
  IRegistrationResponse,
} from '../../shared/auth/registration.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  get passwordMismatch(): boolean {
    return this.password !== this.confirmPassword;
  }

  onSubmit(form: NgForm) {
    if (form.invalid || this.passwordMismatch) {
      this.errorMessage = 'Prosím, opravte chyby vo formulári.';
      return;
    }

    const registrationDto: IRegistrationDto = {
      username: this.username,
      password: this.password,
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
    };

    this.authService.register(registrationDto).subscribe({
      next: (response: IRegistrationResponse) => {
        console.log('Registrácia úspešná!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registrácia zlyhala!', error);
        this.errorMessage = 'Registrácia zlyhala. Skúste to znova.';
      },
    });
  }
}
