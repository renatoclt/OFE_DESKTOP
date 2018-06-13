import {DocumentoParametroGeneral} from '../../../general/models/comprobantes/documentoParametroGeneral';

export class DocumentoParametroNotaDebito extends DocumentoParametroGeneral {
  public idParametro: string;
  public descripcionParametro: string;
  public json: string;

  constructor() {
    super();
    this.idParametro = '';
    this.descripcionParametro = '';
    this.json = '';
  }
}
