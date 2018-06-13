import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {A2Edatetimepicker} from '../../../directives/datepicker.module';
import {DirectivasModule} from '../../general/directivas/directivas.module';
import {HttpModule} from '@angular/http';
import {EmisionPercepcionRetencionModule} from '../emision-percepcion-retencion/emision-percepcion-retencion.module';
import {PercepcionRoutingModule} from './percepcion.routing.module';
import {PercepcionComponent} from './percepcion.component';
import {PercepcionComunService} from './servicios/percepcion-comun.service';
import {PercepcionCrearModule} from './percepcion-crear/percepcion-crear.module';
import {PercepcionVistaPreviaModule} from './percepcion-vista-previa/percepcion-vista-previa.module';
import {EmisionComprobanteModule} from '../../general/emision-comprobante/emision-comprobante.module';
import {TokenInterceptorService} from '../../general/services/tokenInterceptor.service';

@NgModule({
  imports: [
    PercepcionRoutingModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    HttpClientModule,
    A2Edatetimepicker,
    TranslateModule,
    DirectivasModule,
    PercepcionCrearModule,
    PercepcionVistaPreviaModule,
    EmisionComprobanteModule
  ],
  declarations: [
    PercepcionComponent
  ],
  providers: [
    PercepcionComunService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class PercepcionModule { }
