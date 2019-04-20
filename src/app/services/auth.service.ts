/* https://github.com/auth0/angular2-jwt*/
// import { Injectable } from '@angular/core';
// npm install @auth0/angular-jwt
// import { JwtHelperService } from '@auth0/angular-jwt';

import { Observable, of } from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// npm install @auth0/angular-jwt
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  /*
  Send POST request to this endpoint and in the body of the request
  we are including the credentials (object with 2 properties: email
  and password). The post method returns an observable of response
  but in out login method I don't want to expose a response object.
  I want to return TRUE or FALSE. So we are going to use the map()
  */


  // obtain Access Token
  login(credentials) {

    const params = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password)
      .set('grant_type', 'password');

    const headersValue = new HttpHeaders()
      .append('Authorization', 'Basic ' + btoa('client' + ':' + 'password'))
      .append('Content-type', 'application/x-www-form-urlencoded');

    const httpOptions = {
      headers: headersValue
    };
    return this.http.post(this.baseUrl + '/oauth/token', params.toString(), httpOptions)
      .pipe(
        map(response => {
          if (response && response.hasOwnProperty('access_token')) {
            this.saveToken(response);
            // implement remember me
            if (credentials.remember) {
              let validity = response['expires_in'];
              if (validity > 10) {
                validity -= 10;
              }
              setTimeout(() => this.obtainRefreshToken(), validity * 1000);
            }
            return true;
          }
          return false;
        })
      );
  }

  saveToken(token) {
    const expireDate = new Date().getTime() + (1000 * token.expires_in);
    localStorage.setItem('username', token.username);
    localStorage.setItem('uid', token.uid);
    localStorage.setItem('access_token', token.access_token);
    localStorage.setItem('access_token_expire', expireDate.toString());
    localStorage.setItem('refresh_token', token.refresh_token);
  }

  obtainRefreshToken() {

    const params = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', localStorage.getItem('refresh_token'));

    localStorage.clear();

    const headersValue = new HttpHeaders()
      .append('Authorization', 'Basic ' + btoa('client' + ':' + 'password'))
      .append('Content-type', 'application/x-www-form-urlencoded');

    const httpOptions = {
      headers: headersValue
    };

    this.http.post(this.baseUrl + '/oauth/token', params.toString(), httpOptions)
      .subscribe(
        data => {
          this.saveToken(data);
          console.log('Refresing token', 'OK');
        },
        () => {
          console.log('Error refreshing token', 'OK');
        });
  }


  register(credentials) {

    console.log(credentials);
    const user = { 'username': credentials.username, 'password': credentials.password, 'email': credentials.email };

    const headersValue = new HttpHeaders()
      .append('Content-type', 'application/json');

    const httpOptions = {
      headers: headersValue
    };

    return this.http.post(this.baseUrl + '/users', JSON.stringify(user), httpOptions);
  }


  getCurrentUsername() {
    return localStorage.getItem('username');
  }

  getCurrentUserId() {
    return localStorage.getItem('uid');
  }


  logout(): void {
    console.log('logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token_expire');
    localStorage.removeItem('uid');
    localStorage.removeItem('username');
  }

  isLoggedIn(): boolean {

    const token = this.jwtHelper.tokenGetter();
    return !this.jwtHelper.isTokenExpired(token);
  }



}