import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http: HttpClient) { }

  liquidationsHours(idPeriodo:number){
    return this.http.get(`${apiUrl}/reportes/liquidacionHoras/`+idPeriodo);
  }

  petitionByPeriod(idPeriodo:number,idColaborador:number){
    return this.http.get(`${apiUrl}/reportes/peticionUsuario/`+idPeriodo+'/'+idColaborador);
  }

  additional(idPeriodo:number,idColaborador:number){
    return this.http.get(`${apiUrl}/reportes/adicionales/`+idPeriodo+'/'+idColaborador);
  }
}
