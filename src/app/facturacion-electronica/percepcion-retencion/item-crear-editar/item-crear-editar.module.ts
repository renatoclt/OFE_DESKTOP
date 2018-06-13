import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import { DirectivasModule } from 'app/facturacion-electronica/general/directivas/directivas.module';
import {Ng2AutoCompleteModule} from 'ng2-auto-complete';
import {Servidores} from '../../general/services/servidores';
import {ItemCrearEditarComponent} from './item-crear-editar.component';
import {DataTableModule} from '../../general/data-table/data-table.module';
import {PdfViewerModule} from '../../general/pdf-viewer/pdf-viewer.module';
import {HttpModule} from '@angular/http';
import {A2Edatetimepicker} from '../../../directives/datepicker.module';
import {Ng2CompleterModule} from 'ng2-completer';
import {ConsultaModule} from '../../general/consulta/consulta.module';
import {HttpClientModule} from '@angular/common/http';
import {PersistenciaPost} from '../services/persistencia-post';
import {ComprobantesService} from '../../general/services/comprobantes/comprobantes.service';
import {RetencionpersiscabeceraService} from '../services/retencionpersiscabecera.service';
import {NuevoDocumentoService} from '../../general/services/documento/nuevoDocumento';
import {RetencionService} from '../../general/services/comprobantes/retencion.service';
import {RetencionesService} from '../../general/services/comprobantes/retenciones.service';
import {PersistenciaEntidadService} from '../services/persistencia.entidad.service';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {PercepcionRetencionReferenciasService} from '../services/percepcion-retencion-referencias.service';
import {PersistenciaServiceRetencion} from '../services/persistencia.service';
import {ArchivoMasivaService} from '../services/archivoMasiva.service';
import {EstadoArchivoService} from '../../general/utils/estadoArchivo.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DirectivasModule,
    FormsModule,
    HttpModule,
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
    ItemCrearEditarComponent
  ],
  exports: [
    ItemCrearEditarComponent
  ],
  providers: [
    Servidores,
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
    PercepcionRetencionReferenciasService
  ]
})
export class ItemCrearEditarModule { }
