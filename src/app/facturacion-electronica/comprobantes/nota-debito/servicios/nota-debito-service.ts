import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FormGroup} from '@angular/forms';
import {ComprobantesService} from '../../../general/services/comprobantes/comprobantes.service';
import {Subscription} from 'rxjs/Subscription';
import {TablaMaestraService} from '../../../general/services/documento/tablaMaestra.service';
import {TablaMaestra} from '../../../general/models/documento/tablaMaestra';
import {TiposService} from '../../../general/utils/tipos.service';
import {ConceptoDocumento} from '../../../general/models/documento/conceptoDocumento';
import {Parametros} from '../../../general/models/parametros/parametros';
import {Serie} from '../../../general/models/configuracionDocumento/serie';
import {LeyendaComprobante} from '../../../general/models/leyendaComprobante';
import {DetalleNotaDebito} from '../modelos/detalleNotaDebito';
import {NotaDebito} from '../modelos/notaDebito';
import {PersistenciaDatosService} from '../../../general/services/utils/persistenciaDatos.service';
import {DetalleDetalleNotaDebito} from '../modelos/detalleDetalleNotaDebito';
import {EntidadNotaDebito} from '../modelos/entidadNotaDebito';
import {DocumentoConceptoNotaDebito} from '../modelos/documentoConceptoNotaDebito';
import {DocumentoParametroNotaDebito} from '../modelos/documentoParametroNotaDebito';
import {DocumentoReferenciaNotaDebito} from '../modelos/documentoReferenciaNotaDebito';
import {JsonDocumentoParametroNotaDebito} from '../modelos/jsonDocumentoParametroNotaDebito';
import {SpinnerService} from '../../../../service/spinner.service';
import {PrecioPipe} from '../../../general/pipes/precio.pipe';
import {Comprobante} from '../../../general/models/comprobantes/comprobante';
import {DetalleNotaCredito} from '../../nota-credito/modelos/detalleNotaCredito';

@Injectable()
export class NotaDebitoService implements OnDestroy {
  tipoNotaDebito: BehaviorSubject<string>;
  private detalleOriginalLista: DetalleNotaDebito[];
  detalleModificadoLista: BehaviorSubject<DetalleNotaDebito[]>;
  comprobanteReferencia: BehaviorSubject<any>;
  private comprobanteReferenciaSubscription: Subscription;
  notaDebito: BehaviorSubject<NotaDebito>;
  pasoAVistaPrevia: BehaviorSubject<boolean>;
  estaUsandoPersistencia: BehaviorSubject<boolean>;
  itemAEditar: BehaviorSubject<DetalleNotaDebito>;

  tiposConcepto: BehaviorSubject<ConceptoDocumento[]>;

  padreFormGroup: BehaviorSubject<FormGroup>;

  constructor(private _comprobanteService: ComprobantesService,
              private _tablaMaestraService: TablaMaestraService,
              private _notaDebitoPersistenciaService: PersistenciaDatosService<[NotaDebito, any]>,
              private _tiposService: TiposService,
              private _spinnerService: SpinnerService,
              private _precioPipe: PrecioPipe) {
    this.tipoNotaDebito = new BehaviorSubject('');
    this.detalleModificadoLista = new BehaviorSubject([]);
    this.detalleOriginalLista = [];
    this.comprobanteReferencia = new BehaviorSubject(null);
    this.comprobanteReferenciaSubscription = new Subscription();
    this.notaDebito = new BehaviorSubject(new NotaDebito());
    this.pasoAVistaPrevia = new BehaviorSubject(false);
    this.estaUsandoPersistencia = new BehaviorSubject(false);
    this._notaDebitoPersistenciaService.nombrePersistencia = 'notaDebitoPersistencia';
    this.padreFormGroup = new BehaviorSubject(null);
    this.itemAEditar = new BehaviorSubject(null);
    this.tiposConcepto = new BehaviorSubject([]);
  }

  ngOnDestroy() {
    this.comprobanteReferenciaSubscription.unsubscribe();
  }

