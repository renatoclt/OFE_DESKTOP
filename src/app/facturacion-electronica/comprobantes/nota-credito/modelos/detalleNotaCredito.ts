import {DetalleDetalleNotaCredito} from './detalleDetalleNotaCredito';

export class DetalleNotaCredito {
  descripcionItem: string;
  idRegistroUnidad: string;
  idTablaUnidad: string;
  codigoUnidadMedida: string;
  posicion: string;
  codigoItem: string;
  precioUnitario: string;
  precioTotal: string;
  cantidad: string;
  montoImpuesto: string;
  cambioDetalle: boolean;
  detalle: DetalleDetalleNotaCredito;

  constructor() {
    this.descripcionItem = '';
    this.idRegistroUnidad = '';
    this.idTablaUnidad = '';
    this.codigoUnidadMedida = '';
    this.posicion = '';
    this.codigoItem = '';
    this.precioUnitario = '0.00';
    this.precioTotal = '0.00';
    this.cantidad = '0.00';
    this.montoImpuesto = '0.00';
    this.cambioDetalle = false;
    this.detalle = new DetalleDetalleNotaCredito();
  }

  copiar(): DetalleNotaCredito {
    const nuevoDetalle = new DetalleNotaCredito();
    nuevoDetalle.descripcionItem = this.descripcionItem;
    nuevoDetalle.idRegistroUnidad = this.idRegistroUnidad;
    nuevoDetalle.idTablaUnidad = this.idTablaUnidad;
    nuevoDetalle.codigoUnidadMedida = this.codigoUnidadMedida;
    nuevoDetalle.posicion = this.posicion;
    nuevoDetalle.codigoItem = this.codigoItem;
    nuevoDetalle.precioUnitario = this.precioUnitario;
    nuevoDetalle.precioTotal = this.precioTotal;
    nuevoDetalle.cantidad = this.cantidad;
    nuevoDetalle.montoImpuesto = this.montoImpuesto;
    nuevoDetalle.cambioDetalle = this.cambioDetalle;
    nuevoDetalle.detalle = this.detalle.copiar();
    return nuevoDetalle;
  }

  copiarDetalle(detalleNotaCredito: DetalleNotaCredito) {
    this.descripcionItem = detalleNotaCredito.descripcionItem;
    this.idRegistroUnidad = detalleNotaCredito.idRegistroUnidad;
    this.idTablaUnidad = detalleNotaCredito.idTablaUnidad;
    this.codigoUnidadMedida = detalleNotaCredito.codigoUnidadMedida;
    this.posicion = detalleNotaCredito.posicion;
    this.codigoItem = detalleNotaCredito.codigoItem;
    this.precioUnitario = detalleNotaCredito.precioUnitario;
    this.precioTotal = detalleNotaCredito.precioTotal;
    this.cantidad = detalleNotaCredito.cantidad;
    this.montoImpuesto = detalleNotaCredito.montoImpuesto;
    this.cambioDetalle = detalleNotaCredito.cambioDetalle;
    this.detalle.copiarDetalle(detalleNotaCredito.detalle);
  }
}
