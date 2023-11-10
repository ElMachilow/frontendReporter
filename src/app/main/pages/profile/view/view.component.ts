import { Component, OnInit } from "@angular/core";
 import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CollaboratorsService } from "app/services/collaborators.service";

@Component({
  selector: "app-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
})
export class ViewComponent implements OnInit {
  public xp: any;
  public user;
  public isAdmin:boolean;
  today: number = Date.now();
 


  constructor(private modalService: NgbModal, 
     private route: ActivatedRoute, private rutaActiva: ActivatedRoute,
     private _collaborators: CollaboratorsService) {}

  ngOnInit(): void {
    this.route.data.subscribe((d) => {
      if (d.isProfile) { 
        this.xp = JSON.parse(localStorage.getItem("currentUser")).usuario.codigoXp; 
      } else {
        this.xp = this.rutaActiva.snapshot.params.xp.toString(); 
        this.isAdmin = true;
      }
      this.getUsuario();
    }); 
 
  }

  // modal Open Vertically Centered
  modalOpenLG(modalLG) {
    this.modalService.open(modalLG, {
      centered: true,
      size: 'lg'
    });
  }
  
  modalOpenVC(modalVC) {
    this.modalService.open(modalVC, {
      centered: true
    });
  }

  getUsuario() {
    this._collaborators.getProfileByXp(this.xp).subscribe(
      (data: any) => { 
        this.user = data;
        console.log('este es el usuario', this.user);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
