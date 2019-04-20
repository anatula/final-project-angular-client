import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MyFile } from '../models/myFile';
import { MyPosition } from './../models/myPosition';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  deleteFile(id: String) {
    console.log('in deleteFile()');
    console.log(localStorage.getItem('access_token'));

    const headersValue = new HttpHeaders()
    .append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    .append('Content-type', 'application/json');

    const httpOptions = {
      headers: headersValue
    };

    return this.http.delete( this.baseUrl + '/files/' + id, httpOptions );
  }

  uploadFile(positionJson: string) {

    console.log('in uploadFile');
    console.log(localStorage.getItem('access_token'));

    const headersValue = new HttpHeaders()
    .append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    .append('Content-type', 'application/json');

    const httpOptions = {
      headers: headersValue
    };

    return this.http.post(this.baseUrl + '/files', positionJson, httpOptions );
  }

  getListOfFilesUploaded() {
    console.log('in getFilesUploaded');
    console.log(localStorage.getItem('access_token'));


    const headersValue = new HttpHeaders()
    .append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    .append('Content-type', 'application/json');

  const httpOptions = {
    headers: headersValue
  };

    return this.http.get<MyFile[]>(this.baseUrl + '/files', httpOptions );
  }


  getListOfFilePurchased() {
    console.log('in getListOfFileBought');
    console.log(localStorage.getItem('access_token'));


    const headersValue = new HttpHeaders()
    .append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    .append('Content-type', 'application/json');

  const httpOptions = {
    headers: headersValue
  };

    return this.http.get<MyFile[]>( this.baseUrl + '/files/purchased', httpOptions );
  }


  getPositionsGivenFileId(id: String) {
    console.log('in getPositionsGivenFileId');
    console.log(localStorage.getItem('access_token'));

    const headersValue = new HttpHeaders()
    .append('Authorization', 'Bearer ' + localStorage.getItem('access_token'))
    .append('Content-type', 'application/json');

    const httpOptions = {
      headers: headersValue
    };

    return this.http.get<MyPosition[]>( this.baseUrl + '/files/' + id + '/positions', httpOptions );
  }

}
