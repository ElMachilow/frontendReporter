import { DatePipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Navigation, NavigationStart, Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PeticionDetalle } from 'app/Models/peticionDetalle.model';
import { PeticionDetalleCabecera } from 'app/Models/peticionDetalleCabecera.model';
import { PeticionDetalleDescuento } from 'app/Models/peticionDetalleDescuento.model';
import { ParameterService } from 'app/services/parameter.service';
import { PeriodService } from 'app/services/period.service';
import { petitionService } from 'app/services/petition.service';
import { SecurityService } from 'app/services/security.service';
import { Constantes } from 'app/util/Constantes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-petition-register',
  templateUrl: './petition-register.component.html',
  styleUrls: ['./petition-register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class petitionRegisterComponent implements OnInit {
  isAdmin = false;
  idDiscount: Number = 0;
  dateDetailUpdate = "";
  dateDiscountUpdate = "";
  form: FormGroup; 
  formDetails: FormGroup;
  formDiscount: FormGroup;
  peticionDetalleCabecera: PeticionDetalleCabecera;
  peticionDetalleDescuento: PeticionDetalleDescuento;
  peticionDetalle: PeticionDetalle;
  codePetition: Number = 0;
  isUpdate:boolean = false;
  isUpdateDiscount:boolean = false;
  petition : any = {};
  idPetitionUpdate: Number = 0;
  idPetitionDetalleUpdate: Number = 0;
  textButtonUpdate: string;
  public items = [];
  public formSubmit = false;
  public formDiscountSubmit = false;
  public formDetailsSubmit = false;
  public item = {
    idPeticionDetalle : 0,
    fechaAtencion: '',
    horas: '',
    descripcion: ''
  };
  public selectProyecto = [];
  public selectTarea = [];
  public selectPeriod = [];
  public dateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input'
  };
 

   /**
   * Constructor
   *
   * @param {NgbModal} modalService
   */ 

  constructor(private _coreSidebarService: CoreSidebarService,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private datePipe: DatePipe,
              private router: Router,
              private _parameterService: ParameterService,
              private _periodService: PeriodService,
              private _securityService: SecurityService,
              private _petitionService : petitionService,
              private ref: ChangeDetectorRef) { 
                let nav: Navigation = this.router.getCurrentNavigation();

                if (nav.extras && nav.extras.state && nav.extras.state.row) {
                 
                  this.isUpdate = true;
                  this.idPetitionUpdate = nav.extras.state.row[0].idPeticion;
                  this.petition = nav.extras.state.row;
                  this.isAdmin = nav.extras.state?.isAdmin;
                  console.log(nav.extras.state?.isAdmin);
                }
              }


  ngOnInit(): void {
    this.initForm();
    this.loadParameters();
    this.loadDatailsUpdate();
  }

  initForm(){
    this.form = this.fb.group({
      proyecto: ['', [Validators.required]],
      tipoTarea: ['', [Validators.required]],
      periodo: ['', [Validators.required]],
      nroPeticion: ['', [Validators.required]],
      nombrePeticion: ['', [Validators.required]]
    });
    
    this.formDetails = this.fb.group({
      fechaAtencion: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      horas: ['',[Validators.required,Validators.min(1), Validators.max(8) ]]
    })

    this.formDiscount = this.fb.group({
      fechaAtencion: [''],
      descripcion: [''],
      horas: [''],
      horasDescuento : ['',[Validators.required]],
      motivo: ['',[Validators.required]],
      fechaDescuento: ['',[Validators.required]]
    })
  }

  loadParameters(){
    this._parameterService.listParameter(Constantes.CodGrupoProyecto).subscribe((data:any) => {
      this.selectProyecto = data;
      console.log(this.selectProyecto);
    }, (err) => {
      console.log(err)
    })

    this._parameterService.listParameter(Constantes.CodGrupoTarea).subscribe((data:any) => {
      this.selectTarea = data;
    }, (err) => {
      console.log(err)
    })

    this._periodService.listPeriod().subscribe((data:any) => {
      this.selectPeriod = data;
    }, (err) => {
      console.log(err)
    })
  }

  loadDatailsUpdate(){
    if(this.isUpdate){
      this.form.controls['proyecto'].setValue(this.petition[0].codigoProyecto);
      this.form.controls['tipoTarea'].setValue(this.petition[0].tipoTarea);
      this.form.controls['periodo'].setValue(this.petition[0].periodo);
      this.form.controls['nroPeticion'].setValue(this.petition[0].numero);
      this.form.controls['nombrePeticion'].setValue(this.petition[0].nombre);

      this._petitionService.listPetitionDetailByIdPetition(this.petition[0].idPeticion).subscribe((data:any) => {
        this.items = [];
        data.forEach(element => {
            this.items.push(element)
        });
      })
    }
  }

  UpdatePedition(){
    this.formSubmit = true;
    if(this.form.invalid){
      return ;
    }
    this.generateObjectUpdatePetition();
    let textoQuestion="¿Está seguro de actualizar la petición?";
    let textoSuccess = "Se ha actualizado la petición.";
    let action = "ACTUALIZAR_PETICION";
    this.openSwal(textoQuestion,textoSuccess,action)
  }

  save(){
    this.formSubmit = true;
    if(this.form.invalid){
      return ;
    }
    this.generateObjectRegister();
    let textoQuestion="¿Está seguro de registrar la petición y detalle de horas atendidas?";
    let textoSuccess = "Se ha registrado la petición y el detalle de horas.";
    let action = "REGISTRAR_PETICION";
    this.openSwal(textoQuestion,textoSuccess,action)
  }

  updateDetailPetition(){
    this.formDetailsSubmit = true;
    if(this.formDetails.invalid){
      return ;
    }
    if(this.idPetitionDetalleUpdate === 0){
      this.generateObjectNewDetailPetition();
      let textoQuestion="¿Está seguro de registrar el detalle de horas?";
      let textoSuccess = "Se ha registrado el detalle de horas.";
      let action = "NUEVO_DETALLE_PETICION";
      this.openSwal(textoQuestion,textoSuccess,action);
    }else{
      this.generateObjectUpdateDetailPetition();
      let textoQuestion="¿Está seguro de actualizar el detalle de horas?";
      let textoSuccess = "Se ha actualizado el detalle de horas.";
      let action = "ACTUALIZAR_DETALLE_PETICION";
      this.openSwal(textoQuestion,textoSuccess,action);
    }
  }

  deleteItemDB(row){
    this.idPetitionDetalleUpdate = row.idPeticionDetalle;
    let textoQuestion="¿Está seguro de eliminar el detalle de horas?";
      let textoSuccess = "Se ha eliminado el detalle de horas.";
      let action = "ELIMINAR_DETALLE_PETICION";
      this.openSwal(textoQuestion,textoSuccess,action);
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
          case "REGISTRAR_PETICION":
            this._petitionService.registerPetitionHeadDetail(this.peticionDetalleCabecera).subscribe((resp:any) => {
              Swal.fire({
                icon: 'success',
                text: textoSuccess.toString(),
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
              this.restartForms();
              console.log(resp);
            }, (err) => {
              Swal.fire({
                text: err?.error?.message,
                icon: 'warning'
              });
              console.log(err)
            });
          break;
          case "ACTUALIZAR_PETICION":
            this._petitionService.updatePetition(this.peticionDetalleCabecera).subscribe((resp:any) => {
              Swal.fire({
                icon: 'success',
                text: textoSuccess.toString(),
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
              console.log(resp);
            }, (err) => {
              Swal.fire({
                text: err?.error?.message,
                icon: 'warning'
              });
              console.log(err)
            });
          break;
          case "ACTUALIZAR_DETALLE_PETICION" :
            this._petitionService.updateDetailPetition(this.peticionDetalle).subscribe((resp:any) => {
              Swal.fire({
                icon: 'success',
                text: textoSuccess.toString(),
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
              this.loadDatailsUpdate();
              this.modalService.dismissAll();
              this.formDetailsSubmit = false;
              this.idPetitionDetalleUpdate = 0;
              this.dateDetailUpdate = "";
              console.log(resp);
            }, (err) => {
              Swal.fire({
                text: err?.error?.message,
                icon: 'warning'
              });
              console.log(err)
            });
          break;
          case "NUEVO_DETALLE_PETICION" :
            this._petitionService.registerPetitionDetail(this.peticionDetalle).subscribe((resp:any) => {
              Swal.fire({
                icon: 'success',
                text: textoSuccess.toString(),
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
              this.loadDatailsUpdate();
              this.modalService.dismissAll();
              this.formDetailsSubmit = false;
              this.idPetitionDetalleUpdate = 0;
              this.dateDetailUpdate = "";
              console.log(resp);
            }, (err) => {
              Swal.fire({
                text: err?.error?.message,
                icon: 'warning'
              });
              console.log(err)
            });
          break;
          case "ELIMINAR_DETALLE_PETICION" :
            this._petitionService.deleteDetailPetition(this.idPetitionDetalleUpdate).subscribe((resp:any) => {
              Swal.fire({
                icon: 'success',
                text: textoSuccess.toString(),
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
              this.loadDatailsUpdate();
              this.idPetitionDetalleUpdate = 0;
              console.log(resp);
            }, (err) => {
              Swal.fire({
                text: err?.error?.message,
                icon: 'warning'
              });
              console.log(err)
            });
          break;
          case "REDUCCION_HORAS" :
            this._petitionService.registerDiscount(this.peticionDetalleDescuento).subscribe((resp:any) => {
              Swal.fire({
                icon: 'success',
                text: textoSuccess.toString(),
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
              this.loadDatailsUpdate();
              this.modalService.dismissAll();
              this.formDiscountSubmit = false;
              this.idPetitionDetalleUpdate = 0;
              console.log(resp);
            }, (err) => {
              Swal.fire({
                text: err?.error?.message,
                icon: 'warning'
              });
              console.log(err)
            });
          break;
          case "ACTUALIZAR_DESCUENTO":
            this._petitionService.updateDiscount(this.peticionDetalleDescuento).subscribe((resp:any) => {
              Swal.fire({
                icon: 'success',
                text: textoSuccess.toString(),
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
              this.loadDatailsUpdate();
              this.modalService.dismissAll();
              this.formDiscountSubmit = false;
              this.idDiscount = 0;
            }, (err) => {
              Swal.fire({
                text: err?.error?.message,
                icon: 'warning'
              });
              console.log(err)
            });
          break;
          case "ELIMINAR_DESCUENTO":
            this._petitionService.deleteDiscount(this.idDiscount).subscribe((resp:any) => {
              Swal.fire({
                icon: 'success',
                text: textoSuccess.toString(),
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
              this.loadDatailsUpdate();
              this.modalService.dismissAll();
              this.formDiscountSubmit = false;
              this.idDiscount = 0;
            }, (err) => {
              Swal.fire({
                text: err?.error?.message,
                icon: 'warning'
              });
              console.log(err)
            });
          break;
        }
        
      }
    });
  }

  restartForms(){
    this.formSubmit = false;
    this.formDetailsSubmit = false;
    this.formDiscountSubmit = false;
    this.form.reset();
    this.formDetails.reset();
    this.formDiscount.reset();
    this.items = [];
  }

  generateObjectDiscount(){
    this.peticionDetalleDescuento = new PeticionDetalleDescuento();
    this.peticionDetalleDescuento.idPeticionDetalle = this.idPetitionDetalleUpdate;
    this.peticionDetalleDescuento.fechaDescuento = this.datePipe.transform(this.formDiscount.controls["fechaDescuento"].value,"yyyy-MM-dd");
    this.peticionDetalleDescuento.horas = this.formDiscount.controls["horasDescuento"].value;
    this.peticionDetalleDescuento.motivo = this.formDiscount.controls["motivo"].value;
    this.peticionDetalleDescuento.usuarioCreacion = this._securityService.getFullNameUser();
  }

  generateObjectUpdateDiscount(){
    this.peticionDetalleDescuento = new PeticionDetalleDescuento();
    this.peticionDetalleDescuento.id = this.idDiscount;
    this.peticionDetalleDescuento.fechaDescuento = this.datePipe.transform(this.formDiscount.controls["fechaDescuento"].value,"yyyy-MM-dd");
    this.peticionDetalleDescuento.horas = this.formDiscount.controls["horasDescuento"].value;
    this.peticionDetalleDescuento.motivo = this.formDiscount.controls["motivo"].value;
    this.peticionDetalleDescuento.usuarioModificacion = this._securityService.getFullNameUser();
  }

  generateObjectUpdatePetition(){
    this.peticionDetalleCabecera = new PeticionDetalleCabecera();
    this.peticionDetalleCabecera.idPeticion = this.idPetitionUpdate;
    this.peticionDetalleCabecera.codigoProyecto = this.form.controls['proyecto'].value;
    this.peticionDetalleCabecera.tipoTarea =  this.form.controls['tipoTarea'].value;
    this.peticionDetalleCabecera.periodo =  this.form.controls['periodo'].value;
    this.peticionDetalleCabecera.numero =  this.form.controls['nroPeticion'].value;
    this.peticionDetalleCabecera.nombre =  this.form.controls['nombrePeticion'].value;
    this.peticionDetalleCabecera.idUsuario = this._securityService.getIdUsuario();
    this.peticionDetalleCabecera.usuarioModificacion =  this._securityService.getFullNameUser();
  }

  generateObjectRegister(){
    this.peticionDetalleCabecera = new PeticionDetalleCabecera();
    this.peticionDetalleCabecera.codigoProyecto = this.form.controls['proyecto'].value;
    this.peticionDetalleCabecera.tipoTarea =  this.form.controls['tipoTarea'].value;
    this.peticionDetalleCabecera.periodo =  this.form.controls['periodo'].value;
    this.peticionDetalleCabecera.numero =  this.form.controls['nroPeticion'].value;
    this.peticionDetalleCabecera.nombre =  this.form.controls['nombrePeticion'].value;
    this.peticionDetalleCabecera.idUsuario = this._securityService.getIdUsuario();
    this.peticionDetalleCabecera.usuarioCreacion = this._securityService.getFullNameUser();
    this.peticionDetalleCabecera.peticionDetalle = [];

    for(let item of this.items){
      let peticionDetalle = new PeticionDetalle();
      peticionDetalle.fechaAtencion = this.datePipe.transform(item.fechaAtencion,"yyyy-MM-dd");
      peticionDetalle.horas = item.horas;
      peticionDetalle.descripcion = item.descripcion;
      peticionDetalle.usuarioCreacion = this._securityService.getFullNameUser();
      this.peticionDetalleCabecera.peticionDetalle.push(peticionDetalle);
    }
  }

  generateObjectUpdateDetailPetition(){
    this.peticionDetalle = new PeticionDetalle();
    this.peticionDetalle.idPeticionDetalle = this.idPetitionDetalleUpdate;
    this.peticionDetalle.fechaAtencion = this.datePipe.transform(this.formDetails.controls["fechaAtencion"].value,"yyyy-MM-dd");
    this.peticionDetalle.horas = this.formDetails.controls["horas"].value;
    this.peticionDetalle.descripcion = this.formDetails.controls["descripcion"].value;
    this.peticionDetalle.usuarioModificacion = this._securityService.getFullNameUser();
  }

  generateObjectNewDetailPetition(){
    this.peticionDetalle = new PeticionDetalle();
    this.peticionDetalle.idPeticion = this.idPetitionUpdate;
    this.peticionDetalle.fechaAtencion = this.datePipe.transform(this.formDetails.controls["fechaAtencion"].value,"yyyy-MM-dd");
    this.peticionDetalle.horas = this.formDetails.controls["horas"].value;
    this.peticionDetalle.descripcion = this.formDetails.controls["descripcion"].value;
    this.peticionDetalle.usuarioCreacion = this._securityService.getFullNameUser();
  }

  addDetail(){
    this.formDetailsSubmit = true;
    if(this.formDetails.invalid){
      return ;
    }
    
    this.items.push({
      fechaAtencion: this.formDetails.controls['fechaAtencion'].value,
      horas: this.formDetails.controls['horas'].value,
      descripcion: this.formDetails.controls['descripcion'].value
    });
    
    //let totalhoras = 0;
    //this.items.forEach((x) => totalhoras = totalhoras + x.horas);
    //this.form.controls['totalHoras'].setValue(totalhoras);

    this.formDetailsSubmit = false;
    this.formDetails.reset();
    this.modalService.dismissAll();
  }

  openModalupdateDetail(row,modalForm){
    this.idPetitionDetalleUpdate = row.idPeticionDetalle;
    this.dateDetailUpdate = row.fechaAtencion;
    this.formDetails.controls["fechaAtencion"].setValue(this.dateDetailUpdate);
    this.formDetails.controls["horas"].setValue(row.horas);
    this.formDetails.controls["descripcion"].setValue(row.descripcion);
    this.textButtonUpdate = "Actualizar";
    this.modalService.open(modalForm, {
      centered: true,
      size: 'lg'
    });
  }

  openModalDiscount(row,modalForm){
    this.idPetitionDetalleUpdate = row.idPeticionDetalle;
    this.dateDetailUpdate = row.fechaAtencion;
    this.dateDiscountUpdate = "";
    this.idDiscount = row.idDescuento;
    if(this.idDiscount > 0){
      this.isUpdateDiscount = true;
      this._petitionService.listDiscountById(this.idDiscount).subscribe((data:any) => {
        this.dateDiscountUpdate = data.fechaDescuento;
        this.formDiscount.controls["fechaAtencion"].setValue(this.dateDetailUpdate);
        this.formDiscount.controls["horas"].setValue(row.horas);
        this.formDiscount.controls["descripcion"].setValue(row.descripcion);
        this.formDiscount.controls["horasDescuento"].setValue(data.horas);
        this.formDiscount.controls["motivo"].setValue(data.motivo);
        this.formDiscount.controls["fechaDescuento"].setValue(this.dateDiscountUpdate);
        this.modalService.open(modalForm, {
          centered: true,
          size: 'lg'
        });
      }, (err) => {
        console.log(err);
      })
    }else{
      this.isUpdateDiscount = false;
      this.formDiscount.controls["fechaAtencion"].setValue(this.dateDetailUpdate);
      this.formDiscount.controls["horas"].setValue(row.horas);
      this.formDiscount.controls["descripcion"].setValue(row.descripcion);
      this.formDiscount.controls["horasDescuento"].setValue("");
      this.formDiscount.controls["motivo"].setValue("");
      this.formDiscount.controls["fechaDescuento"].setValue("");
      this.modalService.open(modalForm, {
        centered: true,
        size: 'lg'
      });
    }
  }

  deleteItem(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items.indexOf(this.items[i]) === id) {
       // this.form.controls['totalHoras'].setValue(this.form.controls['totalHoras'].value - this.items[i].horas);
        this.items.splice(i, 1);
        break;
      }
    }
  }

  registerDiscount(){
    this.formDiscountSubmit = true;
    if(this.formDiscount.invalid){
      return;
    }
    this.generateObjectDiscount();
    let textoQuestion="¿Está seguro de aplicar la reducción de horas al detalle seleccionado?";
    let textoSuccess = "Se ha aplicado la reducción de horas.";
    let action = "REDUCCION_HORAS";
    this.openSwal(textoQuestion,textoSuccess,action)
  }

  updateDiscount(){
    this.formDiscountSubmit = true;
    if(this.formDiscount.invalid){
      return;
    }
    this.generateObjectUpdateDiscount();
    let textoQuestion="¿Está seguro de actualizar la reducción de horas al detalle seleccionado?";
    let textoSuccess = "Se ha aplicado la reducción de horas.";
    let action = "ACTUALIZAR_DESCUENTO";
    this.openSwal(textoQuestion,textoSuccess,action)
  }

  deleteDiscount(){
    let textoQuestion="¿Está seguro de eliminar la reducción de horas al detalle seleccionado?";
    let textoSuccess = "Se ha eliminado la reducción de horas.";
    let action = "ELIMINAR_DESCUENTO";
    this.openSwal(textoQuestion,textoSuccess,action)
  }

  modalOpenForm(modalForm) {
    this.textButtonUpdate = "";
    this.formDetails.reset();
    this.idPetitionDetalleUpdate = 0;
    this.dateDetailUpdate = "";
    if(this.isUpdate){
      this.textButtonUpdate = "Registrar";
    }
    this.modalService.open(modalForm, {
      centered: true,
      size: 'lg'
    });
  }
  
  closeModal(){
    this.formDetailsSubmit = false;
    this.formDetails.reset();
    this.modalService.dismissAll();
  }


  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  submit(form) {
    if (form.valid) {
      this.toggleSidebar('new-user-sidebar');
    }
  }
}
