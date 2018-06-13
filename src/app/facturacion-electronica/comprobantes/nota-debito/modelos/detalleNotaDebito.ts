import {DetalleDetalleNotaDebito} from './detalleDetalleNotaDebito';

export class DetalleNotaDebito {
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
  detalle: DetalleDetalleNotaDebito;

  constructor() {
    this.descripcionItem = '';
    this.idRegistroUnidad = '';
    this.idTablaUnidad = '';
    this.codigoUnidadMedida = '';
    this.posicion = '0';
    this.codigoItem = '';
    this.precioUnitario = '';
    this.precioTotal = '';
    this.cantidad = '1';
    this.montoImpuesto = '0.00';
    this.cambioDetalle = false;
    this.detalle = new DetalleDetalleNotaDebito();
  }

  copiar(): DetalleNotaDebito {
    const nuevoDetalle = new DetalleNotaDebito();
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

  copiarDetalle(detalleNotaDebito: DetalleNotaDebito) {
    this.descripcionItem = detalleNotaDebito.descripcionItem;
    this.idRegistroUnidad = detalleNotaDebito.idRegistroUnidad;
    this.idTablaUnidad = detalleNotaDebito.idTablaUnidad;
    this.codigoUnidadMedida = detalleNotaDebito.codigoUnidadMedida;
    this.posicion = detalleNotaDebito.posicion;
    this.codigoItem = detalleNotaDebito.codigoItem;
    this.precioUnitario = detalleNotaDebito.precioUnitario;
    this.precioTotal = detalleNotaDebito.precioTotal;
    this.cantidad = detalleNotaDebito.cantidad;
    this.montoImpuesto = detalleNotaDebito.montoImpuesto;
    this.cambioDetalle = detalleNotaDebito.cambioDetalle;
    this.detalle.copiarDetalle(detalleNotaDebito.detalle);
  }
}
