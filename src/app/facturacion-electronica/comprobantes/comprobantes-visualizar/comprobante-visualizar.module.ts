import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {PdfViewerModule} from '../../general/pdf-viewer/pdf-viewer.module';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import { A2Edatetimepicker } from 'app/directives/datepicker.module';
import { DataTableModule } from 'app/facturacion-electronica/general/data-table/data-table.module';
import { DirectivasModule } from 'app/facturacion-electronica/general/directivas/directivas.module';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { Ng2CompleterModule } from 'ng2-completer';
import { TranslateModule } from '@ngx-translate/core';
import { BoletaFacturanVisualizarComponent } from 'app/facturacion-electronica/comprobantes/comprobantes-visualizar/comprobante-visualizar-boleta-factura/comprobante-visualizar-boleta-factura.component';
import { ComprobanteVisualizarComponent } from 'app/facturacion-electronica/comprobantes/comprobantes-visualizar/comprobantes-visualizar';
import { Servidores } from 'app/facturacion-electronica/general/services/servidores';
import { PersistenciaService } from 'app/facturacion-electronica/comprobantes/services/persistencia.service';
import { DocumentoQueryService } from 'app/facturacion-electronica/general/services/comprobantes/documentoQuery.service';
import { PercepcionRetencionReferenciasService } from 'app/facturacion-electronica/percepcion-retencion/services/percepcion-retencion-referencias.service';
import {ComprobanteVisualizarNotaCreditoDebitoComponent} from './comprobante-visualizar-nota-credito-debito/comprobante-visualizar-nota-credito-debito.component';
import {ComprobantesService} from '../../general/services/comprobantes/comprobantes.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../../general/services/tokenInterceptor.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    A2Edatetimepicker,
    DataTableModule,
    TranslateModule,
    Ng2CompleterModule,
    Ng2AutoCompleteModule,
    DirectivasModule
  ],
  declarations: [
    BoletaFacturanVisualizarComponent,
    ComprobanteVisualizarComponent,
    ComprobanteVisualizarNotaCreditoDebitoComponent
  ],
  exports: [
    BoletaFacturanVisualizarComponent,
    ComprobanteVisualizarComponent,
    ComprobanteVisualizarNotaCreditoDebitoComponent
  ],
  providers: [
    ArchivoService,
    DocumentoQueryService,
    ComprobantesService,
    PersistenciaService,
    Servidores,
    PercepcionRetencionReferenciasService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class ComprobanteVisualizarModule { }
