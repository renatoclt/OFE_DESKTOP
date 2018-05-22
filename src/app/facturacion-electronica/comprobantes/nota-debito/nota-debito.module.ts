import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ComprobantesService} from '../../general/services/comprobantes/comprobantes.service';
import {ParametrosService} from '../../general/services/configuracionDocumento/parametros.service';
import {PersistenciaDatosService} from '../../general/services/utils/persistenciaDatos.service';
import {TablaMaestraService} from '../../general/services/documento/tablaMaestra.service';
import {Servidores} from '../../general/services/servidores';
import {EstilosServices} from '../../general/utils/estilos.services';
import {TiposService} from '../../general/utils/tipos.service';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {SeriesService} from '../../general/services/configuracionDocumento/series.service';
import {Ng2AutoCompleteModule} from 'ng2-auto-complete';
import {ReactiveFormsModule} from '@angular/forms';
import {ConceptoDocumentoService} from '../../general/services/documento/conceptoDocumento.service';
import {NotaDebitoService} from './servicios/nota-debito-service';
import {NotaDebitoComponent} from './nota-debito.component';
import {VistaPreviaNotaDebitoModule} from './vista-previa-nota-debito/vista-previa-nota-debito.module';
import {TipoNotaDebitoDatatableModule} from './tipo-nota-debito-datatable/tipo-nota-debito-datatable.module';
import {TipoNotaDebitoNormalModule} from './tipo-nota-debito-normal/tipo-nota-debito-normal.module';
import {NotaDebitoRoutingModule} from './nota-debito.routing.module';
import {DirectivasModule} from '../../general/directivas/directivas.module';
import { PersistenciaService } from '../services/persistencia.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotaDebitoRoutingModule,
    TranslateModule,
    Ng2AutoCompleteModule,
    TipoNotaDebitoNormalModule,
    TipoNotaDebitoDatatableModule,
    VistaPreviaNotaDebitoModule,
    DirectivasModule
  ],
  declarations: [
    NotaDebitoComponent
  ],
  providers: [
    ComprobantesService,
    Servidores,
    TablaMaestraService,
    TiposService,
    ParametrosService,
    ArchivoService,
    PersistenciaDatosService,
    SeriesService,
    EstilosServices,
    ConceptoDocumentoService,
    NotaDebitoService,
    PersistenciaService
  ]
})
export class NotaDebitoModule { }
