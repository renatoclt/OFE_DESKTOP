import { Routes } from '@angular/router';

import { FacelecFacebizBuscarComponent } from './facebiz/buscar/facelecfacebizbuscar.component';

export const FacelecRoutes: Routes = [
  {
    path: '',
    children: [
        {
          path: 'facebiz/buscar',
          component: FacelecFacebizBuscarComponent
        }
    ]
  }
];
