import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuthGuardService } from 'app/service/auth-guard.service';
import { ResumenBoletasComponent } from 'app/facturacion-electronica/resumen-boletas/resumen-boletas.component';
import { ConsultaComponent } from 'app/facturacion-electronica/general/consulta/consulta.component';

const routes: Routes = [
  {
    path: '',
    component: ResumenBoletasComponent,
    children: [
      {
        path: 'consultar',
        component: ConsultaComponent,
        data: {
          titulo: 'resumenBoletas',
          tipoConsulta: 4
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
  
})

export class ResumenBoletasRoutingModule {}
