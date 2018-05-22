import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {RetencionComponent} from './retencion.component';
import {RetencionRoutingModule} from './retencion.routing.module';
import {ArchivoMasivaService} from '../services/archivoMasiva.service';
import {RetencionService} from '../../general/services/comprobantes/retencion.service';
import {RetencionpersiscabeceraService} from '../services/retencionpersiscabecera.service';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {ComprobantesService} from '../../general/services/comprobantes/comprobantes.service';
import {NuevoDocumentoService} from '../../general/services/documento/nuevoDocumento';
import {PersistenciaEntidadService} from '../services/persistencia.entidad.service';
import {RetencionesService} from '../../general/services/comprobantes/retenciones.service';
import {PersistenciaServiceRetencion} from '../services/persistencia.service';
import {PercepcionRetencionReferenciasService} from '../services/percepcion-retencion-referencias.service';
import {EstadoArchivoService} from '../../general/utils/estadoArchivo.service';
import {PersistenciaPost} from '../services/persistencia-post';
import {Ng2AutoCompleteModule} from 'ng2-auto-complete';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConsultaModule} from '../../general/consulta/consulta.module';
import {Ng2CompleterModule} from 'ng2-completer';
import {A2Edatetimepicker} from '../../../directives/datepicker.module';
import {PdfViewerModule} from '../../general/pdf-viewer/pdf-viewer.module';
import {DirectivasModule} from '../../general/directivas/directivas.module';
import {HttpModule} from '@angular/http';
import {DataTableModule} from '../../general/data-table/data-table.module';
import {RetencionUnitariaComponent} from './retencion-unitaria/retencion-unitaria.component';
import {RetencionMasivaComponent} from './retencion-masiva/retencion-masiva.component';
import {ItemCrearEditarComponent} from '../item-crear-editar/item-crear-editar.component';
import {ItemCrearEditarModule} from '../item-crear-editar/item-crear-editar.module';
import {RetencionMasivaDetalleModule} from '../retencion-masiva-detalle/retencion-masiva-detalle.module';
import {VistapreviaRetencionModule} from '../vistaprevia-retencion/vistaprevia-retencion.module';
import {EmisionPercepcionRetencionModule} from '../emision-percepcion-retencion/emision-percepcion-retencion.module';
import {PercepcionComponent} from '../percepcion/percepcion.component';
import {RefreshService} from '../../general/services/refresh.service';
import {PadreComprobanteService} from '../../comprobantes/services/padre-comprobante.service';
//import {SpinnerService} from '../../../service/spinner.service';

@NgModule({
  imports: [
    CommonModule,
    RetencionRoutingModule,
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
    Ng2AutoCompleteModule,
    ItemCrearEditarModule,
    RetencionMasivaDetalleModule,
    VistapreviaRetencionModule,
    EmisionPercepcionRetencionModule
  ],
  declarations: [
    RetencionComponent,
    RetencionUnitariaComponent,
    RetencionMasivaComponent
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
    RefreshService,
    PadreComprobanteService
  ],
  exports: [
    RetencionComponent,
    RetencionUnitariaComponent,
    RetencionMasivaComponent
  ]
})
export class RetencionModule { }
