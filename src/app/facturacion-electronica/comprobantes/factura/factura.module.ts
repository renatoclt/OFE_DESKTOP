import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FacturaRoutingModule} from './factura.routing.module';
import {FacturaComponent} from './factura.component';
import {ReactiveFormsModule} from '@angular/forms';
import {A2Edatetimepicker} from '../../../directives/datepicker.module';
import {ItemModule} from '../item/item.module';
import {DataTableModule} from '../../general/data-table/data-table.module';
import {ComprobanteVistaPreviaModule} from '../comprobante-vista-previa/comprobante-vista-previa.module';
import {ConsultaModule} from '../../general/consulta/consulta.module';
import {ComprobanteDocumentoRelacionadoModule} from '../comprobante-documento-relacionado/comprobante-documento-relacionado.module';
import {ComprobanteItemModule} from '../comprobante-item/comprobante-item.module';
import { ComprobanteEmitirModule } from '../comprobante-emitir/comprobante-emitir.module';
import {PersonService} from '../../general/services/person.service';
import {TranslateModule} from '@ngx-translate/core';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { Ng2CompleterModule } from 'ng2-completer';
import { DirectivasModule } from 'app/facturacion-electronica/general/directivas/directivas.module';
//import { SpinnerService } from 'app/service/spinner.service';
import { TablaMaestraService } from 'app/facturacion-electronica/general/services/documento/tablaMaestra.service';
import { PersistenciaEntidadService } from 'app/facturacion-electronica/percepcion-retencion/services/persistencia.entidad.service';
import { FacturaAnticipoModalComponent } from 'app/facturacion-electronica/comprobantes/factura/factura-anticipo-modal.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from 'app/facturacion-electronica/general/services/tokenInterceptor.service';
import { RefreshService } from 'app/facturacion-electronica/general/services/refresh.service';
import { EmisionComprobanteModule } from 'app/facturacion-electronica/general/emision-comprobante/emision-comprobante.module';

@NgModule({
  imports: [
    CommonModule,
    FacturaRoutingModule,
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
    FacturaComponent,
    FacturaAnticipoModalComponent
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
export class FacturaModule { }
