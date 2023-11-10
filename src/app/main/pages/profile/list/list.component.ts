import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { NgbModal,NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CollaboratorsService } from "app/services/collaborators.service";
import { NewCollaboratorComponent } from "./new-collaborator/new-collaborator.component";
import Swal from 'sweetalert2';
 
@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ListComponent implements OnInit {
  // Public
  file: File = null;
  inputXlsForm!: FormGroup;  
  public user;
  public report = [];
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = "";
  public previousPlanFilter = "";
  public previousStatusFilter = "";
  public colorInitials = [];
  public paramsCollborators :Object;
  public tituloModal;
  public fileRequired;
  message: string;
  //modal
  modal : NgbModalRef;

  @ViewChild(NewCollaboratorComponent) child
  public searchValue = "";
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;
  // Private
  private tempData = [];

  constructor(
    private formBuilderExcel: FormBuilder,
    private _coreSidebarService: CoreSidebarService,
    private modalService: NgbModal,
    private _collaborators: CollaboratorsService
  ) {
    this.buildForm();
  }

  

  // Public Methods

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.nombres.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // Update The Rows
    this.user = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }
  filterUpdateNew(filtro) {
    // Reset ng-select on search
    const val = filtro.toLowerCase();

    //   Our Data
    const temp = this.tempData.filter(function (d) {
      return (
        (
          (d.dataBBBVA[0]?.staffer
            ? d.dataBBBVA[0].staffer.toLowerCase()
            : null) +
          (d.dataBBBVA[0]?.techLead
            ? d.dataBBBVA[0].techLead.toLowerCase()
            : null) +
          (d.dataBBBVA[0]?.scrumMaster
            ? d.dataBBBVA[0].scrumMaster.toLowerCase()
            : null) +
          d.nombres.toLowerCase() +
          d.apellidos.toLowerCase() +
          (d.codigoXp ? d.codigoXp.toLowerCase() : null) +
          (d.dataBBBVA[0]?.gerencia.nombre
            ? d.dataBBBVA[0].gerencia.nombre.toLowerCase()
            : null)
        ).indexOf(val) !== -1 || !val
      );
    });

    this.user = temp;
    // this.table.offset = 0;
  }
  exportAsXLSX(): void {
    this.user?.forEach((e) => {
      this.report.push({
        Nombre: e.nombres,
        Apellido: e.apellidos,
        CodigoXp: e.codigoXp,
        Staffer: e.dataBBBVA[0]?.staffer ? e.dataBBBVA[0].staffer : null,
        LiderTecnico: e.dataBBBVA[0]?.techLead ? e.dataBBBVA[0].techLead : null,
        ScrumMaster: e.dataBBBVA[0]?.scrumMaster
          ? e.dataBBBVA[0].scrumMaster
          : null,
      });
    });

    this._collaborators.exportAsExcelFile(this.report, "sample");
  }
  ngOnInit(): void {
    this.getUsuarios();
    this._collaborators.customMessage.subscribe((msg) => {
      this.message = msg;
      this.filterUpdateNew(this.message);
    });
  } 
  getUsuarios() {
    this._collaborators.listUsers().subscribe(
      (data: any) => {
        this.user = data;
        this.tempData = this.user;
        console.log("usuarios", this.user);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getColor() {
    this.colorInitials = [
      "bg-light-success",
      "bg-light-secondary",
      "bg-light-warning",
    ];
    const random = Math.floor(Math.random() * this.colorInitials.length);
    return random;
  } 
  toggleSidebar(name): void {
    console.log("que componente tra", name);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  } 
  // modal create
  modalOpen(modalBasic,action, codigoXp?) {
   /* this.paramsCollborators.push(action);
    this.paramsCollborators.push(codigoXp);*/
    if(action == 'create'){
      this.tituloModal = "Crear Colaborador"
    }else{
      this.tituloModal = "Actualizar Colaborador"
    }
    this.paramsCollborators = {
      actions:action,
      xp: codigoXp
    }
    this.modalService.open(modalBasic, {
      centered: true,
      size: "lg",
      keyboard:false,
      backdrop: 'static'
    });
    //this.paramsCollborators =[];
    
    console.log('habre el modal', this.paramsCollborators) 
  }
    // modal Open Secondary
    modalOpenSecondary(modalSecondary) {
     this.modal = this.modalService.open(modalSecondary, {
        centered: true,
        windowClass: 'modal modal-secondary',
        keyboard:false,
        backdrop: 'static'
        
      });
    }
    cerrarModalFile(){
      this.modal.close();
      this.file = null;
      this.fileRequired = false;
    }
    private buildForm() {
      this.inputXlsForm = this.formBuilderExcel.group({
        xls: [''  ]
      });  
    }
// (change)="upload($event.target.files)"
    onChange(event) {
      this.fileRequired = false;
      this.file = event.target.files[0];
    }

 onUpload() {
    
    if (this.file) { 
      let textoQuestion="¿Está seguro de cargar el archivo ?";
      let textoSuccess = "Se ha cargado el archivo.";
      let action = "UPLOAD_EXCEL";
      this.openSwal(textoQuestion,textoSuccess,action); 
    }
    else{
        this.fileRequired = true;
    }
  }    

    openSwal(textoQuestion:String = "", textoSuccess:String, action:String){
      Swal.fire({
        text: textoQuestion.toString(),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        cancelButtonColor: '#E42728',
        confirmButtonText: 'Sí',
        cancelButtonText : 'No',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        }
      }).then((result) => {
        if (result.isConfirmed) {
    
          switch(action){
            case "UPLOAD_EXCEL": 
            this._collaborators.UploadExcel(this.file).subscribe((resp:any) => {
                  Swal.fire({
                    icon: 'success',
                    text: textoSuccess.toString(),
                    customClass: {
                      confirmButton: 'btn btn-success'
                    }
                  });
                  //this.restartForms();
                  this.modal.close();
                  console.log(resp); 
                  
                }, (err) => {
                  if(err.status == 200){
                    Swal.fire({
                      icon: 'success',
                      text: textoSuccess.toString(),
                      customClass: {
                        confirmButton: 'btn btn-success'
                      }
                    });
                    this.modal.close();
                    this.file = null;
                  }else{
                    Swal.fire({
                      text: err?.error?.message,
                      icon: 'warning'
                    });
                  }

                  
                  console.log(err)
                });
              break; 
           
          }  
          
        }
      });
    }
}
