import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NotaCreditoRoutingModule} from './nota-credito.routing.module';
import {NotaCreditoComponent} from './nota-credito.component';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ComprobantesService} from '../../general/services/comprobantes/comprobantes.service';
import {Servidores} from '../../general/services/servidores';
import {TablaMaestraService} from '../../general/services/documento/tablaMaestra.service';
import {TiposService} from '../../general/utils/tipos.service';
import {TipoNotaCreditoNormalModule} from './tipo-nota-credito-normal/tipo-nota-credito-normal.module';
import {TipoNotaCreditoDatatableModule} from './tipo-nota-credito-datatable/tipo-nota-credito-datatable.module';
import {ParametrosService} from '../../general/services/configuracionDocumento/parametros.service';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {SeriesService} from '../../general/services/configuracionDocumento/series.service';
import {PersistenciaDatosService} from '../../general/services/utils/persistenciaDatos.service';
import {EstilosServices} from '../../general/utils/estilos.services';
import {ConceptoDocumentoService} from '../../general/services/documento/conceptoDocumento.service';
import {NotaCreditoService} from './servicios/nota-credito.service';
import {VistaPreviaNotaCreditoModule} from './vista-previa-nota-credito/vista-previa-nota-credito.module';
import {DirectivasModule} from '../../general/directivas/directivas.module';
import { PersistenciaService } from '../services/persistencia.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotaCreditoRoutingModule,
    TranslateModule,
    TipoNotaCreditoNormalModule,
    TipoNotaCreditoDatatableModule,
    VistaPreviaNotaCreditoModule,
    DirectivasModule
  ],
  declarations: [
    NotaCreditoComponent
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
    NotaCreditoService,
    PersistenciaService
  ]
})
export class NotaCreditoModule { }
