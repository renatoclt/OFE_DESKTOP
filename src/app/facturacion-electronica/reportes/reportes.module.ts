import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesComponent } from './reportes.component';
import {ReportesRoutingModule} from './reportes.routing.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptorService} from '../general/services/tokenInterceptor.service';

@NgModule({
  imports: [
    CommonModule,
    ReportesRoutingModule
  ],
  declarations: [
    ReportesComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class ReportesModule { }
