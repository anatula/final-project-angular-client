import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

// http://www.codiodes.com/match-password-validation/

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  invalidRegistration: boolean;
  registerForm: FormGroup;
  hide = true;
  registering = false;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      'username': ['', [Validators.required, Validators.minLength(4)]],
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(4)]],
      'repeat': ['', [Validators.required, Validators.minLength(4)]]
    },
      {
        validator: this.matchValidator
      });
  }

  matchValidator(group: FormGroup) {
    const password = group.get('password').value;
    const repeatPassword = group.get('repeat').value;

    if (repeatPassword.length <= 0) {
      return null;
    }

    if (repeatPassword !== password) {
      return {
        doesMatchPassword: true
      };
    }

    return null;
  }

  onRegisterSubmit(credentials) {
    console.log(credentials);
    this.registering = true;
    this.authService.register(credentials).subscribe(
      resp => {
        this.registering = false;
        this.openSnackBar('User ' + credentials.username + ' registered OK. Open your email and validate', 'OK');
        this.router.navigate(['/']);
      },
      error => {
        // console.log('Can not connect with server');
        // console.log(error);
        this.registering = false;
        if (error.error.error_description) {
          this.openSnackBar(error.error.error_description, 'OK');
        } else {
          this.openSnackBar(error.error.message, 'OK');
        }
      },
      () => {
        // 'onCompleted' callback.
        // No errors, route to new page here
      }
    );


  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}






