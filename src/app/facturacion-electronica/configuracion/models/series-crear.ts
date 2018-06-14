export class SeriesCrear {
  idEntidad: number;
  serie: string;
  correlativo: string;
  idTipoDocumento: string;
  direccionMac: string;
  tipoSerie: number;
  direccion: string;

  constructor() {
    this.idEntidad = null;
    this.serie = '';
    this.correlativo = '';
    this.idTipoDocumento = '';
    this.direccionMac = '';
    this.tipoSerie = null;
    this.direccion = '';
  }
}
