export class ProductoQry {
  id: number;
  idEntidad: number;
  idTipoCalc: number;
  codigo: string;
  descripcion: string;
  precioUnitario: any;
  montoIsc: any;
  unidadMedida: string;
  afectaDetraccion: string;
  tipoProducto: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: number;

  constructor() {
    this.id = 0;
    this.idEntidad = 0;
    this.idTipoCalc = 0;
    this.codigo = '';
    this.descripcion = '';
    this.precioUnitario = 0;
    this.montoIsc = 0;
    this.unidadMedida = '';
    this.afectaDetraccion = '';
    this.tipoProducto = '';
    this.usuarioCreacion = '';
    this.usuarioModificacion = '';
    this.fechaCreacion = new Date();
    this.fechaModificacion = new Date();
    this.estado = 0;
  }
}
