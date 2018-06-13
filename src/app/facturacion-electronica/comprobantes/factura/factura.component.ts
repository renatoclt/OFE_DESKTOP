import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ElementRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableComponent } from '../../general/data-table/data-table.component';
import { RutasService } from '../../general/utils/rutas.service';
import {ActivatedRoute, Router} from '@angular/router';
import { DetalleEbiz } from '../models/detalleEbiz';
import { Accion, Icono } from '../../general/data-table/utils/accion';
import { TipoAccion } from '../../general/data-table/utils/tipo-accion';
import { ModoVistaAccion } from '../../general/data-table/utils/modo-vista-accion';
import { PersistenciaService } from '../services/persistencia.service';
import { FormControlName } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { Subscription } from 'rxjs/Subscription';
// import { Serie } from '../models/serie';
import { Serie } from '../../general/models/configuracionDocumento/serie';
import { Moneda } from '../models/moneda';
import { FacturaEbiz } from '../models/facturaEbiz';
import { TipoProducto } from '../../general/data-table/utils/tipoProducto';
import { TipoBotonAgregar } from '../../general/data-table/utils/tipoBotonAgregar';
import { TiposService } from '../../general/utils/tipos.service';
import { CabeceraFactura } from '../models/cabeceraFactura';
// import { TranslateService } from '@ngx-translate/core';
import { SeriesService } from '../../general/services/configuracionDocumento/series.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EntidadService } from 'app/facturacion-electronica/general/services/organizacion/entidad.service';
import { TablaMaestra, TABLA_MAESTRA_MONEDAS } from 'app/facturacion-electronica/general/models/documento/tablaMaestra';
import { TablaMaestraService } from 'app/facturacion-electronica/general/services/documento/tablaMaestra.service';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms/src/directives/default_value_accessor';
import { concat } from 'rxjs/operator/concat';
import { CatalogoIgvService } from 'app/facturacion-electronica/general/utils/catalogo-igv.service';
import { Observable } from 'rxjs/Observable';
import { Entidad } from '../../general/models/organizacion/entidad';
import { PersistenciaEntidadService } from 'app/facturacion-electronica/percepcion-retencion/services/persistencia.entidad.service';
import { CatalogoDocumentoIdentidadService } from 'app/facturacion-electronica/general/utils/catalogo-documento-identidad.service';
import { toString } from '@ng-bootstrap/ng-bootstrap/util/util';
import { element } from 'protractor';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DocumentoConcepto } from 'app/facturacion-electronica/comprobantes/models/documentoConcepto';
import { ConceptoDocumentoService } from 'app/facturacion-electronica/general/services/documento/conceptoDocumento.service';
import { ConceptoDocumento } from 'app/facturacion-electronica/general/models/documento/conceptoDocumento';
import { DocumentoParametro } from 'app/facturacion-electronica/comprobantes/models/documentoParametro';
import { ValidadorPersonalizado } from 'app/facturacion-electronica/general/services/utils/validadorPersonalizado';
import { TranslateService } from '@ngx-translate/core';
import { RefreshService } from 'app/facturacion-electronica/general/services/refresh.service';
import {PadreComprobanteService} from '../services/padre-comprobante.service';
import {DatePipe} from '@angular/common';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';

