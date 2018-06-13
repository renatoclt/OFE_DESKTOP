import {TipoDocumento} from './tipo_documento';
import {Series} from './series';

export class Anulacion {
  id: number;
  fecha_baja: Date;
  tipo_comprobante: TipoDocumento;
  fecha_emision: Date;
  motivo: string;
  ticket: string;
  estado_anulacion: string;

  constructor() {}
}
