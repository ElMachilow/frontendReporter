import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';

import { AuthGuard } from 'app/guards/auth.guards';
import { Role } from 'app/auth/models/role';
import { RptHoursComponent } from './rpt-hours/rpt-hours.component';
import { ReportsComponent } from './reports/reports.component';
import { RptLiquidacionComponent } from './rpt-liquidacion/rpt-liquidacion.component';
import { RptPetitionAnalystComponent } from './rpt-petition-analyst/rpt-petition-analyst.component';


// routing
const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: { role: [Role.Admin] },
    component: ReportsComponent,
  }
];

@NgModule({
  declarations: [
    RptHoursComponent,
    ReportsComponent,
    RptLiquidacionComponent,
    RptPetitionAnalystComponent],
  imports: [RouterModule.forChild(routes), 
    FormsModule,
    CoreCommonModule,
    CommonModule,
    FormsModule,
    NgbModule,
    ContentHeaderModule,
    ReactiveFormsModule,CoreDirectivesModule,CorePipesModule,NgSelectModule],
    providers :[DatePipe,CurrencyPipe]
})
export class reportsModule {}
