import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {A2Edatetimepicker} from '../../directives/datepicker.module';
import {PercepcionRetencionComponent} from './percepcion-retencion.component';
import {PercepcionRetencionRoutingModule} from './percepcion-retencion.routing.module';
import {DataTableModule} from '../general/data-table/data-table.module';
import {PersistenciaServiceRetencion} from './services/persistencia.service';
import {PdfViewerModule} from '../general/pdf-viewer/pdf-viewer.module';
import { ConsultaModule } from '../general/consulta/consulta.module';
import {TranslateModule} from '@ngx-translate/core';
import {RetencionpersiscabeceraService} from './services/retencionpersiscabecera.service';
import { DirectivasModule } from '../general/directivas/directivas.module';
import { EstadoArchivoService } from '../general/utils/estadoArchivo.service';
import {ArchivoMasivaService} from './services/archivoMasiva.service';
import {NuevoDocumentoService} from '../general/services/documento/nuevoDocumento';
import {PersistenciaEntidadService} from './services/persistencia.entidad.service';
import {RetencionesService} from '../general/services/comprobantes/retenciones.service';
import {PercepcionRetencionVisualizarComponent} from './percepcion-retencion-visualizar/percepcion-retencion-visualizar.component';
import {PersistenciaPost} from './services/persistencia-post';
import { ArchivoService } from '../general/services/archivos/archivo.service';
import { ComprobantesService } from '../general/services/comprobantes/comprobantes.service';
import { RetencionService } from 'app/facturacion-electronica/general/services/comprobantes/retencion.service';
import { PercepcionRetencionReferenciasService } from 'app/facturacion-electronica/percepcion-retencion/services/percepcion-retencion-referencias.service';
import {Ng2CompleterModule} from 'ng2-completer';
import {Ng2AutoCompleteModule} from 'ng2-auto-complete';
import {Detalletabla} from './services/detalletabla';
import {PadreComprobanteService} from '../comprobantes/services/padre-comprobante.service';
import {PadreRetencionPercepcionService} from './services/padre-retencion-percepcion.service';

@NgModule({
  imports: [
    PercepcionRetencionRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    HttpClientModule,
    A2Edatetimepicker,
    PdfViewerModule,
    DataTableModule,
    ConsultaModule,
    TranslateModule,
    DirectivasModule,
    Ng2CompleterModule,
    Ng2AutoCompleteModule
  ],
  declarations: [
    PercepcionRetencionComponent,
    PercepcionRetencionVisualizarComponent
  ],
  providers: [
    PersistenciaServiceRetencion,
    RetencionpersiscabeceraService,
    EstadoArchivoService,
    ArchivoMasivaService,
    NuevoDocumentoService,
    PersistenciaEntidadService,
    RetencionesService,
    RetencionesService,
    ArchivoService,
    PersistenciaPost,
    ComprobantesService,
    RetencionService,
    PercepcionRetencionReferenciasService,
    Detalletabla,
    PadreComprobanteService,
    PadreRetencionPercepcionService
],
  exports: [
    PercepcionRetencionComponent
  ]
})
export class PercepcionRetencionModule {}
