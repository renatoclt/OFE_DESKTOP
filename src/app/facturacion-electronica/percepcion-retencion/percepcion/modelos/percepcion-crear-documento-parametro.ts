import {PercepcionCrearDocumentoParametroJson} from './percepcion-crear-documento-parametro-json';

export class PercepcionCrearDocumentoParametro {
  idParametro: string;
  descripcionParametro: string;
  json: string;

  constructor() {
    this.idParametro = '';
    this.descripcionParametro = '';
    this.json = JSON.stringify(new PercepcionCrearDocumentoParametroJson());
  }
}
