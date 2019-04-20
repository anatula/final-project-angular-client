import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';

// https://dzone.com/articles/angular-5-material-design-login-application

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  hide = true;
  invalidLogin: boolean;
  logging = false;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  // credential object: value behind our form
  signIn(credentials) {
    this.logging = true;
    this.authService.login(credentials)
      .subscribe(
        result => {
          // Handle result
          if (result) {
            // insted of just redirect to homepage. I check the query params
            // and if I have returnUrl return to that url
            this.router.navigate([this.route.snapshot.queryParamMap.get('returnUrl') || '/']);
          } else {
            this.invalidLogin = true;
          }
          this.logging = false;
        },
        error => {
          // console.log('Can not connect with server');
          // console.log(error);
          this.logging = false;
          if (error.error.error_description) {
            this.openSnackBar(error.error.error_description, 'OK');
          } else {
            this.openSnackBar(error.message, 'OK');
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
