import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select'; 
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { RoleService } from '../../service/role.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ValidationError } from '../../interfaces/validation-error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private authService = inject(AuthService);
  private matSnackbar = inject(MatSnackBar);
  roles$!: Observable<Role[]>;
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  errors: ValidationError[] = [];

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      roles: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator
    });

    this.roles$ = this.roleService.getRoles();
  }

  register(): void {
    if (this.registerForm.invalid) return;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.matSnackbar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.errors = [];
        if (err.status === 400) {
          this.errors = err.error;
          this.matSnackbar.open('Validations error', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
        }
      },
      complete: () => console.log('Register success'),
    });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    if (passwordValue !== confirmPasswordValue) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }
}
