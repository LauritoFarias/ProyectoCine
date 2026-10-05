import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals para controlar la visibilidad de las contraseñas
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  // Expresión regular: Al menos 1 mayúscula (?=.*[A-Z]) y 1 carácter especial (?=.*[^a-zA-Z0-9])
  passwordPattern = /(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/;

  registroForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(8),
      Validators.pattern(this.passwordPattern)
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
    fechaNacimiento: new FormControl('', [Validators.required]),
    tipoSangre: new FormControl(''),
    colorOjos: new FormControl(''),
    diasVacaciones: new FormControl(0, [Validators.min(0)])
  }, { validators: passwordMatchValidator }); // Aplicamos el validador al grupo completo

  mensajeErrorGeneral = signal('');
  mostrarToast = signal(false);

  // Alternadores de visibilidad
  togglePassword() { this.hidePassword.set(!this.hidePassword()); }
  toggleConfirmPassword() { this.hideConfirmPassword.set(!this.hideConfirmPassword()); }

  isInvalid(controlName: string): boolean {
    const control = this.registroForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  // Verifica si el validador personalizado falló
  hasMismatchError(): boolean {
    const confirmControl = this.registroForm.get('confirmPassword');
    return !!(this.registroForm.hasError('mismatch') && confirmControl?.touched);
  }

  async onSubmit() {
    this.mensajeErrorGeneral.set('');

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    try {
      // Excluimos 'confirmPassword' de los datos que mandamos al backend
      const { confirmPassword, ...datosRegistro } = this.registroForm.value;
      
      await this.authService.registrarCliente(datosRegistro);
      
      this.mostrarToast.set(true);
      setTimeout(() => { this.router.navigate(['/']); }, 2500);

    } catch (error: any) {
      this.mensajeErrorGeneral.set(error.message || 'Ocurrió un error al intentar registrarte.');
    }
  }
}
