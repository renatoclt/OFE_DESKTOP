export class ArchivoMasivaEntrada {
  nombreArchivo: string;
  tamanhoArchivo: string;
  data: string;

  constructor () {
  }

  crearArchivoMasivaEntrada( nombreArchivo: string,
                             tamanhoArchivo: string,
                             data: string,
                             ) {
    this.nombreArchivo = nombreArchivo;
    this.tamanhoArchivo = tamanhoArchivo;
    this.data = data;
  }
}


export class ArchivoMasiva {
  idDocumentoMasivo: number;
  idEntidad: number;
  correoEntidad: string;
  idTipoDocumento: number;
  usuario: string;
  fecha: string;
  nombreArchivo: string;
  tamanhoArchivo: string;
  ticket: string;
  totalRegistros: number;
  totalRegistrosErroneos: number;
  detalle: DetalleArchivoMasiva[];
  data: string;
  estado: boolean;
  constructor() {}
}

export class DetalleArchivoMasiva {
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: string;
  fechaModificacion: string;
  estado: boolean;
  idDetalleMasivo: number;
  fila: number;
  columna: number;
  serie: string;
  correlativo: string;
  error: string;
}
