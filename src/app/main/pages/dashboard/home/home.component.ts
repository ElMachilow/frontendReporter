import { Component, OnInit } from '@angular/core';
import { PeriodService } from 'app/services/period.service';
import { SecurityService } from 'app/services/security.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  periods = [];
  isAdmin:boolean = false;
  constructor(private periodoService: PeriodService,
    private _securityService:SecurityService) {

  }

  ngOnInit(): void {
    this.loadParameters();
    this.isAdmin = this._securityService.isAdmin;
  }

  loadParameters(){


    this.periodoService.listPeriod().subscribe((data:any) => {
      this.periods = data;
    }, (err) => {
      console.log(err)
    })
  }

}
