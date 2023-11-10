import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationModule } from './authentication/authentication.module';

const routes: Routes = [
  {
    path: 'horas',
    loadChildren: () => import('./petition/petition.module').then(m => m.petitionModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'reportes',
    loadChildren: () => import('./reports/reports.module').then(m => m.reportsModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'miscellaneous',
    loadChildren: () => import('./miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule)
  }
];
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AuthenticationModule,
    RouterModule.forChild(routes)
  ],

  providers: []
})
export class PagesModule {}