  cargandoDetalleComprobante(comprobante: Comprobante, todosTiposUnidades: BehaviorSubject<TablaMaestra[]>) {
    this.cargarDetalleDecomprobanteReferencia(comprobante, todosTiposUnidades);
    this.comprobanteReferencia.next(comprobante);
  }

  buscarComprobanteReferencia(uuid: string, todosTiposUnidades: BehaviorSubject<TablaMaestra[]>) {
    this._spinnerService.set(true);
    this.comprobanteReferenciaSubscription = this._comprobanteService.buscarPorUuid(uuid).subscribe(
      comprobante => {
        if (comprobante !== null) {
          this.cargarDetalleDecomprobanteReferencia(comprobante, todosTiposUnidades);
          this._spinnerService.set(false);
          this.comprobanteReferencia.next(comprobante);
        }
      }
    );
  }

  obtenerNotaDebitoPersistencia() {
    const datosPersistencia = <[NotaDebito, any]> this._notaDebitoPersistenciaService.obtener();
    if (datosPersistencia) {
      const notaDebitoPersistencia = datosPersistencia[0];
      const comprobanteReferenciaPersistencia = datosPersistencia[1];
      if (notaDebitoPersistencia !== null) {
        this.estaUsandoPersistencia.next(true);
        this.comprobanteReferencia.next(comprobanteReferenciaPersistencia);
        this.notaDebito.next(notaDebitoPersistencia);
        this.detalleModificadoLista.next(notaDebitoPersistencia.detalleEbiz);
        return notaDebitoPersistencia;
      } else {
        this.estaUsandoPersistencia.next(false);
        return null;
      }
    } else {
      this.estaUsandoPersistencia.next(false);
      return null;
    }
  }

  eliminarNotaDebitoPersistencia() {
    this._notaDebitoPersistenciaService.eliminar();
  }

  cargarDetalleDecomprobanteReferencia(comprobante: any, todosTiposUnidades: BehaviorSubject<TablaMaestra[]>) {
    const detalles = [];
    const detallesOriginal = [];
    for (const detalle of comprobante.detalle) {
      const detalleNotaDebito = new DetalleNotaDebito();
      detalleNotaDebito.codigoItem = detalle.vcCodigoProducto;
      detalleNotaDebito.cantidad = this._precioPipe.transform(detalle.deCantidaddespachada);
      detalleNotaDebito.codigoUnidadMedida = detalle.vcUnidadmedida;
      detalleNotaDebito.descripcionItem = detalle.vcDescripcionitem;

      const detalleDetalleNotaDebito = new DetalleDetalleNotaDebito();
      detalleDetalleNotaDebito.idTipoIgv = detalle.inItipoAfectacionigv;
      detalleDetalleNotaDebito.codigoTipoIgv = detalle.inCodigoAfectacionigv;
      detalleDetalleNotaDebito.descripcionTipoIgv = detalle.vcDescAfectacionigv;

      detalleDetalleNotaDebito.idTipoIsc = detalle.inItipoCalculoisc;
      detalleDetalleNotaDebito.codigoTipoIsc = detalle.inCodigoCalculoisc;
      detalleDetalleNotaDebito.descripcionTipoIsc = detalle.vcDescCalculoisc;

      detalleDetalleNotaDebito.idTipoPrecio = detalle.inItipoPrecioventa;
      detalleDetalleNotaDebito.codigoTipoPrecio = detalle.inCodigoPrecioventa;
      detalleDetalleNotaDebito.descripcionTipoPrecio = detalle.vcDescPrecioventa;

      detalleDetalleNotaDebito.idProducto = detalle.inIproducto;
      detalleDetalleNotaDebito.numeroItem = detalle.deCantidaddespachada;
      detalleDetalleNotaDebito.precioUnitarioVenta = this._precioPipe.transform(detalle.dePreciounitarioitem);
      detalleDetalleNotaDebito.subtotalIsc = this._precioPipe.transform(detalle.nuSubtotalIsc);
      detalleDetalleNotaDebito.subtotalVenta = this._precioPipe.transform(detalle.dePreciototalitem);
      detalleDetalleNotaDebito.subtotalIgv = this._precioPipe.transform(detalle.nuSubtotalIgv);
      detalleDetalleNotaDebito.unidadMedida = detalle.vcUnidadmedida;

      detalleDetalleNotaDebito.descuento = this._precioPipe.transform(detalle.nuDescuento.toString());

      detalleNotaDebito.detalle = detalleDetalleNotaDebito;
      detalleNotaDebito.montoImpuesto = this._precioPipe.transform(detalle.deMontoimpuesto);
      detalleNotaDebito.posicion = detalle.vcPosicion;
      detalleNotaDebito.precioTotal = this._precioPipe.transform(detalle.dePreciototalitem);
      detalleNotaDebito.precioUnitario = this._precioPipe.transform(detalle.dePreciounitarioitem);
      this._tablaMaestraService.obtenerPorAtributoDeTablaMaestra(todosTiposUnidades, [detalle.vcUnidadmedida], 'iso')
        .take(1)
        .subscribe(
          unidadesMedidas => {
            if (unidadesMedidas.length === 1) {
              detalleNotaDebito.idRegistroUnidad = unidadesMedidas[0].codigo;
              detalleNotaDebito.idTablaUnidad = unidadesMedidas[0].tabla.toString();

            }
          }
        );
      detalles.push(detalleNotaDebito);
      detallesOriginal.push(detalleNotaDebito.copiar());
    }
    this.ponerDetalle(detalles);
    this.detalleOriginalLista = detallesOriginal;
  }

