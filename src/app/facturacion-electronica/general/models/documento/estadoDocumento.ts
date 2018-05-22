export class EstadoDocumento {
  idEstadoComprobante: number;
  descripcion: string;
  abreviacion: string;

}


export const TIPO_ESTADO_DOCUMENTO_PENDIENTE_DE_ENVIO = 1;
export const TIPO_ESTADO_DOCUMENTO_BLOQUEADO = 2;
export const TIPO_ESTADO_DOCUMENTO_AUTORIZADO = 3;
export const TIPO_ESTADO_DOCUMENTO_AUTORIZADO_CON_OBSERVACIONES = 4;
export const TIPO_ESTADO_DOCUMENTO_RECHAZADO = 5;
export const TIPO_ESTADO_DOCUMENTO_DADO_DE_BAJA = 6;
