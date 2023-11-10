import { Injectable } from '@angular/core';
import { Role } from 'app/auth/models/role';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  saveCurrentUser(user:any){
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  deleteCurrentUser(){
    localStorage.removeItem('currentUser');
  }

  getToken(){
    let token =JSON.parse(localStorage.getItem('currentUser'))?.tokenDeAcceso
    return token === null ? "" : token;
  }

  getRol(){
    let rol =JSON.parse(localStorage.getItem('currentUser')).role.toString()
    return rol === null ? "" : rol;
  }

  get isAdmin() {
    return this.getRol() && this.getRol() === Role.Admin;
  }

  getIdUsuario():Number{
    let idUsuario = JSON.parse(localStorage.getItem('currentUser'))?.usuario.idUsuario;
    return idUsuario === null ? -1 : idUsuario;
  }

  getFullNameUser():String{
    let fullName = JSON.parse(localStorage.getItem('currentUser'))?.usuario.nombres + ' '
                   JSON.parse(localStorage.getItem('currentUser'))?.usuario.apellidos
    return fullName === null ? "" : fullName;
  }

  getCurrentUser(){
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}
