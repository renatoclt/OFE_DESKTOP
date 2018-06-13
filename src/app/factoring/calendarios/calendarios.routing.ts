import { Routes } from '@angular/router';
import { CalendariosBuscarComponent } from "./comprador/buscar/calendariosbuscar.component";
import { CalendariosDetalleComponent } from "./comprador/detalle/calendariosdetalle.component";


export const FactoringRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'comprador/buscar',
        component: CalendariosBuscarComponent
      },
      {
        path: 'comprador/detalle/:id',
        component: CalendariosDetalleComponent
      }
    ]
  }
];
