import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  summaryHours(idPeriodo:Number, idUsuario:Number){
    return this.http.get(`${apiUrl}/dashboard/resumenHoras/`+idPeriodo+'/'+idUsuario);
  }

  summaryHoursTotal(idPeriodo:Number){
    return this.http.get(`${apiUrl}/dashboard/resumenHorasTotal/`+idPeriodo);
  }

  summaryHoursTotalDetail(idPeriodo:Number){
    return this.http.get(`${apiUrl}/dashboard/resumenHorasTotalDetalle/`+idPeriodo);
  }

  distribution( idUsuario:Number){
    return this.http.get(`${apiUrl}/dashboard/distribucion/`+idUsuario);
  }
}
