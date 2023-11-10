import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, DataTableFooterComponent } from '@swimlane/ngx-datatable';
import { UserService } from 'app/services/user.service';
import { ParameterService } from 'app/services/parameter.service';
import { PeriodService } from 'app/services/period.service';
import { petitionService } from 'app/services/petition.service';
import { SecurityService } from 'app/services/security.service';
import { Constantes } from 'app/util/Constantes';

@Component({
  selector: 'app-petition-all',
  templateUrl: './petition-all.component.html',
  styleUrls: ['./petition-all.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class petitionAllComponent implements OnInit {
  private tempData = [];
  public ColumnMode = ColumnMode;
  public rows: any;
  public selectUsuario: any = [];
  public selectPeriodo: any = [
    { name: 'Todos', value: '' }
  ];
  public tempFilterData;
  public previousColaborador = '';
  public previousPeriodoFilter = '';
  public previousNombreFilter = '';
  public searchValue = '';

  constructor(
    private _parameterService: ParameterService,
    private _periodService: PeriodService,
    private router: Router,
    private _servicePetition: petitionService,
    private _securityService: SecurityService,
    private _userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.ListPetitionByIdUser();
    this.loadParameters();
  }

  loadParameters(){
    this._userService.listUserByRol(Constantes.ROL_USER).subscribe((data: any) => {
      let arr = [ { name: 'Todos', value: '' }]
      data.forEach(element => {
        let obj = {
          'name': element.nombres + ' ' + element.apellidos,
          'value': element.nombres + ' ' + element.apellidos
        }
        arr.push(obj);
        this.selectUsuario = arr;
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
    this._servicePetition.listPetitionAll().subscribe((data:any) => {
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
          state: { row: rows , isAdmin:true }
        });
    }
}

  edit(rows:any){
    console.log(rows)
    this.router.navigate(['/main/horas/actualizar'], {
      state: { row: rows }
    });
  }

  filterByColaborador(event){
    const filter = event ? event.value : '';
    this.previousColaborador = filter;
    this.tempFilterData = this.filterRows(this.previousPeriodoFilter, this.previousNombreFilter,filter);
    this.rows = this.tempFilterData;
  }

  filterByPeriodo(event){
    const filter = event ? event.value : '';
    this.previousPeriodoFilter = filter;
    this.tempFilterData = this.filterRows(filter, this.previousNombreFilter,this.previousColaborador);
    this.rows = this.tempFilterData;
  }

  filterByNombre(event) {
    const filter = event ? event.target.value : '';
    this.previousNombreFilter = filter;
    this.tempFilterData = this.filterRows(this.previousPeriodoFilter,filter,this.previousColaborador);
    this.rows = this.tempFilterData;
  }

  filterRows(periodoFilter, nombreFilter , colaboradorFilter): any[] {
    // Reset search on select change
    this.searchValue = '';


    periodoFilter = periodoFilter.toLowerCase();
    nombreFilter = nombreFilter.toLowerCase();
    colaboradorFilter = colaboradorFilter.toLowerCase();;
    return this.tempData.filter(row => {
      const isPartialStatusMatch = row.periodo.toString().toLowerCase().indexOf(periodoFilter) !== -1 || !periodoFilter;
      const isPartialNombreMatch = row.nombre.toString().toLowerCase().indexOf(nombreFilter) !== -1 || !nombreFilter; ;
      const isPartialColaboradorMatch = row.nombreCompleto.toString().toLowerCase().indexOf(colaboradorFilter) !== -1 || !colaboradorFilter; ;

      return isPartialStatusMatch && isPartialNombreMatch && isPartialColaboradorMatch;
    });
  }
}
