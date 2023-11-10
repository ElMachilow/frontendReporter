import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  constructor(private http: HttpClient) { }

  listParameter(idGrupo: Number){
    return this.http.get(`${apiUrl}/parametros/listarParametrosPorIdGrupo/`+idGrupo);
  }

}
