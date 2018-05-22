import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConsultaComponent} from './consulta.component';
import {ReactiveFormsModule} from '@angular/forms';
import { DataTableModule } from '../data-table/data-table.module';
import { CatalogoDocumentoIdentidadService } from '../utils/catalogo-documento-identidad.service';
import { A2Edatetimepicker } from '../../../directives/datepicker.module';
import {TranslateModule} from '@ngx-translate/core';
import { ComprobanteVistaPreviaModule } from '../../comprobantes/comprobante-vista-previa/comprobante-vista-previa.module';
import { BsModalModule } from 'ng2-bs3-modal';
import { ConsultaBitacoraComponent } from './consulta-bitacora.component';
import { RutasService } from '../utils/rutas.service';
import { PersistenciaService } from '../../comprobantes/services/persistencia.service';
import {GeneralModule} from '../general.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptorService} from '../services/tokenInterceptor.service';
import { DirectivasModule } from '../directivas/directivas.module';
import { SeriesService } from '../services/configuracionDocumento/series.service';
import { ComprobantesService } from '../services/comprobantes/comprobantes.service';
import { PersistenciaServiceRetencion } from '../../percepcion-retencion/services/persistencia.service';
import { OrderModule } from 'ngx-order-pipe';
//import { SpinnerService } from 'app/service/spinner.service';

@NgModule({
  imports: [
    CommonModule,
    OrderModule,
    ReactiveFormsModule,
    DataTableModule,
    A2Edatetimepicker,
    TranslateModule,
    ComprobanteVistaPreviaModule,
    BsModalModule,
    GeneralModule,
    DirectivasModule
  ],
  declarations: [
    ConsultaComponent,
    ConsultaBitacoraComponent
  ],
  exports: [
    ConsultaComponent,
    ConsultaBitacoraComponent
  ],
  providers: [
    PersistenciaServiceRetencion,
    ComprobantesService,
    SeriesService,
    CatalogoDocumentoIdentidadService,
    PersistenciaService,
   // SpinnerService,
    RutasService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class ConsultaModule { }
