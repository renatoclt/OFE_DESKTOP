import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'bienes-servicios',
    loadChildren: './facturacion-electronica/bienes-servicios/bienes-servicios.module#BienesServiciosModule'
  },
  {
    path: 'comprobantes',
    loadChildren: './facturacion-electronica/comprobantes/comprobantes.module#ComprobantesModule'
  },
  {
    path: 'configuracion',
    loadChildren: './facturacion-electronica/configuracion/configuracion.module#ConfiguracionModule'
  },
  {
    path: 'general',
    loadChildren: './facturacion-electronica/general/general.module#GeneralModule'
  },
  {
    path: 'guia-remision',
    loadChildren: './facturacion-electronica/guia-remision/guia-remision.module#GuiaRemisionModule'
  },
  {
    path: 'percepcion-retencion',
    loadChildren: './facturacion-electronica/percepcion-retencion/percepcion-retencion.module#PercepcionRetencionModule'
  },
  {
    path: 'reportes',
    loadChildren: './facturacion-electronica/reportes/reportes.module#ReportesModule'
  },
  {
    path: 'resumen-bajas',
    loadChildren: './facturacion-electronica/resumen-bajas/resumen-bajas.module#ResumenBajasModule'
      },
  {
    path: 'resumen-boletas',
    loadChildren: './facturacion-electronica/resumen-boletas/resumen-boletas.module#ResumenBoletasModule'
  }
];
