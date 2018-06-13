import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistaPreviaNotaCreditoComponent } from './vista-previa-nota-credito.component';
import {TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CreacionComprobantes} from '../../../general/services/comprobantes/creacionComprobantes';
import {DataTableModule} from '../../../general/data-table/data-table.module';
import {EmisionComprobanteModule} from '../../../general/emision-comprobante/emision-comprobante.module';
import {TokenInterceptorService} from '../../../general/services/tokenInterceptor.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DataTableModule,
    HttpClientModule,
    EmisionComprobanteModule
  ],
  declarations: [
    VistaPreviaNotaCreditoComponent
  ],
  exports: [
    VistaPreviaNotaCreditoComponent
  ],
  providers: [
    CreacionComprobantes,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class VistaPreviaNotaCreditoModule { }
