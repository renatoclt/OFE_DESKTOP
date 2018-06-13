import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ResumenBajasComponent} from './resumen-bajas.component';
import {ResumenBajasCrearComponent} from './resumen-bajas-crear/resumen-bajas-crear.component';
import {ResumenBajasRoutingModule} from './resumen-bajas.routing.module';
import {A2Edatetimepicker} from '../../directives/datepicker.module';
import { TiposService } from '../general/utils/tipos.service';
import { DataTableModule } from '../general/data-table/data-table.module';
import { DirectivasModule } from '../general/directivas/directivas.module';
import {ComprobantesService} from '../general/services/comprobantes/comprobantes.service';
import {Servidores} from '../general/services/servidores';
import {TranslateModule} from '@ngx-translate/core';
import {ResumenBajasListarModule} from './resumen-bajas-listar/resumen-bajas-listar.module';
import {ArchivoService} from '../general/services/archivos/archivo.service';
import {NuevoDocumentoBajaService} from '../general/services/documento/nuevoDocumentoBaja';
import {TokenInterceptorService} from '../general/services/tokenInterceptor.service';
import { PersistenciaService } from 'app/facturacion-electronica/comprobantes/services/persistencia.service';
import {UtilsService} from '../general/utils/utils.service';
import {EstilosServices} from '../general/utils/estilos.services';


@NgModule({
  imports: [
    ResumenBajasRoutingModule,
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    HttpClientModule,
    A2Edatetimepicker,
    DataTableModule,
    TranslateModule,
    DirectivasModule,
    ResumenBajasListarModule
  ],
  declarations: [
    ResumenBajasComponent,
    ResumenBajasCrearComponent,
  ],
  providers: [
    TiposService,
    EstilosServices,
    ComprobantesService,
    Servidores,
    ArchivoService,
    PersistenciaService,
    NuevoDocumentoBajaService,
    UtilsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  exports: [
    ResumenBajasComponent
  ]
})
export class ResumenBajasModule {}
