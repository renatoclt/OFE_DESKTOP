import { NgModule } from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {ComprobanteVistaPreviaComponent} from './comprobante-vista-previa.component';
import { DataTableModule } from '../../general/data-table/data-table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NuevoDocumentoService } from 'app/facturacion-electronica/general/services/documento/nuevoDocumento';
import { TokenInterceptorService } from 'app/facturacion-electronica/general/services/tokenInterceptor.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import { PersistenciaPost } from 'app/facturacion-electronica/percepcion-retencion/services/persistencia-post';
import { CreacionComprobantes } from 'app/facturacion-electronica/general/services/comprobantes/creacionComprobantes';
import { MensajeService } from 'app/facturacion-electronica/general/services/utils/mensaje.service';
import { CatalogoDocumentoIdentidadService } from '../../general/utils/catalogo-documento-identidad.service';
import {DirectivasModule} from '../../general/directivas/directivas.module';
//import { SpinnerService } from 'app/service/spinner.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DataTableModule,
    HttpModule,
    HttpClientModule
  ],
  declarations: [
    ComprobanteVistaPreviaComponent
  ],
  exports: [
    ComprobanteVistaPreviaComponent
  ],
  providers: [
   // SpinnerService,
   CatalogoDocumentoIdentidadService,
   CreacionComprobantes,
    PersistenciaPost,
    Servidores,
    MensajeService,
    NuevoDocumentoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class ComprobanteVistaPreviaModule { }
