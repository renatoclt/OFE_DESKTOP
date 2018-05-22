export class DetalleDetalleNotaDebito {
  idTipoIgv: number;
  codigoTipoIgv: number;
  descripcionTipoIgv: string;
  idTipoIsc: number;
  codigoTipoIsc: number;
  descripcionTipoIsc: string;
  idTipoPrecio: number;
  codigoTipoPrecio: number;
  descripcionTipoPrecio: string;
  idProducto: string;
  numeroItem: string;
  precioUnitarioVenta: string;
  unidadMedida: string;
  subtotalVenta: string;
  subtotalIgv: string;
  subtotalIsc: string;
  descuento: string;
  descuentoOriginal: string;

  constructor() {
    this.idTipoIgv = 0;
    this.codigoTipoIgv = 0;
    this.descripcionTipoIgv = '';
    this.idTipoIsc = 0;
    this.codigoTipoIsc = 0;
    this.descripcionTipoIsc = '';
    this.idTipoPrecio = 0;
    this.codigoTipoPrecio = 0;
    this.descripcionTipoPrecio = '';
    this.idProducto = '';
    this.numeroItem = '0.00';
    this.precioUnitarioVenta = '0.00';
    this.unidadMedida = '';
    this.subtotalVenta = '0.00';
    this.subtotalIgv = '0.00';
    this.subtotalIsc = '0.00';
    this.descuento = '0.00';
    this.descuentoOriginal = '0.00';
  }

  copiar(): DetalleDetalleNotaDebito {
    const nuevoDetalleDetalle = new DetalleDetalleNotaDebito();
    nuevoDetalleDetalle.idTipoIgv = this.idTipoIgv;
    nuevoDetalleDetalle.codigoTipoIgv = this.codigoTipoIgv;
    nuevoDetalleDetalle.descripcionTipoIgv = this.descripcionTipoIgv;
    nuevoDetalleDetalle.idTipoIsc = this.idTipoIsc;
    nuevoDetalleDetalle.codigoTipoIsc = this.codigoTipoIsc;
    nuevoDetalleDetalle.descripcionTipoIsc = this.descripcionTipoIsc;
    nuevoDetalleDetalle.idTipoPrecio = this.idTipoPrecio;
    nuevoDetalleDetalle.codigoTipoPrecio = this.codigoTipoPrecio;
    nuevoDetalleDetalle.descripcionTipoPrecio = this.descripcionTipoPrecio;
    nuevoDetalleDetalle.idProducto = this.idProducto;
    nuevoDetalleDetalle.numeroItem = this.numeroItem;
    nuevoDetalleDetalle.precioUnitarioVenta = this.precioUnitarioVenta;
    nuevoDetalleDetalle.unidadMedida = this.unidadMedida;
    nuevoDetalleDetalle.subtotalVenta = this.subtotalVenta;
    nuevoDetalleDetalle.subtotalIgv = this.subtotalIgv;
    nuevoDetalleDetalle.subtotalIsc = this.subtotalIsc;
    nuevoDetalleDetalle.descuento = this.descuento;
    return nuevoDetalleDetalle;
  }

  copiarDetalle(detalleDetalleNotaDebito: DetalleDetalleNotaDebito) {
    this.idTipoIgv = detalleDetalleNotaDebito.idTipoIgv;
    this.codigoTipoIgv = detalleDetalleNotaDebito.codigoTipoIgv;
    this.descripcionTipoIgv = detalleDetalleNotaDebito.descripcionTipoIgv;
    this.idTipoIsc = detalleDetalleNotaDebito.idTipoIsc;
    this.codigoTipoIsc = detalleDetalleNotaDebito.codigoTipoIsc;
    this.descripcionTipoIsc = detalleDetalleNotaDebito.descripcionTipoIsc;
    this.idTipoPrecio = detalleDetalleNotaDebito.idTipoPrecio;
    this.codigoTipoPrecio = detalleDetalleNotaDebito.codigoTipoPrecio;
    this.descripcionTipoPrecio = detalleDetalleNotaDebito.descripcionTipoPrecio;
    this.idProducto = detalleDetalleNotaDebito.idProducto;
    this.numeroItem = detalleDetalleNotaDebito.numeroItem;
    this.precioUnitarioVenta = detalleDetalleNotaDebito.precioUnitarioVenta;
    this.unidadMedida = detalleDetalleNotaDebito.unidadMedida;
    this.subtotalVenta = detalleDetalleNotaDebito.subtotalVenta;
    this.subtotalIgv = detalleDetalleNotaDebito.subtotalIgv;
    this.subtotalIsc = detalleDetalleNotaDebito.subtotalIsc;
    this.descuento = detalleDetalleNotaDebito.descuento;
  }
}
