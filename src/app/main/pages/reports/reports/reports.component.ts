import { Component, OnInit } from '@angular/core';
import { PeriodService } from 'app/services/period.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  
  public selectPeriodo = [];
  public listPeriodo = [];
  constructor( private _periodService: PeriodService) { }

  ngOnInit(): void {
    this.listPeriod();
  }

  listPeriod(){
    this._periodService.listPeriod().subscribe((data: any) => {
      this.listPeriod = data;
      let arr = []
      data.forEach(element => {
        let obj = {
          'name': element.descripcion,
          'value': element.idPeriodo.toString()
        }
        arr.push(obj);
        this.selectPeriodo = arr;
      });
    }, (err) => {
      console.log(err)
    })
  
  }

}
