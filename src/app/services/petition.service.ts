import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class petitionService {

  constructor(private http: HttpClient) { }

  registerPetitionHeadDetail(objeto: any):Observable<Object>{
    return this.http.post(`${apiUrl}/peticion/registrar`, objeto);
  }

  
  registerPetitionDetail(objeto: any):Observable<Object>{
    return this.http.post(`${apiUrl}/peticion/registrarPeticionDetalle`, objeto);
  }

  updatePetition(objeto: any):Observable<Object>{
    return this.http.put(`${apiUrl}/peticion/actualizar`, objeto);
  }

  
  updateDetailPetition(objeto: any):Observable<Object>{
    return this.http.put(`${apiUrl}/peticion/actualizarPeticionDetalle`, objeto);
  }

  deleteDetailPetition(id: Number):Observable<Object>{
    return this.http.delete(`${apiUrl}/peticion/eliminarPeticionDetalle/`+id);
  }

  listPetitionByIdUser(idUsuario:Number){
    return this.http.get(`${apiUrl}/peticion/listarPeticionPorIdUsuario/`+idUsuario);
  }

  listPetitionAll(){
    return this.http.get(`${apiUrl}/peticion/listarPeticionTodos`);
  }

  listPetitionDetailByIdPetition(idPeticion:number){
    return this.http.get(`${apiUrl}/peticion/listarDetallePeticionPorIdPeticion/`+idPeticion);
  }

  listPetitionHeadDetailByIdUserPeriod(idUsuario:number,idperiodo:number){
    return this.http.get(`${apiUrl}/peticion/listarPeticionCabeceraDetalleIdUsuarioPeriodo/`+idUsuario+'/'+idperiodo);
  }

  registerDiscount(objeto: any):Observable<Object>{
    return this.http.post(`${apiUrl}/peticionDescuento/registrar`, objeto);
  }

  updateDiscount(objeto: any):Observable<Object>{
    return this.http.put(`${apiUrl}/peticionDescuento/actualizar`, objeto);
  }

  deleteDiscount(id: Number):Observable<Object>{
    return this.http.delete(`${apiUrl}/peticionDescuento/eliminar/`+id);
  }

  listDiscountById(id:Number){
    return this.http.get(`${apiUrl}/peticionDescuento/listarPorId/`+id);
  }

  listDiscountByIdPetitionDetail(id:Number){
    return this.http.get(`${apiUrl}/peticionDescuento/listarPorIdPetcionDetalle/`+id);
  }

}
