import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SincronizacionService } from '../general/services/sincronizacion/sincronizacion.service';
import { ParametrosService } from '../general/services/sincronizacion/parametros.service';
import { SincronizacionComponent } from './sincronizacion.component';
import { BitacoraComponent } from './sincronizacion-bitacora/sincronizacion-bitacora.component';
import { SincronizacionRoutingModule  } from './sincronizacion.routing.module';
import { TiposService } from '../general/utils/tipos.service';
import { LoginService } from '../../service/login.service';
import { SincronizacionRetenciones } from '../general/services/sincronizacion/SincronizacionRetenciones';

@NgModule({
    imports: [
      CommonModule,
      TranslateModule,
      SincronizacionRoutingModule
    ],
    declarations: [
      SincronizacionComponent
    ],
    providers: [
      SincronizacionService,
      SincronizacionRetenciones,
      ParametrosService,
      TiposService,
      LoginService
    ]
  })
  export class SincronizacionModule { }