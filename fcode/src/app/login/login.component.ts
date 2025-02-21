import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true, 
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submitLogin() {
    const { email, password } = this.loginForm.value;
  
    this.http.post('http://localhost:3000/login', { email, password }).subscribe(
      (response: any) => {
        console.log('Login Response:', response);
  
        if (response.message === 'Login successful') {
          alert('Login Successful!');
  
          // Store user data in localStorage
          localStorage.setItem('userId', response.userId); // Assuming response contains userId
          localStorage.setItem('userEmail', response.email);
          localStorage.setItem('userName', response.name); // Store name if available
  
          // Redirect to users page
          this.router.navigateByUrl('/users');
        } else {
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = error.error?.message || 'Invalid credentials, please try again.';
      }
    );
  }
  
  
  
}

