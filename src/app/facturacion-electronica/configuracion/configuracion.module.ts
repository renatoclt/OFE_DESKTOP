import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfiguracionRoutingModule} from './configuracion.routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {DirectivasModule} from '../general/directivas/directivas.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {EmpresaEmisoraModule} from './empresa-emisora/empresa-emisora.module';
import {SeriesModule} from './series/series.module';
import {MiCuentaModule} from './mi-cuenta/mi-cuenta.module';
import {ConfiguracionComponent} from './configuracion.component';
import {TokenInterceptorService} from '../general/services/tokenInterceptor.service';

@NgModule({
  imports: [
    ConfiguracionRoutingModule,
    CommonModule,
    HttpClientModule,
    TranslateModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    DirectivasModule,
    EmpresaEmisoraModule,
    SeriesModule,
    MiCuentaModule
  ],
  declarations: [
    ConfiguracionComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class ConfiguracionModule { }