  ponerTipoNotaDebito(tipoNotaDebito: string) {
    this.tipoNotaDebito.next(tipoNotaDebito);
  }

  ponerDetalle(detalleLista: DetalleNotaDebito[]) {
    this.detalleModificadoLista.next(detalleLista);
  }

  obtenerDetalleOriginal() {
    const copiaDetalle = [];
    for (const detalle of this.detalleOriginalLista) {
      const detalleNuevo = new DetalleNotaCredito();
      detalleNuevo.copiarDetalle(detalle);
      copiaDetalle.push(detalleNuevo);
    }
    return copiaDetalle;
  }

  setDatosPersistencia(tiposConceptos: BehaviorSubject<ConceptoDocumento[]>, tipoDeNotasDeDebito: BehaviorSubject<Parametros[]>,
                       cmbTipoNotaDebito: string, series: BehaviorSubject<Serie[]>, cmbSerie: string, txtMotivoNotaDebito: string,
                       txtObservacionesDebito: string) {
    this.notaDebito.next(new NotaDebito());
    this.tiposConcepto = tiposConceptos;
    this.setEntidadPersistencia();
    this.setDocumentoParametro(tipoDeNotasDeDebito, cmbTipoNotaDebito);
    this.setDocumentoReferencia();
    this.setCabeceraPersistencia(series, cmbSerie, txtMotivoNotaDebito, txtObservacionesDebito);
    this.pasoAVistaPrevia.subscribe(
      data => {
        if (data) {
          this._notaDebitoPersistenciaService.agregar([this.notaDebito.value, this.comprobanteReferencia.value]);
          this.estaUsandoPersistencia.next(true);
          this.pasoAVistaPrevia.next(false);
        }
      }
    );
  }