declare var swal: any;

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit, AfterViewInit, OnDestroy {
  public rucquery: string;
  public labelContinuar: string;
  public showDialog = false;
  public titulo = 'factura';
  public tituloFacturaAnticipo: string;
  public formGroup: FormGroup;
  public columnasTabla: ColumnaDataTable[];
  public esFacturaAnticipo: boolean;
  public tipoIgvItems: number;
  public igv: number;
  public facturaFormGroup: FormGroup;
  public datos: any;
  public entidad: Entidad[] = [];
  public entidad_uno: Entidad = new Entidad();
  // public subscriptionSerie: Subscription;
  public subscriptionMoneda: Subscription;
  public dtoOutSeries: Serie[] = [];
  public subscriptionSeries: BehaviorSubject<Serie[]>;
  private tiposConceptos: BehaviorSubject<ConceptoDocumento[]>;

  public estadoautocomplete: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public series: Serie[] = [];
  public dtoOuMonedas: Moneda[] = [];

  @ViewChild('otro') tabla: DataTableComponent<DetalleEbiz>;
  @ViewChild('inputRazonSocial') razonautocomplete: ElementRef;
  public TipoAccion = TipoAccion;

  // @ViewChild(DataTableComponent) tabla: DataTableComponent<DetalleEbiz>;
  public factura: FacturaEbiz;
  public cabeceraDatosFactura: CabeceraFactura;
  public tipo: any = ModoVistaAccion.ICONOS;
  public tipoBotonAgregar = TipoBotonAgregar.COMBO;
  public AccionesPrueba: Accion[] = [
    new Accion('editar', new Icono('edit', 'btn-info'), TipoAccion.EDITAR),
    new Accion('eliminar', new Icono('delete', 'btn-info'), TipoAccion.ELIMINAR),
    // new Accion('Descargar', new Icono('file_download', 'btn-info'), null),
  ];
  public flagVistaPrevia: boolean;
  public flagRangoFechas: boolean;
  public searchData = [];
  public org_busqueda: Entidad;
  public listaProductos: DetalleEbiz[];
  public producto: DetalleEbiz = new DetalleEbiz();

  public monedas: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  private todosTipoConceptos: BehaviorSubject<ConceptoDocumento[]>;

  constructor(
    private _persistenciaService: PersistenciaService,
    private _rutas: RutasService,
    private _route: Router,
    private _activeRoute: ActivatedRoute,
    private _tipos: TiposService,
    public seriesService: SeriesService,
    private _entidadServices: EntidadService,
    private _tablaMaestraService: TablaMaestraService,
    private _catalogoIgvService: CatalogoIgvService,
    private _entidadPersistenciaService: PersistenciaEntidadService,
    private _cataloDocumentos: CatalogoDocumentoIdentidadService,
    private _conceptoDocumentoService: ConceptoDocumentoService,
    private _translate: TranslateService,
    private _datePipe: DatePipe,
    private Refresh: RefreshService,
    private _padreComprobanteService: PadreComprobanteService) {
    this._padreComprobanteService.actualizarComprobante(this._activeRoute.snapshot.data['codigo'],
      this._activeRoute.snapshot.data['mostrarCombo'], false);
    this.igv = 0.18;
    this._translate.get('continuar').subscribe(data => this.labelContinuar = data);
    this.factura = new FacturaEbiz();
    this.cabeceraDatosFactura = new CabeceraFactura();
    this.esFacturaAnticipo = false;
    this.flagRangoFechas = false;
    this.listaProductos = [];
    this.columnasTabla = [
      new ColumnaDataTable('codigo', 'codigoItem'),
      new ColumnaDataTable('descripcion', 'descripcionItem', {'text-align': 'left'}),
      new ColumnaDataTable('cantidad', 'cantidad', {'text-align': 'right'}),
      new ColumnaDataTable('unidadMedida', 'detalle.unidadMedida'),
      new ColumnaDataTable('valorUnitario', 'precioUnitario', {'text-align': 'right'}),
      new ColumnaDataTable('igv', 'montoImpuesto', {'text-align': 'right'}),
      new ColumnaDataTable('isc', 'detalle.subtotalIsc', {'text-align': 'right'}),
      new ColumnaDataTable('descuento', 'detalle.descuento', {'text-align': 'right'}),
      new ColumnaDataTable('valorVenta', 'precioTotal', {'text-align': 'right'})
    ];
  }
  ngOnInit() {
    this.initFormGroup();
    console.log('this.Refresh.CargarPersistencia - ONINIT');
    console.log(this.Refresh.CargarPersistencia);
    if (!this.Refresh.CargarPersistencia) {
        this._persistenciaService.removePersistenciaSimple('documentosReferencia');
        this._persistenciaService.removePersistenciaSimple('checkFacturaAnticipo');
        this._persistenciaService.removePersistenciaSimple('listaProductos');
        this._persistenciaService.removePersistenciaSimple('cabeceraFactura');
        this._persistenciaService.removePersistencias();

        this._persistenciaService.removePersistenciaSimple('factura');
        this._persistenciaService.removePersistenciaSimple('listaProductos')
        this._persistenciaService.removePersistenciaSimple('listaConsultaDocumentosRelacionados');
        this._persistenciaService.removePersistenciaSimple('UUIDConsultaComprobante');
        this._persistenciaService.removePersistenciaSimple('tipoComprobanteCodigo');
        this._persistenciaService.removePersistenciaSimple('entidad');
        this._persistenciaService.removePersistenciaSimple('checkFacturaAnticipo');
        this._persistenciaService.removePersistenciaSimple('documentosReferenciaTemporal');
        this._persistenciaService.removePersistenciaSimple('documentosReferencia');
    }
    this.cargarServicios();
    this.cargarFactura();
    this.setFlagVistaPrevia();
    // this.seriesService.obtenerTodo().subscribe((val) => {
    //   this.series = val;
    // });
    this.seriesService.filtroSeries( localStorage.getItem('id_entidad'),
      this._tipos.TIPO_DOCUMENTO_FACTURA, this._tipos.TIPO_SERIE_ONLINE.toString())
    .subscribe(
      valor => {
        this.series = valor;
      });
    this.listarrazonsocial();
    this.esFacturaAnticipo = this._persistenciaService.getEstadoFacturaAnticipo();
    if (this.esFacturaAnticipo === true) {
      this.facturaFormGroup.controls['txtDetraccion'].disable();
      this.facturaFormGroup.controls['txtDetraccion'].setValue('0.00');
    }
  }
  ngAfterViewInit() {
    this.fillCabecera();
  }
  ngOnDestroy() {
    this.Refresh.CargarPersistencia =  false;
    // this.subscriptionSerie.unsubscribe();
  }
  public cargarFactura() {
    this.listaProductos = this._persistenciaService.getListaProductos();
    this.factura.documentoReferencia = this._persistenciaService.getDocumentosReferencia();
    this.calcularMontos();
  }
  public calcularMontos() {
    this.listaProductos = this._persistenciaService.getListaProductos();
    let tipoIgvListaProductos: number;
    let montoTipoOperacion: number;
    const detraccion = this.facturaFormGroup.controls['txtDetraccion'].value;
    this.factura.detraccion = Number(detraccion);
    this.factura.totalDescuentos = 0;
    this.factura.sumaAnticipos = 0;
    this.factura.totalAnticipos = 0;
    this.factura.sumaIgv = 0;
    this.factura.sumaIsc = 0;
    this.factura.subTotal = 0;
    this.factura.importeTotal = 0;
    this.factura.sumaOtrosCargos = 0;
    this.factura.sumaOtrosTributos = 0;
    this.factura.sumaOtrosTributos = Number( this.facturaFormGroup.controls['txtSumatoriaOtrosTributos'].value);
    this.factura.sumaOtrosCargos = Number( this.facturaFormGroup.controls['txtSumatoriaOtrosCargos'].value);
    this.factura.importeReferencial = '0';
    this.factura.montoGravadas = 0;
    this.factura.montoExoaneradas = 0;
    this.factura.montoInafectas = 0;
    this.factura.subTotalComprobanteConcepto = 0;

    montoTipoOperacion = 0;
    if (this.listaProductos.length > 0) {
      this.setTipoIgv(Number(this.listaProductos[0].detalle.codigoTipoIgv));
      for (let a = 0; a < this.listaProductos.length; a++) {
        montoTipoOperacion = montoTipoOperacion +
                            (
                              (Number(this.listaProductos[a].cantidad) * Number(this.listaProductos[a].precioUnitario)) -
                              Number(this.listaProductos[a].detalle.descuento)
                            );
        this.factura.totalDescuentos = this.factura.totalDescuentos + Number(this.listaProductos[a].detalle.descuento);
        this.factura.sumaIsc = this.factura.sumaIsc + Number(this.listaProductos[a].detalle.subtotalIsc);
        this.factura.importeReferencial = (
                                            Number(this.factura.importeReferencial) +
                                            (Number(this.listaProductos[a].cantidad) * Number(this.listaProductos[a].precioUnitario))
                                          ).toString();
        this.factura.subTotalComprobanteConcepto = this.factura.subTotalComprobanteConcepto +
                                                    Number(this.listaProductos[a].cantidad) * Number(this.listaProductos[a].precioUnitario);
      }
      this.factura.subTotal = (montoTipoOperacion + this.factura.sumaIsc);
      if (this.tipoIgvItems === this._catalogoIgvService.IGV_GRAVADO_RANGO) {
        this.factura.sumaIgv = (this.factura.subTotal * this._catalogoIgvService.IGV_VALOR);
      }
    } else {
      this.tipoIgvItems = 0;
    }
    for (let a = 0; a < this.factura.documentoReferencia.length; a++) {
      this.factura.totalAnticipos = this.factura.totalAnticipos + Number(this.factura.documentoReferencia[a].anticipo);
    }

    this.factura.importeTotal = this.factura.subTotal + this.factura.sumaIgv - this.factura.totalAnticipos +
    this.factura.sumaOtrosCargos + this.factura.sumaOtrosTributos;
    //  - Number(detraccion);
    this.factura.totalComprobante = (this.factura.subTotal + this.factura.sumaIgv - this.factura.totalAnticipos).toString();

    this.facturaFormGroup.controls['txtOperacionesGrabadas'].setValue('0.00');
    this.facturaFormGroup.controls['txtOperacionesExoneradas'].setValue('0.00');
    this.facturaFormGroup.controls['txtOperacionesInafectas'].setValue('0.00');
    this.facturaFormGroup.controls['txtTotalDescuentos'].setValue(this.formatearNumeroADecimales(this.factura.totalDescuentos));
    this.facturaFormGroup.controls['txtTotalAnticipos'].setValue(this.formatearNumeroADecimales(this.factura.totalAnticipos));
    this.facturaFormGroup.controls['txtSumatoriaIsc'].setValue(this.formatearNumeroADecimales(this.factura.sumaIsc));
    this.facturaFormGroup.controls['txtSumatoriaIgv'].setValue(this.formatearNumeroADecimales(this.factura.sumaIgv));
    this.facturaFormGroup.controls['txtSubTotal'].setValue(this.formatearNumeroADecimales(this.factura.subTotalComprobanteConcepto));
    this.facturaFormGroup.controls['txtImporteTotal'].setValue(this.formatearNumeroADecimales(this.factura.importeTotal));

    switch (this.tipoIgvItems) {
      case this._catalogoIgvService.IGV_GRAVADO_RANGO:
        this.factura.montoGravadas = montoTipoOperacion;
        this.facturaFormGroup.controls['txtOperacionesGrabadas'].setValue(this.formatearNumeroADecimales(this.factura.montoGravadas));
        break;
      case this._catalogoIgvService.IGV_EXONERADO_RANGO:
      this.factura.montoExoaneradas = montoTipoOperacion;
        this.facturaFormGroup.controls['txtOperacionesExoneradas'].setValue(this.formatearNumeroADecimales(this.factura.montoExoaneradas));
        break;
      case this._catalogoIgvService.IGV_INAFECTO_RANGO:
      this.factura.montoInafectas = montoTipoOperacion;
        this.facturaFormGroup.controls['txtOperacionesInafectas'].setValue(this.formatearNumeroADecimales(this.factura.montoInafectas));
        break;
      default:
        break;
    }
  }
  public sumarOtrosCargos() {
    this.factura.importeTotal = Number( this.facturaFormGroup.controls['txtImporteTotal'].value);
    if (this.listaProductos.length === 0) {
      this.factura.importeTotal = 0;
    }
    this.factura.sumaOtrosTributos = Number( this.facturaFormGroup.controls['txtSumatoriaOtrosTributos'].value);
    this.factura.sumaOtrosCargos = Number( this.facturaFormGroup.controls['txtSumatoriaOtrosCargos'].value);
    this.factura.importeTotal = this.factura.importeTotal + this.factura.sumaOtrosTributos + this.factura.sumaOtrosCargos;
    this.facturaFormGroup.controls['txtImporteTotal'].setValue(this.formatearNumeroADecimales(this.factura.importeTotal));
  }
  public formatearNumeroADecimales(valor: number, numeroDecimales = 2): string {
    return valor.toFixed(numeroDecimales);
  }
  public setTipoIgv(codigoIgv: number) {
    if (codigoIgv > (this._catalogoIgvService.IGV_INAFECTO_RANGO - 1)) {
      if (codigoIgv > (this._catalogoIgvService.IGV_EXPORTACION_RANGO - 1)) {
        this.tipoIgvItems = this._catalogoIgvService.IGV_EXPORTACION_RANGO;
      } else {
        this.tipoIgvItems = this._catalogoIgvService.IGV_INAFECTO_RANGO;
      }
    } else {
      if (codigoIgv > (this._catalogoIgvService.IGV_EXONERADO_RANGO - 1)) {
        this.tipoIgvItems = this._catalogoIgvService.IGV_EXONERADO_RANGO;
      } else {
        this.tipoIgvItems = this._catalogoIgvService.IGV_GRAVADO_RANGO;
      }
    }
  }
  public fillCabecera() {
    this.cabeceraDatosFactura = this._persistenciaService.getCabeceraFactura();
    if (this.cabeceraDatosFactura && this.cabeceraDatosFactura.ruc !== '') {
      this.estadoautocomplete.next(true);
      this.busqueda();
      if (this.cabeceraDatosFactura.direccionFiscal !== '') {this.eliminarEstiloInput('txtRuc', 'is-empty'); }
      if (this.cabeceraDatosFactura.correo !== '') {this.eliminarEstiloInput('txtCorreo', 'is-empty'); }
      if (this.cabeceraDatosFactura.sumaOtrosCargos !== '') {this.eliminarEstiloInput('txtSumatoriaOtrosCargos', 'is-empty'); }
      if (this.cabeceraDatosFactura.sumaOtrosTributos !== '') {this.eliminarEstiloInput('txtSumatoriaOtrosTributos', 'is-empty'); }
      if (this.cabeceraDatosFactura.ruc !== '') {this.eliminarEstiloInput('txtRuc', 'is-empty'); }
      if (this.cabeceraDatosFactura.serie !== '') {this.eliminarEstiloInput('cmbSerie', 'is-empty'); }
      if (this.cabeceraDatosFactura.fechaEmision !== '') {this.eliminarEstiloInput('txtFechaEmision', 'is-empty'); }
      if (this.cabeceraDatosFactura.fechaVencimiento !== '') {this.eliminarEstiloInput('txtFechaVencimiento', 'is-empty'); }
      if (this.cabeceraDatosFactura.tipoMoneda !== '') {this.eliminarEstiloInput('cmbMoneda', 'is-empty'); }
      if (this.cabeceraDatosFactura.observaciones !== '') {this.eliminarEstiloInput('txtObservaciones', 'is-empty'); }
      //  if (this.cabeceraDatosFactura.razonsSocial !== '') {this.eliminarEstiloInput('txtRazonSocial', 'is-empty'); }
      this.facturaFormGroup.controls['txtDireccionFiscal'].setValue(this.cabeceraDatosFactura.direccionFiscal);
      this.facturaFormGroup.controls['txtCorreo'].setValue(this.cabeceraDatosFactura.correo);
      this.facturaFormGroup.controls['txtSumatoriaOtrosCargos'].setValue(this.cabeceraDatosFactura.sumaOtrosCargos);
      this.facturaFormGroup.controls['txtSumatoriaOtrosTributos'].setValue(this.cabeceraDatosFactura.sumaOtrosTributos);
      this.facturaFormGroup.controls['txtRuc'].setValue(this.cabeceraDatosFactura.ruc);
      this.facturaFormGroup.controls['txtDetraccion'].setValue(this.cabeceraDatosFactura.detraccion);
      this.facturaFormGroup.controls['cmbSerie'].setValue(this.cabeceraDatosFactura.serie);
      this.facturaFormGroup.controls['txtFechaEmision'].setValue(this.cabeceraDatosFactura.fechaEmision);
      this.facturaFormGroup.controls['txtFechaVencimiento'].setValue(this.cabeceraDatosFactura.fechaVencimiento);
      this.facturaFormGroup.controls['cmbMoneda'].setValue(this.cabeceraDatosFactura.tipoMoneda);
      this.facturaFormGroup.controls['txtObservaciones'].setValue(this.cabeceraDatosFactura.observaciones);
      this.facturaFormGroup.controls['txtRazonSocial'].setValue(this.cabeceraDatosFactura.razonsSocial);
    } else {
      const fecha = new Date();
      const fechaActual = this.setMes( fecha.getDate()) + '/' + this.setMes(fecha.getMonth() + 1) + '/' + fecha.getFullYear().toString();
      this.facturaFormGroup.controls['txtFechaEmision'].setValue(fechaActual);
      this.facturaFormGroup.controls['txtFechaVencimiento'].setValue(fechaActual);
    }
    //  if (this.facturaFormGroup.controls['txtRazonSocial'].value !== '') {this.eliminarEstiloInput('txtRazonSocial', 'is-empty'); }
  }
  /**
   * Establece los valores generales de la cabecera de la factura, para su envio a API
   */
  public setFacturaCabeceraDetalle() {
    this.cabeceraDatosFactura = new CabeceraFactura();
    //  this._persistenciaService.getCabeceraFactura();
    this.cabeceraDatosFactura.ruc = this.facturaFormGroup.controls['txtRuc'].value;
    this.cabeceraDatosFactura.razonsSocial = this.facturaFormGroup.controls['txtRazonSocial'].value;
    this.cabeceraDatosFactura.detraccion = this.facturaFormGroup.controls['txtDetraccion'].value;
    this.cabeceraDatosFactura.serie = this.facturaFormGroup.controls['cmbSerie'].value;
    this.cabeceraDatosFactura.fechaEmision = this.facturaFormGroup.controls['txtFechaEmision'].value;
    this.cabeceraDatosFactura.fechaVencimiento = this.facturaFormGroup.controls['txtFechaVencimiento'].value;
    this.cabeceraDatosFactura.tipoMoneda = this.facturaFormGroup.controls['cmbMoneda'].value;
    this.cabeceraDatosFactura.sumaOtrosCargos = this.facturaFormGroup.controls['txtSumatoriaOtrosCargos'].value;
    this.cabeceraDatosFactura.sumaOtrosTributos = this.facturaFormGroup.controls['txtSumatoriaOtrosTributos'].value;
    this.cabeceraDatosFactura.observaciones = this.facturaFormGroup.controls['txtObservaciones'].value;
    this.cabeceraDatosFactura.direccionFiscal = this.facturaFormGroup.controls['txtDireccionFiscal'].value;
    this.cabeceraDatosFactura.correo = this.facturaFormGroup.controls['txtCorreo'].value;
    this._persistenciaService.setCabeceraFactura(this.cabeceraDatosFactura);
  }
  public setFlagVistaPrevia() {
    this.listaProductos = this._persistenciaService.getListaProductos();
    if (this.listaProductos.length === 0) {
      this.flagVistaPrevia = false;
    } else {
      this.flagVistaPrevia = true;
    }
  }
  public cargarServicios() {
    this.monedas = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_MONEDAS);
    this.todosTipoConceptos = this._conceptoDocumentoService.obtenerTodosConceptosDocumentos();
    //  this.facturaFormGroup.controls['cmbMoneda'].setValue(this._tipos.TIPO_MONEDA_SOL);
    //  this.eliminarEstiloInput('cmbMoneda', 'is-empty');
  }
  public eliminarEstiloInput(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().removeClass(estilo);
    }, 200);
  }
  iniciarData(event) {
    this.listaProductos = this._persistenciaService.getListaProductos();
    this.tabla.insertarData(this.listaProductos);
  }
  public irDocumentoRelacionado() {
    this.setFacturaCabeceraDetalle();
    this._persistenciaService.setFactura(this.factura);
    const listaTmpDocumentosRelacionados = this._persistenciaService.getDocumentosReferencia();
    this._persistenciaService.setPersistenciaSimple('documentosReferenciaTemporal', listaTmpDocumentosRelacionados);
    this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_FACTURA_DOCUMENTO_RELACIONADO);
  }
  public irAgregarServicio() {
    this.setFacturaCabeceraDetalle();
    this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_FACTURA_SERVICIO_AGREGAR);
  }
  public irAgregarBien() {
    this.setFacturaCabeceraDetalle();
    this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_FACTURA_BIEN_AGREGAR);
  }
  public irVistaPrevia() {
    this.validacionComprobanteMontos();
  }
  /**
   * Método que valida que los montos ingresados sean congruentes
   */
  public validacionComprobanteMontos() {
    if (this.factura.importeTotal < 0) {
      swal({
        title: 'Advertencia',
        text: 'El monto por anticipos no puede ser mayor al monto total del comprobante.',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#2399e5',
        cancelButtonColor: '#2399e5',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result) {
          this.irDocumentoRelacionado();
          this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_FACTURA_DOCUMENTO_RELACIONADO);
        }
      });
    } else {
      this.setFacturaCabeceraDetalle();
      this.cargarDataVistaPrevia();
      this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_FACTURA_VISTA_PREVIA);
    }
  }
  /**
   * Establece los valores del JSON de Factura, para el servicio de API
   */
  public cargarDataVistaPrevia() {
    //  CABECERA FACTURA
    this.factura.idSerie = this.facturaFormGroup.controls['cmbSerie'].value;
    const serieFormato = this.series.find(
      element => this.factura.idSerie === (element.idSerie).toString()
    );
    this.factura.serieNombre = serieFormato.serie;
    this.factura.numeroComprobante = this.factura.serieNombre;

    this.factura.rucCompradorBase = this.facturaFormGroup.controls['txtRuc'].value;
    this.factura.rucProveedorBase = localStorage.getItem('org_ruc');

    this.factura.rucProveedor = this.factura.rucProveedorBase;
    this.factura.rucComprador = this.factura.rucCompradorBase;
    this.factura.usuarioCreacion = JSON.parse( localStorage.getItem('usuarioActual') ).nombreusuario;
    this.factura.usuarioModificacion = 'SYSTEM';

    this.factura.idTablaTipoComprobante = this._tipos.ID_TABLA_TIPO_COMPROBANTE;
    if (this.esFacturaAnticipo) {
      this.factura.idTipoComprobante = this._tipos.TIPO_DOCUMENTO_FACTURA;
    } else {
      this.factura.idTipoComprobante = this._tipos.TIPO_DOCUMENTO_FACTURA;
    }
    this.factura.idRegistroTipoComprobante = this._tipos.TIPO_DOCUMENTO_FACTURA;
    this.factura.razonSocialProveedor = localStorage.getItem('org_nombre');
    this.factura.razonSocialComprador = this.facturaFormGroup.controls['txtRazonSocial'].value;
    this.factura.observacionComprobante = this.facturaFormGroup.controls['txtObservaciones'].value;
    this.factura.tipoComprobante = this._tipos.TIPO_DOCUMENTO_FACTURA_NOMBRE;
    this.factura.montoPagado = (this.factura.importeTotal).toString();
    this.factura.igv = (this.factura.sumaIgv).toString();
    this.factura.isc = (this.factura.sumaIsc).toString();
    this.factura.otrosTributos = (this.factura.sumaOtrosTributos).toString();
    this.factura.descuento = (this.factura.totalDescuentos).toString();
    this.factura.subtotalComprobante = (
                                        Number(this.factura.importeReferencial) - Number(this.factura.totalDescuentos)
                                      ).toString();
    this.factura.totalComprobante = this.factura.totalComprobante;
    this.factura.tipoItem = (this.listaProductos[0].tipoProducto).toString();

    this.monedas.subscribe(
      data => {
        const indice = data.findIndex(
          element => element.codigo == this.facturaFormGroup.get('cmbMoneda').value
        );
        this.factura.moneda = data[indice].descripcionCorta;
        this.factura.idTablaMoneda = (data[indice].tabla).toString();
        this.factura.idRegistroMoneda = Number(data[indice].codigo).toString();
      }
    );
    let fechaTimestamp = this.facturaFormGroup.controls['txtFechaEmision'].value;
    let fechastr = fechaTimestamp.toString().split('/');
    let dia = Number(fechastr[0]);
    let mes = Number( fechastr[1] ) - 1;
    let anio = Number(fechastr[2]);
    let fecha = anio + '-' + mes + '-' + dia;

    this.factura.fechaEmision = Number( new Date(anio, mes, dia) );
    fechaTimestamp = this.facturaFormGroup.controls['txtFechaVencimiento'].value;
    fechastr = fechaTimestamp.toString().split('/');
    dia = Number(fechastr[0]);
    mes = Number( fechastr[1] ) - 1;
    anio = Number(fechastr[2]);
    fecha = anio + '-' + mes + '-' + dia;
    this.factura.fechaVencimiento = Number( new Date(anio, mes, dia) );
    this.factura.direccionProveedor = localStorage.getItem('org_direccion');
    this.factura.porcentajeDetracction = this.facturaFormGroup.controls['txtDetraccion'].value;
    this.factura.detraccion = this.facturaFormGroup.controls['txtDetraccion'].value;
    this.factura.direccionComprador = this.facturaFormGroup.controls['txtDireccionFiscal'].value;
    this.factura.direccionProveedor = localStorage.getItem('org_direccion');
    this.factura.porcentajeImpuesto = this.formatearNumeroADecimales(this.igv * 100);
    // this.factura.usuarioCreacion = this.entidad_uno.usuarioCreacion;
    // this.factura.usuarioModificacion = this.entidad_uno.usuarioCreacion;
    //  DETALLE EBIZ
    this.factura.detalleEbiz = this._persistenciaService.getListaProductos();
    //  DOCUMENTO ENTIDAD
    //  Emisor
    this.org_busqueda = this._entidadPersistenciaService.getEntidad();
    this.factura.documentoEntidad[0].idTipoEntidad = this._tipos.TIPO_ENTIDAD_EMISOR;
    this.factura.documentoEntidad[0].descripcionTipoEntidad = this._tipos.DESCRIPCION_TIPO_ENTIDAD_EMISOR;
    this.factura.documentoEntidad[0].idEntidad = localStorage.getItem('id_entidad');
    this.factura.documentoEntidad[0].tipoDocumento = '6'; // this._cataloDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC;
    this.factura.documentoEntidad[0].documento = localStorage.getItem('org_ruc');
    this.factura.documentoEntidad[0].denominacion = localStorage.getItem('org_nombre');
    this.factura.documentoEntidad[0].nombreComercial = localStorage.getItem('org_nombre');
    this.factura.documentoEntidad[0].direccionFiscal = localStorage.getItem('org_direccion');
    this.factura.documentoEntidad[0].ubigeo = '040101';
    this.factura.documentoEntidad[0].email = localStorage.getItem('org_email');
    this.factura.documentoEntidad[0].correo = localStorage.getItem('org_email');
    this.factura.documentoEntidad[0].notifica = this._tipos.NOTIFICACION_DOCUMENTO_ENTIDAD;
    //  Receptor
    this.factura.documentoEntidad[1].idTipoEntidad = this._tipos.TIPO_ENTIDAD_RECEPTOR;
    this.factura.documentoEntidad[1].descripcionTipoEntidad = this._tipos.DESCRIPCION_TIPO_ENTIDAD_RECEPTOR;
    this.factura.documentoEntidad[1].idEntidad = this.org_busqueda.id.toString();
    this.factura.documentoEntidad[1].tipoDocumento = '6'; // this._cataloDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC;
    this.factura.documentoEntidad[1].documento = this.facturaFormGroup.controls['txtRuc'].value;
    this.factura.documentoEntidad[1].denominacion = this.facturaFormGroup.controls['txtRazonSocial'].value;
    this.factura.documentoEntidad[1].nombreComercial = this.org_busqueda.direccionFiscal;
    this.factura.documentoEntidad[1].direccionFiscal = this.facturaFormGroup.controls['txtDireccionFiscal'].value;
    this.factura.documentoEntidad[1].ubigeo = this.org_busqueda.ubigeo;
    this.factura.documentoEntidad[1].email = this.facturaFormGroup.controls['txtCorreo'].value;
    this.factura.documentoEntidad[1].correo = this.facturaFormGroup.controls['txtCorreo'].value;
    this.factura.documentoEntidad[1].notifica = this._tipos.NOTIFICACION_DOCUMENTO_ENTIDAD;
    //  DOCUMENTO CONCEPTO
    const codigosConceptosAUtilizar = [
      this._tipos.CONCEPTO_OPERACION_GRAVADA_CODIGO,
      this._tipos.CONCEPTO_OPERACION_INAFECTAS_CODIGO,
      this._tipos.CONCEPTO_OPERACION_EXONERADO_CODIGO,
      this._tipos.CONCEPTO_OPERACION_GRATUITA_CODIGO,
      this._tipos.CONCEPTO_OPERACION_SUB_TOTAL_VENTA_CODIGO,
      this._tipos.CONCEPTO_OPERACION_TOTAL_DESCUENTOS_CODIGO,
      this._tipos.CONCEPTO_OPERACION_DETRACCIONES_CODIGO,
      this._tipos.CONCEPTO_OPERACION_OTROS_CARGOS_CODIGO,
    ];
    this.tiposConceptos = this._conceptoDocumentoService.obtenerPorCodigos(this.todosTipoConceptos, codigosConceptosAUtilizar);
    this.setDocumentoConcepto();

    if (this.esFacturaAnticipo) {
      this.factura.documentoParametro = [];
      const documentoParametro: DocumentoParametro = new DocumentoParametro();
      documentoParametro.descripcionParametro = this._tipos.FACTURA_ANTICIPO_DESCRIPCION_PARAMETRO;
      documentoParametro.idParametro = this._tipos.FACTURA_ANTICIPO_ID_PARAMETRO;
      documentoParametro.jsonn.tipo = this._tipos.FACTURA_ANTICIPO_TIPO_PARAMETRO;
      documentoParametro.jsonn.valor = this._tipos.FACTURA_ANTICIPO_TIPO_PARAMETRO_VALOR;
      documentoParametro.jsonn.auxiliarEntero = this._tipos.FACTURA_ANTICIPO_ID_DOMINIO;
      documentoParametro.jsonn.auxiliarCaracter = this._tipos.FACTURA_ANTICIPO_CODIGO_SUNAT;
      documentoParametro.jsonn.auxiliarFecha = null;
      documentoParametro.jsonn.auxiliarImporte = this.factura.importeTotal;

      this.factura.documentoParametro.push(documentoParametro);
      this.factura.documentoParametro[0].json = JSON.stringify(this.factura.documentoParametro[0].jsonn);
      // this.factura.documentoParametro[0].jsonn.auxiliarImporte = this.factura.importeTotal;
      // this.factura.documentoParametro[0].json = JSON.stringify(this.factura.documentoParametro[0].jsonn);
    } else {
      this.factura.documentoParametro = [];
    }
    this.calcularMontos();
    this._persistenciaService.setFactura(this.factura);
  }
  public setDocumentoConcepto() {
    let documentoConcepto = new DocumentoConcepto();

    this.tiposConceptos.subscribe(
      (conceptos) => {
        for (const concepto of conceptos) {
          switch (concepto.codigo) {
            case this._tipos.CONCEPTO_OPERACION_GRAVADA_CODIGO:
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.factura.montoGravadas).toString();
              this.factura.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesGravadas.importe = ;
              break;
            case this._tipos.CONCEPTO_OPERACION_INAFECTAS_CODIGO:
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.factura.montoInafectas).toString();
              this.factura.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesInafectas.importe = ;
              break;
            case this._tipos.CONCEPTO_OPERACION_EXONERADO_CODIGO:
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.factura.montoExoaneradas).toString();
              this.factura.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesExoneradas.importe = ;
              break;
            case this._tipos.CONCEPTO_OPERACION_GRATUITA_CODIGO:
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = '0.00';
              this.factura.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesGratuitas.importe = ;
              break;
            case this._tipos.CONCEPTO_OPERACION_SUB_TOTAL_VENTA_CODIGO:
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.factura.subTotalComprobanteConcepto).toString();
              this.factura.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesSubTotalVenta.importe = ;
              break;
            case this._tipos.CONCEPTO_OPERACION_TOTAL_DESCUENTOS_CODIGO:
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.factura.totalDescuentos).toString();
              this.factura.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesTotalDescuentos.importe = ;
              break;
            case this._tipos.CONCEPTO_OPERACION_DETRACCIONES_CODIGO:
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.factura.detraccion).toString();
              this.factura.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesTotalDescuentos.importe = ;
              break;
            case this._tipos.CONCEPTO_OPERACION_OTROS_CARGOS_CODIGO:
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.factura.sumaOtrosCargos).toString();
              this.factura.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesTotalDescuentos.importe = ;
              break;
          }
        }
      }
    );
  }
  public validacionesFacturaAnticipo(value: boolean) {
    //  Factura Anticipo => true
    if (value === true) {
      //  Validación si existen items ingresados de forma normal, una factura de anticipo no debe tener productos ingresados
      if (this._persistenciaService.getListaProductos().length === 0) {
        this.tituloFacturaAnticipo = 'Factura de Anticipo';
        this.invocarModalMontoacturaAnticipo();
        this.esFacturaAnticipo = value;
        this._persistenciaService.setEstadoFacturaAnticipo(true);
      } else {
        const that = this;
        this.esFacturaAnticipo = false;
        this.facturaFormGroup.controls['txtDetraccion'].enable();
        $('#chkFacturaAnticipo').prop('checked', false);
        swal(
          {
            title: '¿Está seguro?',
            html:
              '<div class="text-center"> El comprobante ya tiene ítems ingresados, desea eliminarlos. </div>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#f44336',
            confirmButtonText: 'SÍ',
            cancelButtonText: 'NO'
          }
        )
          .catch((result) => {
            that._persistenciaService.setEstadoFacturaAnticipo(false);
          }
          )
          .then((result) => {
            //  Eliminar productos ingresados, para ingresar el monto de la factura de anticipo
            if (result) {
              that._persistenciaService.eliminarListaItemsFactura();
              that.listaProductos = that._persistenciaService.getListaProductos();
              that.tabla.insertarData(that.listaProductos);
              //  this.recargarTabla();
              this.tituloFacturaAnticipo = 'Item(s) eliminado(s) correctamente.<br>Ingrese el monto de la factura de anticipo';
              this.invocarModalMontoacturaAnticipo();
            } else {
              this.facturaFormGroup.controls['txtDetraccion'].enable();
              that._persistenciaService.setEstadoFacturaAnticipo(false);
            }
          }
          );
      }
      //  Factura Anticipo => false
    } else {
      const that = this;
      if (this.esFacturaAnticipo) {
        swal(
          {
            title: '¿Está seguro?',
            html:
              '<div class="text-center"> ¡Se eliminarán los datos guardados! </div>',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#f44336',
            confirmButtonText: 'SÍ',
            cancelButtonText: 'NO'
          }
        )
          .catch((result) => {
            //  that._persistenciaService.setEstadoFacturaAnticipo(false);
          }
          )
          .then((result) => {
            if (result) {
              that._persistenciaService.eliminarListaItemsFactura();
              that._persistenciaService.setEstadoFacturaAnticipo(false);
              that.esFacturaAnticipo = false;
              that.facturaFormGroup.controls['txtDetraccion'].enable();
              that.listaProductos = that._persistenciaService.getListaProductos();
              that.tabla.insertarData(that.listaProductos);
              this.factura.documentoParametro = [];
              //  this.factura
              that.calcularMontos();
            } else {
              //  that._persistenciaService.setEstadoFacturaAnticipo(false);
              that.esFacturaAnticipo = true;
              $('#chkFacturaAnticipo').prop('checked', true);
            }
          }
          );
      }
    }
    this.listaProductos = this._persistenciaService.getListaProductos();
    this.tabla.insertarData(this.listaProductos);
    //  this.recargarTabla();
  }
  public seleccionFacturaAnticipo(value: boolean) {
    let mensajeDocumentosRelacionadosExistentes: string;
    let tituloAdvertencia: string;
    let eliminarLabel: string;
    let cancelarLabel: string;
    this._translate.get('mensajeComprobanteConDocumentosRelacionados').subscribe(data => mensajeDocumentosRelacionadosExistentes = data);
    this._translate.get('mensajeNotificacionTituloAdvertencia').subscribe(data => tituloAdvertencia = data);
    this._translate.get('eliminar').subscribe(data => eliminarLabel = data);
    this._translate.get('cancelar').subscribe(data => cancelarLabel = data);
    const that = this;
    $('#chkFacturaAnticipo').prop('checked', !value);
    if (this.factura.documentoReferencia.length > 0) {
      swal(
        {
          title: 'Advertencia',
          text: mensajeDocumentosRelacionadosExistentes,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#2399e5',
          cancelButtonColor: '#2399e5',
          confirmButtonText: eliminarLabel,
          cancelButtonText: cancelarLabel
        }
      )
        .catch((result) => {
        }
        )
        .then((result) => {
          //  Eliminar productos ingresados, para ingresar el monto de la factura de anticipo
          if (result === true) {
            swal({
              title: 'Advertencia',
              text: 'Documentos Relacionados eliminados exitosamente.',
              confirmButtonText: that.labelContinuar
            });
            that._persistenciaService.removeDocumentosReferencia();
            this.factura.documentoReferencia = [];
            this.validacionesFacturaAnticipo(value);
          } else {
            $('#chkFacturaAnticipo').prop('checked', false);
          }
        }
        );
    } else {
      this.validacionesFacturaAnticipo(value);
    }
  }
  /**
   * Muestra modal para ingresar el monto de una Factura de Anticipo
   */
  public invocarModalMontoacturaAnticipo() {
    let formatoMonedaLabel: string;
    this._translate.get('formatoMontoSwalLabel').subscribe(data => formatoMonedaLabel = data);
    const that = this;
    swal({
      title: this.tituloFacturaAnticipo,
      //  input: 'text',
      html: '<div class="form-group label-floating" xmlns="http://www.w3.org/1999/html">' +
            '<label class="control-label">Monto Factura Anticipo (sin IGV)<span class="star">*</span> </label>' +
            '<input type="text" id="montoAnticipo" type="text" class="form-control"/> ' +
            '<label>' + formatoMonedaLabel + '</label>' +
      '</div>',
      allowOutsideClick: false,

      preConfirm: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let bandera = 0;
            let banderaCero = false;
            // const regExp = /([0-9,]{1,9})|([.]([0-9]{2}))/g;
            const regExp = /[0-9]+(\.[0-9][0-9]?)?/g;
            let montoAnticipo = $('#montoAnticipo').val();
            montoAnticipo = montoAnticipo.split(',');
            const montoAnticipoInvalidos = montoAnticipo.filter(function(monto){
              const validacion = regExp.test(monto);
              if (!validacion){
                bandera = 1;
                return true;
              } else {
                const numero = Number(monto);
                if (isNaN(numero)) {
                  bandera = 1;
                  return false;
                } else {
                  if (numero <= 0 ) {
                    bandera = 2;
                    return true;
                  }
                  return false;
                }

              }
            });
            if (bandera){
              switch(bandera) {
                case 1: swal.showValidationError(), reject(new Error('Formato Inválido'));
                        break;
                case 2: swal.showValidationError(), reject(new Error('Monto Inválido'));
                        break;
              }
            } else {
              resolve(montoAnticipo);
            }
          }, 500);
        });
      },
      showCancelButton: true,
      confirmButtonColor: '#2399e5',
      cancelButtonColor: '#2399e5',
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Regresar',
    })
      .catch((result) => console.log('CANCEL')
      )
      .then((result) => {
        if(result) {
            this.setFacturaAnticipo(Number(that.formatearNumeroADecimales(Number(result)) ));
            swal({
              type: 'success',
              title: 'Acción Exitosa',
              confirmButtonText: that.labelContinuar,
              confirmButtonColor: '#4caf50'
            });
            that.listaProductos = that._persistenciaService.getListaProductos();
            that.tabla.insertarData(that.listaProductos);
            this.esFacturaAnticipo = true;
            $('#chkFacturaAnticipo').prop('checked', true);
            this._persistenciaService.setEstadoFacturaAnticipo(true);
            this.facturaFormGroup.controls['txtDetraccion'].disable();
            this.facturaFormGroup.controls['txtDetraccion'].setValue('0.00');
        } else {
          this.esFacturaAnticipo = false;
          $('#chkFacturaAnticipo').prop('checked', false);
          this._persistenciaService.setEstadoFacturaAnticipo(false);
          this.facturaFormGroup.controls['txtDetraccion'].enable();
        }
      });
  }
  public setFacturaAnticipo(montoFacturaAnticipo: number) {
    let documentoParametro: DocumentoParametro = new DocumentoParametro();
    //  this.recargarTabla();
    this.producto.descripcionItem = 'Factura de Anticipo';
    this.producto.idRegistroUnidad = '0000001';
    this.producto.idTablaUnidad = '10000';
    this.producto.codigoUnidadMedida = 'NIU';
    this.producto.posicion = '1';
    //  Codigo Defecto Item Factura Anticipo => FA00
    this.producto.codigoItem = this._tipos.FACTURA_ANTICIPO_VALOR_CODIGO_ITEM;
    this.producto.precioUnitario = this.formatearNumeroADecimales(montoFacturaAnticipo);
    this.producto.precioTotal = this.formatearNumeroADecimales(Number (((Number(this.producto.precioUnitario) * this.igv) +
                              Number(this.producto.precioUnitario)).toString()));
    this.producto.cantidad = '1.00';
    this.producto.montoImpuesto = this.formatearNumeroADecimales((Number(this.producto.precioUnitario) * this.igv));
    // SUB DETALLE
    this.producto.detalle.idTipoIgv = this._tipos.FACTURA_ANTICIPO_ID_TIPO_IGV;
    this.producto.detalle.codigoTipoIgv = this._tipos.FACTURA_ANTICIPO_CODIGO_TIPO_IGV;
    this.producto.detalle.descripcionTipoIgv = this._tipos.FACTURA_ANTICIPO_DESCRIPCION_TIPO_IGV;
    this.producto.detalle.idTipoIsc = this._tipos.ID_ISC_ID_TIPO_NO_TIENE;
    this.producto.detalle.codigoTipoIsc = this._tipos.CODIGO_TIPO_ISC_NO_TIENE;
    this.producto.detalle.descripcionTipoIsc = this._tipos.DESCRIPCION_TIPO_ISC_NO_TIENE;
    this.producto.detalle.idTipoPrecio = this._tipos.TIPO_PRECIO_PRECIO_UNITARIO_ID;
    this.producto.detalle.codigoTipoPrecio = this._tipos.TIPO_PRECIO_PRECIO_UNITARIO_CODIGO;
    this.producto.detalle.descripcionTipoPrecio = this._tipos.TIPO_PRECIO_PRECIO_UNITARIO_DESCRIPCION;
    this.producto.detalle.idProducto = null;
    this.producto.detalle.numeroItem = '1';
    this.producto.detalle.precioUnitarioVenta = this.producto.precioTotal;
    this.producto.detalle.unidadMedida = '-';
    this.producto.detalle.subtotalVenta = this.producto.precioTotal;
    this.producto.detalle.subtotalIgv = this.producto.montoImpuesto;
    this.producto.detalle.subtotalIsc = '0.00';
    this.producto.detalle.descuento = '0.00';
    this.producto.tipoProducto = this._tipos.TIPO_PRODUCTO_SERVICIO;
    this.producto.idTipoItemFactura = this._tipos.FACTURA_ANTICIPO_IDENTIFICADOR_ITEM;
    this._persistenciaService.agregarProducto(this.producto);

    this.factura.tipoItem = this._tipos.TIPO_PRODUCTO_SERVICIO.toString();

    documentoParametro.descripcionParametro = this._tipos.FACTURA_ANTICIPO_DESCRIPCION_PARAMETRO;
    documentoParametro.idParametro = this._tipos.FACTURA_ANTICIPO_ID_PARAMETRO;
    documentoParametro.jsonn.tipo = this._tipos.FACTURA_ANTICIPO_TIPO_PARAMETRO;
    documentoParametro.jsonn.valor = this._tipos.FACTURA_ANTICIPO_TIPO_PARAMETRO_VALOR;
    documentoParametro.jsonn.auxiliarEntero = this._tipos.FACTURA_ANTICIPO_ID_DOMINIO;
    documentoParametro.jsonn.auxiliarCaracter = this._tipos.FACTURA_ANTICIPO_CODIGO_SUNAT;
    documentoParametro.jsonn.auxiliarFecha = null;
    documentoParametro.jsonn.auxiliarImporte = this.factura.importeTotal;

    this.factura.documentoParametro.push(documentoParametro);
    this._persistenciaService.setFactura(this.factura);
    this.calcularMontos();
    //  this.recargarTabla();
    this.facturaFormGroup.controls['txtDetraccion'].disable();
    this.facturaFormGroup.controls['txtDetraccion'].setValue('0.00');
    this.setFlagVistaPrevia();
  }
  public setMes(mes: number): string {
    if (mes / 10 > 1) {
      return mes.toString();
    }
    return '0' + mes.toString();
  }
  public initFormGroup() {
    const fecha = new Date();
    const fechaActual = this.setMes( fecha.getDate()) + '/' + this.setMes(fecha.getMonth() + 1) + '/' + fecha.getFullYear().toString();
    //  const fechaActual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.facturaFormGroup = new FormGroup(
      {
        'txtRuc': new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]+'),
          Validators.maxLength(11),
          Validators.minLength(11)
        ]
        ),
        'txtRazonSocial': new FormControl('', [
          Validators.required,
          Validators.pattern('[A-Za-z0-9áéíóúÁÉÍÓÚ/%\\s-.;]+'),
          Validators.maxLength(100),
          Validators.minLength(1)
        ]
        ),
        'txtDetraccion': new FormControl('0.00', [
          Validators.required,
          Validators.pattern('[0-9]+[.][0-9]{2}'),
          Validators.maxLength(15),
          Validators.minLength(4)
        ]
        ),
        'cmbSerie': new FormControl('', [
          Validators.required
        ]
        ),
        'txtDireccionFiscal': new FormControl({ value: '', disabled: true }),
        'txtCorreo': new FormControl('',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}')
        ]
      ),
        'txtFechaEmision': new FormControl(fechaActual,
          ValidadorPersonalizado.validarFechaEmision('errorFecha', this._translate, this._datePipe)
        ),
        'txtFechaVencimiento': new FormControl(fechaActual,
          [Validators.required, ValidadorPersonalizado.fechaDeberiaSerMayorAHoy('errorFecha')]
          // , [
          // Validators.required,
          // Validators.pattern('[0-9]{2}[/][0-9]{2}[/][0-9]{4}'),
          // Validators.maxLength(10),
          // Validators.minLength(10)
        // ]
        ),
        'cmbMoneda': new FormControl('', [
          Validators.required
        ]
        ),
        'chkFacturaAnticipo': new FormControl(''),
        'txtObservaciones': new FormControl(''),
        'txtOperacionesGrabadas': new FormControl({ value: '0.00', disabled: true }),
        'txtOperacionesInafectas': new FormControl({ value: '0.00', disabled: true }),
        'txtOperacionesExoneradas': new FormControl({ value: '0.00', disabled: true }),
        'txtTotalDescuentos': new FormControl({ value: '0.00', disabled: true }),
        'txtSumatoriaOtrosTributos': new FormControl('0.00'),
        'txtSumatoriaOtrosCargos': new FormControl('0.00'),
        'txtTotalAnticipos': new FormControl({ value: '0.00', disabled: true }),
        'txtSumatoriaIsc': new FormControl({ value: '0.00', disabled: true }),
        'txtSumatoriaIgv': new FormControl({ value: '0.00', disabled: true }),
        'txtSubTotal': new FormControl({ value: '0.00', disabled: true }),
        'txtImporteTotal': new FormControl({ value: '0.00', disabled: true }),
      }
      , ValidadorPersonalizado.fechaDeberiaSerMenorEmisionVencimiento('txtFechaEmision', 'txtFechaVencimiento', 'errorFecha'));
    //  );
    //  this.facturaFormGroup.controls['cmbMoneda'].setValue('');
  }
  eliminar(elementos: DetalleEbiz[]) {
    this.calcularMontos();
    this._persistenciaService.setListaProductos(elementos);
  }
  agregarItem(agrego: boolean) {
  }
  ejecutarAccion(evento: [TipoAccion, DetalleEbiz]) {
    const tipoAccion = evento[0];
    let producto: DetalleEbiz = new DetalleEbiz();
    producto = evento[1];
    switch (tipoAccion) {
      case TipoAccion.ELIMINAR:
        if (this.esFacturaAnticipo) {
          this.esFacturaAnticipo = !this.esFacturaAnticipo;
          this._persistenciaService.setEstadoFacturaAnticipo(this.esFacturaAnticipo);
        }
        this._persistenciaService.eliminarItem(producto);
        this.recargarTabla();
        this.setFlagVistaPrevia();
        this.calcularMontos();
        // this._route.navigate( [this._rutas.URL_COMPROBANTE_EDITAR_BASE, producto.id] );
        break;
      case TipoAccion.EDITAR:
      if (this.esFacturaAnticipo) {
        this.editarItemFacturaAnticipo();
      } else {
        switch(producto.tipoProducto){
          case this._tipos.TIPO_PRODUCTO_BIEN:
            this._persistenciaService.setPersistenciaSimple('idEditarProducto', producto.id);
            this.setFacturaCabeceraDetalle();
            this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_FACTURA_BIEN_EDITAR);
            break;
          case this._tipos.TIPO_PRODUCTO_SERVICIO:
            this._persistenciaService.setPersistenciaSimple('idEditarProducto', producto.id);
            this.setFacturaCabeceraDetalle();
            this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_FACTURA_SERVICIO_EDITAR);
            break;
        }
      }
    }
  }
  public editarItemFacturaAnticipo() {
    const itemFacturaAnticipo = this._persistenciaService.getListaProductos()[0];
    const that = this;
    let formatoMonedaLabel: string;
    this._translate.get('formatoMontoSwalLabel').subscribe(data => formatoMonedaLabel = data);

    swal({
      title: 'Editar Factura Anticipo',
      //  input: 'text',
      html: '<div class="form-group label-floating" xmlns="http://www.w3.org/1999/html">' +
            '<label class="control-label">Monto Factura Anticipo (sin IGV)<span class="star">*</span> </label>' +
            '<input type="text" id="montoAnticipo" type="text" class="form-control" value="' + itemFacturaAnticipo.precioUnitario + '"/> ' +
            '<label>' + formatoMonedaLabel + '</label>' +
      '</div>',
      allowOutsideClick: false,

      preConfirm: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let bandera = 0;
            let banderaCero = false;
            const regExp = /([0-9,]{1,9})|([.]([0-9]{2}))/g;
            let montoAnticipo = $('#montoAnticipo').val();
            montoAnticipo = montoAnticipo.split(',');
            const montoAnticipoInvalidos = montoAnticipo.filter(function(monto){
              if (!regExp.test(monto)){
                bandera = 1;
                return true;
              } else {
                const numero = Number(monto);
                if (isNaN(numero)) {
                  bandera = 1;
                  return false;
                } else {
                  if (numero <= 0 ) {
                    bandera = 2;
                    return true;
                  }
                  return false;
                }
              }
            });
            if (bandera){
              switch(bandera) {
                case 1: swal.showValidationError(), reject(new Error('Formato Inválido'));
                        break;
                case 2: swal.showValidationError(), reject(new Error('Monto Inválido'));
                        break;
              }
            } else {
              resolve(montoAnticipo);
            }
          }, 500);
        });
      },
      showCancelButton: true,
      confirmButtonColor: '#2399e5',
      cancelButtonColor: '#2399e5',
      confirmButtonText: 'Editar',
      cancelButtonText: 'Regresar',
    })
      .catch((result) => console.log('CANCEL')
      )
      .then((result) => {
        if(result) {
          that._persistenciaService.removePersistenciaSimple('listaProductos');
              this.setFacturaAnticipo(Number(result));
              // this.
              swal({
                type: 'success',
                title: 'Acción Exitosa',
                confirmButtonText: that.labelContinuar,
                confirmButtonColor: '#4caf50'
              });

              that.listaProductos = that._persistenciaService.getListaProductos();
              that.tabla.insertarData(that.listaProductos);
      }});

  }
  public recargarTabla() {
    this.listaProductos = this._persistenciaService.getListaProductos();
    this.tabla.insertarData(this.listaProductos);
  }
  tipoProductoSeleccionado(producto: TipoProducto) {
    switch (producto.codigo) {
      case this._tipos.TIPO_PRODUCTO_BIEN:
        this.irAgregarBien();
        break;
      case this._tipos.TIPO_PRODUCTO_SERVICIO:
        this.irAgregarServicio();
        break;
    }
  }
  public probarBotonVistaPrevia() {
    console.log(this.facturaFormGroup.controls);
    console.log('!( ' + this.flagVistaPrevia + ' && ' + this.facturaFormGroup.valid + ' )');
    console.log(!(this.flagVistaPrevia && this.facturaFormGroup.valid));
  }
  /**
   * Metodo que realiza la busqueda para autocompletar
   * @param event
   */
  busquedaruc(event) {
      if (this.facturaFormGroup.get('txtRuc').value.length == 11) {
        const listaEntidades = this._entidadServices.buscarPorRuc(this.facturaFormGroup.get('txtRuc').value);
        if (listaEntidades != null) {
          listaEntidades.subscribe(
            data => {
              this.entidad_uno = data ? data : new Entidad();
              this.facturaFormGroup.controls['txtRazonSocial'].setValue(this.entidad_uno.denominacion);
              this.facturaFormGroup.controls['txtCorreo'].setValue(this.entidad_uno.correoElectronico);
              this.facturaFormGroup.controls['txtDireccionFiscal'].setValue(this.entidad_uno.direccionFiscal);
              if (this.entidad_uno.correoElectronico) {
                if (this.entidad_uno.correoElectronico === '-') {
                  this.facturaFormGroup.controls['txtCorreo'].enable();
                } else {
                  this.facturaFormGroup.controls['txtCorreo'].disable();
                }
              } else {
                this.facturaFormGroup.controls['txtCorreo'].enable();
              }
              this._entidadPersistenciaService.setEntidad(this.entidad_uno);
              setTimeout(function () {
                $('input').each(function () {
                  $(this.parentElement).removeClass('is-empty');
                });
              }, 200);
              this.eliminarEstiloInputDosNiveles('txtRazonSocial', 'is-empty');
            }
          );
        }
        } else {
          this.facturaFormGroup.controls['txtRazonSocial'].reset();
          this.facturaFormGroup.controls['txtCorreo'].reset();
          this.facturaFormGroup.controls['txtDireccionFiscal'].reset();
          this.agregarEstiloInput('txtRazonSocial', 'is-empty');
          this.agregarEstiloInput('txtCorreo', 'is-empty');
          this.agregarEstiloInput('txtDireccionFiscal', 'is-empty');
          this.agregarEstiloInputDosNiveles('txtRazonSocial', 'is-empty');
        }
  }
  public agregarEstiloInputDosNiveles(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().parent().addClass(estilo);
    }, 200);
  }
  public agregarEstiloInput(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().addClass(estilo);
    }, 200);
  }
  public listarrazonsocial() {
    const that = this;
    const inicio = new Date().getTime();
    const tiempo_espera = 4000;
    setTimeout(function () {
      const fin = new Date().getTime();
      if (inicio + tiempo_espera <= fin) {
        that._entidadServices.buscarPorRazonSocial(that.facturaFormGroup.get('txtRazonSocial').value, '6').subscribe(
          data => {
            that.searchData = data;
          }
        );
      }
    }, 4000);
  }
  public autocompleListFormatter(data: any): string {
    return data['denominacion'];
  }
  listarOrganizacionesDeAutcompletado(keyword: any) {
    if (keyword) {
      return this._entidadServices.buscarPorRazonSocial(keyword, '6');
    } else {
      return Observable.of([]);
    }
  }
  cambioAutocomplete() {
    if (typeof this.facturaFormGroup.get('txtRazonSocial').value === 'object') {
      this.estadoautocomplete.next(true);
    } else {
      this.facturaFormGroup.get('txtRuc').reset();
      this.facturaFormGroup.get('txtDireccionFiscal').reset();
      this.facturaFormGroup.get('txtRazonSocial').reset();
      this.facturaFormGroup.get('txtCorreo').reset();
      this.agregarEstiloInput('txtRuc', 'is-empty');
      this.agregarEstiloInput('txtCorreo', 'is-empty');
      this.agregarEstiloInput('txtDireccionFiscal', 'is-empty');
      this.estadoautocomplete.next(false);
    }
  }
  public busqueda() {
    if (this.estadoautocomplete.value == true) {
      this.rucquery = this.cabeceraDatosFactura.ruc;
    } else {
      this.rucquery = this.facturaFormGroup.get('txtRazonSocial').value.documento;
    }
    this.estadoautocomplete.next(false);
    if (this.facturaFormGroup.get('txtRazonSocial').value != undefined && this.facturaFormGroup.get('txtRazonSocial').value != "") {
      this._entidadServices.buscarPorRuc(this.rucquery)
        .subscribe(
        data => {
          this.entidad_uno = data ? data : new Entidad();
          this.facturaFormGroup.controls['txtRuc'].setValue(this.entidad_uno.documento);
          this.facturaFormGroup.controls['txtDireccionFiscal'].setValue(this.entidad_uno.direccionFiscal);
          this.facturaFormGroup.controls['txtRazonSocial'].setValue(this.entidad_uno.denominacion);
          this.facturaFormGroup.controls['txtCorreo'].setValue(this.entidad_uno.correoElectronico);
          this._entidadPersistenciaService.setEntidad(this.entidad_uno);
          //  this.eliminarEstiloInput('txtRazonSocial', 'is-empty');
          $('input').each(function () {
            $(this.parentElement).removeClass('is-empty');
          });
        }
        ),
        error => {
          if (error.status == 500) {
            swal({
              type: 'error',
              title: 'No se encontró la organización u ocurrió un problema en el servidor.',
              confirmButtonClass: 'btn btn-danger',
              buttonsStyling: false
            });
          }
        };
    }
  }
  public validarRangoFechaCreacionVencimiento() {
    const fechaEmisionInput = new Date ( this.facturaFormGroup.controls['txtFechaEmision'].value );
    const fechaVencimientoInput = new Date ( this.facturaFormGroup.controls['txtFechaVencimiento'].value );
    if ( fechaEmisionInput > fechaVencimientoInput ) {
      this.flagRangoFechas = true;
      this.facturaFormGroup.invalid;
    } else {
      this.flagRangoFechas = false;
    }
  }
  public eliminarEstiloInputDosNiveles(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().parent().removeClass(estilo);
    }, 200);
  }
}
