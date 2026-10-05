import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  formData = { email: '', password: '' };
  mensajeError = signal('');

  async onSubmit() {
    this.mensajeError.set('');
    try {
      await this.authService.login(this.formData.email, this.formData.password);
      this.router.navigate(['/']);
    } catch (error: any) {
      this.mensajeError.set('Correo o contraseña incorrectos.');
    }
  }
}
