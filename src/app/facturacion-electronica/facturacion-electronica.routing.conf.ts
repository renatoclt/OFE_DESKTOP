import {RouteInfo} from '../sidebar/sidebar.metadata';
import * as ComprobantesRoutingConf from './comprobantes/comprobantes.routing.module.conf';
import * as PercepcionRetecionConf from './percepcion-retencion/percepcion-retencion.routing.module.conf';
import * as ReportesRoutingConf from './reportes/reportes.routing.conf';

export const routesInfo: RouteInfo[] = [
  ...ComprobantesRoutingConf.routesInfo,
  ...PercepcionRetecionConf.routesInfo,
  ...ReportesRoutingConf.routesInfo,
  {
    path: '/resumen-bajas/crear',
    title: 'Resumen de Bajas / Crear',
    icon: 'material-icons'
  },
  {
    path: '/resumen-bajas/consultar',
    title: 'Resumen de Bajas / Consultar',
    icon: 'material-icons'
  },
  {
    path: '/resumen-boletas/consultar',
    title: 'Resumen de Boletas / Consultar',
    icon: 'material-icons'
  }
];
