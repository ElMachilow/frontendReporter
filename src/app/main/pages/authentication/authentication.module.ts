import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { CoreCommonModule } from '@core/common.module';

import { AuthLoginV2Component } from 'app/main/pages/authentication/auth-login-v2/auth-login-v2.component';
import { AuthForgotPasswordComponent } from './auth-forgot-password/auth-forgot-password.component';

// routing
const routes: Routes = [
  {
    path: 'authentication/login',
    component: AuthLoginV2Component,
    data: { animation: 'auth' }
  },
  {
    path: 'authentication/forgotPassword',
    component: AuthForgotPasswordComponent,
    data: { animation: 'auth' }
  }
];

@NgModule({
  declarations: [AuthLoginV2Component, AuthForgotPasswordComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule,ToastrModule]
})
export class AuthenticationModule {}
