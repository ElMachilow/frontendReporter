import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SummaryHoursComponent } from './summary-hours/summary-hours.component';

import { DistributionComponent } from './distribution/distribution.component';
import { AuthGuard } from 'app/guards/auth.guards';
import { Role } from 'app/auth/models/role';
import { SummaryHoursTotalComponent } from './summary-hours-total/summary-hours-total.component';
import { ShtModalDetailComponent } from './summary-hours-total/sht-modal-detail/sht-modal-detail.component';
import { CoreCommonModule } from '@core/common.module';


// routing
const routes: Routes = [
    {
      path: 'home',
      canActivate: [AuthGuard],
      data: { role: [Role.Admin, Role.User] },
      component: HomeComponent,
    }
  ];
@NgModule({
  declarations: [

  
    HomeComponent,
          SummaryHoursComponent,
          DistributionComponent,
          SummaryHoursTotalComponent,
          ShtModalDetailComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    CoreCommonModule,
    NgApexchartsModule,
    RouterModule.forChild(routes)
  ],

  providers :[DatePipe]
})
export class DashboardModule {}
