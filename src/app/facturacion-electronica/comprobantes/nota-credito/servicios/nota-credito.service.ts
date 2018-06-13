import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DetalleNotaCredito} from '../modelos/detalleNotaCredito';
import {FormGroup} from '@angular/forms';
import {ComprobantesService} from '../../../general/services/comprobantes/comprobantes.service';
import {Subscription} from 'rxjs/Subscription';
import {DetalleDetalleNotaCredito} from '../modelos/detalleDetalleNotaCredito';
import {TablaMaestraService} from '../../../general/services/documento/tablaMaestra.service';
import {TablaMaestra} from '../../../general/models/documento/tablaMaestra';
import {PersistenciaDatosService} from '../../../general/services/utils/persistenciaDatos.service';
import {NotaCredito} from '../modelos/notaCredito';
import {JsonDocumentoParametroNotaCredito} from '../modelos/jsonDocumentoParametroNotaCredito';
import {DocumentoParametroNotaCredito} from '../modelos/documentoParametroNotaCredito';
import {EntidadNotaCredito} from '../modelos/entidadNotaCredito';
import {DocumentoConceptoNotaCredito} from '../modelos/documentoConceptoNotaCredito';
import {DocumentoReferenciaNotaCredito} from '../modelos/documentoReferenciaNotaCredito';
import {TiposService} from '../../../general/utils/tipos.service';
import {ConceptoDocumento} from '../../../general/models/documento/conceptoDocumento';
import {Parametros} from '../../../general/models/parametros/parametros';
import {Serie} from '../../../general/models/configuracionDocumento/serie';
import {LeyendaComprobante} from '../../../general/models/leyendaComprobante';
import {SpinnerService} from '../../../../service/spinner.service';
import {PrecioPipe} from '../../../general/pipes/precio.pipe';
import {Comprobante} from '../../../general/models/comprobantes/comprobante';

@Injectable()
export class NotaCreditoService implements OnDestroy {
  tipoNotaCredito: BehaviorSubject<string>;
  private detalleOriginalLista: DetalleNotaCredito[];
  detalleModificadoLista: BehaviorSubject<DetalleNotaCredito[]>;
  comprobanteReferencia: BehaviorSubject<any>;
  private comprobanteReferenciaSubscription: Subscription;
  notaCredito: BehaviorSubject<NotaCredito>;
  pasoAVistaPrevia: BehaviorSubject<boolean>;
  estaUsandoPersistencia: BehaviorSubject<boolean>;
  itemAEditar: BehaviorSubject<DetalleNotaCredito>;
  tiposConcepto: BehaviorSubject<ConceptoDocumento[]>;

  padreFormGroup: BehaviorSubject<FormGroup>;

