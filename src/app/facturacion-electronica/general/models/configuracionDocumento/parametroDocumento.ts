import {DominioDocumento} from './dominioDocumento';

export class ParametroDocumento {
  idParametro: number;
  parametro_descripcion: string;
  parametro_estado: number;
  dominios: DominioDocumento[];
}