  setEntidadPersistencia() {
    if (this.comprobanteReferencia.value !== null) {
      const emisor = new EntidadNotaDebito();
      const receptor = new EntidadNotaDebito();

      emisor.idTipoEntidad = '1';
      emisor.descripcionTipoEntidad = 'Emisor';
      emisor.idEntidad = this.comprobanteReferencia.value.entidadproveedora.seIentidad;
      emisor.tipoDocumento = this.comprobanteReferencia.value.entidadproveedora.inTipoDocumento;
      emisor.denominacion = this.comprobanteReferencia.value.entidadproveedora.vcDenominacion;
      emisor.direccionFiscal = this.comprobanteReferencia.value.entidadproveedora.vcDirFiscal;
      emisor.documento = this.comprobanteReferencia.value.entidadproveedora.vcDocumento;
      emisor.nombreComercial = this.comprobanteReferencia.value.entidadproveedora.vcNomComercia;
      emisor.notifica = 'N';
      emisor.ubigeo = this.comprobanteReferencia.value.entidadproveedora.vcUbigeo;
      emisor.correo = this.comprobanteReferencia.value.entidadproveedora.vcCorreo;

      receptor.idTipoEntidad = '2';
      receptor.descripcionTipoEntidad = 'Receptor';
      receptor.idEntidad = this.comprobanteReferencia.value.entidadcompradora.seIentidad;
      receptor.tipoDocumento = this.comprobanteReferencia.value.entidadcompradora.inTipoDocumento;
      receptor.denominacion = this.comprobanteReferencia.value.entidadcompradora.vcDenominacion;
      receptor.direccionFiscal = this.comprobanteReferencia.value.entidadcompradora.vcDirFiscal;
      receptor.documento = this.comprobanteReferencia.value.entidadcompradora.vcDocumento;
      receptor.nombreComercial = this.comprobanteReferencia.value.entidadcompradora.vcNomComercia;
      receptor.notifica = 'S';
      receptor.ubigeo = this.comprobanteReferencia.value.entidadcompradora.vcUbigeo;
      receptor.correo = this.comprobanteReferencia.value.entidadcompradora.vcCorreo;

      this.notaDebito.value.documentoEntidad.push(emisor);
      this.notaDebito.value.documentoEntidad.push(receptor);
    }
  }

  setDocumentoConcepto(tiposConceptos: BehaviorSubject<ConceptoDocumento[]>) {
    const documentoConceptoOperacionesGravadas = new DocumentoConceptoNotaDebito();
    const documentoConceptoOperacionesInafectas = new DocumentoConceptoNotaDebito();
    const documentoConceptoOperacionesExoneradas = new DocumentoConceptoNotaDebito();
    const documentoConceptoOperacionesGratuitas = new DocumentoConceptoNotaDebito();
    const documentoConceptoOperacionesSubTotalVenta = new DocumentoConceptoNotaDebito();
    const documentoConceptoOperacionesTotalDescuentos = new DocumentoConceptoNotaDebito();

    this.notaDebito.value.documentoConcepto = [];
    tiposConceptos.subscribe(
      (conceptos) => {
        for (const concepto of conceptos) {
          switch (concepto.codigo) {
            case this._tiposService.CONCEPTO_OPERACION_GRAVADA_CODIGO:
              documentoConceptoOperacionesGravadas.idConcepto = concepto.idConcepto;
              documentoConceptoOperacionesGravadas.descripcionConcepto = concepto.descripcion;
              documentoConceptoOperacionesGravadas.codigoConcepto = concepto.codigo;
              // documentoConceptoOperacionesGravadas.importe = ;
              break;
            case this._tiposService.CONCEPTO_OPERACION_INAFECTAS_CODIGO:
              documentoConceptoOperacionesInafectas.idConcepto = concepto.idConcepto;
              documentoConceptoOperacionesInafectas.descripcionConcepto = concepto.descripcion;
              documentoConceptoOperacionesInafectas.codigoConcepto = concepto.codigo;
              // documentoConceptoOperacionesInafectas.importe = ;
              break;
            case this._tiposService.CONCEPTO_OPERACION_EXONERADO_CODIGO:
              documentoConceptoOperacionesExoneradas.idConcepto = concepto.idConcepto;
              documentoConceptoOperacionesExoneradas.descripcionConcepto = concepto.descripcion;
              documentoConceptoOperacionesExoneradas.codigoConcepto = concepto.codigo;
              // documentoConceptoOperacionesExoneradas.importe = ;
              break;
            case this._tiposService.CONCEPTO_OPERACION_GRATUITA_CODIGO:
              documentoConceptoOperacionesGratuitas.idConcepto = concepto.idConcepto;
              documentoConceptoOperacionesGratuitas.descripcionConcepto = concepto.descripcion;
              documentoConceptoOperacionesGratuitas.codigoConcepto = concepto.codigo;
              // documentoConceptoOperacionesGratuitas.importe = |;
              break;
            case this._tiposService.CONCEPTO_OPERACION_SUB_TOTAL_VENTA_CODIGO:
              documentoConceptoOperacionesSubTotalVenta.idConcepto = concepto.idConcepto;
              documentoConceptoOperacionesSubTotalVenta.descripcionConcepto = concepto.descripcion;
              documentoConceptoOperacionesSubTotalVenta.codigoConcepto = concepto.codigo;
              documentoConceptoOperacionesSubTotalVenta.importe = this.notaDebito.value.subtotalComprobante;
              break;
            case this._tiposService.CONCEPTO_OPERACION_TOTAL_DESCUENTOS_CODIGO:
              documentoConceptoOperacionesTotalDescuentos.idConcepto = concepto.idConcepto;
              documentoConceptoOperacionesTotalDescuentos.descripcionConcepto = concepto.descripcion;
              documentoConceptoOperacionesTotalDescuentos.codigoConcepto = concepto.codigo;
              break;
          }
        }
        this.notaDebito.value.documentoConcepto.push(documentoConceptoOperacionesGravadas);
        this.notaDebito.value.documentoConcepto.push(documentoConceptoOperacionesInafectas);
        this.notaDebito.value.documentoConcepto.push(documentoConceptoOperacionesExoneradas);
        this.notaDebito.value.documentoConcepto.push(documentoConceptoOperacionesGratuitas);
        // this.notaDebito.value.documentoConcepto.push(documentoConceptoOperacionesSubTotalVenta);
        this.notaDebito.value.documentoConcepto.push(documentoConceptoOperacionesTotalDescuentos);
      }
    );
  }

