import {Injectable} from '@angular/core';
import {PersistenciaDatosService} from '../../../general/services/utils/persistenciaDatos.service';
import {PercepcionCrear} from '../modelos/percepcion-crear';
import {PercepcionCrearDetalle} from '../modelos/percepcion-crear-detalle';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Serie} from '../../../general/models/configuracionDocumento/serie';
import {PercepcionCrearDocumentoEntidad} from '../modelos/percepcion-crear-documento-entidad';
import {CatalogoDocumentoIdentidadService} from '../../../general/utils/catalogo-documento-identidad.service';
import {TiposService} from '../../../general/utils/tipos.service';
import {PercepcionCrearDocumentoParametro} from '../modelos/percepcion-crear-documento-parametro';
import {PercepcionCrearDocumentoParametroJson} from '../modelos/percepcion-crear-documento-parametro-json';
import {PercepcionCrearDocumentoReferencia} from '../modelos/percepcion-crear-documento-referencia';
import {PercepcionCrearAuxiliar} from '../modelos/percepcion-crear-auxiliar';
import {UtilsService} from '../../../general/utils/utils.service';
import {DatePipe} from '@angular/common';

@Injectable()
export class PercepcionComunService {
  percepcion: BehaviorSubject<PercepcionCrear>;

  percepcionAuxiliar: BehaviorSubject<PercepcionCrearAuxiliar>;

  itemDetalleEditar: BehaviorSubject<PercepcionCrearDetalle>;

  constructor(
    private _catalogoDocumentoEntidadService: CatalogoDocumentoIdentidadService,
    private _tiposService: TiposService,
    private _utilsService: UtilsService,
    private _percepcionAuxiliarPersistenciaService: PersistenciaDatosService<PercepcionCrearAuxiliar>
  ) {
    this.inicializarVariables();
  }

  inicializarVariables() {
    this._percepcionAuxiliarPersistenciaService.nombrePersistencia = 'percepcionAuxliar';

    this.percepcion = new BehaviorSubject(null);
    this.percepcionAuxiliar = new BehaviorSubject(null);
    this.itemDetalleEditar = new BehaviorSubject(null);
  }

  fillPercepcionAEmitir() {
    this.percepcion.next(new PercepcionCrear());
    this.cargarDatosEntidades();
    this.cargarDatosParametros();
    this.cargarDatosEnCabeceraNoDependeDetalle(
      this.percepcionAuxiliar.value.cabecera.serie,
      this.percepcionAuxiliar.value.cabecera.fechaPago,
      this.percepcionAuxiliar.value.cabecera.tipoMoneda,
      this.percepcionAuxiliar.value.cabecera.observacion);
      this.calcularDatosDetalle();
      console.log('JSON PERCEPCION');
      console.log(this.percepcionAuxiliar);
  }

  cargarDatosEnCabeceraNoDependeDetalle(serie: Serie, fecha: string, moneda: string, observacion: string) {
    this.percepcion.value.fechaEmision = this._utilsService.convertirFechaStringATimestamp(fecha);
    this.percepcion.value.tipoItem = '3';
    this.percepcion.value.idSerie = serie.idSerie.toString();
    this.percepcion.value.descuento = '0.00';
    this.percepcion.value.monedaDescuento = moneda;
    this.percepcion.value.moneda = moneda;
    this.percepcion.value.observacionComprobante = observacion;
    this.percepcion.value.razonSocialComprador = this.percepcionAuxiliar.value.entidadReceptora.denominacion;
    this.percepcion.value.razonSocialProveedor = localStorage.getItem('org_nombre');
    this.percepcion.value.tipoComprobante = this._tiposService.TIPO_DOCUMENTO_PERCEPCION_NOMBRE;
    this.percepcion.value.idTipoComprobante = this._tiposService.TIPO_DOCUMENTO_PERCEPCION;
    this.percepcion.value.rucComprador = this.percepcionAuxiliar.value.entidadReceptora.documento;
    this.percepcion.value.rucProveedor = localStorage.getItem('org_ruc');
    this.percepcion.value.numeroComprobante = serie.serie;
  }

  cargarCabeceraDependeDetalle(porcentajeImpuesto: number, totalComprobante: number,
                               montoDescuento: number, montoPagado: number) {
    this.percepcion.value.porcentajeImpuesto = porcentajeImpuesto.toFixed(2);
    this.percepcion.value.totalComprobante = totalComprobante.toFixed(2);
    this.percepcion.value.montoDescuento = montoDescuento.toFixed(2);
    this.percepcion.value.montoPagado = montoPagado.toFixed(2);
    this.percepcion.value.porcentajeImpuesto = this.percepcionAuxiliar.value.cabecera.porcentajePercepcion.toFixed();
  }

