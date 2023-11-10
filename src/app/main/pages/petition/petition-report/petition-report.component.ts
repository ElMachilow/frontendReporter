import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, DataTableFooterComponent } from '@swimlane/ngx-datatable';
import { ParameterService } from 'app/services/parameter.service';
import { PeriodService } from 'app/services/period.service';
import { petitionService } from 'app/services/petition.service';
import { SecurityService } from 'app/services/security.service';
import { Constantes } from 'app/util/Constantes';


@Component({
  selector: 'app-petition-report',
  templateUrl: './petition-report.component.html',
  styleUrls: ['./petition-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class petitionReportComponent implements OnInit {
  private tempData = [];
  public ColumnMode = ColumnMode;
  public rows: any;
  public selectProyecto: any = [
   
  ];
  public selectTarea: any = [
    { name: 'Todos', value: '' }
  ];
  public selectPeriodo: any = [
    { name: 'Todos', value: '' }
  ];
  public tempFilterData;
  public previousProjectFilter = '';
  public previousTareaFilter = '';
  public previousPeriodoFilter = '';
  public previousNombreFilter = '';
  public searchValue = '';

  constructor(
    private _parameterService: ParameterService,
    private _periodService: PeriodService,
    private router: Router,
    private _servicePetition: petitionService,
    private _securityService: SecurityService
  ) {
  }

  ngOnInit(): void {
    this.ListPetitionByIdUser();
    this.loadParameters();
  }

  loadParameters(){
    this._parameterService.listParameter(Constantes.CodGrupoProyecto).subscribe((data:any) => {
      let arr = [ { name: 'Todos', value: '' }]
      data.forEach(element => {
        let obj = {
          'name' : element.descripcion,
          'value' :element.id.toString()
        }
        arr.push(obj);
        this.selectProyecto = arr;
      });
    
      console.log(this.selectProyecto);
    }, (err) => {
      console.log(err)
    })

    this._parameterService.listParameter(Constantes.CodGrupoTarea).subscribe((data:any) => {
      let arr = [ { name: 'Todos', value: '' }]
      data.forEach(element => {
        let obj = {
          'name' : element.descripcion,
          'value' :element.id.toString()
        }
        arr.push(obj);
        this.selectTarea = arr;
      });
    }, (err) => {
      console.log(err)
    })

    this._periodService.listPeriod().subscribe((data:any) => {
      let arr = [ { name: 'Todos', value: '' }]
      data.forEach(element => {
        let obj = {
          'name' : element.descripcion,
          'value' :element.idPeriodo.toString()
        }
        arr.push(obj);
        this.selectPeriodo = arr;
      });
    }, (err) => {
      console.log(err)
    })
  }


  ListPetitionByIdUser(){
    this._servicePetition.listPetitionByIdUser(this._securityService.getIdUsuario()).subscribe((data:any) => {
      console.log(data);
      this.rows = data;
      this.tempData = this.rows;
    },(err) => {
      console.log(err)
    } )
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
 
  }
  onActivate(event) {
    if(event.type == 'click') {
        console.log(event.row);
        let rows = [event.row];
        this.router.navigate(['/main/horas/actualizar'], {
          state: { row: rows }
        });
    }
}
  edit(rows:any){
    console.log(rows)
    this.router.navigate(['/main/horas/actualizar'], {
      state: { row: rows }
    });
  }

  filterByProject(event){
    const filter = event ? event.value : '';
    this.previousProjectFilter = filter;
    this.tempFilterData = this.filterRows(filter,this.previousTareaFilter,this.previousPeriodoFilter,this.previousNombreFilter);
    this.rows = this.tempFilterData;
  }

  filterByTarea(event){
    const filter = event ? event.value : '';
    this.previousTareaFilter = filter;
    this.tempFilterData = this.filterRows(this.previousProjectFilter,filter,this.previousPeriodoFilter,this.previousNombreFilter);
    this.rows = this.tempFilterData;
  }

  filterByPeriodo(event){
    const filter = event ? event.value : '';
    this.previousPeriodoFilter = filter;
    this.tempFilterData = this.filterRows(this.previousProjectFilter,this.previousTareaFilter,filter, this.previousNombreFilter);
    this.rows = this.tempFilterData;
  }

  filterByNombre(event) {
    const filter = event ? event.target.value : '';
    this.previousNombreFilter = filter;
    this.tempFilterData = this.filterRows(this.previousProjectFilter,this.previousTareaFilter,this.previousPeriodoFilter,filter);
    this.rows = this.tempFilterData;
  }

  filterRows(projectFilter, tareaFilter, periodoFilter, nombreFilter): any[] {
    // Reset search on select change
    this.searchValue = '';

    projectFilter = projectFilter.toLowerCase();
    tareaFilter = tareaFilter.toLowerCase();
    periodoFilter = periodoFilter.toLowerCase();
    nombreFilter = nombreFilter.toLowerCase();
    return this.tempData.filter(row => {
      const isPartialNameMatch = row.codigoProyecto.toString().toLowerCase().indexOf(projectFilter) !== -1 || !projectFilter;
      const isPartialGenderMatch = row.tipoTarea.toString().toLowerCase().indexOf(tareaFilter) !== -1 || !tareaFilter;
      const isPartialStatusMatch = row.periodo.toString().toLowerCase().indexOf(periodoFilter) !== -1 || !periodoFilter;
      const isPartialNombreMatch = row.nombre.toString().toLowerCase().indexOf(nombreFilter) !== -1 || !nombreFilter; ;

      return isPartialNameMatch && isPartialGenderMatch && isPartialStatusMatch && isPartialNombreMatch;
    });
  }
}
