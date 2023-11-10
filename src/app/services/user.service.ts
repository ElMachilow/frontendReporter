import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment'; 
import { BehaviorSubject } from 'rxjs';

 
   
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private message = new BehaviorSubject<string>('');
  public customMessage = this.message.asObservable();

  constructor(private http: HttpClient) { }

  listUserByRol(idRol:number){
    return this.http.get(`${apiUrl}/usuario/listarUsuarioPorRol/`+idRol);
  }

  updatePassword(idUsuario: Number, password: String){
    return this.http.put(`${apiUrl}/usuario/actualizarPassword/`+idUsuario+'/'+password,null);
  }
  

 
}
