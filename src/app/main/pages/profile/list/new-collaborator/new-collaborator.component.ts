import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CollaboratorsService } from "app/services/collaborators.service";
import { BehaviorSubject } from "rxjs";
import { Collaborator } from "app/Models/collaborator.model";
import { TrackPosition } from "app/Models/trackPosition.model";
import { ManagementArea } from "app/Models/managementArea.model";
import { NivelNeoris } from "app/Models/nivelNeoris.model";
import { PlataformaBBVA } from "app/Models/plataformaBBVA.model";
import { EstadoRecruiting } from "app/Models/estadoRecruiting.model";

import { DatePipe } from "@angular/common";
import { FlatpickrOptions } from "ng2-flatpickr";
import { Console } from "console";
import Swal from "sweetalert2";

@Component({
  selector: "app-new-collaborator",
  templateUrl: "./new-collaborator.component.html",
  styleUrls: ["./new-collaborator.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class NewCollaboratorComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  public trackPosition;
  public managementArea;
  public nivelNeoris;
  public plataformaBbva;
  public estadoRecruiting;
  public collaborator: Collaborator;
  public params: Object;
  idCollaborator!: any;
  public EstadoNeoris;
  fechaNac = "";
  fechaIngresoNeoris = "";
  fechaAltaContractor = "";
  fechaAltaVdi = "";
  fechaAltaAccesoServiceNow = "";
  fechaAccesoRacf = "";
  especialidades:[];
  proyectosNeoris:[];
  dataBBBVA:[];
  perfilBBVA: [];  

  public dateOptions = { 
    altInput: true,
    mode: "single",
    altInputClass:
      "form-control flat-picker flatpickr-input invoice-edit-input",
  };
 
  @Input() paramsCollborator: Object;
  @Output() messageEvent = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private _collaborators: CollaboratorsService,
    private datePipe: DatePipe
  ) {
    this.buildForm();
    this.listTrackPosition();
    this.listManagementArea();
    this.listNivelNeoris();
    this.listPlataformaBbva();
    this.listEstadoRecruiting();
  }

  ngOnInit(): void {}

  ngOnChanges() {
    console.log(
      "que ventana esta abriendo xdddd",
      this.paramsCollborator[0].actions,
      this.paramsCollborator[0].xp
    );
    // console.log('que ventana esta abriendo', this.paramsCollborator. );

    if (this.paramsCollborator[0].actions == "edit") {
      this._collaborators
        .getProfileByXp(this.paramsCollborator[0].xp)
        .subscribe(
          (data: any) => {
            this.collaborator = data;
            console.log(
              "este es el usuario a editar con el modelo",
              this.collaborator
            );
            this.loadCollaborator();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
  /*
    this.registerForm.setValue({
    ruc: this.gtpService.EmpresaServicios.ruc,
    nombre: (this.gtpService.EmpresaServicios.newNameGTPStatus === 3) ? this.gtpService.EmpresaServicios.newName : this.gtpService.EmpresaServicios.name,
    rubro: this.gtpService.EmpresaServicios.entry,
    email: this.gtpService.EmpresaServicios.email,
    telefono: this.gtpService.EmpresaServicios.movilNumber,
    contrasena: '',
    repcontrasena: '',
    acceptterms: true
    });
  */
  public loadCollaborator() {
     
    this.EstadoNeoris = this.collaborator.estadoNeoris;

    this.idCollaborator = this.collaborator.id; 
    this.fechaNac = this.collaborator.fechaNacimiento.toString();
    this.fechaIngresoNeoris = this.collaborator.fechaIngresoNeoris.toString();
 
    this.fechaAltaContractor = this.collaborator.fechaAltaContractor
      ? this.collaborator.fechaAltaContractor.toString()
      : null;
    this.fechaAltaVdi = this.collaborator.fechaAltaVDI
      ? this.collaborator.fechaAltaVDI.toString()
      : null;
    this.fechaAltaAccesoServiceNow = this.collaborator.fechaAltaAccesoServiceNow
      ? this.collaborator.fechaAltaAccesoServiceNow.toString()
      : null;
    this.fechaAccesoRacf = this.collaborator.fechaAccesoRacf
      ? this.collaborator.fechaAccesoRacf.toString()
      : null;

    this.especialidades = this.collaborator.especialidades;
    this.proyectosNeoris = this.collaborator.proyectosNeoris;
    this.dataBBBVA = this.collaborator.dataBBBVA;
    this.perfilBBVA = this.collaborator.perfilBBVA; 
  
    this.form.patchValue({
      nombres: this.collaborator.nombres,
      apellidos: this.collaborator.apellidos,
      codigoEmpleado: this.collaborator.codigoEmpleado,
      codigoXP: this.collaborator.codigoXp,
      dni: this.collaborator.dni,
      estadoNeoris: this.collaborator.estadoNeoris,
      pais: this.collaborator.pais, // this.datePipe.transform(this.f.fechaNacimiento.value ,"yyyy-MM-dd");
      fechaNacimiento: this.fechaNac,
      celular: this.collaborator.celular,
      fechaIngresoNeoris: this.fechaIngresoNeoris,
      correoNeoris: this.collaborator.correoNeoris,
      estadoPmoBbva: this.collaborator.estadoPmoBbva,
      correoContractor: this.collaborator.correoContractor,
      fechaAltaContractor: this.fechaAltaContractor,
      vdiPmo: this.collaborator.vdiPmo,
      fechaAltaVdi: this.fechaAltaVdi,
      accesoServiceNow: this.collaborator.accesoServiceNow,
      fechaAltaAccesoServiceNow: this.fechaAltaAccesoServiceNow,
      timeReport: this.collaborator.timeReport,
      accesoRacf: this.collaborator.accesoRacf,
      fechaAccesoRacf: this.fechaAccesoRacf,
      ipVdiPmo: this.collaborator.ipVdiPmo,
       trackPosition:this.collaborator.trackPosition? this.collaborator.trackPosition.id:"",
      managementArea:this.collaborator.managementArea? this.collaborator.managementArea.id:"",
      nivelNeoris:this.collaborator.nivelNeoris? this.collaborator.nivelNeoris.id:"",
      plataformaBBVA: this.collaborator.plataformaBBVA ?this.collaborator.plataformaBBVA.id:"",
      estadoRecruiting: this.collaborator.estadoRecruiting?this.collaborator.estadoRecruiting.id:"", 
 
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      nombres: ["", [Validators.required]],
      apellidos: ["", [Validators.required]],
      codigoEmpleado: ["" ],
      codigoXP: ["", [Validators.required]],
      dni: ["", [Validators.required]],
      estadoNeoris: ["", [Validators.required]], //
      pais: ["", [Validators.required]],
      fechaNacimiento: ["", [Validators.required]],
      celular: ["", [Validators.required]],
      fechaIngresoNeoris: ["", [Validators.required]],
      /*fechaSalidaNeoris: ['', [Validators.required]], null */
      correoNeoris: ["", [Validators.required]],
      estadoPmoBbva: ["" ],
      correoContractor: ["" ],
      fechaAltaContractor: ["" ],
      vdiPmo: [""],
      fechaAltaVdi: [""],
      accesoServiceNow: [""],
      fechaAltaAccesoServiceNow: ["" ],
      timeReport: [""],
      accesoRacf: [""],
      fechaAccesoRacf: ["" ],
      ipVdiPmo: ["" ],
      /*imagen: ['', [Validators.required]], como null */
      trackPosition: [""],
      managementArea: [""],
      nivelNeoris: ["" ],
      plataformaBBVA: ["" ],
      estadoRecruiting: ["" ],
    });
  }
  
  get f(): any {
    return this.form.controls;
  }
  listTrackPosition() {
    this._collaborators.listTrackPosition().subscribe(
      (data: any) => {
        this.trackPosition = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  listManagementArea() {
    this._collaborators.listManagementArea().subscribe(
      (data: any) => {
        this.managementArea = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  listNivelNeoris() {
    this._collaborators.listNivelNeoris().subscribe(
      (data: any) => {
        this.nivelNeoris = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  listPlataformaBbva() {
    this._collaborators.listPlataformaBbva().subscribe(
      (data: any) => {
        this.plataformaBbva = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  listEstadoRecruiting() {
    this._collaborators.listEstadoRecruiting().subscribe(
      (data: any) => {
        this.estadoRecruiting = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  grabar(event: Event) {
    event.preventDefault();
    this.submitted = true;
    if (this.form.valid) {
      if (this.idCollaborator) {
        console.log("EL ID del que se va a ctualizar e ", this.idCollaborator);
        this.update();
      } else {
        this.create();
      }
    }
  }

  create() {
     
    var fechaAltaAccesoServiceNow =  new String(this.f.fechaAltaAccesoServiceNow.value);
    var fechaAccesoRacf = new String( this.f.fechaAccesoRacf.value);
    var fechaAltaVdi = new String( this.f.fechaAltaVdi.value);
    var fechaAltaContractor = new String( this.f.fechaAltaContractor.value);  

      this.collaborator = new Collaborator();
      this.collaborator.trackPosition = new TrackPosition();
      this.collaborator.managementArea = new ManagementArea();
      this.collaborator.nivelNeoris = new NivelNeoris();
      this.collaborator.plataformaBBVA = new PlataformaBBVA();
      this.collaborator.estadoRecruiting = new EstadoRecruiting();
 
      this.collaborator.nombres = this.f.nombres.value;
      this.collaborator.apellidos = this.f.apellidos.value;
      this.collaborator.codigoEmpleado = this.f.codigoEmpleado.value;
      this.collaborator.pais = this.f.pais.value;
      this.collaborator.dni = this.f.dni.value;
      this.collaborator.codigoXp = this.f.codigoXP.value;
      this.collaborator.estadoNeoris = this.f.estadoNeoris.value;
      this.collaborator.fechaNacimiento = this.datePipe.transform(
        this.f.fechaNacimiento.value,
        "yyyy-MM-dd"
      );
      this.collaborator.celular = this.f.celular.value;
      this.collaborator.fechaIngresoNeoris = this.datePipe.transform(
        this.f.fechaIngresoNeoris.value,
        "yyyy-MM-dd"
      );
      this.collaborator.fechaSalidaNeoris = null;
      this.collaborator.correoNeoris = this.f.correoNeoris.value;
      this.collaborator.estadoPmoBbva = this.f.estadoPmoBbva.value;
      this.collaborator.correoContractor = this.f.correoContractor.value;
      this.collaborator.fechaAltaContractor = fechaAltaContractor.length !== 0 ? this.datePipe.transform(
        this.f.fechaAltaContractor.value,
        "yyyy-MM-dd"
      ):null;
      this.collaborator.vdiPmo = this.f.vdiPmo.value;
      this.collaborator.fechaAltaVDI =fechaAltaVdi.length !== 0 ? this.datePipe.transform(
        this.f.fechaAltaVdi.value,
        "yyyy-MM-dd"
      ):null;
      this.collaborator.accesoServiceNow = this.f.accesoServiceNow.value;
      this.collaborator.fechaAltaAccesoServiceNow =fechaAltaAccesoServiceNow.length !== 0 ?this.datePipe.transform(
        this.f.fechaAltaAccesoServiceNow.value,
        "yyyy-MM-dd"
      ):null;
      this.collaborator.timeReport = this.f.timeReport.value;
      this.collaborator.accesoRacf = this.f.accesoRacf.value;
      this.collaborator.fechaAccesoRacf = fechaAccesoRacf.length !== 0  ? this.datePipe.transform(
        this.f.fechaAccesoRacf.value,
        "yyyy-MM-dd"
      ):null;
      this.collaborator.ipVdiPmo = this.f.ipVdiPmo.value;
      this.collaborator.trackPosition.id = this.f.trackPosition.value ? parseInt(this.f.trackPosition.value):this.collaborator.trackPosition =null;
    this.collaborator.managementArea.id  = this.f.managementArea.value? parseInt( this.f.managementArea.value):this.collaborator.managementArea=null;
    this.collaborator.nivelNeoris.id  =this.f.nivelNeoris.value? parseInt(this.f.nivelNeoris.value):this.collaborator.nivelNeoris =null;
    this.collaborator.plataformaBBVA.id  =this.f.plataformaBBVA.value? parseInt( this.f.plataformaBBVA.value ):this.collaborator.plataformaBBVA =null;
    this.collaborator.estadoRecruiting.id  =  this.f.estadoRecruiting.value ? parseInt( this.f.estadoRecruiting.value ):this.collaborator.estadoRecruiting = null;
    
      this.collaborator.especialidades = [];
      this.collaborator.proyectosNeoris = [];
      this.collaborator.dataBBBVA = [];
      this.collaborator.perfilBBVA = []; 
      console.log("EL COLABORADOR ENVIADO ES", this.collaborator);
      console.log(  "EL COLABORADOR HA CREAR  ES EN JSON ",  this.collaborator   )
      let textoQuestion = "¿Está seguro de registrar el colaborador?";
      let textoSuccess = "Se ha registrado el colaborador.";
      let action = "REGISTRAR_COLABORADOR";
      this.openSwal(textoQuestion, textoSuccess, action);
    
  }

  update() {



    var fechaAltaAccesoServiceNow =  new String(this.f.fechaAltaAccesoServiceNow.value);
    var fechaAccesoRacf = new String( this.f.fechaAccesoRacf.value);
    var fechaAltaVdi = new String( this.f.fechaAltaVdi.value);
    var fechaAltaContractor = new String( this.f.fechaAltaContractor.value);

    this.collaborator = new Collaborator();
    this.collaborator.trackPosition = new TrackPosition();
    this.collaborator.managementArea = new ManagementArea();
    this.collaborator.nivelNeoris = new NivelNeoris();
    this.collaborator.plataformaBBVA = new PlataformaBBVA();
    this.collaborator.estadoRecruiting = new EstadoRecruiting(); 

    this.collaborator.id = this.idCollaborator;
    this.collaborator.nombres = this.f.nombres.value;
    this.collaborator.apellidos = this.f.apellidos.value;
    this.collaborator.codigoEmpleado = this.f.codigoEmpleado.value;
    this.collaborator.pais = this.f.pais.value;
    this.collaborator.dni = this.f.dni.value;
    this.collaborator.codigoXp = this.f.codigoXP.value;
    this.collaborator.estadoNeoris = this.f.estadoNeoris.value;
    this.collaborator.fechaNacimiento = this.datePipe.transform(
      this.f.fechaNacimiento.value,
      "yyyy-MM-dd"
    );
    this.collaborator.celular = this.f.celular.value;
    this.collaborator.fechaIngresoNeoris = this.datePipe.transform(
      this.f.fechaIngresoNeoris.value,
      "yyyy-MM-dd"
    );
    this.collaborator.fechaSalidaNeoris = null;
    this.collaborator.correoNeoris = this.f.correoNeoris.value;
    this.collaborator.estadoPmoBbva = this.f.estadoPmoBbva.value;
    this.collaborator.correoContractor = this.f.correoContractor.value;
    this.collaborator.fechaAltaContractor = fechaAltaContractor.length !== 0 ? this.datePipe.transform(
      this.f.fechaAltaContractor.value,
      "yyyy-MM-dd"
    ):null;
    this.collaborator.vdiPmo = this.f.vdiPmo.value;
    this.collaborator.fechaAltaVDI =fechaAltaVdi.length !== 0 ? this.datePipe.transform(
      this.f.fechaAltaVdi.value,
      "yyyy-MM-dd"
    ):null;
    this.collaborator.accesoServiceNow = this.f.accesoServiceNow.value;
    this.collaborator.fechaAltaAccesoServiceNow =fechaAltaAccesoServiceNow.length !== 0 ?this.datePipe.transform(
      this.f.fechaAltaAccesoServiceNow.value,
      "yyyy-MM-dd"
    ):null;
    this.collaborator.timeReport = this.f.timeReport.value;
    this.collaborator.accesoRacf = this.f.accesoRacf.value;
    this.collaborator.fechaAccesoRacf = fechaAccesoRacf.length !== 0  ? this.datePipe.transform(
      this.f.fechaAccesoRacf.value,
      "yyyy-MM-dd"
    ):null;
    this.collaborator.ipVdiPmo = this.f.ipVdiPmo.value;
    this.collaborator.trackPosition.id = this.f.trackPosition.value ? parseInt(this.f.trackPosition.value):this.collaborator.trackPosition =null;
    this.collaborator.managementArea.id  = this.f.managementArea.value? parseInt( this.f.managementArea.value):this.collaborator.managementArea=null;
    this.collaborator.nivelNeoris.id  =this.f.nivelNeoris.value? parseInt(this.f.nivelNeoris.value):this.collaborator.nivelNeoris =null;
    this.collaborator.plataformaBBVA.id  =this.f.plataformaBBVA.value? parseInt( this.f.plataformaBBVA.value ):this.collaborator.plataformaBBVA =null;
    this.collaborator.estadoRecruiting.id  =  this.f.estadoRecruiting.value ? parseInt( this.f.estadoRecruiting.value ):this.collaborator.estadoRecruiting = null;
    
    this.collaborator.especialidades = this.especialidades;
    this.collaborator.proyectosNeoris = this.proyectosNeoris; // problema
    this.collaborator.dataBBBVA = this.dataBBBVA;
    this.collaborator.perfilBBVA =  this.perfilBBVA;
  
    
    console.log(  "EL COLABORADOR HA ACTUALIZAR ES ",  this.collaborator   )
    console.log( "EL COLABORADOR ACTUALIZADO EM JSON ES  ", JSON.stringify(this.collaborator) );
    let textoQuestion = "¿Está seguro de actualizar el colaborador?";
    let textoSuccess = "Se ha actualizado el colaborador.";
    let action = "ACTUALIZAR_COLABORADOR";
    this.openSwal(textoQuestion, textoSuccess, action);
    /*if (this.EstadoNeoris === "ALTA") {
      console.log(
        "EL COLABORADOR ACTUALIZADO ES ",
        JSON.stringify(this.collaborator)
      );

      let textoQuestion = "¿Está seguro de actualizar el colaborador?";
      let textoSuccess = "Se ha actualizado el colaborador.";
      let action = "ACTUALIZAR_COLABORADOR";
      this.openSwal(textoQuestion, textoSuccess, action);
    } else {  
      let textoError =""
      if(this.EstadoNeoris ==  this.collaborator.estadoNeoris ){
          textoError = "No se puede actualizar el Colaborador por que no esta en estado Neoris 'Alta' ";
      }
      else {
        textoError = "No se puede actualizar el Colaborador por que no esta en estado Neoris 'Alta' Originalmente";
      }
      Swal.fire({
        text: textoError.toString(),
        icon: "warning",
      });

    } */
  }

  openSwal(textoQuestion: String = "", textoSuccess: String, action: String) {
    Swal.fire({
      text: textoQuestion.toString(),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7367F0",
      cancelButtonColor: "#E42728",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ml-1",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        switch (action) {
          case "REGISTRAR_COLABORADOR":
            this._collaborators.createCollaboratos(this.collaborator).subscribe(
              (resp: any) => {
                Swal.fire({
                  icon: "success",
                  text: textoSuccess.toString(),
                  customClass: {
                    confirmButton: "btn btn-success",
                  },
                });
                //this.restartForms();
                console.log(resp);
                this.messageEvent.emit();
              },
              (err) => {
                Swal.fire({
                  text: err?.error?.message,
                  icon: "warning",
                });
                console.log(err);
              }
            );
            break;
          case "ACTUALIZAR_COLABORADOR":
            this._collaborators
              .updateCollaboratos(this.collaborator, this.idCollaborator)
              .subscribe(
                (resp: any) => {
                  Swal.fire({
                    icon: "success",
                    text: textoSuccess.toString(),
                    customClass: {
                      confirmButton: "btn btn-success",
                    },
                  });
                  this.messageEvent.emit();
                },
                (err) => {
                  Swal.fire({
                    text: err?.error?.message,
                    icon: "warning",
                  });
                  console.log(err);
                }
              );
            break;
          case "ACTUALIZAR_COLABORADOR_ESTADO_NO_ALTA":
            Swal.fire({
              text: textoSuccess.toString(),
              icon: "warning",
            });
            break;
        }
      }
    });
  }
}
