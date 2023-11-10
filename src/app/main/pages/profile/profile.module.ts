import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ViewComponent } from "./view/view.component";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "app/guards/auth.guards";
import { CoreDirectivesModule } from "@core/directives/directives";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ListComponent } from "./list/list.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FormsModule } from '@angular/forms';

import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
 import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';
import { Role } from 'app/auth/models/role';
import { NewCollaboratorComponent } from './list/new-collaborator/new-collaborator.component';

 

// routing
const routes: Routes = [
  {
    path: "view",
    canActivate: [AuthGuard],
    component: ViewComponent,
    data: { isProfile: true }
  },
  {
    path: "view/:xp",
    canActivate: [AuthGuard],
    component: ViewComponent,
    data: { isProfile: false, role: [Role.Admin] }
  },
  {
    path: "list",
    canActivate: [AuthGuard],
    component: ListComponent,
    data: { role: [Role.Admin] }, 
  },
];

@NgModule({
  declarations: [ViewComponent, ListComponent, NewCollaboratorComponent ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    CoreDirectivesModule,
    NgbModule,
    NgxDatatableModule,
    Ng2FlatpickrModule,
    CoreCommonModule,
    CorePipesModule,
    CoreSidebarModule,
    FormsModule

  ],
})
export class ProfileModule {}
