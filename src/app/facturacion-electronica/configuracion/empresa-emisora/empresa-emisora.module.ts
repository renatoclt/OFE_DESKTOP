import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {DirectivasModule} from '../../general/directivas/directivas.module';
import {HttpClientModule} from '@angular/common/http';
import {EmpresaEmisoraComponent} from './empresa-emisora.component';
import {EmpresaEmisoraRoutingModule} from './empresa-emisora.routing.module';
import {ConsultaModule} from '../../general/consulta/consulta.module';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {SeriesModule} from '../series/series.module';
import {PadreComprobanteService} from '../../comprobantes/services/padre-comprobante.service';
import {DataTableModule} from '../../general/data-table/data-table.module';
import {EstilosServices} from '../../general/utils/estilos.services';
import {ConfiguracionEmpresaService} from '../servicios/configuracion-empresa.service';


@NgModule({
  imports: [
    EmpresaEmisoraRoutingModule,
    CommonModule,
    HttpClientModule,
    TranslateModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    DirectivasModule,
    ConsultaModule,
    SeriesModule,
    DataTableModule
  ],
  declarations: [
    EmpresaEmisoraComponent
  ],
  providers: [
    ArchivoService,
    PadreComprobanteService,
    EstilosServices,
    ConfiguracionEmpresaService
  ]
})
export class EmpresaEmisoraModule { }