  setDocumentoParametro(tipoDeNotasDeDebito: BehaviorSubject<Parametros[]>, cmbTipoNotaDebito: string) {
    tipoDeNotasDeDebito.subscribe(
      tipoDeNotaDebitoLista => {
        const tipoNotaDebito = tipoDeNotaDebitoLista.find(item => item.codigo_dominio === cmbTipoNotaDebito);
        const documentoParametro = new DocumentoParametroNotaDebito();
        documentoParametro.idParametro = tipoNotaDebito.idparametro.toString();
        documentoParametro.descripcionParametro = tipoNotaDebito.parametro_descripcion;
        const jsonDocumentoParametro = new JsonDocumentoParametroNotaDebito();
        jsonDocumentoParametro.tipo = 3;
        jsonDocumentoParametro.valor = tipoNotaDebito.descripcion_dominio;
        jsonDocumentoParametro.auxiliarCaracter = tipoNotaDebito.codigo_dominio;
        documentoParametro.json = JSON.stringify(jsonDocumentoParametro);
        this.notaDebito.value.documentoParametro.push(documentoParametro);
      }
    );
  }

  setDocumentoReferencia() {
    const documentoReferencia = new DocumentoReferenciaNotaDebito();
    documentoReferencia.tipoDocumentoOrigen = this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO;
    documentoReferencia.tipoDocumentoOrigenDescripcion = this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO_NOMBRE;

    if ( this.comprobanteReferencia.value !== null) {
      documentoReferencia.idDocumentoDestino = this.comprobanteReferencia.value.inIdcomprobantepago;
      documentoReferencia.tipoDocumentoDestino = this.comprobanteReferencia.value.vcIdregistrotipocomprobante;
      documentoReferencia.correlativoDocumentoDestino = this.comprobanteReferencia.value.vcCorrelativo;
      documentoReferencia.serieDocumentoDestino = this.comprobanteReferencia.value.vcSerie;
      documentoReferencia.fechaEmisionDestino = this.comprobanteReferencia.value.tsFechaemision;
      documentoReferencia.totalImporteDestino = Number(this.comprobanteReferencia.value.deTotalcomprobantepago).toFixed(2);

      let igvTotal = 0;
      for (const detalle of this.comprobanteReferencia.value.detalle) {
        igvTotal += detalle.nuSubtotalIgv;
      }
      documentoReferencia.totalImporteAuxiliarDestino = Number(igvTotal).toFixed(2);
      documentoReferencia.monedaDestino = this.comprobanteReferencia.value.chMonedacomprobantepago.toString();
      documentoReferencia.tipoDocumentoDestinoDescripcion = this.comprobanteReferencia.value.vcTipocomprobante;
      documentoReferencia.totalMonedaDestino = this.comprobanteReferencia.value.deTotalcomprobantepago;
      documentoReferencia.totalPorcentajeAuxiliarDestino = Number(0).toFixed(2);
    }
    this.notaDebito.value.documentoReferencia.push(documentoReferencia);
  }

