import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { BehaviorSubject, Observable } from 'rxjs';
import { Collaborator } from 'app/Models/collaborator.model';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';  
const EXCEL_EXTENSION = '.xlsx';  
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CollaboratorsService {
  private message = new BehaviorSubject<string>('');
  public customMessage = this.message.asObservable();

  constructor(private http: HttpClient)  { }

  getProfileByXp( xpColaborador: String){
    return this.http.get(`${apiUrl}/colaborador/profile/`+xpColaborador);
  }

  listUsers(){
    return this.http.get(`${apiUrl}/colaborador`);
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);  
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };  
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });  
    this.saveAsExcelFile(excelBuffer, excelFileName);  
  }  
  private saveAsExcelFile(buffer: any, fileName: string): void {  
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});  
     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);  
  }  
  public changeMessage(msg: string): void {
    this.message.next(msg);
  }
  createCollaboratos(collaborator: Collaborator){
   return this.http.post<Collaborator>(`${apiUrl}/colaborador`, collaborator);
  }
  updateCollaboratos(collaborator: Collaborator, id :number){
    return this.http.put<Collaborator>(`${apiUrl}/colaborador/${id}`, collaborator);
   }
  
  listTrackPosition(){
    return this.http.get(`${apiUrl}/track_position`);
  }
  listManagementArea(){
    return this.http.get(`${apiUrl}/management_area`);
  }
  listNivelNeoris(){
    return this.http.get(`${apiUrl}/nivel_neoris`);
  }
  listPlataformaBbva(){
    return this.http.get(`${apiUrl}/plataforma_bbva`);
  }
  listEstadoRecruiting(){
    return this.http.get(`${apiUrl}/estado_recruiting`);
  }

/*

  UploadExcel(files: any, service: string, changestatus: boolean): Observable<any> {
    this.statusUpload = changestatus;
    this.errores = [];
    const url = `${this.URI_API}/debt/load/${service}?_=` + new Date().getTime();
    const opts={
      headers: {
        "Authorization" : "bearer " + this.storage.getCurrentToken(),
        "Ocp-Apim-Subscription-Key": environment.END_POINT,
        "Ocp-Apim-Trace": "true"
      }
    }
    const formData = new FormData();
    formData.append('file', files[0], files[0].name)
    return this.http.post<any>(url, formData, opts).pipe(
      catchError(error => throwError(error)));
  }
*/

  UploadExcel(files: any) {
    const formData = new FormData();
    formData.append('file', files, files.name)
    return this.http.post<any>(`${apiUrl}/file/upload`, formData);
  }  

 /* UploadExcel(files: File[]) {
    const formData = new FormData();
    formData.append('file', files[0], files[0].name)
    return this.http.post<any>(`${apiUrl}/file/upload`, formData);
  }
*/

}
