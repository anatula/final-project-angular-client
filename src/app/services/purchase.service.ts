import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  baseUrl = environment.baseUrl;

  getCount(fileId: String) {
    console.log(localStorage.getItem('access_token'));

    const headersValue = new HttpHeaders()
    .append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    .append('Content-type', 'application/json');

    const httpOptions = {
    headers: headersValue
    };

    return this.http.get<number>( this.baseUrl + '/purchases/files/' + fileId , httpOptions );
  }

  constructor(private http: HttpClient) { }

  createPurchase(fileIds: string) {

    console.log('in createPurchase');
    console.log('yo are about to buy: ');
    console.log(fileIds);
    console.log(localStorage.getItem('access_token'));

    const headersValue = new HttpHeaders()
    .append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    .append('Content-type', 'application/json');

    const httpOptions = {
      headers: headersValue
    };

    return this.http.post( this.baseUrl + '/purchases', fileIds, httpOptions );
  }

}
