import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BoletaRoutingModule} from './boleta.routing.module';
import {BoletaComponent} from './boleta.component';
import {ReactiveFormsModule} from '@angular/forms';
import {A2Edatetimepicker} from '../../../directives/datepicker.module';
import {ComprobanteVistaPreviaModule} from '../comprobante-vista-previa/comprobante-vista-previa.module';
import {ComprobanteDocumentoRelacionadoModule} from '../comprobante-documento-relacionado/comprobante-documento-relacionado.module';
import {ConsultaModule} from '../../general/consulta/consulta.module';
import {ComprobanteItemModule} from '../comprobante-item/comprobante-item.module';
import { ComprobanteEmitirModule } from '../comprobante-emitir/comprobante-emitir.module';
import {TranslateModule} from '@ngx-translate/core';
import { ItemModule } from 'app/facturacion-electronica/comprobantes/item/item.module';
import { DataTableModule } from 'app/facturacion-electronica/general/data-table/data-table.module';
import { Ng2CompleterModule } from 'ng2-completer';
import { EmisionComprobanteModule } from 'app/facturacion-electronica/general/emision-comprobante/emision-comprobante.module';
import { DirectivasModule } from 'app/facturacion-electronica/general/directivas/directivas.module';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { RefreshService } from 'app/facturacion-electronica/general/services/refresh.service';
import { PersonService } from 'app/facturacion-electronica/general/services/person.service';
import { TablaMaestraService } from 'app/facturacion-electronica/general/services/documento/tablaMaestra.service';
import { PersistenciaEntidadService } from 'app/facturacion-electronica/percepcion-retencion/services/persistencia.entidad.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from 'app/facturacion-electronica/general/services/tokenInterceptor.service';

@NgModule({
  imports: [
    BoletaRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    A2Edatetimepicker,
    ItemModule,
    DataTableModule,
    ComprobanteItemModule,
    ComprobanteVistaPreviaModule,
    ComprobanteDocumentoRelacionadoModule,
    ConsultaModule,
    ComprobanteEmitirModule,
    TranslateModule,
    Ng2CompleterModule,
    Ng2AutoCompleteModule,
    DirectivasModule,
    EmisionComprobanteModule
  ],
  declarations: [
    BoletaComponent
  ],
  providers: [
    RefreshService,
    PersonService,
   // SpinnerService,
    TablaMaestraService,
    PersistenciaEntidadService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class BoletaModule { }
