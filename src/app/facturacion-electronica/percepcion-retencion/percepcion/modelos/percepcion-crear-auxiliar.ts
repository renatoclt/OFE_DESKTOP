import {PercepcionCabecera} from './percepcion-cabecera';
import {Entidad} from '../../../general/models/organizacion/entidad';
import {PercepcionCrearDetalle} from './percepcion-crear-detalle';

export class PercepcionCrearAuxiliar {
  cabecera: PercepcionCabecera;
  entidadReceptora: Entidad;
  entidadEmisora: Entidad;
  detalle: PercepcionCrearDetalle[];

  constructor() {
    this.cabecera = null;
    this.entidadReceptora = null;
    this.entidadEmisora = null;
    this.detalle = [];
  }
}
