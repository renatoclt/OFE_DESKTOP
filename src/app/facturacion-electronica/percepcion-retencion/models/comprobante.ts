import {TipoDocumento} from './tipo_documento';
import {Series} from './series';


export class Comprobante {
  id: number;
  tipodocumento: TipoDocumento;
  serie: Series;
  correlativo: number;
  fecha_emision: any;
  total: number;

  constructor() {}
}
