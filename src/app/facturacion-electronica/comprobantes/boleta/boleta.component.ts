import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableComponent } from '../../general/data-table/data-table.component';
import { RutasService } from '../../general/utils/rutas.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { TablaMaestra, TABLA_MAESTRA_MONEDAS, TABLA_MAESTRA_DOCUMENTO_IDENTIDAD } from 'app/facturacion-electronica/general/models/documento/tablaMaestra';
import { TablaMaestraService } from 'app/facturacion-electronica/general/services/documento/tablaMaestra.service';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms/src/directives/default_value_accessor';
import { concat } from 'rxjs/operator/concat';
import { CatalogoIgvService } from 'app/facturacion-electronica/general/utils/catalogo-igv.service';
import { Observable } from 'rxjs/Observable';
import { Entidad, OrganizacionDTO } from '../../general/models/organizacion/entidad';
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
import { PadreComprobanteService } from '../services/padre-comprobante.service';
import { DatePipe } from '@angular/common';
import { ColumnaDataTable } from '../../general/data-table/utils/columna-data-table';

declare var swal: any;

@Component({
  selector: 'app-boleta',
  templateUrl: './boleta.component.html',
  styleUrls: ['./boleta.component.css']
})
export class BoletaComponent implements OnInit, AfterViewInit {
  public rucquery: string;
  public showDialog = false;
  public titulo = 'boleta';
  public tituloBoletaAnticipo: string;
  public formGroup: FormGroup;
  public columnasTabla: ColumnaDataTable[];
  public esBoletaAnticipo: boolean;
  public flagTipoDocumento: boolean;
  public tipoIgvItems: number;
  public igv: number;
  public formatoTipoDocumento: number;
  public tamanioTipoDocumento: number;
  public idEntidadCliente: string;
  public ubigeoCliente: string;
  public boletaFormGroup: FormGroup;
  public datos: any;
  public entidad: Entidad[] = [];
  public entidad_uno: Entidad = new Entidad();
  // public subscriptionSerie: Subscription;
  public subscriptionMoneda: Subscription;
  public dtoOutSeries: Serie[] = [];
  public subscriptionSeries: BehaviorSubject<Serie[]>;
  private tiposConceptos: BehaviorSubject<ConceptoDocumento[]>;
  public tiposDocumentos: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);

  public estadoautocomplete: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public series: Serie[] = [];
  public dtoOuMonedas: Moneda[] = [];

  @ViewChild('otro') tabla: DataTableComponent<DetalleEbiz>;
  @ViewChild('inputRazonSocial') razonautocomplete: ElementRef;
  public TipoAccion = TipoAccion;

  // @ViewChild(DataTableComponent) tabla: DataTableComponent<DetalleEbiz>;
  public boleta: FacturaEbiz;
  public cabeceraDatosBoleta: CabeceraFactura;
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
  private todosTiposDocumentoIdentidad: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
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
    private _catalogoDocumentos: CatalogoDocumentoIdentidadService,
    private _padreComprobanteService: PadreComprobanteService) {
      this._padreComprobanteService.actualizarComprobante(this._activeRoute.snapshot.data['codigo'],
        this._activeRoute.snapshot.data['mostrarCombo'], false);
      this.igv = 0.18;
      this.boleta = new FacturaEbiz();
      this.cabeceraDatosBoleta = new CabeceraFactura();
      this.esBoletaAnticipo = false;
      this.flagRangoFechas = false;
      this.listaProductos = [];
      this.columnasTabla = [
        new ColumnaDataTable('codigo', 'codigoItem'),
        new ColumnaDataTable('descripcion', 'descripcionItem', { 'text-align': 'left' }),
        new ColumnaDataTable('cantidad', 'cantidad', { 'text-align': 'right' }),
        new ColumnaDataTable('unidadMedida', 'detalle.unidadMedida'),
        new ColumnaDataTable('valorUnitario', 'precioUnitario', { 'text-align': 'right' }),
        new ColumnaDataTable('igv', 'montoImpuesto', { 'text-align': 'right' }),
        new ColumnaDataTable('isc', 'detalle.subtotalIsc', { 'text-align': 'right' }),
        new ColumnaDataTable('descuento', 'detalle.descuento', { 'text-align': 'right' }),
        new ColumnaDataTable('valorVenta', 'precioTotal', { 'text-align': 'right' })
      ];
      this.flagTipoDocumento = true;
  }
  ngOnInit() {
    this.initFormGroup();
    console.log('this.Refresh.CargarPersistencia - ONINIT');
    console.log(this.Refresh.CargarPersistencia);
    if (!this.Refresh.CargarPersistencia) {
      this._persistenciaService.removePersistenciaSimple('documentosReferencia');
      this._persistenciaService.removePersistenciaSimple('checkBoletaAnticipo');
      this._persistenciaService.removePersistenciaSimple('listaProductos');
      this._persistenciaService.removePersistenciaSimple('cabeceraFactura');
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
    this.cargarBoleta();
    this.setFlagVistaPrevia();
    // this.seriesService.obtenerTodo().subscribe((val) => {
    //   this.series = val;
    // });
    this.seriesService.filtroSeries(localStorage.getItem('id_entidad'),
      this._tipos.TIPO_DOCUMENTO_BOLETA, this._tipos.TIPO_SERIE_OFFLINE.toString())
      .subscribe(
        valor => {
          this.series = valor;
        });
    this.listarrazonsocial();
    this.esBoletaAnticipo = this._persistenciaService.getEstadoFacturaAnticipo();
    console.log(this.boletaFormGroup.controls['txtFechaEmision'].valid);
    // if (this.esBoletaAnticipo === true) {
    //   this.boletaFormGroup.controls['txtDetraccion'].disable();
    //   this.boletaFormGroup.controls['txtDetraccion'].setValue('0.00');
    // }
    console.log(this.boletaFormGroup.controls['txtFechaEmision'].valid);
  }
  ngAfterViewInit() {
    this.fillCabecera();
  }
  noOnDestroy() {
    this.Refresh.CargarPersistencia = false;
    // this.subscriptionSerie.unsubscribe();
  }
  public cargarBoleta() {
    this.listaProductos = this._persistenciaService.getListaProductos();
    this.boleta.documentoReferencia = this._persistenciaService.getDocumentosReferencia();
    this.calcularMontos();
  }
  public calcularMontos() {
    this.listaProductos = this._persistenciaService.getListaProductos();
    let tipoIgvListaProductos: number;
    let montoTipoOperacion: number;
    // const detraccion = this.boletaFormGroup.controls['txtDetraccion'].value;
    const detraccion = '0.00';
    this.boleta.detraccion = Number(detraccion);
    this.boleta.totalDescuentos = 0;
    this.boleta.sumaAnticipos = 0;
    this.boleta.totalAnticipos = 0;
    this.boleta.sumaIgv = 0;
    this.boleta.sumaIsc = 0;
    this.boleta.subTotal = 0;
    this.boleta.importeTotal = 0;
    this.boleta.sumaOtrosCargos = 0;
    this.boleta.sumaOtrosTributos = 0;
    this.boleta.sumaOtrosTributos = Number(this.boletaFormGroup.controls['txtSumatoriaOtrosTributos'].value);
    this.boleta.sumaOtrosCargos = Number(this.boletaFormGroup.controls['txtSumatoriaOtrosCargos'].value);
    this.boleta.importeReferencial = '0';
    this.boleta.montoGravadas = 0;
    this.boleta.montoExoaneradas = 0;
    this.boleta.montoInafectas = 0;
    this.boleta.subTotalComprobanteConcepto = 0;
    montoTipoOperacion = 0;
    if (this.listaProductos.length > 0) {
      this.setTipoIgv(Number(this.listaProductos[0].detalle.codigoTipoIgv));
      for (let a = 0; a < this.listaProductos.length; a++) {
        montoTipoOperacion = montoTipoOperacion +
          (
            (Number(this.listaProductos[a].cantidad) * Number(this.listaProductos[a].precioUnitario)) -
            Number(this.listaProductos[a].detalle.descuento)
          );
        this.boleta.totalDescuentos = this.boleta.totalDescuentos + Number(this.listaProductos[a].detalle.descuento);
        this.boleta.sumaIsc = this.boleta.sumaIsc + Number(this.listaProductos[a].detalle.subtotalIsc);
        this.boleta.importeReferencial = (
          Number(this.boleta.importeReferencial) +
          (Number(this.listaProductos[a].cantidad) * Number(this.listaProductos[a].precioUnitario))
        ).toString();
        this.boleta.subTotalComprobanteConcepto = this.boleta.subTotalComprobanteConcepto + 
                                                  Number(this.listaProductos[a].cantidad) * Number(this.listaProductos[a].precioUnitario);
      }
      this.boleta.subTotal = (montoTipoOperacion + this.boleta.sumaIsc);
      if (this.tipoIgvItems === this._catalogoIgvService.IGV_GRAVADO_RANGO) {
        this.boleta.sumaIgv = (this.boleta.subTotal * this._catalogoIgvService.IGV_VALOR);
      }
    } else {
      this.tipoIgvItems = 0;
    }
    for (let a = 0; a < this.boleta.documentoReferencia.length; a++) {
      this.boleta.totalAnticipos = this.boleta.totalAnticipos + Number(this.boleta.documentoReferencia[a].anticipo);
    }

    this.boleta.importeTotal = this.boleta.subTotal + this.boleta.sumaIgv - this.boleta.totalAnticipos +
      this.boleta.sumaOtrosCargos + this.boleta.sumaOtrosTributos;
    //  - Number(detraccion);
    this.boleta.totalComprobante = (this.boleta.subTotal + this.boleta.sumaIgv - this.boleta.totalAnticipos).toString();

    this.boletaFormGroup.controls['txtOperacionesGrabadas'].setValue('0.00');
    this.boletaFormGroup.controls['txtOperacionesExoneradas'].setValue('0.00');
    this.boletaFormGroup.controls['txtOperacionesInafectas'].setValue('0.00');
    this.boletaFormGroup.controls['txtTotalDescuentos'].setValue(this.formatearNumeroADecimales(this.boleta.totalDescuentos));
    this.boletaFormGroup.controls['txtTotalAnticipos'].setValue(this.formatearNumeroADecimales(this.boleta.totalAnticipos));
    this.boletaFormGroup.controls['txtSumatoriaIsc'].setValue(this.formatearNumeroADecimales(this.boleta.sumaIsc));
    this.boletaFormGroup.controls['txtSumatoriaIgv'].setValue(this.formatearNumeroADecimales(this.boleta.sumaIgv));
    this.boletaFormGroup.controls['txtSubTotal'].setValue(this.formatearNumeroADecimales(this.boleta.subTotalComprobanteConcepto));
    this.boletaFormGroup.controls['txtImporteTotal'].setValue(this.formatearNumeroADecimales(this.boleta.importeTotal));

    switch (this.tipoIgvItems) {
      case this._catalogoIgvService.IGV_GRAVADO_RANGO:
        this.boleta.montoGravadas = montoTipoOperacion;
        this.boletaFormGroup.controls['txtOperacionesGrabadas'].setValue(this.formatearNumeroADecimales(this.boleta.montoGravadas));
        break;
      case this._catalogoIgvService.IGV_EXONERADO_RANGO:
        this.boleta.montoExoaneradas = montoTipoOperacion;
        this.boletaFormGroup.controls['txtOperacionesExoneradas'].setValue(this.formatearNumeroADecimales(this.boleta.montoExoaneradas));
        break;
      case this._catalogoIgvService.IGV_INAFECTO_RANGO:
        this.boleta.montoInafectas = montoTipoOperacion;
        this.boletaFormGroup.controls['txtOperacionesInafectas'].setValue(this.formatearNumeroADecimales(this.boleta.montoInafectas));
        break;
      default:
        break;
    }
  }
  public sumarOtrosCargos() {
    this.boleta.importeTotal = Number(this.boletaFormGroup.controls['txtImporteTotal'].value);
    if (this.listaProductos.length === 0) {
      this.boleta.importeTotal = 0;
    }
    this.boleta.sumaOtrosTributos = Number(this.boletaFormGroup.controls['txtSumatoriaOtrosTributos'].value);
    this.boleta.sumaOtrosCargos = Number(this.boletaFormGroup.controls['txtSumatoriaOtrosCargos'].value);
    this.boleta.importeTotal = this.boleta.importeTotal + this.boleta.sumaOtrosTributos + this.boleta.sumaOtrosCargos;
    this.boletaFormGroup.controls['txtImporteTotal'].setValue(this.formatearNumeroADecimales(this.boleta.importeTotal));
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
    this.cabeceraDatosBoleta = this._persistenciaService.getCabeceraFactura();
    if (this.cabeceraDatosBoleta) {
      this.idEntidadCliente = this.cabeceraDatosBoleta.idEntidadCliente;
      this.ubigeoCliente = this.cabeceraDatosBoleta.ubigeoCliente;
      this.estadoautocomplete.next(true);
      if (this.cabeceraDatosBoleta.tipoDocumento !== '') {
        this.boletaFormGroup.controls['cmbTipoDocumento'].setValue(this.cabeceraDatosBoleta.tipoDocumento);
        this.setFormatoTamanioDocumento();
        this.eliminarEstiloInput('cmbTipoDocumento', 'is-empty');
      }
      if (this.cabeceraDatosBoleta.numeroDocumento !== '') {
        this.eliminarEstiloInput('txtNumeroDocumento', 'is-empty');
        this.boletaFormGroup.controls['txtNumeroDocumento'].setValue(this.cabeceraDatosBoleta.numeroDocumento);
      }
      // this.busquedaruc(null);
      if (this.cabeceraDatosBoleta.direccionFiscal !== '') { this.eliminarEstiloInput('txtDireccionFiscal', 'is-empty'); }
      if (this.cabeceraDatosBoleta.correo !== '') { this.eliminarEstiloInput('txtCorreo', 'is-empty'); }
      if (this.cabeceraDatosBoleta.sumaOtrosCargos !== '') { this.eliminarEstiloInput('txtSumatoriaOtrosCargos', 'is-empty'); }
      if (this.cabeceraDatosBoleta.sumaOtrosTributos !== '') { this.eliminarEstiloInput('txtSumatoriaOtrosTributos', 'is-empty'); }
      if (this.cabeceraDatosBoleta.ruc !== '') { this.eliminarEstiloInput('txtNumeroDocumento', 'is-empty'); }
      if (this.cabeceraDatosBoleta.serie !== '') { this.eliminarEstiloInput('cmbSerie', 'is-empty'); }
      if (this.cabeceraDatosBoleta.fechaEmision !== '') { this.eliminarEstiloInput('txtFechaEmision', 'is-empty'); }
      if (this.cabeceraDatosBoleta.fechaVencimiento !== '') { this.eliminarEstiloInput('txtFechaVencimiento', 'is-empty'); }
      if (this.cabeceraDatosBoleta.tipoMoneda !== '') { this.eliminarEstiloInput('cmbMoneda', 'is-empty'); }
      if (this.cabeceraDatosBoleta.observaciones !== '') { this.eliminarEstiloInput('txtObservaciones', 'is-empty'); }
      //  if (this.cabeceraDatosBoleta.razonsSocial !== '') {this.eliminarEstiloInput('txtRazonSocial', 'is-empty'); }
      this.boletaFormGroup.controls['txtDireccionFiscal'].setValue(this.cabeceraDatosBoleta.direccionFiscal);
      this.boletaFormGroup.controls['txtCorreo'].setValue(this.cabeceraDatosBoleta.correo);
      this.boletaFormGroup.controls['txtSumatoriaOtrosCargos'].setValue(this.cabeceraDatosBoleta.sumaOtrosCargos);
      this.boletaFormGroup.controls['txtSumatoriaOtrosTributos'].setValue(this.cabeceraDatosBoleta.sumaOtrosTributos);
      this.boletaFormGroup.controls['txtNumeroDocumento'].setValue(this.cabeceraDatosBoleta.ruc);
      // this.boletaFormGroup.controls['txtDetraccion'].setValue(this.cabeceraDatosBoleta.detraccion);
      this.boletaFormGroup.controls['cmbSerie'].setValue(this.cabeceraDatosBoleta.serie);
      this.boletaFormGroup.controls['txtFechaEmision'].setValue(this.cabeceraDatosBoleta.fechaEmision);
      this.boletaFormGroup.controls['txtFechaVencimiento'].setValue(this.cabeceraDatosBoleta.fechaVencimiento);
      this.boletaFormGroup.controls['cmbMoneda'].setValue(this.cabeceraDatosBoleta.tipoMoneda);
      this.boletaFormGroup.controls['txtObservaciones'].setValue(this.cabeceraDatosBoleta.observaciones);
      this.boletaFormGroup.controls['txtRazonSocial'].setValue(this.cabeceraDatosBoleta.razonsSocial);
    } else {
      const fecha = new Date();
      const fechaActual = this.setMes(fecha.getDate()) + '/' + this.setMes(fecha.getMonth() + 1) + '/' + fecha.getFullYear().toString();
      this.boletaFormGroup.controls['txtFechaEmision'].setValue(fechaActual);
      this.boletaFormGroup.controls['txtFechaVencimiento'].setValue(fechaActual);
    }
    //  if (this.boletaFormGroup.controls['txtRazonSocial'].value !== '') {this.eliminarEstiloInput('txtRazonSocial', 'is-empty'); }
  }
  /**
   * Establece los valores generales de la cabecera de la boleta, para su envio a API
   */
  public setBoletaCabeceraDetalle() {
    this.guardarOrganizacion();
    this.cabeceraDatosBoleta = new CabeceraFactura();
    //  this._persistenciaService.getCabeceraBoleta();
    this.cabeceraDatosBoleta.ubigeoCliente = this.ubigeoCliente;
    this.cabeceraDatosBoleta.idEntidadCliente = this.idEntidadCliente;
    this.cabeceraDatosBoleta.tipoDocumento = this.boletaFormGroup.controls['cmbTipoDocumento'].value;
    this.cabeceraDatosBoleta.numeroDocumento = this.boletaFormGroup.controls['txtNumeroDocumento'].value;
    this.cabeceraDatosBoleta.ruc = this.boletaFormGroup.controls['txtNumeroDocumento'].value;
    this.cabeceraDatosBoleta.razonsSocial = this.boletaFormGroup.controls['txtRazonSocial'].value;
    // this.cabeceraDatosBoleta.detraccion = this.boletaFormGroup.controls['txtDetraccion'].value;
    this.cabeceraDatosBoleta.serie = this.boletaFormGroup.controls['cmbSerie'].value;
    this.cabeceraDatosBoleta.fechaEmision = this.boletaFormGroup.controls['txtFechaEmision'].value;
    this.cabeceraDatosBoleta.fechaVencimiento = this.boletaFormGroup.controls['txtFechaVencimiento'].value;
    this.cabeceraDatosBoleta.tipoMoneda = this.boletaFormGroup.controls['cmbMoneda'].value;
    this.cabeceraDatosBoleta.sumaOtrosCargos = this.boletaFormGroup.controls['txtSumatoriaOtrosCargos'].value;
    this.cabeceraDatosBoleta.sumaOtrosTributos = this.boletaFormGroup.controls['txtSumatoriaOtrosTributos'].value;
    this.cabeceraDatosBoleta.observaciones = this.boletaFormGroup.controls['txtObservaciones'].value;
    this.cabeceraDatosBoleta.direccionFiscal = this.boletaFormGroup.controls['txtDireccionFiscal'].value;
    this.cabeceraDatosBoleta.correo = this.boletaFormGroup.controls['txtCorreo'].value;
    this._persistenciaService.setCabeceraFactura(this.cabeceraDatosBoleta);
  }
  public setFlagVistaPrevia() {
    this.listaProductos = this._persistenciaService.getListaProductos();
    if (this.listaProductos.length === 0) {
      this.flagVistaPrevia = false;
    } else {
      this.flagVistaPrevia = true;
    }
  }
  public setFormatoDocumento() {
    this.boletaFormGroup.controls['txtNumeroDocumento'].setValue('');
    this.boletaFormGroup.controls['txtRazonSocial'].setValue('');
    this.boletaFormGroup.controls['txtDireccionFiscal'].setValue('');
    this.boletaFormGroup.controls['txtCorreo'].setValue('');

    this.agregarEstiloInput('txtNumeroDocumento', 'is-empty');
    this.agregarEstiloInput('txtRazonSocial', 'is-empty');
    this.agregarEstiloInput('txtDireccionFiscal', 'is-empty');
    this.agregarEstiloInput('txtCorreo', 'is-empty');

    this.setFormatoTamanioDocumento();
  }
  public setFormatoTamanioDocumento() {
    switch (this.boletaFormGroup.controls['cmbTipoDocumento'].value) {
      case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC:
        this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC_TAMANIO;
        this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_NUMERICO;
        // this.flagTipoDocumento = true;
        break;
      case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI:
        this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI_TAMANIO;
        this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_NUMERICO;
        // this.flagTipoDocumento = true;
        break;
      case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA:
        this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA_TAMANIO;
        this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_ALFANUMERICO;
        // this.boletaFormGroup.controls['txtDireccionFiscal'].enable();
        // this.flagTipoDocumento = false;
        break;
      case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE:
        this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE_TAMANIO;
        this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_ALFANUMERICO;
        // this.boletaFormGroup.controls['txtDireccionFiscal'].enable();
        // this.flagTipoDocumento = false;
        break;
      case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC:
        this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC_TAMANIO;
        this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_NUMERICO;
        // this.flagTipoDocumento = true;
        break;
      case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD:
        this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD_TAMANIO;
        this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_NUMERICO;
        // this.boletaFormGroup.controls['txtDireccionFiscal'].enable();
        // this.flagTipoDocumento = false;
        break;
    }
  }
  public cargarServicios() {
    this.monedas = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_MONEDAS);
    this.todosTipoConceptos = this._conceptoDocumentoService.obtenerTodosConceptosDocumentos();
    this.setTipoDocumento();
    //  this.boletaFormGroup.controls['cmbMoneda'].setValue(this._tipos.TIPO_MONEDA_SOL);
    //  this.eliminarEstiloInput('cmbMoneda', 'is-empty');
  }
  public setTipoDocumento() {
    let codigosDocumentosIdentidad: string[] = [];
    codigosDocumentosIdentidad = [
      this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC,
      this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI,
      this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA,
      this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
      //  this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD,
      //  this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_OTROS
    ];
    this.todosTiposDocumentoIdentidad = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_DOCUMENTO_IDENTIDAD);
    this.tiposDocumentos =
      this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposDocumentoIdentidad, codigosDocumentosIdentidad);
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
    // this.guardarOrganizacion();
    this.setBoletaCabeceraDetalle();
    this._persistenciaService.setFactura(this.boleta);
    const listaTmpDocumentosRelacionados = this._persistenciaService.getDocumentosReferencia();
    this._persistenciaService.setPersistenciaSimple('documentosReferenciaTemporal', listaTmpDocumentosRelacionados);
    this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_BOLETA_DOCUMENTO_RELACIONADO);
  }
  public irAgregarServicio() {
    this.setBoletaCabeceraDetalle();
    this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_BOLETA_SERVICIO_AGREGAR);
  }
  public irAgregarBien() {
    this.setBoletaCabeceraDetalle();
    this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_BOLETA_BIEN_AGREGAR);
  }
  public irVistaPrevia() {
    this.validacionComprobanteMontos();
  }
  /**
   * Método que valida que los montos ingresados sean congruentes
   */
  public validacionComprobanteMontos() {
    if (this.boleta.importeTotal < 0) {
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
          this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_BOLETA_DOCUMENTO_RELACIONADO);
        }
      });
    } else {
      this.setBoletaCabeceraDetalle();
      this.cargarDataVistaPrevia();
      this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_BOLETA_VISTA_PREVIA);
    }
  }
  /**
   * Establece los valores del JSON de Boleta, para el servicio de API
   */
  public cargarDataVistaPrevia() {
    //  CABECERA BOLETA
    this.boleta.idSerie = this.boletaFormGroup.controls['cmbSerie'].value;
    const serieFormato = this.series.find(
      element => this.boleta.idSerie === (element.idSerie).toString()
    );
    this.boleta.serieNombre = serieFormato.serie;
    this.boleta.numeroComprobante = this.boleta.serieNombre;

    this.boleta.rucCompradorBase = this.boletaFormGroup.controls['txtNumeroDocumento'].value;
    this.boleta.rucProveedorBase = localStorage.getItem('org_ruc');

    this.boleta.rucProveedor = this.boleta.rucProveedorBase;
    this.boleta.rucComprador = this.boleta.rucCompradorBase;
    this.boleta.usuarioCreacion = JSON.parse(localStorage.getItem('usuarioActual')).nombreusuario;
    this.boleta.usuarioModificacion = 'SYSTEM';

    this.boleta.idTablaTipoComprobante = this._tipos.ID_TABLA_TIPO_COMPROBANTE;
    if (this.esBoletaAnticipo) {
      this.boleta.idTipoComprobante = this._tipos.TIPO_DOCUMENTO_BOLETA;
    } else {
      this.boleta.idTipoComprobante = this._tipos.TIPO_DOCUMENTO_BOLETA;
    }
    this.boleta.idRegistroTipoComprobante = this._tipos.TIPO_DOCUMENTO_BOLETA;
    this.boleta.razonSocialProveedor = localStorage.getItem('org_nombre');
    this.boleta.razonSocialComprador = this.boletaFormGroup.controls['txtRazonSocial'].value;
    this.boleta.observacionComprobante = this.boletaFormGroup.controls['txtObservaciones'].value;
    this.boleta.tipoComprobante = this._tipos.TIPO_DOCUMENTO_BOLETA_NOMBRE;
    this.boleta.montoPagado = (this.boleta.importeTotal).toString();
    this.boleta.igv = (this.boleta.sumaIgv).toString();
    this.boleta.isc = (this.boleta.sumaIsc).toString();
    this.boleta.otrosTributos = (this.boleta.sumaOtrosTributos).toString();
    this.boleta.descuento = (this.boleta.totalDescuentos).toString();
    this.boleta.subtotalComprobante = (
      Number(this.boleta.importeReferencial) - Number(this.boleta.totalDescuentos)
    ).toString();
    this.boleta.totalComprobante = this.boleta.totalComprobante;
    this.boleta.tipoItem = (this.listaProductos[0].tipoProducto).toString();

    this.monedas.subscribe(
      data => {
        const indice = data.findIndex(
          element => element.codigo == this.boletaFormGroup.get('cmbMoneda').value
        );
        this.boleta.moneda = data[indice].descripcionCorta;
        this.boleta.idTablaMoneda = (data[indice].tabla).toString();
        this.boleta.idRegistroMoneda = Number(data[indice].codigo).toString();
      }
    );
    let fechaTimestamp = this.boletaFormGroup.controls['txtFechaEmision'].value;
    let fechastr = fechaTimestamp.toString().split('/');
    let dia = Number(fechastr[0]);
    let mes = Number(fechastr[1]) - 1;
    let anio = Number(fechastr[2]);
    let fecha = anio + '-' + mes + '-' + dia;

    this.boleta.fechaEmision = Number(new Date(anio, mes, dia));
    fechaTimestamp = this.boletaFormGroup.controls['txtFechaVencimiento'].value;
    fechastr = fechaTimestamp.toString().split('/');
    dia = Number(fechastr[0]);
    mes = Number(fechastr[1]) - 1;
    anio = Number(fechastr[2]);
    fecha = anio + '-' + mes + '-' + dia;
    this.boleta.fechaVencimiento = Number(new Date(anio, mes, dia));
    this.boleta.direccionProveedor = localStorage.getItem('org_direccion');
    // this.boleta.porcentajeDetracction = this.boletaFormGroup.controls['txtDetraccion'].value;
    this.boleta.porcentajeDetracction = '0.00';
    this.boleta.detraccion = 0.00;
    this.boleta.direccionComprador = this.boletaFormGroup.controls['txtDireccionFiscal'].value;
    this.boleta.direccionProveedor = localStorage.getItem('org_direccion');
    this.boleta.porcentajeImpuesto = this.formatearNumeroADecimales(this.igv * 100);
    // this.boleta.usuarioCreacion = this.entidad_uno.usuarioCreacion;
    // this.boleta.usuarioModificacion = this.entidad_uno.usuarioCreacion;
    //  DETALLE EBIZ
    this.boleta.detalleEbiz = this._persistenciaService.getListaProductos();
    //  DOCUMENTO ENTIDAD
    //  Emisor
    this.boleta.documentoEntidad[0].idTipoEntidad = this._tipos.TIPO_ENTIDAD_EMISOR;
    this.boleta.documentoEntidad[0].descripcionTipoEntidad = this._tipos.DESCRIPCION_TIPO_ENTIDAD_EMISOR;
    this.boleta.documentoEntidad[0].idEntidad = localStorage.getItem('id_entidad');
    this.boleta.documentoEntidad[0].tipoDocumento = '6'; // this._cataloDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC;
    this.boleta.documentoEntidad[0].documento = localStorage.getItem('org_ruc');
    this.boleta.documentoEntidad[0].denominacion = localStorage.getItem('org_nombre');
    this.boleta.documentoEntidad[0].nombreComercial = localStorage.getItem('org_nombre');
    this.boleta.documentoEntidad[0].direccionFiscal = localStorage.getItem('org_direccion');
    this.boleta.documentoEntidad[0].ubigeo = '040101';
    this.boleta.documentoEntidad[0].email = localStorage.getItem('org_email');
    this.boleta.documentoEntidad[0].correo = localStorage.getItem('org_email');
    this.boleta.documentoEntidad[0].notifica = this._tipos.NOTIFICACION_DOCUMENTO_ENTIDAD;
    //  Receptor
    // this.org_busqueda = this._entidadPersistenciaService.getEntidad();
    this.boleta.documentoEntidad[1].idTipoEntidad = this._tipos.TIPO_ENTIDAD_RECEPTOR;
    this.boleta.documentoEntidad[1].descripcionTipoEntidad = this._tipos.DESCRIPCION_TIPO_ENTIDAD_RECEPTOR;
    if (this.flagTipoDocumento) {
      this.boleta.documentoEntidad[1].idEntidad = this.idEntidadCliente;
      this.boleta.documentoEntidad[1].ubigeo = this.ubigeoCliente;
    } else {
      this.boleta.documentoEntidad[1].idEntidad = null;
      this.boleta.documentoEntidad[1].ubigeo = null;
    }
    if (!isNaN(parseInt(this.boletaFormGroup.controls['cmbTipoDocumento'].value, 10))) {
      this.boleta.documentoEntidad[1].tipoDocumento = (Number(this.boletaFormGroup.controls['cmbTipoDocumento'].value)).toString();
    } else {
      this.boleta.documentoEntidad[1].tipoDocumento = (this.boletaFormGroup.controls['cmbTipoDocumento'].value);
    }
    // this._cataloDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC;
    this.boleta.documentoEntidad[1].documento = this.boletaFormGroup.controls['txtNumeroDocumento'].value;
    this.boleta.documentoEntidad[1].denominacion = this.boletaFormGroup.controls['txtRazonSocial'].value;
    this.boleta.documentoEntidad[1].nombreComercial = this.boletaFormGroup.controls['txtRazonSocial'].value;
    this.boleta.documentoEntidad[1].direccionFiscal = this.boletaFormGroup.controls['txtDireccionFiscal'].value;
    this.boleta.documentoEntidad[1].email = this.boletaFormGroup.controls['txtCorreo'].value;
    this.boleta.documentoEntidad[1].correo = this.boletaFormGroup.controls['txtCorreo'].value;
    this.boleta.documentoEntidad[1].notifica = this._tipos.NOTIFICACION_DOCUMENTO_ENTIDAD;
    //  DOCUMENTO CONCEPTO
    const codigosConceptosAUtilizar = [
      Number(this._tipos.CONCEPTO_OPERACION_GRAVADA_CODIGO),
      Number(this._tipos.CONCEPTO_OPERACION_INAFECTAS_CODIGO),
      Number(this._tipos.CONCEPTO_OPERACION_EXONERADO_CODIGO),
      Number(this._tipos.CONCEPTO_OPERACION_GRATUITA_CODIGO),
      Number(this._tipos.CONCEPTO_OPERACION_SUB_TOTAL_VENTA_CODIGO),
      Number(this._tipos.CONCEPTO_OPERACION_TOTAL_DESCUENTOS_CODIGO),
      Number(this._tipos.CONCEPTO_OPERACION_DETRACCIONES_CODIGO),
      Number(this._tipos.CONCEPTO_OPERACION_OTROS_CARGOS_CODIGO),
    ];
    this.tiposConceptos = this._conceptoDocumentoService.obtenerPorCodigos(this.todosTipoConceptos, codigosConceptosAUtilizar);
    this.setDocumentoConcepto();

    if (this.esBoletaAnticipo) {
      this.boleta.documentoParametro = [];
      const documentoParametro: DocumentoParametro = new DocumentoParametro();
      documentoParametro.descripcionParametro = this._tipos.BOLETA_ANTICIPO_DESCRIPCION_PARAMETRO;
      documentoParametro.idParametro = this._tipos.BOLETA_ANTICIPO_ID_PARAMETRO;
      documentoParametro.jsonn.tipo = this._tipos.BOLETA_ANTICIPO_TIPO_PARAMETRO;
      documentoParametro.jsonn.valor = this._tipos.BOLETA_ANTICIPO_TIPO_PARAMETRO_VALOR;
      documentoParametro.jsonn.auxiliarEntero = this._tipos.BOLETA_ANTICIPO_ID_DOMINIO;
      documentoParametro.jsonn.auxiliarCaracter = this._tipos.BOLETA_ANTICIPO_CODIGO_SUNAT;
      documentoParametro.jsonn.auxiliarFecha = null;
      documentoParametro.jsonn.auxiliarImporte = this.boleta.importeTotal;

      this.boleta.documentoParametro.push(documentoParametro);
      // this.boleta.documentoParametro[0].jsonn.auxiliarImporte = this.boleta.importeTotal;
      this.boleta.documentoParametro[0].json = JSON.stringify(this.boleta.documentoParametro[0].jsonn);
    } else {
      this.boleta.documentoParametro = [];
    }
    this.calcularMontos();
    this._persistenciaService.setFactura(this.boleta);
  }
  public setDocumentoConcepto() {
    let documentoConcepto = new DocumentoConcepto();

    this.tiposConceptos.subscribe(
      (conceptos) => {
        for (const concepto of conceptos) {
          switch (Number(concepto.codigo)) {
            case Number(this._tipos.CONCEPTO_OPERACION_GRAVADA_CODIGO):
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.boleta.montoGravadas).toString();
              this.boleta.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesGravadas.importe = ;
              break;
            case Number(this._tipos.CONCEPTO_OPERACION_INAFECTAS_CODIGO):
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.boleta.montoInafectas).toString();
              this.boleta.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesInafectas.importe = ;
              break;
            case Number(this._tipos.CONCEPTO_OPERACION_EXONERADO_CODIGO):
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.boleta.montoExoaneradas).toString();
              this.boleta.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesExoneradas.importe = ;
              break;
            case Number(this._tipos.CONCEPTO_OPERACION_GRATUITA_CODIGO):
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = '0.00';
              this.boleta.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesGratuitas.importe = ;
              break;
            case Number(this._tipos.CONCEPTO_OPERACION_SUB_TOTAL_VENTA_CODIGO):
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.boleta.subTotalComprobanteConcepto).toString();
              // documentoConcepto.importe = (this.boleta.subTotal).toString();
              this.boleta.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesSubTotalVenta.importe = ;
              break;
            case Number(this._tipos.CONCEPTO_OPERACION_TOTAL_DESCUENTOS_CODIGO):
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.boleta.totalDescuentos).toString();
              this.boleta.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesTotalDescuentos.importe = ;
              break;
            case Number(this._tipos.CONCEPTO_OPERACION_DETRACCIONES_CODIGO):
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.boleta.detraccion).toString();
              this.boleta.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesTotalDescuentos.importe = ;
              break;
            case Number(this._tipos.CONCEPTO_OPERACION_OTROS_CARGOS_CODIGO):
              documentoConcepto = new DocumentoConcepto();
              documentoConcepto.idConcepto = concepto.idConcepto.toString();
              documentoConcepto.descripcionConcepto = concepto.descripcion;
              documentoConcepto.codigoConcepto = concepto.codigo;
              documentoConcepto.importe = (this.boleta.sumaOtrosCargos).toString();
              this.boleta.documentoConcepto.push(documentoConcepto);
              // documentoConceptoOperacionesTotalDescuentos.importe = ;
              break;
          }
        }
      }
    );
  }
  public validacionesBoletaAnticipo(value: boolean) {
    //  Boleta Anticipo => true
    if (value === true) {
      //  Validación si existen items ingresados de forma normal, una boleta de anticipo no debe tener productos ingresados
      if (this._persistenciaService.getListaProductos().length === 0) {
        // this.guardarOrganizacion();
        this.tituloBoletaAnticipo = 'Boleta de Anticipo';
        this.invocarModalMontoacturaAnticipo();
        this.esBoletaAnticipo = value;
        this._persistenciaService.setEstadoFacturaAnticipo(true);
      } else {
        const that = this;
        this.esBoletaAnticipo = false;
        // this.boletaFormGroup.controls['txtDetraccion'].enable();
        $('#chkBoletaAnticipo').prop('checked', false);
        // try {
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
            //  Eliminar productos ingresados, para ingresar el monto de la boleta de anticipo
            if (result) {
              that._persistenciaService.eliminarListaItemsFactura();
              that.listaProductos = that._persistenciaService.getListaProductos();
              that.tabla.insertarData(that.listaProductos);
              //  this.recargarTabla();
              this.tituloBoletaAnticipo = 'Item(s) eliminado(s) correctamente.<br>Ingrese el monto de la boleta de anticipo';
              this.invocarModalMontoacturaAnticipo();
            } else {
              // this.boletaFormGroup.controls['txtDetraccion'].enable();
              that._persistenciaService.setEstadoFacturaAnticipo(false);
            }
          }
          );
        // }
        // catch(e){
        //   console.log('errrroojasldkfjasklñdfjañsdfj');
        //   console.log(e);
        // }
      }
      //  Boleta Anticipo => false
    } else {
      const that = this;
      if (this.esBoletaAnticipo) {
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
            //  that._persistenciaService.setEstadoBoletaAnticipo(false);
          }
          )
          .then((result) => {
            if (result) {
              that._persistenciaService.eliminarListaItemsFactura();
              that._persistenciaService.setEstadoFacturaAnticipo(false);
              that.esBoletaAnticipo = false;
              // that.boletaFormGroup.controls['txtDetraccion'].enable();
              that.listaProductos = that._persistenciaService.getListaProductos();
              that.tabla.insertarData(that.listaProductos);
              this.boleta.documentoParametro = [];
              //  this.boleta
              that.calcularMontos();
            } else {
              //  that._persistenciaService.setEstadoBoletaAnticipo(false);
              that.esBoletaAnticipo = true;
              $('#chkBoletaAnticipo').prop('checked', true);
            }
          }
          );
      }
    }
    this.listaProductos = this._persistenciaService.getListaProductos();
    this.tabla.insertarData(this.listaProductos);
    //  this.recargarTabla();
  }
  public seleccionBoletaAnticipo(value: boolean) {
    // this.guardarOrganizacion();
    let mensajeDocumentosRelacionadosExistentes: string;
    let tituloAdvertencia: string;
    let eliminarLabel: string;
    let cancelarLabel: string;
    this._translate.get('mensajeComprobanteConDocumentosRelacionados').subscribe(data => mensajeDocumentosRelacionadosExistentes = data);
    this._translate.get('mensajeNotificacionTituloAdvertencia').subscribe(data => tituloAdvertencia = data);
    this._translate.get('eliminar').subscribe(data => eliminarLabel = data);
    this._translate.get('cancelar').subscribe(data => cancelarLabel = data);
    const that = this;
    $('#chkBoletaAnticipo').prop('checked', !value);
    if (this.boleta.documentoReferencia.length > 0) {
      // try{
      //   console.log('try');
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
          //  Eliminar productos ingresados, para ingresar el monto de la boleta de anticipo
          if (result === true) {
            swal({
              title: 'Advertencia',
              text: 'Documentos Relacionados eliminados exitosamente.',
              confirmButtonText: 'CONTINUAR'
            });
            that._persistenciaService.removeDocumentosReferencia();
            this.boleta.documentoReferencia = [];
            this.validacionesBoletaAnticipo(value);
          } else {
            $('#chkBoletaAnticipo').prop('checked', false);
          }
        }
        );
      // }catch(e){
      //   console.log(e);
      // }
    } else {
      this.validacionesBoletaAnticipo(value);
    }
  }
  /**
   * Muestra modal para ingresar el monto de una Boleta de Anticipo
   */
  public invocarModalMontoacturaAnticipo() {
    let formatoMonedaLabel: string;
    this._translate.get('formatoMontoSwalLabel').subscribe(data => formatoMonedaLabel = data);
    const that = this;
    swal({
      title: this.tituloBoletaAnticipo,
      //  input: 'text',
      html: '<div class="form-group label-floating" xmlns="http://www.w3.org/1999/html">' +
            '<label class="control-label">Monto Boleta Anticipo (sin IGV)<span class="star">*</span> </label>' +
            '<input type="text" id="montoAnticipo" type="text" class="form-control"/> ' +
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
            const montoAnticipoInvalidos = montoAnticipo.filter(function (monto) {
              if (!regExp.test(monto)) {
                bandera = 1;
                return true;
              } else {
                if (Number(monto) <= 0 ) {
                  bandera = 2;
                  return true;
                }
                return false;
              }
            });
            if (bandera) {
              switch (bandera) {
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
        if (result) {
            this.setBoletaAnticipo(Number(that.formatearNumeroADecimales(Number(result))));
            swal({
              type: 'success',
              title: 'Acción Exitosa',
              confirmButtonText: 'CONTINUAR',
              confirmButtonColor: '#4caf50'
            });
            that.listaProductos = that._persistenciaService.getListaProductos();
            that.tabla.insertarData(that.listaProductos);
            this.esBoletaAnticipo = true;
            $('#chkBoletaAnticipo').prop('checked', true);
            this._persistenciaService.setEstadoFacturaAnticipo(true);
            // this.boletaFormGroup.controls['txtDetraccion'].disable();
            // this.boletaFormGroup.controls['txtDetraccion'].setValue('0.00');
        } else {
          this.esBoletaAnticipo = false;
          $('#chkBoletaAnticipo').prop('checked', false);
          this._persistenciaService.setEstadoFacturaAnticipo(false);
          // this.boletaFormGroup.controls['txtDetraccion'].enable();
        }
      });
  }
  public setBoletaAnticipo(montoBoletaAnticipo: number) {
    let documentoParametro: DocumentoParametro = new DocumentoParametro();
    //  this.recargarTabla();
    this.producto.descripcionItem = 'Boleta de Anticipo';
    this.producto.idRegistroUnidad = '0000001';
    this.producto.idTablaUnidad = '10000';
    this.producto.codigoUnidadMedida = 'NIU';
    this.producto.posicion = '1';
    //  Codigo Defecto Item Boleta Anticipo => FA00
    this.producto.codigoItem = this._tipos.BOLETA_ANTICIPO_VALOR_CODIGO_ITEM;
    this.producto.precioUnitario = this.formatearNumeroADecimales(montoBoletaAnticipo);
    this.producto.precioTotal = this.formatearNumeroADecimales(Number(((Number(this.producto.precioUnitario) * this.igv) +
      Number(this.producto.precioUnitario)).toString()));
    this.producto.cantidad = '1.00';
    this.producto.montoImpuesto = this.formatearNumeroADecimales((Number(this.producto.precioUnitario) * this.igv));
    // SUB DETALLE
    this.producto.detalle.idTipoIgv = this._tipos.BOLETA_ANTICIPO_ID_TIPO_IGV;
    this.producto.detalle.codigoTipoIgv = this._tipos.BOLETA_ANTICIPO_CODIGO_TIPO_IGV;
    this.producto.detalle.descripcionTipoIgv = this._tipos.BOLETA_ANTICIPO_DESCRIPCION_TIPO_IGV;
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
    this.producto.idTipoItemFactura = this._tipos.BOLETA_ANTICIPO_IDENTIFICADOR_ITEM;
    this._persistenciaService.agregarProducto(this.producto);

    this.boleta.tipoItem = this._tipos.TIPO_PRODUCTO_SERVICIO.toString();

    documentoParametro.descripcionParametro = this._tipos.BOLETA_ANTICIPO_DESCRIPCION_PARAMETRO;
    documentoParametro.idParametro = this._tipos.BOLETA_ANTICIPO_ID_PARAMETRO;
    documentoParametro.jsonn.tipo = this._tipos.BOLETA_ANTICIPO_TIPO_PARAMETRO;
    documentoParametro.jsonn.valor = this._tipos.BOLETA_ANTICIPO_TIPO_PARAMETRO_VALOR;
    documentoParametro.jsonn.auxiliarEntero = this._tipos.BOLETA_ANTICIPO_ID_DOMINIO;
    documentoParametro.jsonn.auxiliarCaracter = this._tipos.BOLETA_ANTICIPO_CODIGO_SUNAT;
    documentoParametro.jsonn.auxiliarFecha = null;
    documentoParametro.jsonn.auxiliarImporte = this.boleta.importeTotal;

    this.boleta.documentoParametro.push(documentoParametro);
    this._persistenciaService.setFactura(this.boleta);
    this.calcularMontos();
    //  this.recargarTabla();
    // this.boletaFormGroup.controls['txtDetraccion'].disable();
    // this.boletaFormGroup.controls['txtDetraccion'].setValue('0.00');
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
    const fechaActual = this.setMes(fecha.getDate()) + '/' + this.setMes(fecha.getMonth() + 1) + '/' + fecha.getFullYear().toString();
    //  const fechaActual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.boletaFormGroup = new FormGroup(
      {
        // 'txtRuc': new FormControl('', [
        //   Validators.required,
        //   Validators.pattern('[0-9]+'),
        //   // Validators.maxLength(11),
        //   // Validators.minLength(11)
        // ]
        // ),
        'txtRazonSocial': new FormControl('', [
          Validators.required,
          Validators.pattern('[A-Za-z0-9áéíóúÁÉÍÓÚ/%\\s-.;,]+'),
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
        'cmbTipoDocumento': new FormControl('',
          // [ Validators.required ]
        ),
        'txtNumeroDocumento': new FormControl('',
          // [Validators.required]
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
          // , [
          // Validators.required,
          // Validators.pattern('[0-9]{2}[/][0-9]{2}[/][0-9]{4}'),
          // Validators.maxLength(10),
          // Validators.minLength(10)
          // ]
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
        'chkBoletaAnticipo': new FormControl(''),
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
    //  this.boletaFormGroup.controls['cmbMoneda'].setValue('');
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
        if (this.esBoletaAnticipo) {
          this.esBoletaAnticipo = !this.esBoletaAnticipo;
          this._persistenciaService.setEstadoFacturaAnticipo(this.esBoletaAnticipo);
        }
        this._persistenciaService.eliminarItem(producto);
        this.recargarTabla();
        this.setFlagVistaPrevia();
        this.calcularMontos();
        // this._route.navigate( [this._rutas.URL_COMPROBANTE_EDITAR_BASE, producto.id] );
        break;
      case TipoAccion.EDITAR:
        if (this.esBoletaAnticipo) {
          this.editarItemBoletaAnticipo();
        } else {
          switch (producto.tipoProducto) {
            case this._tipos.TIPO_PRODUCTO_BIEN:
              this._persistenciaService.setPersistenciaSimple('idEditarProducto', producto.id);
              this.setBoletaCabeceraDetalle();
              this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_BOLETA_BIEN_EDITAR);
              break;
            case this._tipos.TIPO_PRODUCTO_SERVICIO:
              this._persistenciaService.setPersistenciaSimple('idEditarProducto', producto.id);
              this.setBoletaCabeceraDetalle();
              this._route.navigateByUrl(this._rutas.URL_COMPROBANTE_BOLETA_SERVICIO_EDITAR);
              break;
          }
        }
    }
  }
  public editarItemBoletaAnticipo() {
    const itemBoletaAnticipo = this._persistenciaService.getListaProductos()[0];
    const that = this;
    let formatoMonedaLabel: string;
    this._translate.get('formatoMontoSwalLabel').subscribe(data => formatoMonedaLabel = data);

    swal({
      title: 'Editar Boleta Anticipo',
      //  input: 'text',
      html: '<div class="form-group label-floating" xmlns="http://www.w3.org/1999/html">' +
        '<label class="control-label">Monto Boleta Anticipo (sin IGV)<span class="star">*</span> </label>' +
        '<input type="text" id="montoAnticipo" type="text" class="form-control" value="' + itemBoletaAnticipo.precioUnitario + '"/> ' +
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
            const montoAnticipoInvalidos = montoAnticipo.filter(function (monto) {
              if (!regExp.test(monto)) {
                bandera = 1;
                return true;
              } else {
                if (Number(monto) <= 0) {
                  bandera = 2;
                  return true;
                }
                return false;
              }
            });
            if (bandera) {
              switch (bandera) {
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
        if (result) {
          that._persistenciaService.removePersistenciaSimple('listaProductos');
          this.setBoletaAnticipo(Number(result));
          // this.
          swal({
            type: 'success',
            title: 'Acción Exitosa',
            confirmButtonText: 'CONTINUAR',
            confirmButtonColor: '#4caf50'
          });

          that.listaProductos = that._persistenciaService.getListaProductos();
          that.tabla.insertarData(that.listaProductos);
        }
      });

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
    console.log(this.boletaFormGroup.controls);
    console.log('!( ' + this.flagVistaPrevia + ' && ' + this.boletaFormGroup.valid + ' )');
    console.log(!(this.flagVistaPrevia && this.boletaFormGroup.valid));
  }
  /**
   * Metodo que realiza la busqueda para autocompletar
   * @param event
   */
  busquedaruc(event) {
    if (this.boletaFormGroup.get('txtNumeroDocumento').value.length === this.tamanioTipoDocumento) {
      const listaEntidades = this._entidadServices.buscarPorRuc(this.boletaFormGroup.get('txtNumeroDocumento').value
        + '?idTipoDocumento=' + (Number(this.boletaFormGroup.get('cmbTipoDocumento').value)).toString());
      console.log(listaEntidades);
      if (listaEntidades != null) {
        this.flagTipoDocumento = true;
        this.eliminarEstiloInputDosNiveles('txtRazonSocial', 'is-empty');
        listaEntidades.subscribe(
          data => {
            this.entidad_uno = data ? data : new Entidad();
            this.org_busqueda = this.entidad_uno;
            this.idEntidadCliente = this.entidad_uno.id;
            this.ubigeoCliente = this.entidad_uno.ubigeo;

            if (this.entidad_uno.denominacion) {
              if (this.entidad_uno.correoElectronico === '') {
                this.boletaFormGroup.controls['txtCorreo'].enable();
                this.agregarEstiloInput('txtRazonSocial', 'is-empty');
              } else {
                this.boletaFormGroup.controls['txtCorreo'].disable();
                this.boletaFormGroup.controls['txtRazonSocial'].setValue(this.entidad_uno.denominacion);
                this.eliminarEstiloInput('txtRazonSocial', 'is-empty');
              }
            } else {
              this.boletaFormGroup.controls['txtRazonSocial'].enable();
              this.agregarEstiloInput('txtRazonSocial', 'is-empty');
            }
            if (this.entidad_uno.correoElectronico) {
              if (this.entidad_uno.correoElectronico === '-') {
                this.boletaFormGroup.controls['txtCorreo'].enable();
                this.agregarEstiloInput('txtCorreo', 'is-empty');
              } else {
                this.boletaFormGroup.controls['txtCorreo'].disable();
                this.boletaFormGroup.controls['txtCorreo'].setValue(this.entidad_uno.correoElectronico);
                this.eliminarEstiloInput('txtCorreo', 'is-empty');
              }
            } else {
              this.boletaFormGroup.controls['txtCorreo'].enable();
              this.agregarEstiloInput('txtCorreo', 'is-empty');
            }
            if (this.entidad_uno.direccionFiscal) {
              if (this.entidad_uno.direccionFiscal !== '') {
                this.boletaFormGroup.controls['txtDireccionFiscal'].disable();
                this.boletaFormGroup.controls['txtDireccionFiscal'].setValue(this.entidad_uno.direccionFiscal);
                this.eliminarEstiloInput('txtDireccionFiscal', 'is-empty');
              } else {
                this.boletaFormGroup.controls['txtDireccionFiscal'].enable();
                this.agregarEstiloInput('txtDireccionFiscal', 'is-empty');
              }
            } else {
              this.boletaFormGroup.controls['txtDireccionFiscal'].enable();
              this.agregarEstiloInput('txtDireccionFiscal', 'is-empty');
            }
          }
        );
      } else {
        this.flagTipoDocumento = false;
        this.boletaFormGroup.controls['txtCorreo'].enable();
        this.boletaFormGroup.controls['txtDireccionFiscal'].enable();
        this.boletaFormGroup.controls['txtRazonSocial'].enable();
      }
    } else {
      this.boletaFormGroup.controls['txtRazonSocial'].reset();
      this.boletaFormGroup.controls['txtCorreo'].reset();
      this.boletaFormGroup.controls['txtDireccionFiscal'].reset();
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
        that._entidadServices.buscarPorRazonSocial(that.boletaFormGroup.get('txtRazonSocial').value, '6').subscribe(
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
    if (typeof this.boletaFormGroup.get('txtRazonSocial').value === 'object') {
      this.estadoautocomplete.next(true);
    } else {
      this.boletaFormGroup.get('txtNumeroDocumento').reset();
      this.boletaFormGroup.get('txtDireccionFiscal').reset();
      this.boletaFormGroup.get('txtRazonSocial').reset();
      this.boletaFormGroup.get('txtCorreo').reset();
      this.agregarEstiloInput('txtNumeroDocumento', 'is-empty');
      this.agregarEstiloInput('txtCorreo', 'is-empty');
      this.agregarEstiloInput('txtDireccionFiscal', 'is-empty');
      this.estadoautocomplete.next(false);
    }
  }
  public busqueda() {
    if (this.estadoautocomplete.value == true) {
      this.rucquery = this.cabeceraDatosBoleta.ruc;
    } else {
      this.rucquery = this.boletaFormGroup.get('txtRazonSocial').value.documento;
    }
    this.estadoautocomplete.next(false);
    if (this.boletaFormGroup.get('txtRazonSocial').value !== undefined && this.boletaFormGroup.get('txtRazonSocial').value != "") {
      this._entidadServices.buscarPorRuc(this.rucquery)
        .subscribe(
          data => {
            this.entidad_uno = data ? data : new Entidad();
            this.org_busqueda = this.entidad_uno;
            this.boletaFormGroup.controls['txtNumeroDocumento'].setValue(this.entidad_uno.documento);
            this.boletaFormGroup.controls['txtDireccionFiscal'].setValue(this.entidad_uno.direccionFiscal);
            this.boletaFormGroup.controls['txtRazonSocial'].setValue(this.entidad_uno.denominacion);
            this.boletaFormGroup.controls['txtCorreo'].setValue(this.entidad_uno.correoElectronico);
            this._entidadPersistenciaService.setEntidad(this.entidad_uno);
            //  this.eliminarEstiloInput('txtRazonSocial', 'is-empty');
            $('input').each(function () {
              $(this.parentElement).removeClass('is-empty');
            });
          },
          error => {
            if (error.status == 500) {
              swal({
                type: 'error',
                title: 'No se encontró la organización u ocurrió un problema en el servidor.',
                confirmButtonClass: 'btn btn-danger',
                buttonsStyling: false
              });
            }
          }
        )
    }
  }
  public validarRangoFechaCreacionVencimiento() {
    const fechaEmisionInput = new Date(this.boletaFormGroup.controls['txtFechaEmision'].value);
    const fechaVencimientoInput = new Date(this.boletaFormGroup.controls['txtFechaVencimiento'].value);
    if (fechaEmisionInput > fechaVencimientoInput) {
      this.flagRangoFechas = true;
      this.boletaFormGroup.invalid;
    } else {
      this.flagRangoFechas = false;
    }
  }
  public eliminarEstiloInputDosNiveles(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().parent().removeClass(estilo);
    }, 200);
  }
  
  guardarOrganizacion() {
    let organizacion:  OrganizacionDTO = new OrganizacionDTO;
    organizacion.correo = this.boletaFormGroup.controls['txtCorreo'].value;
    organizacion.direccion = this.boletaFormGroup.controls['txtDireccionFiscal'].value;
    organizacion.nombreComercial = this.boletaFormGroup.controls['txtRazonSocial'].value;
    organizacion.ruc = this.boletaFormGroup.controls['txtNumeroDocumento'].value; 
    organizacion.idTipoDocumento = this.boletaFormGroup.controls['cmbTipoDocumento'].value;
    if(organizacion.ruc.toString().length == this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC_TAMANIO && organizacion.tipoDocumento == this._cataloDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC){
      this._conceptoDocumentoService.guardarOrganizacion(organizacion).subscribe();
    }
    if(organizacion.ruc.toString().length == this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA_TAMANIO && organizacion.tipoDocumento == this._cataloDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA){
      this._conceptoDocumentoService.guardarOrganizacion(organizacion).subscribe();
    }
    if(organizacion.ruc.toString().length == this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD_TAMANIO && organizacion.tipoDocumento == this._cataloDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD){
      this._conceptoDocumentoService.guardarOrganizacion(organizacion).subscribe();
    }
    if(organizacion.ruc.toString().length == this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI_TAMANIO && organizacion.tipoDocumento == this._cataloDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI){
      this._conceptoDocumentoService.guardarOrganizacion(organizacion).subscribe();
    }
    if(organizacion.ruc.toString().length == this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE_TAMANIO && organizacion.tipoDocumento == this._cataloDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE){
      this._conceptoDocumentoService.guardarOrganizacion(organizacion).subscribe();
    }
  }
}