  setCabeceraPersistencia(series: BehaviorSubject<Serie[]>, cmbSerie: string, txtMotivoNotaDebito: string,
                          txtObservacionesNotaDebito: string) {
    series.subscribe(
      seriesData => {
        if (seriesData.length > 0) {
          const serie = seriesData.find(item => item.idSerie === Number(cmbSerie));
          if (serie != null) {
            this.notaDebito.value.numeroComprobante = serie.serie;
          }
        }
      }
    );

    if (this.comprobanteReferencia.value != null) {
      this.notaDebito.value.rucProveedor = this.comprobanteReferencia.value.entidadproveedora.vcDocumento;
      this.notaDebito.value.razonSocialProveedor = this.comprobanteReferencia.value.entidadproveedora.vcDenominacion;
      this.notaDebito.value.idTablaMoneda = this.comprobanteReferencia.value.vcIdtablamoneda;
      this.notaDebito.value.idRegistroMoneda = this.comprobanteReferencia.value.vcIdregistromoneda;
      this.notaDebito.value.idTablaTipoComprobante = this.comprobanteReferencia.value.vcIdtablatipocomprobante;
      this.notaDebito.value.moneda = this.comprobanteReferencia.value.chMonedacomprobantepago.toString();
      this.notaDebito.value.rucComprador = this.comprobanteReferencia.value.entidadcompradora.vcDocumento;
      this.notaDebito.value.razonSocialComprador = this.comprobanteReferencia.value.entidadcompradora.vcDenominacion;
    }

    this.notaDebito.value.idRegistroTipoComprobante = this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO;
    this.notaDebito.value.idTipoComprobante = this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO;
    this.notaDebito.value.tipoComprobante = this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO;

    this.notaDebito.value.observacionComprobante = txtObservacionesNotaDebito;
    this.notaDebito.value.tipoComprobante = this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO_NOMBRE;
    this.notaDebito.value.motivoComprobante = txtMotivoNotaDebito;

    this.notaDebito.value.usuarioCreacion = localStorage.getItem('username');
    this.notaDebito.value.usuarioModificacion = localStorage.getItem('username');

    this.notaDebito.value.idSerie = cmbSerie;
  }

  setCabeceraNormal(leyendaComprobante: LeyendaComprobante) {
    this.notaDebito.value.montoPagado = Number(leyendaComprobante.montoPagado).toFixed(2);
    this.notaDebito.value.igv = Number(leyendaComprobante.igv).toFixed(2);
    this.notaDebito.value.isc = Number(leyendaComprobante.isc).toFixed(2);
    this.notaDebito.value.descuento = Number(leyendaComprobante.descuentos).toFixed(2);
    this.notaDebito.value.totalComprobante = Number(leyendaComprobante.total).toFixed(2);
    this.notaDebito.value.subtotalComprobante = Number(leyendaComprobante.subTotal).toFixed(2);
    this.notaDebito.value.importeReferencial = Number(leyendaComprobante.importeReferencial).toFixed(2);
    this.notaDebito.value.otrosTributos = Number(leyendaComprobante.otrosTributos).toFixed(2);
    // this.notaDebito.tipoItem = ;
    this.setDocumentoConcepto(this.tiposConcepto);
  }