  constructor(private _comprobanteService: ComprobantesService,
              private _tablaMaestraService: TablaMaestraService,
              private _notaCreditoPersistenciaService: PersistenciaDatosService<[NotaCredito, any, DetalleNotaCredito[]]>,
              private _tiposService: TiposService,
              private _spinnerService: SpinnerService,
              private _precioPipe: PrecioPipe) {
    this.tipoNotaCredito = new BehaviorSubject('');
    this.detalleModificadoLista = new BehaviorSubject([]);
    this.detalleOriginalLista = [];
    this.comprobanteReferencia = new BehaviorSubject(null);
    this.comprobanteReferenciaSubscription = new Subscription();
    this.notaCredito = new BehaviorSubject(new NotaCredito());
    this.pasoAVistaPrevia = new BehaviorSubject(false);
    this.estaUsandoPersistencia = new BehaviorSubject(false);
    this._notaCreditoPersistenciaService.nombrePersistencia = 'notaCreditoPersistencia';
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

  obtenerNotaCreditoPersistencia() {
    const datosPersistencia = <[NotaCredito, any, DetalleNotaCredito[]]> this._notaCreditoPersistenciaService.obtener();
    if (datosPersistencia) {
      const notaCreditoPersistencia = datosPersistencia[0];
      const comprobanteReferenciaPersistencia = datosPersistencia[1];
      const detalleOriginal = <DetalleNotaCredito[]> datosPersistencia[2];
      if (notaCreditoPersistencia !== null) {
        this.estaUsandoPersistencia.next(true);
        this.comprobanteReferencia.next(comprobanteReferenciaPersistencia);
        this.notaCredito.next(notaCreditoPersistencia);
        this.detalleOriginalLista = detalleOriginal;
        this.detalleModificadoLista.next(notaCreditoPersistencia.detalleEbiz);
        return notaCreditoPersistencia;
      } else {
        this.estaUsandoPersistencia.next(false);
        return null;
      }
    } else {
      this.estaUsandoPersistencia.next(false);
      return null;
    }
  }

  eliminarNotaCreditoPersistencia() {
    this._notaCreditoPersistenciaService.eliminar();
  }

  cargarDetalleDecomprobanteReferencia(comprobante: any, todosTiposUnidades: BehaviorSubject<TablaMaestra[]>) {
    const detalles = [];
    const detallesOriginal = [];
    for (const detalle of comprobante.detalle) {
      const detalleNotaCredito = new DetalleNotaCredito();
      detalleNotaCredito.codigoItem = detalle.vcCodigoProducto;
      detalleNotaCredito.cantidad = this._precioPipe.transform(detalle.deCantidaddespachada);
      detalleNotaCredito.codigoUnidadMedida = detalle.vcUnidadmedida;
      detalleNotaCredito.descripcionItem = detalle.vcDescripcionitem;

      const detalleDetalleNotaCredito = new DetalleDetalleNotaCredito();
      detalleDetalleNotaCredito.idTipoIgv = detalle.inItipoAfectacionigv;
      detalleDetalleNotaCredito.codigoTipoIgv = detalle.inCodigoAfectacionigv;
      detalleDetalleNotaCredito.descripcionTipoIgv = detalle.vcDescAfectacionigv;

      detalleDetalleNotaCredito.idTipoIsc = detalle.inItipoCalculoisc;
      detalleDetalleNotaCredito.codigoTipoIsc = detalle.inCodigoCalculoisc;
      detalleDetalleNotaCredito.descripcionTipoIsc = detalle.vcDescCalculoisc;

      detalleDetalleNotaCredito.idTipoPrecio = detalle.inItipoPrecioventa;
      detalleDetalleNotaCredito.codigoTipoPrecio = detalle.inCodigoPrecioventa;
      detalleDetalleNotaCredito.descripcionTipoPrecio = detalle.vcDescPrecioventa;

      detalleDetalleNotaCredito.idProducto = detalle.inIproducto;
      detalleDetalleNotaCredito.numeroItem = detalle.deCantidaddespachada;
      detalleDetalleNotaCredito.precioUnitarioVenta = this._precioPipe.transform(detalle.dePreciounitarioitem);
      detalleDetalleNotaCredito.subtotalIsc = this._precioPipe.transform(detalle.nuSubtotalIsc);
      detalleDetalleNotaCredito.subtotalVenta = this._precioPipe.transform(detalle.dePreciototalitem);
      detalleDetalleNotaCredito.subtotalIgv = this._precioPipe.transform(detalle.nuSubtotalIgv);
      detalleDetalleNotaCredito.unidadMedida = detalle.vcUnidadmedida;

      detalleDetalleNotaCredito.descuento = '0.00';
      detalleDetalleNotaCredito.descuentoOriginal = this._precioPipe.transform(detalle.nuDescuento.toString());

      detalleNotaCredito.detalle = detalleDetalleNotaCredito;
      detalleNotaCredito.montoImpuesto = this._precioPipe.transform(detalle.deMontoimpuesto);
      detalleNotaCredito.posicion = detalle.vcPosicion;
      detalleNotaCredito.precioTotal = this._precioPipe.transform(detalle.dePreciototalitem);
      detalleNotaCredito.precioUnitario = this._precioPipe.transform(detalle.dePreciounitarioitem);
      this._tablaMaestraService.obtenerPorAtributoDeTablaMaestra(todosTiposUnidades, [detalle.vcUnidadmedida], 'iso')
        .take(1)
        .subscribe(
          unidadesMedidas => {
            if (unidadesMedidas.length === 1) {
              detalleNotaCredito.idRegistroUnidad = unidadesMedidas[0].codigo;
              detalleNotaCredito.idTablaUnidad = unidadesMedidas[0].tabla.toString();

            }
          }
        );
      detalles.push(detalleNotaCredito);
      detallesOriginal.push(detalleNotaCredito.copiar());
    }
    this.ponerDetalle(detalles);
    this.detalleOriginalLista = detallesOriginal;
  }

  ponerTipoNotaCredito(tipoNotaCredito: string) {
    this.tipoNotaCredito.next(tipoNotaCredito);
  }

  ponerDetalle(detalleLista: DetalleNotaCredito[]) {
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

  setDatosPersistencia(tiposConceptos: BehaviorSubject<ConceptoDocumento[]>, tipoDeNotasDeCredito: BehaviorSubject<Parametros[]>,
                       cmbTipoNotaCredito: string, series: BehaviorSubject<Serie[]>, cmbSerie: string, txtMotivoNotaCredito: string,
                       txtObservacionesCredito: string) {
    this.notaCredito.next(new NotaCredito());
    this.setEntidadPersistencia();
    this.setDocumentoParametro(tipoDeNotasDeCredito, cmbTipoNotaCredito);
    this.setDocumentoReferencia();
    this.setCabeceraPersistencia(series, cmbSerie, txtMotivoNotaCredito, txtObservacionesCredito);
    this.tiposConcepto = tiposConceptos;
    this.pasoAVistaPrevia.subscribe(
      data => {
        if (data) {
          this._notaCreditoPersistenciaService.agregar([this.notaCredito.value, this.comprobanteReferencia.value, this.detalleOriginalLista]);
          this.estaUsandoPersistencia.next(true);
          this.pasoAVistaPrevia.next(false);
        }
      }
    );
  }

  setEntidadPersistencia() {
    if (this.comprobanteReferencia.value !== null) {
      const emisor = new EntidadNotaCredito();
      const receptor = new EntidadNotaCredito();

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

      this.notaCredito.value.documentoEntidad.push(emisor);
      this.notaCredito.value.documentoEntidad.push(receptor);
    }
  }

  setDocumentoConcepto(tiposConceptos: BehaviorSubject<ConceptoDocumento[]>) {
    const documentoConceptoOperacionesGravadas = new DocumentoConceptoNotaCredito();
    const documentoConceptoOperacionesInafectas = new DocumentoConceptoNotaCredito();
    const documentoConceptoOperacionesExoneradas = new DocumentoConceptoNotaCredito();
    const documentoConceptoOperacionesGratuitas = new DocumentoConceptoNotaCredito();
    const documentoConceptoOperacionesSubTotalVenta = new DocumentoConceptoNotaCredito();
    const documentoConceptoOperacionesTotalDescuentos = new DocumentoConceptoNotaCredito();
    this.notaCredito.value.documentoConcepto = [];
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
              // documentoConceptoOperacionesGratuitas.importe = ;
              break;
            case this._tiposService.CONCEPTO_OPERACION_SUB_TOTAL_VENTA_CODIGO:
              documentoConceptoOperacionesSubTotalVenta.idConcepto = concepto.idConcepto;
              documentoConceptoOperacionesSubTotalVenta.descripcionConcepto = concepto.descripcion;
              documentoConceptoOperacionesSubTotalVenta.codigoConcepto = concepto.codigo;
              documentoConceptoOperacionesSubTotalVenta.importe = this.notaCredito.value.subtotalComprobante;
              break;
            case this._tiposService.CONCEPTO_OPERACION_TOTAL_DESCUENTOS_CODIGO:
              documentoConceptoOperacionesTotalDescuentos.idConcepto = concepto.idConcepto;
              documentoConceptoOperacionesTotalDescuentos.descripcionConcepto = concepto.descripcion;
              documentoConceptoOperacionesTotalDescuentos.codigoConcepto = concepto.codigo;

              break;
          }
        }

        this.notaCredito.value.documentoConcepto.push(documentoConceptoOperacionesGravadas);
        this.notaCredito.value.documentoConcepto.push(documentoConceptoOperacionesInafectas);
        this.notaCredito.value.documentoConcepto.push(documentoConceptoOperacionesExoneradas);
        this.notaCredito.value.documentoConcepto.push(documentoConceptoOperacionesGratuitas);
        // this.notaCredito.value.documentoConcepto.push(documentoConceptoOperacionesSubTotalVenta);
        this.notaCredito.value.documentoConcepto.push(documentoConceptoOperacionesTotalDescuentos);
      }
    );
  }

  setDocumentoParametro(tipoDeNotasDeCredito: BehaviorSubject<Parametros[]>, cmbTipoNotaCredito: string) {
    tipoDeNotasDeCredito.subscribe(
      tipoDeNotaCreditoLista => {
        const tipoNotaCredito = tipoDeNotaCreditoLista.find(item => item.codigo_dominio === cmbTipoNotaCredito);
        const documentoParametro = new DocumentoParametroNotaCredito();
        documentoParametro.idParametro = tipoNotaCredito.idparametro.toString();
        documentoParametro.descripcionParametro = tipoNotaCredito.parametro_descripcion;
        const jsonDocumentoParametro = new JsonDocumentoParametroNotaCredito();
        jsonDocumentoParametro.tipo = 3;
        jsonDocumentoParametro.valor = tipoNotaCredito.descripcion_dominio;
        jsonDocumentoParametro.auxiliarCaracter = tipoNotaCredito.codigo_dominio;
        documentoParametro.json = JSON.stringify(jsonDocumentoParametro);
        this.notaCredito.value.documentoParametro.push(documentoParametro);
      }
    );
  }

  setDocumentoReferencia() {
    const documentoReferencia = new DocumentoReferenciaNotaCredito();
    documentoReferencia.tipoDocumentoOrigen = this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO;
    documentoReferencia.tipoDocumentoOrigenDescripcion = this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO_NOMBRE;

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
    this.notaCredito.value.documentoReferencia.push(documentoReferencia);
  }

  setCabeceraPersistencia(series: BehaviorSubject<Serie[]>, cmbSerie: string, txtMotivoNotaCredito: string,
                          txtObservacionesNotaCredito: string) {
    series.subscribe(
      seriesData => {
        if (seriesData.length > 0) {
          const serie = seriesData.find(item => item.idSerie === Number(cmbSerie));
          if (serie != null) {
            this.notaCredito.value.numeroComprobante = serie.serie;
          }
        }
      }
    );

    if (this.comprobanteReferencia.value != null) {
      this.notaCredito.value.rucProveedor = this.comprobanteReferencia.value.entidadproveedora.vcDocumento;
      this.notaCredito.value.razonSocialProveedor = this.comprobanteReferencia.value.entidadproveedora.vcDenominacion;
      this.notaCredito.value.idTablaMoneda = this.comprobanteReferencia.value.vcIdtablamoneda;
      this.notaCredito.value.idRegistroMoneda = this.comprobanteReferencia.value.vcIdregistromoneda;
      this.notaCredito.value.idTablaTipoComprobante = this.comprobanteReferencia.value.vcIdtablatipocomprobante;
      this.notaCredito.value.moneda = this.comprobanteReferencia.value.chMonedacomprobantepago.toString();
      this.notaCredito.value.rucComprador = this.comprobanteReferencia.value.entidadcompradora.vcDocumento;
      this.notaCredito.value.razonSocialComprador = this.comprobanteReferencia.value.entidadcompradora.vcDenominacion;
    }

    this.notaCredito.value.idRegistroTipoComprobante = this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO;
    this.notaCredito.value.idTipoComprobante = this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO;
    this.notaCredito.value.tipoComprobante = this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO;

    this.notaCredito.value.observacionComprobante = txtObservacionesNotaCredito;
    this.notaCredito.value.tipoComprobante = this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO_NOMBRE;
    this.notaCredito.value.motivoComprobante = txtMotivoNotaCredito;

    this.notaCredito.value.usuarioCreacion = localStorage.getItem('username');
    this.notaCredito.value.usuarioModificacion = localStorage.getItem('username');

    this.notaCredito.value.idSerie = cmbSerie;
  }

  setCabeceraNormal(leyendaComprobante: LeyendaComprobante) {
    this.notaCredito.value.montoPagado = Number(leyendaComprobante.montoPagado).toFixed(2);
    this.notaCredito.value.igv = Number(leyendaComprobante.igv).toFixed(2);
    this.notaCredito.value.isc = Number(leyendaComprobante.isc).toFixed(2);
    this.notaCredito.value.totalComprobante = Number(leyendaComprobante.total).toFixed(2);
    this.notaCredito.value.descuento = Number(leyendaComprobante.descuentos).toFixed(2);
    this.notaCredito.value.subtotalComprobante = Number(leyendaComprobante.subTotal).toFixed(2);
    this.notaCredito.value.importeReferencial = Number(leyendaComprobante.importeReferencial).toFixed(2);
    this.notaCredito.value.otrosTributos = Number(leyendaComprobante.otrosTributos).toFixed(2);
    // this.notaCredito.tipoItem = ;
    this.setDocumentoConcepto(this.tiposConcepto);
  }

  setDetalleNormal(detalle: DetalleNotaCredito) {
    if (detalle !== null) {
      this.notaCredito.value.detalleEbiz = [detalle];
    } else {
      this.notaCredito.value.detalleEbiz = this.detalleModificadoLista.value;
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
    this.notaCredito.value.montoPagado = Number(montoPagado).toFixed(2);
    this.notaCredito.value.igv = Number(igv).toFixed(2);
    this.notaCredito.value.isc = Number(isc).toFixed(2);
    this.notaCredito.value.otrosTributos = Number(otrosTributos).toFixed(2);
    this.notaCredito.value.importeReferencial = Number(importeReferencial).toFixed(2);
    this.notaCredito.value.subtotalComprobante = Number(subtotalComprobante).toFixed(2);
    this.notaCredito.value.totalComprobante = Number(totalComprobante).toFixed(2);
    this.notaCredito.value.descuento = Number(descuento).toFixed(2);
    // this.notaCredito.tipoItem = ;
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
    for (const detalle of this.notaCredito.value.detalleEbiz) {
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


  setDetalleDataTable(detalleNotaCreditoLista: DetalleNotaCredito[]) {
    if (
      this.tipoNotaCredito.value === this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_POR_ITEM ||
      this.tipoNotaCredito.value === this._tiposService.TIPO_NOTA_CREDITO_DISMINUCION_EN_EL_VALOR ||
      this.tipoNotaCredito.value === this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_POR_ITEM
    ) {
      for (const index in detalleNotaCreditoLista) {
        if (this.tipoNotaCredito.value === this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_POR_ITEM) {
          detalleNotaCreditoLista[index].detalle.descuento = '0.00';
        }
        detalleNotaCreditoLista[index].posicion = index;
        detalleNotaCreditoLista[index].detalle.numeroItem = index;
        detalleNotaCreditoLista[index].detalle.precioUnitarioVenta = detalleNotaCreditoLista[index].precioTotal;
        detalleNotaCreditoLista[index].detalle.subtotalVenta = (
          Number(detalleNotaCreditoLista[index].detalle.precioUnitarioVenta) -
          Number(detalleNotaCreditoLista[index].detalle.subtotalIgv)).toFixed(2);
      }
    }
    this.notaCredito.value.detalleEbiz = detalleNotaCreditoLista;
  }

}
