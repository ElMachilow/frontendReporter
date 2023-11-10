import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor( private datePipe: DatePipe) { }

  public getCurrentPeriod():Number{
    let myDate = new Date();
    return Number(this.datePipe.transform(myDate,"yyyyMM"))
  }

  public getTextCurrentPeriod(periodo):String{
    let month = periodo.toString().substring(4,6)
    let year = periodo.toString().substring(0,4)
    switch(month){
      case "01": return "Enero " +year; break;
      case "02": return "Febrero " +year; break;
      case "03": return "Marzo " +year; break;
      case "04": return "Abril " +year; break;
      case "05": return "Mayo " +year; break;
      case "06": return "Junio " +year; break;
      case "07": return "Julio " +year; break;
      case "08": return "Agosto " +year; break;
      case "09": return "Setiembre " +year; break;
      case "10": return "Octubre " +year; break;
      case "11": return "Noviembre " +year; break;
      case "12": return "Diciembre " +year; break;
    }
  }
}
