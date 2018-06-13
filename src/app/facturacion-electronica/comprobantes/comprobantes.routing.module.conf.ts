import {RouteInfo} from '../../sidebar/sidebar.metadata';
import * as RoutingConfNotaCredito from './nota-credito/nota-credito.routing.conf';
import * as RoutingConfNotaDebito from './nota-debito/nota-debito.routing.conf';


export const routesInfo: RouteInfo[] = [
  {
    path: '/comprobantes',
    title: 'comprobantes',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/boleta/crear',
    title: 'crearBoleta',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/consultar',
    title: 'Consultar Comprobantes',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/factura/crear',
    title: 'Factura / Crear',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/factura/crear/bien/agregar',
    title: 'Factura / Crear / Agregar Bien',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/factura/crear/bien/editar',
    title: 'Factura / Crear / Editar Bien',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/factura/crear/servicio/agregar',
    title: 'Factura / Crear / Agregar Servicio',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/factura/crear/vistaprevia',
    title: 'Factura / Crear / Vista Previa',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/factura/crear/docRelacionado',
    title: 'Factura / Crear / Documento Relacionado',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/factura/crear/docRelacionado/buscar',
    title: 'Factura / Crear / Documento Relacionado / Consulta',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/factura/emitir',
    title: 'Factura / Emitir',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/consultar',
    title: 'Consultas',
    icon: 'material-icons'
  },
  {
    path: '/comprobantes/consultar/visualizar/factura',
    title: 'Consultas / Factura / Visualizar',
    icon: 'material-icons'
  },
  ...RoutingConfNotaCredito.routesInfo,
  ...RoutingConfNotaDebito.routesInfo

];
