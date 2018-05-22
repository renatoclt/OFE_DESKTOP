import {RouteInfo} from '../sidebar/sidebar.metadata';
import * as ComprobantesRoutingConf from './comprobantes/comprobantes.routing.module.conf';
export const routesInfo: RouteInfo[] = [
  ...ComprobantesRoutingConf.routesInfo,
  {
    path: '/percepcion-retencion',
    title: 'Percepción Retención' ,
    icon: 'material-icons'
  },
  {
    path: '/percepcion-retencion/consultar',
    title: 'Percepción Retención / Consultar',
    icon: 'material-icons'
  },
  {
    path: '/percepcion-retencion/retencion/crear',
    title: 'Percepción Retención / Crear',
    icon: 'material-icons'
  },
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
    path: '/percepcion-retencion/crear/agregar-item',
    title: 'Crear / Retención / Agregar Ítem',
    icon: 'material-icons'
  },
  {
    path: '/percepcion-retencion/retencion/crear',
    title: 'Crear Retención',
    icon: 'material-icons'
  },
  {
    path: '/percepcion-retencion/crear-percepcion',
    title: 'crearPercepcion',
    icon: 'material-icons'
  },
  {
    path: '/percepcion-retencion/crear/editar-item',
    title: 'Retención / Crear / Editar Item',
    icon: 'material-icons'
  },
  {
    path: '/percepcion-retencion/crear/vista-previa',
    title: 'Retención / Crear / Vista Previa',
    icon: 'material-icons'
  },
  {
    path: '/percepcion-retencion/crear/emision',
    title: 'Retención / Crear / Emisión',
    icon: 'material-icons'
  },
  {
    path: '/percepcion-retencion/crear/emision',
    title: 'Retención / Crear / Emisión',
    icon: 'material-icons'
  },
  {
    path: '/percepcion-retencion/bienes-servicios-masiva/detalle',
    title: 'Retención / Masiva / Detalle',
    icon: 'material-icons'
  }
];
