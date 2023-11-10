import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';

import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { petitionReportComponent } from './petition-report/petition-report.component';
import { petitionRegisterComponent } from './petition-register/petition-register.component';
import { AuthGuard } from 'app/guards/auth.guards';
import { Role } from 'app/auth/models/role';
import { petitionAllComponent } from './petition-all/petition-all.component';



// routing
const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: { role: [Role.User] },
    component: petitionReportComponent,
  },
  {
    path: 'todos',
    canActivate: [AuthGuard],
    data: { role: [Role.Admin] },
    component: petitionAllComponent,
  },
  {
    path: 'registrar',
    component: petitionRegisterComponent,
  },
  {
    path: 'actualizar',
    component: petitionRegisterComponent,
  }
];

@NgModule({
  declarations: [
    petitionRegisterComponent,
    petitionReportComponent,
  petitionAllComponent],
  imports: [RouterModule.forChild(routes), 
    FormsModule,
    CoreCommonModule,
    CommonModule,
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreTouchspinModule,
    ReactiveFormsModule],
    providers :[DatePipe]
})
export class petitionModule {}