  cargarDatosEntidades() {
    const documentoEntidadEmisor = new PercepcionCrearDocumentoEntidad();
    documentoEntidadEmisor.idTipoEntidad = 1;
    documentoEntidadEmisor.tipoDocumento = Number(this._catalogoDocumentoEntidadService.TIPO_DOCUMENTO_IDENTIDAD_RUC).toString();
    documentoEntidadEmisor.documento = this.percepcionAuxiliar.value.entidadEmisora.documento;
    documentoEntidadEmisor.direccionFiscal = this.percepcionAuxiliar.value.entidadEmisora.direccionFiscal;
    documentoEntidadEmisor.denominacion = this.percepcionAuxiliar.value.entidadEmisora.denominacion;

    documentoEntidadEmisor.correoElectronico = this.percepcionAuxiliar.value.entidadEmisora.correoElectronico;
    const documentoEntidadReceptor = new PercepcionCrearDocumentoEntidad();
    documentoEntidadReceptor.idTipoEntidad = 2;
    documentoEntidadReceptor.tipoDocumento = this.percepcionAuxiliar.value.entidadReceptora.idTipoDocumento;
    documentoEntidadReceptor.documento = this.percepcionAuxiliar.value.entidadReceptora.documento;
    documentoEntidadReceptor.direccionFiscal = this.percepcionAuxiliar.value.entidadReceptora.direccionFiscal;
    documentoEntidadReceptor.denominacion = this.percepcionAuxiliar.value.entidadReceptora.denominacion;

    documentoEntidadReceptor.correoElectronico = this.percepcionAuxiliar.value.entidadReceptora.correoElectronico;
    this.percepcion.value.documentoEntidad = [
      documentoEntidadEmisor,
      documentoEntidadReceptor
    ];
  }

  calcularDatosDetalle() {
    let porcentajeImpuesto = 0;
    let totalComprobante = 0;
    let montoDescuento = 0;
    for (const detalle of this.percepcionAuxiliar.value.detalle) {
      const documentoReferencia = this.cargarDatosReferencia(detalle);
      totalComprobante += Number(detalle.importeTotalComprobante);
      montoDescuento += Number(detalle.montoPercepcion);
      porcentajeImpuesto += Number(detalle.porcentajePercepcion);
      this.percepcion.value.documentoReferencia.push(documentoReferencia);
    }
    const montoPagado = totalComprobante - montoDescuento;
    this.cargarCabeceraDependeDetalle(porcentajeImpuesto, totalComprobante, montoDescuento,
      montoPagado);
  }

  cargarDatosParametros() {
    const parametroPercepcion = this.percepcionAuxiliar.value.cabecera.tipoPorcentajePercepcion;
    const documentoParametro = new PercepcionCrearDocumentoParametro();
    documentoParametro.idParametro = parametroPercepcion.idparametro.toFixed();
    documentoParametro.descripcionParametro = parametroPercepcion.parametro_descripcion;
    const documentoParametroJson = new PercepcionCrearDocumentoParametroJson();
    documentoParametroJson.tipo = 3;
    documentoParametroJson.valor = parametroPercepcion.descripcion_dominio;
    documentoParametroJson.auxiliarEntero = parametroPercepcion.id_dominio;
    documentoParametroJson.auxiliarCaracter = parametroPercepcion.codigo_dominio;
    documentoParametroJson.auxiliarFecha = null;
    documentoParametroJson.auxiliarImporte = '0.00';
    documentoParametro.json = JSON.stringify(documentoParametroJson);
    this.percepcion.value.documentoParametro = [documentoParametro];
  }

  cargarDatosReferencia(detalle: PercepcionCrearDetalle) {
    const documentoReferencia = new PercepcionCrearDocumentoReferencia();
    if (detalle.comprobante) {
      documentoReferencia.idDocumentoDestino = detalle.idComprobante;
    }
    documentoReferencia.tipoDocumentoOrigen = this._tiposService.TIPO_DOCUMENTO_PERCEPCION;
    documentoReferencia.tipoDocumentoOrigenDescripcion = this._tiposService.TIPO_DOCUMENTO_PERCEPCION_NOMBRE;

    documentoReferencia.tipoDocumentoDestino = detalle.tipoComprobante.codigo;
    documentoReferencia.tipoDocumentoDestinoDescripcion = detalle.tipoComprobante.descripcionLarga;
    documentoReferencia.serieDocumentoDestino = detalle.serieComprobante;
    documentoReferencia.correlativoDocumentoDestino = detalle.correlativoComprobante;
    documentoReferencia.fechaEmisionDestino = this._utilsService.convertirFechaStringATimestamp(detalle.fechaEmisionComprobante);
    documentoReferencia.totalImporteDestino = detalle.importeTotalComprobante;
    documentoReferencia.totalImporteAuxiliarDestino = detalle.montoPercepcion;
    documentoReferencia.totalPorcentajeAuxiliarDestino = detalle.porcentajePercepcion.toFixed(2);
    documentoReferencia.monedaDestino = detalle.monedaComprobante.descripcionCorta;
    documentoReferencia.totalMonedaDestino = detalle.importeSolesComprobante;

    documentoReferencia.auxiliar1 = detalle.tipoCambioComprobante;
    documentoReferencia.auxiliar2 = (Number(detalle.importeSolesComprobante) - Number(detalle.montoPercepcion)).toFixed(2);
    return documentoReferencia;
  }

  setPersistenciaPercepcionAuxiliar() {
    this._percepcionAuxiliarPersistenciaService.agregar(
      this.percepcionAuxiliar.value
    );
  }

  hayPersistencia() {
    const persistencia = <PercepcionCrearAuxiliar> this._percepcionAuxiliarPersistenciaService.obtener();
    this.percepcionAuxiliar.next(persistencia);
    return persistencia !== null;
  }

  eliminarPersistenciaPercepcionAuxiliar() {
    this._percepcionAuxiliarPersistenciaService.eliminar();
  }


}
