import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';

import { ErrorComponent } from 'app/main/pages/miscellaneous/error/error.component';
import { NoAuthorizedComponent } from './no-authorized/no-authorized.component';

// routing
const routes: Routes = [
  {
    path: 'error',
    component: ErrorComponent,
    data: { animation: 'misc' }
  },
  {
    path: 'not-authorized',
    component: NoAuthorizedComponent
  },
];

@NgModule({
  declarations: [ErrorComponent, NoAuthorizedComponent],
  imports: [CommonModule, RouterModule.forChild(routes), CoreCommonModule]
})
export class MiscellaneousModule {}
