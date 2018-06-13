import { Routes } from '@angular/router';
import { ParametrosBuscarComponent } from "./comprador/buscar/parametrosbuscar.component";


export const FactoringRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'comprador/buscar',
        component: ParametrosBuscarComponent
      }
    ]
  }
];
