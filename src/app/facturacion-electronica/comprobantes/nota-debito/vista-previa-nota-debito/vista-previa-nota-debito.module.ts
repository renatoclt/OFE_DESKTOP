import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistaPreviaNotaDebitoComponent } from './vista-previa-nota-debito.component';
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
    VistaPreviaNotaDebitoComponent
  ],
  exports: [
    VistaPreviaNotaDebitoComponent
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
export class VistaPreviaNotaDebitoModule { }
