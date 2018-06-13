import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultarBienesServiciosComponent } from './consultar-bienes-servicios.component';
import {DataTableModule} from '../../general/data-table/data-table.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TokenInterceptorService} from '../../general/services/tokenInterceptor.service';
import {EstilosServices} from '../../general/utils/estilos.services';
import {TiposService} from '../../general/utils/tipos.service';
import {TablaMaestraService} from '../../general/services/documento/tablaMaestra.service';
import {ConsultarBienesServiciosRoutingModule} from './consultar-bienes-servicios.routing.module';
import {CrearModule} from '../crear/crear.module';
import {ProductoServices} from '../../general/services/inventario/producto.services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    DataTableModule,
    ConsultarBienesServiciosRoutingModule,
    CrearModule
  ],
  declarations: [
    ConsultarBienesServiciosComponent
  ],
  exports: [
    ConsultarBienesServiciosComponent
  ],
  providers: [
    EstilosServices,
    TiposService,
    TablaMaestraService,
    ProductoServices,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class ConsultarBienesServiciosModule { }
