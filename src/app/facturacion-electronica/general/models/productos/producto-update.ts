export class ProductoUpdate {
  id: number;
  idEntidad: number;
  codigo: string;
  descripcion: string;
  unidadMedida: string;
  idTipoCalculoIsc: string;
  precioUnitario: string;
  montoIsc: string;
  afectaDetraccion: string;
  tipoProducto: string;
  estado: number;

  constructor() {
    this.id = 0;
    this.idEntidad = 0;
    this.codigo = '';
    this.descripcion = '';
    this.unidadMedida = '';
    this.idTipoCalculoIsc = '';
    this.precioUnitario = '';
    this.montoIsc = '';
    this.afectaDetraccion = '';
    this.tipoProducto = '';
    this.estado = 0;
  }
}
