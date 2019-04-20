import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MyPositionSummary } from '../models/myPositionSummary';
import { MyFileSummary } from '../models/myFileSummary';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PositionService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getPositionInPoly(poly: string) {

    console.log('in getPositionInPoly');

    const headersValue = new HttpHeaders()
    .append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    .append('Content-type', 'application/json');

    const params = new HttpParams().append('poly', btoa(poly));

    const httpOptions = {
      headers: headersValue,
      params: params
    };

    return this.http.get<MyPositionSummary[]>( this.baseUrl + '/positions/', httpOptions );
  }


  getPositionSearch(search: string) {

    console.log('in getPositionInPoly');

    const headersValue = new HttpHeaders()
    .append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    .append('Content-type', 'application/json');

    const params = new HttpParams().append('search', btoa(search));

    const httpOptions = {
      headers: headersValue,
      params: params
    };

    return this.http.get<MyFileSummary[]>( this.baseUrl + '/positions/files', httpOptions );
  }


  getCounterTimestamp(startDate: string, endDate: string) {

    console.log('in getPositionInPoly');

    const headersValue = new HttpHeaders()
    .append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    .append('Content-type', 'application/json');

    const params = new HttpParams().append('startDate', startDate).append('endDate', endDate);

    const httpOptions = {
      headers: headersValue,
      params: params
    };

    return this.http.get<number>( this.baseUrl + '/positions/timestamp', httpOptions );
  }

}
