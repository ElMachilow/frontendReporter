import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  constructor(private http: HttpClient) { }

  listPeriod(){
    return this.http.get(`${apiUrl}/periodo/listarPeriodos`);
  }

}
