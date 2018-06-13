export class DetalleDetalleNotaCredito {
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

  copiar(): DetalleDetalleNotaCredito {
    const nuevoDetalleDetalle = new DetalleDetalleNotaCredito();
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
    nuevoDetalleDetalle.descuentoOriginal = this.descuentoOriginal;
    return nuevoDetalleDetalle;
  }

  copiarDetalle(detalleDetalleNotaCredito: DetalleDetalleNotaCredito) {
    this.idTipoIgv = detalleDetalleNotaCredito.idTipoIgv;
    this.codigoTipoIgv = detalleDetalleNotaCredito.codigoTipoIgv;
    this.descripcionTipoIgv = detalleDetalleNotaCredito.descripcionTipoIgv;
    this.idTipoIsc = detalleDetalleNotaCredito.idTipoIsc;
    this.codigoTipoIsc = detalleDetalleNotaCredito.codigoTipoIsc;
    this.descripcionTipoIsc = detalleDetalleNotaCredito.descripcionTipoIsc;
    this.idTipoPrecio = detalleDetalleNotaCredito.idTipoPrecio;
    this.codigoTipoPrecio = detalleDetalleNotaCredito.codigoTipoPrecio;
    this.descripcionTipoPrecio = detalleDetalleNotaCredito.descripcionTipoPrecio;
    this.idProducto = detalleDetalleNotaCredito.idProducto;
    this.numeroItem = detalleDetalleNotaCredito.numeroItem;
    this.precioUnitarioVenta = detalleDetalleNotaCredito.precioUnitarioVenta;
    this.unidadMedida = detalleDetalleNotaCredito.unidadMedida;
    this.subtotalVenta = detalleDetalleNotaCredito.subtotalVenta;
    this.subtotalIgv = detalleDetalleNotaCredito.subtotalIgv;
    this.subtotalIsc = detalleDetalleNotaCredito.subtotalIsc;
    this.descuento = detalleDetalleNotaCredito.descuento;
    this.descuentoOriginal = detalleDetalleNotaCredito.descuentoOriginal;
  }
}