  setDetalleNormal(detalle: DetalleNotaDebito) {
    if (detalle !== null) {
      this.notaDebito.value.detalleEbiz = [detalle];
    } else {
      this.notaDebito.value.detalleEbiz = this.detalleModificadoLista.value;
    }
  }

  setCabeceraDataTable(ponerValoresEnCero: boolean) {
    if (ponerValoresEnCero) {
      this.ponerValoresEnCabecera(0, 0, 0, 0, 0, 0, 0, 0);
    } else {
      this.reCalcularTotalesDeDetalle();
    }
    this.setDocumentoConcepto(this.tiposConcepto);
  }

  ponerValoresEnCabecera(montoPagado: number, igv: number, isc: number, otrosTributos: number, importeReferencial: number,
                         subtotalComprobante: number, descuento: number, totalComprobante: number) {
    this.notaDebito.value.montoPagado = Number(montoPagado).toFixed(2);
    this.notaDebito.value.igv = Number(igv).toFixed(2);
    this.notaDebito.value.isc = Number(isc).toFixed(2);
    this.notaDebito.value.otrosTributos = Number(otrosTributos).toFixed(2);
    this.notaDebito.value.importeReferencial = Number(importeReferencial).toFixed(2);
    this.notaDebito.value.subtotalComprobante = Number(subtotalComprobante).toFixed(2);
    this.notaDebito.value.totalComprobante = Number(totalComprobante).toFixed(2);
    this.notaDebito.value.descuento = Number(descuento).toFixed(2);
    // this.notaDebito.tipoItem = ;
  }

  reCalcularTotalesDeDetalle() {
    let montoPagado = 0;
    let igv = 0;
    let isc = 0;
    let otrosTributos = 0;
    let importeReferencial = 0;
    let subtotalComprobante = 0;
    let totalComprobante = 0;
    let descuento = 0;
    for (const detalle of this.notaDebito.value.detalleEbiz) {
      detalle.montoImpuesto = detalle.detalle.subtotalIgv;
      montoPagado += Number(detalle.precioTotal);
      igv += Number(detalle.detalle.subtotalIgv);
      isc += Number(detalle.detalle.subtotalIsc);
      // otrosTributos += Number(detalle.);
      importeReferencial += Number(detalle.montoImpuesto);
      subtotalComprobante += Number(detalle.detalle.subtotalVenta);
      totalComprobante += Number(detalle.precioTotal);
      descuento += Number(detalle.detalle.descuento);
    }

    this.ponerValoresEnCabecera(montoPagado, igv, isc, otrosTributos, importeReferencial, subtotalComprobante, descuento, totalComprobante);
  }


  setDetalleDataTable(detalleNotaDebitoLista: DetalleNotaDebito[]) {
    if (
      this.tipoNotaDebito.value === this._tiposService.TIPO_NOTA_DEBITO_AUMENTO_EN_EL_VALOR
    ) {
      for (const index in detalleNotaDebitoLista) {
        detalleNotaDebitoLista[index].posicion = index;
        detalleNotaDebitoLista[index].detalle.numeroItem = index;
        detalleNotaDebitoLista[index].detalle.precioUnitarioVenta = detalleNotaDebitoLista[index].precioTotal;
        detalleNotaDebitoLista[index].detalle.subtotalVenta = (
          Number(detalleNotaDebitoLista[index].detalle.precioUnitarioVenta) -
          Number(detalleNotaDebitoLista[index].detalle.subtotalIgv)).toFixed(2);
      }
    }
    this.notaDebito.value.detalleEbiz = detalleNotaDebitoLista;
    this.notaDebito.value.detalleEbiz = detalleNotaDebitoLista;
  }

}
