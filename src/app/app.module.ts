import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { coreConfig } from 'app/app-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { DatePipe } from '@angular/common';
import { InterceptorService } from './Interceptors/interceptor.service';
import { NgxSpinnerModule } from "ngx-spinner";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'main/authentication/login',
    pathMatch: 'full'
  },
  {
    path: 'main',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '**',
    redirectTo: '/main/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    TranslateModule.forRoot(),

    //NgBootstrap
    NgbModule,
    ToastrModule.forRoot(),

    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    NgxSpinnerModule,
    // App modules
    LayoutModule
  ],

  bootstrap: [AppComponent],
  providers: [DatePipe, {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  }]
})
export class AppModule {}
