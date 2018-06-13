import {Injectable} from '@angular/core';
import {Entidad} from '../models/organizacion/entidad';
import {TranslateService} from '@ngx-translate/core';
import * as WrittenNumber from 'written-number';
import {FormatoFecha} from './formato-fechas';
import {TiposService} from './tipos.service';

@Injectable()
export class UtilsService {
  constructor(
    private _tiposService: TiposService,
    private _translateService: TranslateService) {
  }

  obtenerFechaUTC(actualTimestamp: string): string {
    const dateConvertido = new Date(actualTimestamp);
    const dia = dateConvertido.getUTCDate();
    const mes = dateConvertido.getUTCMonth() + 1;
    const anio = dateConvertido.getUTCFullYear();
    return anio + '-' + this.ponerCeros(mes, 2) + mes + '-' + this.ponerCeros(dia, 2) + dia;
  }

  obtenerFecha(actualTimestamp: string): string {
    const dateConvertido = new Date(actualTimestamp);
    const dia = dateConvertido.getDate();
    const mes = dateConvertido.getMonth() + 1;
    const anio = dateConvertido.getFullYear();
    return anio + '-' + this.ponerCeros(mes, 2) + mes + '-' + this.ponerCeros(dia, 2) + dia;
  }

  ponerCeros(numero: number, cantidadZeros: number) {
    return '0'.repeat(cantidadZeros - numero.toString().length);
  }

  obtenerFechaActualUTC(): string {
    const dateConvertido = new Date();
    const dia = dateConvertido.getUTCDate();
    const mes = dateConvertido.getUTCMonth() + 1;
    const anio = dateConvertido.getUTCFullYear();
    return anio + '-' + this.ponerCeros(mes, 2) + mes + '-' + this.ponerCeros(dia, 2) + dia;
  }

  convertirATimestampUTC(anio: number, mes: number, dia: number, hora: number, min: number, seg: number, ms: number) {
    return Date.UTC(anio, mes, dia, hora, min, seg, ms);
  }

  convertirATimestamp(anio: number, mes: number, dia: number, hora: number, min: number, seg: number, ms: number) {
    return Number(new Date(anio, mes, dia, hora, min, seg, ms));
  }

  convertirFechaStringATimestamp(fechaString: string, separador: string = '/') {
    const fechaActual = new Date();
    const fechaParseada = fechaString.split(separador);
    const dia = Number(fechaParseada[0]);
    const mes = Number(fechaParseada[1]) - 1;
    const anio = Number(fechaParseada[2]);
    return this.convertirATimestamp(
      anio, mes, dia, fechaActual.getHours(),
      fechaActual.getMinutes(), fechaActual.getSeconds(), fechaActual.getMilliseconds());
  }

  cargarEntidadEmisora(): Entidad {
    const entidad = new Entidad();
    entidad.idEntidad = localStorage.getItem('id_entidad');
    entidad.direccionFiscal = localStorage.getItem('org_direccion');
    entidad.correoElectronico = localStorage.getItem('org_email');
    entidad.documento = localStorage.getItem('org_ruc');
    entidad.denominacion = localStorage.getItem('org_nombre');
    return entidad;
  }

  convertirMontoEnLetras(montoString: String, descripcionLargaMoneda: string) {
    const arr = montoString.split('.');
    const entero = arr[0];
    const decimal = arr[1];
    let con = '';
    this._translateService.get('con').take(1).subscribe(data => con = data);
    const totalEnPalabras =
      (WrittenNumber(Number(entero), { lang: 'es' }) + ' ' + con + ' ' + decimal + '/100 ' +
        descripcionLargaMoneda);
    return totalEnPalabras;
  }

  convertirFechaAFormato(fechaString: string, separadorFechaEntrada: string = '/',
                         formatoFechaEntrada: FormatoFecha = FormatoFecha.DIA_MES_ANIO,
                         formatoFechaSalida: FormatoFecha = FormatoFecha.ANIO_MES_DIA, separadorFechaSalida: string = '-') {
    const fechaParseada = fechaString.split(separadorFechaEntrada);
    let dia = 0;
    let mes = 0;
    let anio = 0;
    switch (formatoFechaEntrada) {
      case FormatoFecha.ANIO_MES_DIA:
        anio = Number(fechaParseada[0]);
        mes = Number(fechaParseada[1]);
        dia = Number(fechaParseada[2]);
        break;
      case FormatoFecha.DIA_MES_ANIO:
        dia = Number(fechaParseada[0]);
        mes = Number(fechaParseada[1]);
        anio = Number(fechaParseada[2]);
        break;
    }
    let fechaNuevoFormato = '';
    switch (formatoFechaSalida) {
      case FormatoFecha.ANIO_MES_DIA:
        fechaNuevoFormato =
          anio + separadorFechaSalida + this.ponerCeros(mes, 2) + mes +
          separadorFechaSalida + this.ponerCeros(dia, 2) + dia;
        break;
      case FormatoFecha.DIA_MES_ANIO:
        fechaNuevoFormato =
          this.ponerCeros(dia, 2) + dia + separadorFechaSalida + this.ponerCeros(mes, 2) +
          mes + separadorFechaSalida + anio;
        break;
    }
    return fechaNuevoFormato;
  }

  verificarEstadoComprobante(estadoComprobante: string) {
    const tiposEstadosAceptados = [
      this._tiposService.TIPO_ESTADO_AUTORIZADO,
      this._tiposService.TIPO_ESTADO_AUTORIZADO_CON_OBSERVACIONES
    ];
    console.log(estadoComprobante);
    console.log(tiposEstadosAceptados.findIndex(item => item === Number(estadoComprobante)) !== -1);
    return tiposEstadosAceptados.findIndex(item => item === Number(estadoComprobante)) !== -1;
  }
}
