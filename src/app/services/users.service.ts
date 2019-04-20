import { Injectable } from '@angular/core';
import { MyUser } from '../models/myUser';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getListOfUsers() {
    console.log('in getListOfUsers()');
    console.log(localStorage.getItem('access_token'));


    const headersValue = new HttpHeaders()
    .append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    .append('Content-type', 'application/json');

    const params = new HttpParams().append('includeMe', 'false');

    const httpOptions = {
      headers: headersValue,
      params: params
    };

    return this.http.get<MyUser[]>( this.baseUrl + '/users', httpOptions );
  }

}
