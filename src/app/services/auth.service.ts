import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  iniciarSesion(objeto: any){
    console.log('ingresa a login 2');

    return this.http.post(`${apiUrl}/auth/iniciarSesion`,objeto);
    
  }
}
