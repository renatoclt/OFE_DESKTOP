import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TiposService } from '../utils/tipos.service';
import { Subscription } from 'rxjs';
import { RutasService } from '../utils/rutas.service';
import { CatalogoDocumentoIdentidadService } from '../utils/catalogo-documento-identidad.service';
import { TipoAccion } from '../data-table/utils/tipo-accion';
import { ConsultaDocumentoRelacionado } from '../models/consultaDocumentoRelacionado';
import { PersistenciaService } from '../../comprobantes/services/persistencia.service';
import { Accion, Icono } from '../data-table/utils/accion';
import { ModoVistaAccion } from '../data-table/utils/modo-vista-accion';
import { DataTableComponent } from '../data-table/data-table.component';
import { ConsultaComprobante } from '../../comprobantes/models/consultaComprobante';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ConsultaPercepcionRetencion } from '../../comprobantes/models/consultaPercepcionRecepcion';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EstadoDocumento } from '../models/documento/estadoDocumento';
import { EstadoDocumentoService } from '../services/documento/estadoDocumento.service';
import { TablaMaestraService } from '../services/documento/tablaMaestra.service';
import {
  TABLA_MAESTRA_DOCUMENTO_IDENTIDAD,
  TABLA_MAESTRA_TIPO_COMPROBANTE,
  TablaMaestra
} from '../models/documento/tablaMaestra';
import { SeriesService } from '../services/configuracionDocumento/series.service';
import { Serie } from '../models/configuracionDocumento/serie';
import { ComprobantesQuery, Evento } from '../../resumen-bajas/models/comprobantes-query';
import { ComprobantesService } from '../services/comprobantes/comprobantes.service';
import { ConsultaDocumentoQuery } from '../models/consultaDocumentoQuery';
import { PersistenciaServiceRetencion } from '../../percepcion-retencion/services/persistencia.service';
import { HttpParams } from '@angular/common/http';
import { DocumentoReferencia } from 'app/facturacion-electronica/comprobantes/models/documentoReferencia';
import { ConsultaDocumento } from 'app/facturacion-electronica/comprobantes/models/consultaDocumento';
import { TranslateService } from '@ngx-translate/core';
import { Comprobante } from 'app/facturacion-electronica/general/models/comprobantes/comprobante';
import {ValidadorPersonalizado} from '../services/utils/validadorPersonalizado';
import {PadreComprobanteService} from '../../comprobantes/services/padre-comprobante.service';
import {UtilsService} from '../utils/utils.service';
import {ColumnaDataTable} from '../data-table/utils/columna-data-table';
declare var $, swal: any;

@Component({
  selector: 'consulta-component',
  templateUrl: 'consulta.component.html',
  styleUrls: ['./consulta.component.css']
})

export class ConsultaComponent implements OnInit, AfterViewInit {
  public titulo: string;
  public labelBotonGenericoDataTable: string;
  public ordenarPorElCampoPercepcionRetencion: string;
  public columnasDocumentoRelacionado: ColumnaDataTable[];;
  public columnasComprobante: ColumnaDataTable[];
  public columnasPercepcionRecepcion: ColumnaDataTable[];
  public columnasResumenBoletas: ColumnaDataTable[];
  public tipoConsulta: number;
  public formatoTipoDocumento: number;
  public tamanioTipoDocumento: number;
  public tipoComprobanteFlag: boolean;
  public tipoDocumentoFlag: boolean;
  public ticketFlag: boolean;
  public estadoFlag: boolean;
  public documentoRelacionadoFlag: boolean;
  public comprobanteFlag: boolean;
  public percepcionRecepcionFlag: boolean;
  public flagConsulta: boolean;
  public flagResumenBoletas: boolean;
  public flagEstadoRequired: boolean;
  public estadoSerie: boolean;
  public estados: BehaviorSubject<EstadoDocumento[]>;
  public series: Serie[] = [];
  public subscriptionSerie: Subscription;
  public consultaFormGroup: FormGroup;
  public comprobantes_query: ComprobantesQuery[] = [];
  public tipoComprobanteRegistro: string;
  public urlConsulta: string;
  public urlConsultaRetencion: string;
  public tipoConsultaGeneral: string;
  public tipoConsultaRetencion: string;
  public showDialog = false;
  public lista_eventos: any = [];
  public comboruc = 'RUC';
  public consultaQuery: ConsultaDocumentoQuery = new ConsultaDocumentoQuery();
  public parametrosConsulta: HttpParams;
  public tiposComprobantes: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  public tiposDocumentos: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  public dtoOutConsultaComprobante: ConsultaComprobante[] = [];
  public dtoOutConsultaDocumentoRelacionado: ConsultaDocumentoRelacionado[] = [];
  public dtoOutConsultaPercepcionRetencion: ConsultaPercepcionRetencion[] = [];

  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  private todosTiposDocumentoIdentidad: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);

  public AccionesDocumentoRelacionado: Accion[] = [
    new Accion('seleccionar', new Icono('check-circle', 'btn-info'), TipoAccion.SELECCIONAR)
  ];
  public AccionesComprobante: Accion[] = [
    new Accion('visualizar', new Icono('check-circle', 'btn-info'), TipoAccion.VISUALIZAR),
    // new Accion('Generar Nota Crédito', new Icono('check-circle', 'btn-info'), TipoAccion.GENERAR_NOTA_CREDITO, 'chEstadocomprobantepago', [3]),
    // new Accion('Generar Nota Débito', new Icono('check-circle', 'btn-info'), TipoAccion.GENERAR_NOTA_DEBITO, 'chEstadocomprobantepago', [3]),
    new Accion('Dar de Baja', new Icono('check-circle', 'btn-info'), TipoAccion.ANULAR, 'chEstadocomprobantepago', [3]),
    new Accion('bitacora', new Icono('check-circle', 'btn-info'), TipoAccion.BITACORA),

  ];
  public AccionesPercepcionRecepcion: Accion[] = [
    new Accion('visualizar', new Icono('check-circle', 'btn-info'), TipoAccion.VISUALIZAR),
    new Accion('Dar de Baja', new Icono('check-circle', 'btn-info'), TipoAccion.ANULAR, 'chEstadocomprobantepago', [3]),
    new Accion('bitacora', new Icono('check-circle', 'btn-info'), TipoAccion.BITACORA),
  ];
  public AccionesResumenBoletas: Accion[] = [
    new Accion('visualizar', new Icono('check-circle', 'btn-info'), TipoAccion.VISUALIZAR),
    new Accion('Dar de Baja', new Icono('check-circle', 'btn-info'), TipoAccion.ANULAR, 'chEstadocomprobantepago', [3]),
    new Accion('bitacora', new Icono('check-circle', 'btn-info'), TipoAccion.BITACORA),
  ];

  public tipo: any = ModoVistaAccion.ICONOS;
  public tipoComprobante: any = ModoVistaAccion.COMBO;
  public tipoPercepcionRecepcion: any = ModoVistaAccion.COMBO;

  public documentoReferencia: DocumentoReferencia[] = [];

  @ViewChild('tablaConsultaDocumentoRelacionado') tablaConsultaDocumentoRelacionado: DataTableComponent<ConsultaDocumentoRelacionado>;
  @ViewChild('tablaConsultaComprobante') tablaComprobante: DataTableComponent<ConsultaComprobante>;
  @ViewChild('tablaConsultaPercepcionRetencion') tablaPercepcionRetencion: DataTableComponent<ConsultaPercepcionRetencion>;

  @ViewChild('modalBitacora') modalBitacora: BsModalComponent;

  constructor(
    private _route: ActivatedRoute,
    private _catalogoDocumentos: CatalogoDocumentoIdentidadService,
    private _router: Router,
    private _tipos: TiposService,
    private _rutas: RutasService,
    private _persistencia: PersistenciaService,
    private _estadoDocumentoService: EstadoDocumentoService,
    private _tablaMaestraService: TablaMaestraService,
    private _series: SeriesService,
    private _comprobantes: ComprobantesService,
    private _persistenciaRetencion: PersistenciaServiceRetencion,
    public _translateService: TranslateService,
    private _padreComprobanteService: PadreComprobanteService,
    private _utilsService: UtilsService) {
    this._padreComprobanteService.actualizarComprobante(this._route.snapshot.data['codigo'], this._route.snapshot.data['mostrarCombo']);
    this.flagConsulta = true;
    this.flagEstadoRequired = false;
    this.labelBotonGenericoDataTable = 'Seleccionar';
    this.columnasPercepcionRecepcion = [
      new ColumnaDataTable('tipoDocumento', 'entidadcompradora.vcTipoDocumento'),
      new ColumnaDataTable('numeroDocumento', 'entidadcompradora.vcDocumento'),
      new ColumnaDataTable('ticket', 'vcTicketRetencion'),
      new ColumnaDataTable('numeroSerie', 'vcSerie'),
      new ColumnaDataTable('correlativo', 'vcCorrelativo'),
      new ColumnaDataTable('fechaEmision', 'tsFechaemision'),
      new ColumnaDataTable('fechaEnvio', 'tsFechaenvio'),
      new ColumnaDataTable('estado', 'chEstadocomprobantepagocomp'),
      new ColumnaDataTable('importeTotal', 'deDctomonto', {'text-align': 'right'})
    ];
    this.columnasComprobante = [
      new ColumnaDataTable('tipoDocumento', 'entidadcompradora.vcTipoDocumento'),
      new ColumnaDataTable('numeroDocumento', 'entidadcompradora.vcDocumento'),
      new ColumnaDataTable('numeroSerie', 'vcSerie'),
      new ColumnaDataTable('correlativo', 'vcCorrelativo'),
      new ColumnaDataTable('fechaEmision', 'tsFechaemision'),
      new ColumnaDataTable('fechaEnvio', 'tsFechaenvio'),
      new ColumnaDataTable('estado', 'chEstadocomprobantepagocomp'),
      new ColumnaDataTable('importeTotal', 'deTotalcomprobantepago', {'text-align': 'right'})
    ];
    this.columnasDocumentoRelacionado = [
      new ColumnaDataTable('tipoComprobante', 'entidadcompradora.vcTipoDocumento'),
      new ColumnaDataTable('numeroComprobante', 'entidadcompradora.vcDocumento'),
      new ColumnaDataTable('numeroSerie', 'vcSerie'),
      new ColumnaDataTable('numeroCorrelativo', 'vcCorrelativo'),
      new ColumnaDataTable('fechaEmision', 'tsFechaemision'),
      new ColumnaDataTable('estado', 'chEstadocomprobantepagocomp'),
      new ColumnaDataTable('importeTotal', 'deTotalcomprobantepago', {'text-align': 'right'})
    ];
    this.columnasResumenBoletas = [
      new ColumnaDataTable('tipoDocumento', 'entidadcompradora.vcTipoDocumento'),
      new ColumnaDataTable('numeroDocumento', 'entidadcompradora.vcDocumento'),
      new ColumnaDataTable('ticket', 'vcTicketRetencion'),
      new ColumnaDataTable('numeroSerie', 'vcSerie'),
      new ColumnaDataTable('correlativo', 'vcCorrelativo'),
      new ColumnaDataTable('fechaEmision', 'tsFechaemision'),
      new ColumnaDataTable('fechaEnvio', 'tsFechaenvio'),
      new ColumnaDataTable('estado', 'chEstadocomprobantepagocomp'),
      new ColumnaDataTable('importeTotal', 'deDctomonto', {'text-align': 'right'})
    ];

    this.ordenarPorElCampoPercepcionRetencion = 'tsFechaemision';
    this.documentoRelacionadoFlag = false;
    this.comprobanteFlag = false;
    this.percepcionRecepcionFlag = false;
    this.flagResumenBoletas = false;
    this.estadoSerie = true;
    this.obtenerParametros();
    this.cargarServiciosArranque();
    this.formatoTipoDocumento = 0;
    this.tamanioTipoDocumento = 0;
  }
  ngOnInit() {
    this.InitForm();
    this.setCamposFormulario();
	  this.setFormatoDocumento();

  }
  ngAfterViewInit(): void {
    if (this.flagResumenBoletas) {
      this.setTipoDocumento();
    }
  }

  private cargarServiciosArranque() {
    let idDeEstados: number [] = [];
    switch (this.tipoConsulta) {
      case this._tipos.TIPO_CONSULTA_FACTURA_DOCUMENTO_RELACIONADO:
        idDeEstados = [
          this._tipos.TIPO_ESTADO_AUTORIZADO,
          this._tipos.TIPO_ESTADO_AUTORIZADO_CON_OBSERVACIONES,
          //  this._tipos.TIPO_ESTADO_ERROR,
          // this._tipos.TIPO_ESTADO_PENDIENTE_DE_ENVIO
        ];
        this.estados = this._estadoDocumentoService.obtenerPorIdEstadoComprobante( idDeEstados);
        this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
        this.todosTiposDocumentoIdentidad = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_DOCUMENTO_IDENTIDAD);
        break;
      case this._tipos.TIPO_CONSULTA_BOLETA_DOCUMENTO_RELACIONADO:
        idDeEstados = [
          this._tipos.TIPO_ESTADO_AUTORIZADO,
          this._tipos.TIPO_ESTADO_AUTORIZADO_CON_OBSERVACIONES,
          //  this._tipos.TIPO_ESTADO_ERROR,
          this._tipos.TIPO_ESTADO_PENDIENTE_DE_ENVIO
        ];
        this.estados = this._estadoDocumentoService.obtenerPorIdEstadoComprobante( idDeEstados);
        this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
        this.todosTiposDocumentoIdentidad = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_DOCUMENTO_IDENTIDAD);
        break;
      case this._tipos.TIPO_CONSULTA_COMPROBANTE:
        this.estados = this._estadoDocumentoService.obtenerEstadosComprobantes();
        this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
        this.todosTiposDocumentoIdentidad = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_DOCUMENTO_IDENTIDAD);
        break;
      case this._tipos.TIPO_CONSULTA_PERCEPCION_RETENCION:
        this.estados = this._estadoDocumentoService.obtenerEstadosComprobantes();
        this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
        this.todosTiposDocumentoIdentidad = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_DOCUMENTO_IDENTIDAD);
        break;
      case this._tipos.TIPO_CONSULTA_RESUMEN_BOLETAS:
        this.estados = this._estadoDocumentoService.obtenerEstadosComprobantes();
        this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
        this.todosTiposDocumentoIdentidad = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_DOCUMENTO_IDENTIDAD);
        break;
    }
  }
  private  obtenerParametros() {
    this.titulo = this._route.snapshot.data['titulo'];
    this.tipoConsulta = this._route.snapshot.data['tipoConsulta'];
  }
  private setCamposFormulario() {
    switch (this.tipoConsulta) {
      case this._tipos.TIPO_CONSULTA_FACTURA_DOCUMENTO_RELACIONADO:
        this.tipoComprobanteFlag = true;
        this.tipoDocumentoFlag = true;
        this.ticketFlag = false;
        this.estadoFlag = true;
        this.documentoRelacionadoFlag = true;
        this.comprobanteFlag = false;
        this.percepcionRecepcionFlag = false;
        this.flagEstadoRequired = true;
        this.consultaFormGroup.controls['cmbEstado'].setValidators([Validators.required]);
        break;
      case this._tipos.TIPO_CONSULTA_BOLETA_DOCUMENTO_RELACIONADO:
        this.tipoComprobanteFlag = true;
        this.tipoDocumentoFlag = true;
        this.ticketFlag = false;
        this.estadoFlag = true;
        this.documentoRelacionadoFlag = true;
        this.comprobanteFlag = false;
        this.percepcionRecepcionFlag = false;
        this.flagEstadoRequired = true;
        this.consultaFormGroup.controls['cmbEstado'].setValidators([Validators.required]);
        break;
      case this._tipos.TIPO_CONSULTA_COMPROBANTE:
        this.tipoComprobanteFlag = true;
        this.tipoDocumentoFlag = true;
        this.ticketFlag = false;
        this.estadoFlag = true;
        this.documentoRelacionadoFlag = false;
        this.comprobanteFlag = true;
        this.percepcionRecepcionFlag = false;
        this.flagEstadoRequired = false;
        break;
      case this._tipos.TIPO_CONSULTA_PERCEPCION_RETENCION:
        this.tipoComprobanteFlag = true;
        this.tipoDocumentoFlag = true;
        this.ticketFlag = false;
        this.estadoFlag = true;
        this.documentoRelacionadoFlag = false;
        this.comprobanteFlag = false;
        this.percepcionRecepcionFlag = true;
        this.flagEstadoRequired = false;
        break;
      case this._tipos.TIPO_CONSULTA_RESUMEN_BOLETAS:
        this.flagResumenBoletas = true;
        this.tipoComprobanteFlag = true;
        this.tipoDocumentoFlag = false;
        this.ticketFlag = true;
        this.estadoFlag = true;
        this.documentoRelacionadoFlag = false;
        this.comprobanteFlag = false;
        this.percepcionRecepcionFlag = true;
        this.flagEstadoRequired = true;
        this.estadoSerie = false;
        //  this.consultaFormGroup.controls['cmbEstado'].setValidators([Validators.required]);
        break;
    }
  }
  private setTipoComprobante() {

    let codigosComprobantes: string[] = [];
    switch (this.tipoConsulta) {
      case this._tipos.TIPO_CONSULTA_FACTURA_DOCUMENTO_RELACIONADO:
        codigosComprobantes = [
          this._tipos.TIPO_DOCUMENTO_FACTURA
        ];
        break;
      case this._tipos.TIPO_CONSULTA_BOLETA_DOCUMENTO_RELACIONADO:
        codigosComprobantes = [
          this._tipos.TIPO_DOCUMENTO_BOLETA
        ];
        break;
      case this._tipos.TIPO_CONSULTA_COMPROBANTE:
        codigosComprobantes = [
          this._tipos.TIPO_DOCUMENTO_BOLETA,
          this._tipos.TIPO_DOCUMENTO_FACTURA,
          // this._tipos.TIPO_DOCUMENTO_NOTA_CREDITO,
          // this._tipos.TIPO_DOCUMENTO_NOTA_DEBITO
        ];
        break;
      case this._tipos.TIPO_CONSULTA_PERCEPCION_RETENCION:
        codigosComprobantes = [
          this._tipos.TIPO_DOCUMENTO_RETENCION,
          this._tipos.TIPO_DOCUMENTO_PERCEPCION
        ];
        break;
      case this._tipos.TIPO_CONSULTA_RESUMEN_BOLETAS:
        codigosComprobantes = [
          this._tipos.TIPO_DOCUMENTO_RESUMEN_BOLETAS
      ];
        break;
    }
    //  Cambio de nombre de los comprobantes como deberáan llamarse, por no estar actualizados en la base de datos,
    switch(this.tipoConsulta) {
      case this._tipos.TIPO_CONSULTA_FACTURA_DOCUMENTO_RELACIONADO:
        this.tiposComprobantes =
          this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);
        this.tiposComprobantes.subscribe(
          data => {
            if (data.length > 0) {
              data[0].descripcionCorta = this._tipos.TIPO_DOCUMENTO_FACTURA_ANTICIPO_NOMBRE;
              data[0].descripcionLarga = this._tipos.TIPO_DOCUMENTO_FACTURA_ANTICIPO_NOMBRE;
            }
          }
        );
        break;
      case this._tipos.TIPO_CONSULTA_BOLETA_DOCUMENTO_RELACIONADO:
        this.tiposComprobantes =
          this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);
        this.tiposComprobantes.subscribe(
          data => {
            if (data.length > 0) {
              data[0].descripcionCorta = this._tipos.TIPO_DOCUMENTO_BOLETA_ANTICIPO_NOMBRE;
              data[0].descripcionLarga = this._tipos.TIPO_DOCUMENTO_BOLETA_ANTICIPO_NOMBRE;
            }
          }
        );
        break;
      case this._tipos.TIPO_CONSULTA_RESUMEN_BOLETAS:
        this.tiposComprobantes =
          this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);
        this.tiposComprobantes.subscribe(
          data => {
            if (data.length > 0) {
              data[0].descripcionCorta = this._tipos.TIPO_DOCUMENTO_RESUMEN_BOLETAS_NOMBRE;
              data[0].descripcionLarga = this._tipos.TIPO_DOCUMENTO_RESUMEN_BOLETAS_NOMBRE;
            }
          }
        );
        break;
      default:
        this.tiposComprobantes =
          this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);
        break;
    }
  }
  private InitForm() {
    const fecha = new Date();
    const fechaActual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();

    this.consultaFormGroup = new FormGroup({
      'cmbTipoComprobante': new FormControl('', [
        Validators.required
      ]),
      'cmbTipoDocumento': new FormControl('', [
        // Validators.required
      ]),
      'txtNumeroDocumento': new FormControl(''),
      'txtTicket': new FormControl(''),
      'cmbSerie': new FormControl(''),
      'cmbEstado': new FormControl(''),
      'txtNúmeroCorrelativoInicial': new FormControl(''),
      'txtNúmeroCorrelativoFinal': new FormControl(''),
      'dateFechaEmisionDel': new FormControl(fechaActual, [
        Validators.required
      ]),
      'dateFechaEmisionAl': new FormControl(fechaActual, [
        Validators.required
      ])
    }, ValidadorPersonalizado.fechaDeberiaSerMenor('dateFechaEmisionDel', 'dateFechaEmisionAl', 'errorFecha'));
    console.log(fechaActual);
    this.consultaFormGroup.controls['dateFechaEmisionDel'].setValue(fechaActual);
    this.consultaFormGroup.controls['dateFechaEmisionAl'].setValue(fechaActual);
    this.setTipoComprobante();
  }
  public setTipoDocumentoValidaciones() {
    switch (this.consultaFormGroup.controls['cmbTipoComprobante'].value) {
      case this._tipos.TIPO_DOCUMENTO_FACTURA:
        break;
      case this._tipos.TIPO_DOCUMENTO_BOLETA:
        break;
      case this._tipos.TIPO_DOCUMENTO_NOTA_CREDITO:
        break;
      case this._tipos.TIPO_DOCUMENTO_NOTA_DEBITO:
        break;
    }
  }
  public eliminarEstiloInput(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().removeClass(estilo);
    }, 200);
  }
  public getCodigosDocumentoGeneral(): string[] {
    const codigos: string[] = [
      this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI,
      this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA,
      this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
      this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD,
      this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_OTROS
    ];
    this.consultaFormGroup.controls['cmbTipoDocumento'].enable();
    return codigos;
  }
  public setTipoDocumento() {
    let codigosDocumentosIdentidad: string[] = [];
    this.consultaFormGroup.controls['txtTicket'].disable();
    console.log(this.consultaFormGroup.controls['cmbTipoComprobante'].value);
    switch (this.consultaFormGroup.controls['cmbTipoComprobante'].value) {
      case this._tipos.TIPO_DOCUMENTO_FACTURA:
        this.ticketFlag = false;
        this.consultaFormGroup.controls['txtTicket'].disable();
        codigosDocumentosIdentidad = [
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC
        ];
        break;
      case this._tipos.TIPO_DOCUMENTO_BOLETA:
        this.ticketFlag = false;
        this.consultaFormGroup.controls['txtTicket'].disable();
        codigosDocumentosIdentidad = [
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_OTROS
        ];
        this.consultaFormGroup.controls['cmbTipoDocumento'].enable();
        break;
      case this._tipos.TIPO_DOCUMENTO_NOTA_CREDITO:
        this.ticketFlag = false;
        this.consultaFormGroup.controls['txtTicket'].disable();
        codigosDocumentosIdentidad = [
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_OTROS
        ];
        this.consultaFormGroup.controls['cmbTipoDocumento'].enable();
        break;
      case this._tipos.TIPO_DOCUMENTO_NOTA_DEBITO:
        this.ticketFlag = false;
        this.consultaFormGroup.controls['txtTicket'].disable();
        codigosDocumentosIdentidad = [
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_OTROS
        ];
        this.consultaFormGroup.controls['cmbTipoDocumento'].enable();
        break;
      case this._tipos.TIPO_DOCUMENTO_PERCEPCION:
        codigosDocumentosIdentidad = [
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC
        ];
        this.consultaFormGroup.controls['cmbTipoDocumento'].enable();
        this.ticketFlag = false;
        this.consultaFormGroup.controls['txtTicket'].disable();
        break;
      case this._tipos.TIPO_DOCUMENTO_FACTURA_ANTICIPO:
        codigosDocumentosIdentidad = [
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_OTROS
        ];
        this.consultaFormGroup.controls['cmbTipoDocumento'].enable();
        // this.consultaFormGroup.controls['cmbTipoDocumento'].setValue( this.tiposDocumentos[0].id );
        break;
      case this._tipos.TIPO_DOCUMENTO_GUIA_REMISION_REMITENTE:
        this.ticketFlag = false;
        this.tipoDocumentoFlag = true;
        this.consultaFormGroup.controls['txtTicket'].disable();
        codigosDocumentosIdentidad = [
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD,
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_OTROS
        ];
        this.consultaFormGroup.controls['cmbTipoDocumento'].enable();
        break;
      case this._tipos.TIPO_DOCUMENTO_RETENCION:
        this.ticketFlag = true;
        this.consultaFormGroup.controls['txtTicket'].enable();
        codigosDocumentosIdentidad = [
          this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC_OFF,
          // this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA,
          // this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
          // this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD,
          // this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_OTROS
        ];
        this.consultaFormGroup.controls['cmbTipoDocumento'].enable();
        break;
      //  Default se usara para resumen de boletas
      case this._tipos.TIPO_DOCUMENTO_RESUMEN_BOLETAS:
        this.ticketFlag = true;
        this.consultaFormGroup.controls['txtTicket'].enable();
        this.consultaFormGroup.controls['cmbTipoDocumento'].disable();
        this.consultaFormGroup.controls['txtNumeroDocumento'].disable();
        codigosDocumentosIdentidad = [];
    }
    
    // this.consultaFormGroup.controls['cmbTipoDocumento'].setValue('-1');
    // this.eliminarEstiloInput('cmbTipoDocumento', 'is-empty');
    this.tiposDocumentos = this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposDocumentoIdentidad, codigosDocumentosIdentidad);
    this._series.filtroSecundarioSeries( localStorage.getItem('id_entidad'), this.consultaFormGroup.controls['cmbTipoComprobante'].value)
      .subscribe(
        valor => {
          this.series = valor;
          this.consultaFormGroup.controls['cmbTipoDocumento'].setValue('');
        });
  }
  public setFormatoDocumento() {
    this.consultaFormGroup.controls['txtNumeroDocumento'].setValue('');
    switch (this.consultaFormGroup.controls['cmbTipoDocumento'].value) {
      case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI:
        this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI_TAMANIO;
        this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_NUMERICO;
        break;
      case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA:
        this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA_TAMANIO;
        this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_ALFANUMERICO;
        break;
      case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE:
        this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE_TAMANIO;
        this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_ALFANUMERICO;
        break;
      case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC:
        this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC_TAMANIO;
        this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_NUMERICO;
        break;
      case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC_OFF:
        this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC_TAMANIO;
        this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_NUMERICO;
        break;
    }
  }
  /**
   * Metodo reutilizable para realizar las busquedas, y recargar la tabla,
   * - Tipo Comprobante, Numero de Documento, Fecha del y fecha al
   */
  public buscar() {
    // Funcion temporal para cargar data de mmuestra
    switch (this.tipoConsulta) {
      //  Se usa servicio de retenciones
      case this._tipos.TIPO_CONSULTA_COMPROBANTE:
        switch (this.consultaFormGroup.controls['cmbTipoComprobante'].value) {
          case this._tipos.TIPO_DOCUMENTO_BOLETA:
            this.filtroComprobante();
            break;
          case this._tipos.TIPO_DOCUMENTO_FACTURA:
            this.filtroComprobante();
            break;
          case this._tipos.TIPO_DOCUMENTO_NOTA_CREDITO:
            this.filtroComprobante(true);
            break;
          case this._tipos.TIPO_DOCUMENTO_NOTA_DEBITO:
            this.filtroComprobante(true);
            break;
          //  Retencion de Prueba para servicios
          default:
            this.filtroComprobante();
        }
        break;
      case this._tipos.TIPO_CONSULTA_FACTURA_DOCUMENTO_RELACIONADO:
        switch (this.consultaFormGroup.controls['cmbTipoComprobante'].value) {
          case this._tipos.TIPO_DOCUMENTO_FACTURA_ANTICIPO:
            this.filtroDocumentoRelacionado();
            //  Llamar Servicio de consulta de documentos relacionados para facturas de anticipo
            //  this.tablaConsultaDocumentoRelacionado.insertarData(this.dtoOutConsultaDocumentoRelacionado);
            break;
          case this._tipos.TIPO_DOCUMENTO_GUIA_REMISION_REMITENTE:
            this.filtroDocumentoRelacionado();
            //  Llamar Servicio de consulta de documentos relacionados para guia de remision remitente
            //  this.tablaConsultaDocumentoRelacionado.insertarData(this.dtoOutConsultaDocumentoRelacionado);
            break;
          default:
            this.filtroDocumentoRelacionado();
            break;
        }
        break;
      case this._tipos.TIPO_CONSULTA_BOLETA_DOCUMENTO_RELACIONADO:
        switch (this.consultaFormGroup.controls['cmbTipoComprobante'].value) {
          case this._tipos.TIPO_DOCUMENTO_BOLETA_ANTICIPO:
            this.filtroDocumentoRelacionado();
            //  Llamar Servicio de consulta de documentos relacionados para facturas de anticipo
            //  this.tablaConsultaDocumentoRelacionado.insertarData(this.dtoOutConsultaDocumentoRelacionado);
            break;
          case this._tipos.TIPO_DOCUMENTO_GUIA_REMISION_REMITENTE:
            this.filtroDocumentoRelacionado();
            //  Llamar Servicio de consulta de documentos relacionados para guia de remision remitente
            //  this.tablaConsultaDocumentoRelacionado.insertarData(this.dtoOutConsultaDocumentoRelacionado);
            break;
          default:
            this.filtroDocumentoRelacionado();
            break;
        }
        break;
      case this._tipos.TIPO_CONSULTA_PERCEPCION_RETENCION:
        switch (this.consultaFormGroup.controls['cmbTipoComprobante'].value) {
          case this._tipos.TIPO_DOCUMENTO_PERCEPCION:
            this.tipoComprobanteRegistro = '20';
            if (this.columnasPercepcionRecepcion.length > 8) {
              this.columnasPercepcionRecepcion.splice(2, 1);
            }
            this.filtroRetencion();
            break;
          case this._tipos.TIPO_DOCUMENTO_RETENCION:
            if (this.columnasPercepcionRecepcion.length < 9) {
              this.columnasPercepcionRecepcion.splice(2, 0, new ColumnaDataTable('ticket', 'vcTicketRetencion') );
            }
            this.tipoComprobanteRegistro = '20';
            this.filtroRetencion();
            break;
        }
        break;
      case this._tipos.TIPO_CONSULTA_RESUMEN_BOLETAS:
        this.filtroResumenBoletas();
        break;
    }
  }
  public formatearNumeroFormatoMoneda ( numero: string): string {
    const numeroInt = Number(numero);
    return numeroInt.toFixed(2);
  }
  public validarNumeroDocumento() {
    const cmbNumeroDocumento = this.consultaFormGroup.get('cmbTipoDocumento').value;
    const numeroDocumento = this.consultaFormGroup.get('txtNumeroDocumento').value;
    console.log('TIPO DE DOCUMENTO');
    console.log(cmbNumeroDocumento);
    if (cmbNumeroDocumento === '' || cmbNumeroDocumento === null) {
      if (numeroDocumento === '' || numeroDocumento === null) {
        this.flagConsulta = true;
      } else {
        swal({
          type: 'warning',
          title: 'Consulta inválida, debe seleccionar el tipo de documento.',
          confirmButtonClass: 'btn btn-danger',
          buttonsStyling: false
        });
        this.flagConsulta = false;
      }
    } else {
      console.log('NÚMERO DOCUMENTO');
      console.log(numeroDocumento);
      if (numeroDocumento === '' || numeroDocumento === null) {
        swal({
          type: 'warning',
          title: 'Debe ingresar el número de documento.',
          confirmButtonClass: 'btn btn-danger',
          buttonsStyling: false
        });
        this.flagConsulta = false;
      }
    }
  }
  /**
   * Metodo que valida y muestra un mensaje, indicando que los correlativos ingresados no son validos para la consulta.
   */
  public validarCorrelativosIngresados() {
    const correlativoInicial = this.consultaFormGroup.controls['txtNúmeroCorrelativoInicial'].value;
    const correlativoFinal = this.consultaFormGroup.controls['txtNúmeroCorrelativoFinal'].value;
    const serie = this.consultaFormGroup.controls['cmbSerie'].value;
    if (serie === '' || serie === null) {
      if ( correlativoInicial !== ''  || correlativoFinal !== '') {
        swal({
          type: 'warning',
          title: 'Consulta inválida, correlativos inválidos, sin una serie.',
          confirmButtonClass: 'btn btn-danger',
          buttonsStyling: false
        });
        this.flagConsulta = false;
      }
    } else {
      if ( correlativoInicial === '' ) {
        if ( correlativoFinal !== '' ) {
          swal({
            type: 'warning',
            title: 'Consulta Inválida, debe tener un rango válido para los correlativos.',
            confirmButtonClass: 'btn btn-danger',
            buttonsStyling: false
          });
          this.flagConsulta = false;
        } else {
          this.flagConsulta = true;
        }
      } else {
        if ( correlativoFinal === ''  ) {
          this.flagConsulta = true;
        } else {
          this.flagConsulta = true;
        }
      }
    }
  }
  public validarTicketSerie() {
    const series = this.consultaFormGroup.get('cmbSerie').value;
    console.log(series);
    if ((series !== '' && series !== null)) {
      this.flagConsulta = false;
      swal({
        type: 'warning',
        title: 'Consulta inválida, no se puede consultar tickets y series',
        confirmButtonClass: 'btn btn-danger',
        buttonsStyling: false
      });
    } else {
      this.flagConsulta = true;
    }
  }
  public validarIputs() {
    this.validarCorrelativosIngresados();
    this.validarNumeroDocumento();
    this.validarTicketSerie();
  }

  public filtroRetencion() {
    this.setDtoFiltroComprobante();
    this.consultaQuery.numeroPagina = this.tablaPercepcionRetencion.paginacion.pagina.getValue().toString();
    this.validacionesFiltroComprobante();
    if ( this.flagConsulta ) {
      console.log('SERVICIO');
      this.setParametrosFiltroConsulta();
      this.urlConsulta = this._comprobantes.urlConsultaQuery;
      this.tablaPercepcionRetencion.setParametros(this.parametrosConsulta);
      this.tablaPercepcionRetencion.cargarData( );
      this.tipoConsultaGeneral = this._comprobantes.TIPO_ATRIBUTO_COMPROBANTES_QUERY;
    }
  }
  public filtroResumenBoletas() {
    this.setDtoFiltroComprobante();
    this.consultaQuery.numeroPagina = this.tablaPercepcionRetencion.paginacion.pagina.getValue().toString();
    this.validacionesFiltroComprobante();
    if ( this.flagConsulta ) {
      console.log('SERVICIO');
      this.setParametrosFiltroConsulta();
      this.urlConsulta = this._comprobantes.urlConsultaQuery;
      this.tablaPercepcionRetencion.setParametros(this.parametrosConsulta);
      //this.cabeceraPercepcionRecepcion.push('');
      this.atributosPercepcionRetencion = [
        'entidadcompradora.vcTipoDocumento', 'entidadcompradora.vcDocumento', 'ticketResumen', 'vcSerie',
        'vcCorrelativo', 'tsFechaemision', 'tsFechaenvio', 'chEstadocomprobantepagocomp', 'deDctomonto'
      ];
      this.tablaPercepcionRetencion.cargarData( );
      this.tipoConsultaGeneral = this._comprobantes.TIPO_ATRIBUTO_COMPROBANTES_QUERY;
    }
  }

  iniciarDataDocumentoRelacionado(event) {
    this.tablaConsultaDocumentoRelacionado.insertarData([]);
  }
  iniciarDataComprobante(event) {
    //  this.tablaComprobante.insertarData(this.dtoOutConsultaComprobante);
  }
  iniciarDataPercepcionRetencion(event) {
    this.buscar();
  }
  public navigate(nav) {
    this._router.navigate(nav, { relativeTo: this._route });
  }
  public regresar() {
    switch (this.tipoConsulta) {
      // agregar mas tipos de consulta
      case this._tipos.CONSULTAS_BUSQUEDA_BOLETAS:
        this._router.navigateByUrl(this._rutas.URL_COMPROBANTE_BOLETA_DOCUMENTO_RELACIONADO);
        break;
      case this._tipos.CONSULTAS_BUSQUEDA_FACTURAS:
        this._router.navigateByUrl(this._rutas.URL_COMPROBANTE_FACTURA_DOCUMENTO_RELACIONADO);
        break;
    }
  }
  public showBitacora( eventos: Evento[]) {
    this.showDialog = !this.showDialog;
    this.lista_eventos = eventos;
  }
  public eliminar(elementos: ConsultaDocumentoRelacionado[]) {
  }

  public agregarItem(agrego: boolean) {
  }

  public ejecutarAccion(evento: [TipoAccion, ConsultaDocumentoRelacionado]) {
    const tipoAccion = evento[0];
    let itemSeleccionado: ConsultaDocumentoRelacionado = new ConsultaDocumentoRelacionado();
    itemSeleccionado = evento[1];
    switch (evento[0]) {
      case TipoAccion.SELECCIONAR:
        this._persistencia.setItemConsultaDocumentoRelacionado(itemSeleccionado);
        this.regresar();
        break;
      // this._route.navigate( [this._rutas.URL_COMPROBANTE_EDITAR_BASE, producto.id] );
    }
  }
  public ejecutarAccionComprobante(evento: [TipoAccion, ConsultaPercepcionRetencion]) {
    const tipoAccion = evento[0];
    const itemSeleccionado = evento[1];
    let comprobantePersistencia: Comprobante = new Comprobante();
    switch (tipoAccion) {
      case TipoAccion.VISUALIZAR:
        let nuevaUrl = '';
        switch (itemSeleccionado.vcIdregistrotipocomprobante) {
          case this._tipos.TIPO_DOCUMENTO_FACTURA:
            nuevaUrl = this._rutas.URL_CONSULTAR_COMPROBANTE_FACTURA_VISUALIZAR;
            break;
          case this._tipos.TIPO_DOCUMENTO_BOLETA:
            nuevaUrl = this._rutas.URL_CONSULTAR_COMPROBANTE_BOLETA_VISUALIZAR;
            break;
          case this._tipos.TIPO_DOCUMENTO_NOTA_CREDITO:
            nuevaUrl = this._rutas.URL_CONSULTAR_COMPROBANTE_NOTA_CREDITO_VISUALIZAR;
            break;
          case this._tipos.TIPO_DOCUMENTO_NOTA_DEBITO:
            nuevaUrl = this._rutas.URL_CONSULTAR_COMPROBANTE_NOTA_DEBITO_VISUALIZAR;
            break;
        }
        this._router.navigate(['./' + nuevaUrl + '/' + itemSeleccionado.inIdcomprobantepago], { relativeTo: this._route});
        break;
      case TipoAccion.BITACORA:
        this.showBitacora(itemSeleccionado.eventos);
        break;
      case TipoAccion.ANULAR:
        comprobantePersistencia.inIdcomprobantepago = itemSeleccionado.inIdcomprobantepago;
        comprobantePersistencia.vcSerie = itemSeleccionado.vcSerie;
        comprobantePersistencia.vcCorrelativo = itemSeleccionado.vcCorrelativo;
        comprobantePersistencia.fechaEmision = itemSeleccionado.tsFechaemision;
        comprobantePersistencia.tipoComprobante = itemSeleccionado.chIdtipocomprobante;
        comprobantePersistencia.chEstadocomprobantepago = itemSeleccionado.chEstadocomprobantepago;
        comprobantePersistencia.chEstadocomprobantepagocomp = itemSeleccionado.chEstadocomprobantepagocomp;
        this._persistencia.setPersistenciaSimple('comprobanteConsultaSeleccionado', comprobantePersistencia);
        this._router.navigateByUrl(this._rutas.URL_RESUMEN_BAJAS);
        break;
      case TipoAccion.GENERAR_NOTA_CREDITO:
        comprobantePersistencia.inIdcomprobantepago = itemSeleccionado.inIdcomprobantepago;
        comprobantePersistencia.tipoComprobante = itemSeleccionado.chIdtipocomprobante;
        comprobantePersistencia.numeroComprobante = itemSeleccionado.vcSerie + '-' + itemSeleccionado.vcCorrelativo;
        comprobantePersistencia.vcDocumentoCliente = itemSeleccionado.entidadcompradora.vcDocumento;
        comprobantePersistencia.vcDenominacionCliente = itemSeleccionado.entidadcompradora.vcDenominacion;
        comprobantePersistencia.moneda = itemSeleccionado.chMonedacomprobantepago;
        this._persistencia.setPersistenciaSimple('comprobanteConsultaSeleccionado', comprobantePersistencia);
        this._router.navigateByUrl(this._rutas.URL_NOTA_CREDITO_CREAR);
        break;
      case TipoAccion.GENERAR_NOTA_DEBITO:
        comprobantePersistencia.inIdcomprobantepago = itemSeleccionado.inIdcomprobantepago;
        comprobantePersistencia.tipoComprobante = itemSeleccionado.chIdtipocomprobante;
        comprobantePersistencia.numeroComprobante = itemSeleccionado.vcSerie + '-' + itemSeleccionado.vcCorrelativo;
        comprobantePersistencia.vcDocumentoCliente = itemSeleccionado.entidadcompradora.vcDocumento;
        comprobantePersistencia.vcDenominacionCliente = itemSeleccionado.entidadcompradora.vcDenominacion;
        comprobantePersistencia.moneda = itemSeleccionado.chMonedacomprobantepago;
        this._persistencia.setPersistenciaSimple('comprobanteConsultaSeleccionado', comprobantePersistencia);
        this._router.navigateByUrl(this._rutas.URL_NOTA_DEBITO_CREAR);
        break;
    }
  }
  /**
   * APLICA PARA RETENCIONES Y RESUMEN DE BOLETAS
   * Metodo que ejecuta las acciones de la tabla
   * @param evento Row completo con toda la data de tabla seleccionada
   */
  public ejecutarAccionRecepcionPercepcion(evento: [TipoAccion, ConsultaPercepcionRetencion]) {
    const tipoAccion = evento[0];
    let itemSeleccionado: ConsultaPercepcionRetencion = new ConsultaPercepcionRetencion();
    itemSeleccionado = evento[1];
    switch (tipoAccion) {
      case TipoAccion.VISUALIZAR:
        console.log(itemSeleccionado.inIdcomprobantepago);
        //  APLICA PARA RETENCIONES Y RESUMENES DE BAJAS
        if (this.tipoConsulta === Number( this._tipos.TIPO_CONSULTA_PERCEPCION_RETENCION)) {
          this._persistenciaRetencion.setUUIDConsultaRetencion(itemSeleccionado.inIdcomprobantepago);
          this._router.navigateByUrl('percepcion-retencion/consultar/visualizar');
        } else {
          alert('Resumen de Boletas');
        }
        break;
      case TipoAccion.GENERAR_NOTA_CREDITO:
        this._router.navigateByUrl('comprobantes/notaCredito/crear');
        break;
      case TipoAccion.GENERAR_NOTA_DEBITO:
        this._router.navigateByUrl('comprobantes/notaDebito/crear');
        break;
      case TipoAccion.BITACORA:
        console.log('ENTRO A BITACORA');
        this.showBitacora(itemSeleccionado.eventos);
        break;
      case TipoAccion.ANULAR:
        let comprobantePersistencia: Comprobante = new Comprobante();
        comprobantePersistencia.inIdcomprobantepago = itemSeleccionado.inIdcomprobantepago;
        comprobantePersistencia.vcSerie = itemSeleccionado.vcSerie;
        comprobantePersistencia.vcCorrelativo = itemSeleccionado.vcCorrelativo;
        comprobantePersistencia.fechaEmision = itemSeleccionado.tsFechaemision;
        comprobantePersistencia.tipoComprobante = itemSeleccionado.chIdtipocomprobante;
        comprobantePersistencia.chEstadocomprobantepago = itemSeleccionado.chEstadocomprobantepago;
        comprobantePersistencia.chEstadocomprobantepagocomp = itemSeleccionado.chEstadocomprobantepagocomp;

        this._persistencia.setPersistenciaSimple('comprobanteConsultaSeleccionado', comprobantePersistencia);
        this._router.navigateByUrl(this._rutas.URL_RESUMEN_BAJAS);
        break;
    }
  }
  public limpiar() {
    this.consultaFormGroup.reset();
    this.series = [];
    setTimeout(function () {
      $('input').each(function () {
        $(this.parentElement).addClass('is-empty');
      });
      $('select').each(function () {
        $(this.parentElement).addClass('is-empty');
      });
    }, 200);
    this.ticketFlag = false;
    const fecha = new Date();
    const fechaActual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.consultaFormGroup.controls['dateFechaEmisionDel'].setValue(fechaActual);
    this.consultaFormGroup.controls['dateFechaEmisionAl'].setValue(fechaActual);
    this.consultaFormGroup.controls['txtNúmeroCorrelativoInicial'].setValue('');
    this.consultaFormGroup.controls['txtNúmeroCorrelativoFinal'].setValue('');
    this.consultaFormGroup.controls['cmbEstado'].setValue('');
    this.consultaFormGroup.controls['cmbSerie'].setValue('');
    this.consultaFormGroup.controls['txtTicket'].setValue('');
    this.consultaFormGroup.controls['txtNumeroDocumento'].setValue('');
    this.consultaFormGroup.controls['cmbTipoDocumento'].setValue('');
    this.consultaFormGroup.controls['cmbTipoComprobante'].setValue('');
    this.tiposDocumentos = new BehaviorSubject<TablaMaestra[]>([]);

    this.eliminarEstiloInput('dateFechaEmisionDel', 'is-empty');
    this.eliminarEstiloInput('dateFechaEmisionAl', 'is-empty');
    this.formatoTipoDocumento = 0;
    this.tamanioTipoDocumento = 0;
    if (this.flagResumenBoletas) {
      this.consultaFormGroup.controls['cmbTipoComprobante'].setValue(this._tipos.TIPO_DOCUMENTO_BOLETA);
      this.setTipoDocumento();
    }
    switch ( this.tipoConsulta ) {
      case this._tipos.TIPO_CONSULTA_COMPROBANTE:
        this.filtroComprobante();
        break;
      case this._tipos.TIPO_CONSULTA_BOLETA_DOCUMENTO_RELACIONADO:
        this.consultaQuery.anticipo = 'S';
        this.filtroDocumentoRelacionado();
        break;
      case this._tipos.TIPO_CONSULTA_FACTURA_DOCUMENTO_RELACIONADO:
        this.consultaQuery.anticipo = 'S';
        this.filtroDocumentoRelacionado();
        break;
      case this._tipos.TIPO_CONSULTA_RESUMEN_BOLETAS:
      this.ticketFlag = true;
        this.consultaFormGroup.controls['txtTicket'].enable();
        this.filtroResumenBoletas();
        break;
      case this._tipos.TIPO_CONSULTA_PERCEPCION_RETENCION:
        this.filtroRetencion();
        break;
    }
  }

  public close() {
    this.modalBitacora.close();
  }
  public show() {
    this.modalBitacora.open();
  }

  /**
   * Métodos genericos para consulta
   */
  public setParametrosFiltroConsulta() {
    if (this.flagConsulta) {
      this.parametrosConsulta = new HttpParams()
        .set('idEntidadEmisora', this.consultaQuery.idEntidadEmisora)
        .set('tipoComprobanteTabla', this.consultaQuery.tipoComprobanteTabla)
        .set('tipoComprobanteRegistro', this.consultaQuery.tipoComprobanteRegistro)
        .set('fechaEmisionDel', this.consultaQuery.fechaDel)
        .set('fechaEmisionAl', this.consultaQuery.fechaAl)
        .set('tipoDocumento', this.consultaQuery.tipoDocumento)
        .set('nroDocumento', this.consultaQuery.numeroDocumento)
        .set('ticket', this.consultaQuery.ticket)
        .set('estado', this.consultaQuery.estado)
        .set('nroSerie', this.consultaQuery.serie)
        .set('correlativoInicial', this.consultaQuery.correlativoInicial)
        .set('correlativoFinal', this.consultaQuery.correlativoFinal)
        .set('nroPagina', this.consultaQuery.numeroPagina)
        .set('regXPagina', this.consultaQuery.registroPorPagina)
        .set('ordenar', this.consultaQuery.ordenar)
        .set('fechaBajaDel', this.consultaQuery.fechaBajaDel)
        .set('fechaBajaAl', this.consultaQuery.fechaBajaAl)
        .set('ticketBaja', this.consultaQuery.ticketBaja)
        .set('seriecorrelativo', this.consultaQuery.seriecorrelativo)
        .set('ticketResumen', this.consultaQuery.ticketResumen)
        .set('anticipo', this.consultaQuery.anticipo);
    }
  }
  /**
   * Método que invoca modal para las notificaciones
   * @param titulo
   * @param mensaje
   * @param tipoAlerta
   * @param botonLabel
   */
  public modalNotificacion(titulo: string, mensaje: string, tipoAlerta: string, botonLabel = 'Sí', colorBoton = '#ff9800') {
    swal({
      title: titulo,
      html:
      '<div class="text-center"> ' + mensaje + '</div>',
      type: tipoAlerta,
      confirmButtonText: botonLabel,
      confirmButtonColor: colorBoton
    });
  }
  /**
   * Métodos para consulta de Documento Relacionado
   */

  /**
   * Método que carga los parametros del formulario
   */
  public setDtoFiltroDocumentoRelacionado() {
    const tipoDocumento = this.consultaFormGroup.get('cmbTipoDocumento').value;
    const numeroDocumento = this.consultaFormGroup.get('txtNumeroDocumento').value;
    const estado = this.consultaFormGroup.get('cmbEstado').value;
    const serie = this.consultaFormGroup.get('cmbSerie').value;
    const correlativoFinal = this.consultaFormGroup.get('txtNúmeroCorrelativoFinal').value;
    const correlativoInicial = this.consultaFormGroup.get('txtNúmeroCorrelativoInicial').value;
    const fechaDel = this.consultaFormGroup.get('dateFechaEmisionDel').value;
    const fechaAl = this.consultaFormGroup.get('dateFechaEmisionAl').value;
    this.consultaQuery.idEntidadEmisora = localStorage.getItem('id_entidad');
    this.consultaQuery.numeroPagina = this.tablaConsultaDocumentoRelacionado.paginacion.pagina.getValue().toString();
    this.consultaQuery.registroPorPagina = '10';
    //  this.consultaQuery.registroPorPagina = this.tablaConsultaDocumentoRelacionado.paginacion.tamanio.getValue().toString();
    this.consultaQuery.ordenar = 'tsFechaemision';
    //  this.consultaQuery.ordenar = this.tablaConsultaDocumentoRelacionado.paginacion.orden.getValue();
    // consultaDocumentoRelacionado.ordenar = 'inIdcomprobantepago';
    //  this.consultaQuery.tipoComprobanteRegistro = this.consultaFormGroup.controls['cmbTipoComprobante'].value;
    this.consultaQuery.tipoComprobanteRegistro = this.consultaFormGroup.controls['cmbTipoComprobante'].value;
    this.consultaQuery.tipoComprobanteTabla = '10007';
    this.consultaQuery.fechaDel = fechaDel;
    this.consultaQuery.fechaAl = fechaAl;

    //  Logica de campos a enviar el servicio
    if ( serie === '' || !serie ) {
      if ( tipoDocumento === '' || !tipoDocumento ) {
        if ( estado === '' || !estado ) {
          console.log('CONSULTA BASE');
        } else {
          console.log('CONSULTA ESTADO');
          this.consultaQuery.estado = estado;
        }
      } else {
        if ( estado === ''  || !estado) {
          console.log('CONSUlTA TIPO DOCUMENTO');
          this.consultaQuery.tipoDocumento = tipoDocumento;
        } else {
          console.log('CONSULTA TIPO DOCUMENTO - ESTADO');
          this.consultaQuery.tipoDocumento = tipoDocumento;
          this.consultaQuery.estado = estado;
        }
      }
    } else {
      if ( correlativoInicial === '' ) {
        if ( estado === '' || !estado ) {
          if ( tipoDocumento === '' || !tipoDocumento) {
            this.consultaQuery.serie = serie;
            console.log('CONSULTA SERIE');
          } else {
            this.consultaQuery.serie = serie;
            this.consultaQuery.tipoDocumento = tipoDocumento;
            console.log('CONSULTA SERIE - TIPO DOCUMENTO');
          }
        } else {
          if ( tipoDocumento === '' || !tipoDocumento) {
            this.consultaQuery.serie = serie;
            this.consultaQuery.estado = estado;
            console.log('CONSULTA SERIE - ESTADO');
          } else {
            this.consultaQuery.serie = serie;
            this.consultaQuery.tipoDocumento = tipoDocumento;
            this.consultaQuery.estado = estado;
            console.log('CONSULTA SERIE - ESTADO - TIPO DOCUMENTO');
          }
        }
      } else {
        if ( correlativoFinal === '' || !correlativoFinal ) {
          if ( estado === '' || !estado ) {
            if ( tipoDocumento === '' || !tipoDocumento) {
              this.consultaQuery.serie = serie;
              this.consultaQuery.correlativoInicial = correlativoInicial;
              console.log('CONSULTA SERIE - CI');
            } else {
              this.consultaQuery.serie = serie;
              this.consultaQuery.correlativoInicial = correlativoInicial;
              this.consultaQuery.tipoDocumento = tipoDocumento;
              console.log('CONSULTA SERIE - CI - TIPO DOCUMENTO');
            }
          } else {
            if ( tipoDocumento === '' || !tipoDocumento) {
              this.consultaQuery.serie = serie;
              this.consultaQuery.correlativoInicial = correlativoInicial;
              this.consultaQuery.estado = estado;
              console.log('CONSULTA SERIE - CI - ESTADO');
            } else {
              this.consultaQuery.serie = serie;
              this.consultaQuery.correlativoInicial = correlativoInicial;
              this.consultaQuery.estado = estado;
              this.consultaQuery.tipoDocumento = tipoDocumento;
              console.log('CONSULTA SERIE - CI - ESTADO - TIPO DOCUMENTO');
            }
          }
        } else {
          if ( estado === '' || !estado ) {
            if ( tipoDocumento === '' || !tipoDocumento) {
              this.consultaQuery.serie = serie;
              this.consultaQuery.correlativoInicial = correlativoInicial;
              this.consultaQuery.correlativoFinal = correlativoFinal;
              console.log('CONSULTA SERIE - CI - CF');
            } else {
              this.consultaQuery.serie = serie;
              this.consultaQuery.correlativoInicial = correlativoInicial;
              this.consultaQuery.correlativoFinal = correlativoFinal;
              console.log('CONSULTA SERIE - CI - CF - TIPO DOCUMENTO');
            }
          } else {
            if ( tipoDocumento === '' || !tipoDocumento) {
              this.consultaQuery.serie = serie;
              this.consultaQuery.correlativoInicial = correlativoInicial;
              this.consultaQuery.correlativoFinal = correlativoFinal;
              console.log('CONSULTA SERIE - CI - CF - ESTADO');
            } else {
              this.consultaQuery.serie = serie;
              this.consultaQuery.correlativoInicial = correlativoInicial;
              this.consultaQuery.correlativoFinal = correlativoFinal;
              console.log('CONSULTA SERIE - CI - CF - ESTADO - TIPO DOCUMENTO');
            }
          }
        }
      }
    }
    // Los campos restantes de consulta query, por defecto se inicializan en ''
  }
  /**
   * Método que consulta los documentos relacionados de una factura
   */
  public filtroDocumentoRelacionado() {
    this.setDtoFiltroComprobante();
    this.consultaQuery.numeroPagina = this.tablaConsultaDocumentoRelacionado.paginacion.pagina.getValue().toString();
    this.validacionesFiltroComprobante();
    if ( this.flagConsulta ) {
      console.log('SERVICIO');
      this.setParametrosFiltroConsulta();
      this.urlConsulta = this._comprobantes.urlConsultaQuery;
      this.tablaConsultaDocumentoRelacionado.setParametros(this.parametrosConsulta);
      this.tablaConsultaDocumentoRelacionado.cargarData( );
      this.tipoConsultaGeneral = this._comprobantes.TIPO_ATRIBUTO_COMPROBANTES_QUERY;
    }
  }
  /**
   * Método que ejecuta las acciones de boton guardar del datatable
   */
  public seleccionarDocumentosRelacionados(elementos: ConsultaDocumento[]) {
    const consultaDocumentoRelacionado: any[] = this.tablaConsultaDocumentoRelacionado.getItemsSeleccionados();
      let listaActualItems: DocumentoReferencia [] = [];
      listaActualItems = this._persistencia.getDocumentosReferencia();
      let listaSeleccionados: ConsultaDocumento[] = [];
      listaSeleccionados = elementos;
      const listaPersistencia: DocumentoReferencia[] = [];
      for ( let a = 0 ; a < listaSeleccionados.length ; a++) {
        const itemPersistencia: DocumentoReferencia = new DocumentoReferencia();
        itemPersistencia.id = a + listaActualItems.length;
        itemPersistencia.idComprobante = listaSeleccionados[a].inIdcomprobantepago; ;
        itemPersistencia.idDocumentoDestino = listaSeleccionados[a].inIdcomprobantepago;
        itemPersistencia.nombreTipoDocumento = listaSeleccionados[a].vcTipocomprobante;
        itemPersistencia.tipoDocumentoOrigen = this._tipos.TIPO_DOCUMENTO_FACTURA;
        itemPersistencia.tipoDocumentoDestino = listaSeleccionados[a].chIdtipocomprobante;
        itemPersistencia.tipoDocumentoDestinoDescripcion = listaSeleccionados[a].vcTipocomprobante;
        itemPersistencia.tipoDocumentoOrigenDescripcion = this._tipos.TIPO_DOCUMENTO_FACTURA_NOMBRE;
        itemPersistencia.serieDocumentoDestino = listaSeleccionados[a].vcSerie;
        itemPersistencia.correlativoDocumentoDestino = listaSeleccionados[a].vcCorrelativo;
        itemPersistencia.fechaEmisionDestino = listaSeleccionados[a].tsFechaemision;
        itemPersistencia.totalImporteDestino = listaSeleccionados[a].deTotalcomprobantepago;
        itemPersistencia.totalImporteAuxiliarDestino = listaSeleccionados[a].deImpuesto1;
        itemPersistencia.monedaDestino = listaSeleccionados[a].chMonedacomprobantepago;
        itemPersistencia.fechaEmisionDocumentoDestino = Number (new Date(listaSeleccionados[a].tsFechaemision));
        itemPersistencia.auxiliar1 = '1';
        itemPersistencia.auxiliar2 = listaSeleccionados[a].deSubtotalcomprobantepago;
        itemPersistencia.anticipo = '0.00';
        listaPersistencia.push( itemPersistencia );
      this._persistencia.setListaDocumentosReferencia(listaPersistencia);
      console.log('LISTA PERSISTENCIA');
      console.log(this._persistencia.getDocumentosReferencia());
      switch(this.tipoConsulta) {
        case this._tipos.TIPO_CONSULTA_FACTURA_DOCUMENTO_RELACIONADO:
          this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_DOCUMENTO_RELACIONADO );
          break;
        case this._tipos.TIPO_CONSULTA_BOLETA_DOCUMENTO_RELACIONADO:
          this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_BOLETA_DOCUMENTO_RELACIONADO );
          break;
      }
    }
  }
  /**
   * Método para consulta de Comproabantes
   */
  public setDtoFiltroComprobante() {
    const tipoDocumento = this.consultaFormGroup.get('cmbTipoDocumento').value;
    const numeroDocumento = this.consultaFormGroup.get('txtNumeroDocumento').value;
    const estado = this.consultaFormGroup.get('cmbEstado').value;
    const serie = this.consultaFormGroup.get('cmbSerie').value;
    const correlativoFinal = this.consultaFormGroup.get('txtNúmeroCorrelativoFinal').value;
    const correlativoInicial = this.consultaFormGroup.get('txtNúmeroCorrelativoInicial').value;
    const fechaDel = this.consultaFormGroup.get('dateFechaEmisionDel').value;
    const fechaAl = this.consultaFormGroup.get('dateFechaEmisionAl').value;
    const ticket = this.consultaFormGroup.get('txtTicket').value;
    const tipoComprobante = this.consultaFormGroup.controls['cmbTipoComprobante'].value;
    this.consultaQuery.idEntidadEmisora = localStorage.getItem('id_entidad');
    this.consultaQuery.registroPorPagina = '10';
    this.consultaQuery.ordenar = 'tsFechaemision';
    this.consultaQuery.tipoComprobanteRegistro = tipoComprobante;
    this.consultaQuery.tipoComprobanteTabla = '10007';
    this.consultaQuery.tipoDocumento = tipoDocumento;
    this.consultaQuery.correlativoFinal = correlativoFinal;
    this.consultaQuery.correlativoInicial = correlativoInicial;
    this.consultaQuery.estado = estado;
    this.consultaQuery.fechaBajaAl = '';
    this.consultaQuery.fechaBajaDel = '';
    this.consultaQuery.numeroDocumento = numeroDocumento;
    this.consultaQuery.serie = serie;
    this.consultaQuery.ticket = '';
    this.consultaQuery.ticketBaja = '';
    this.consultaQuery.seriecorrelativo = '';
    this.consultaQuery.ticketResumen = '';

    // if ( this.tipoConsulta === this._tipos.TIPO_CONSULTA_BOLETA_DOCUMENTO_RELACIONADO) {
    //   this.consultaQuery.anticipo = 'S';
    // }
    // if ( this.tipoConsulta === this._tipos.TIPO_CONSULTA_FACTURA_DOCUMENTO_RELACIONADO) {
    //   if (tipoComprobante === this._tipos.TIPO_DOCUMENTO_FACTURA) {
    //     this.consultaQuery.anticipo = 'S';
    //   }
    // }
    switch ( this.tipoConsulta ) {
      case this._tipos.TIPO_CONSULTA_PERCEPCION_RETENCION:
        if (tipoComprobante === this._tipos.TIPO_DOCUMENTO_RETENCION ) {
          this.consultaQuery.ticket = ticket;
        }
        break;
      case this._tipos.TIPO_CONSULTA_BOLETA_DOCUMENTO_RELACIONADO:
        this.consultaQuery.anticipo = 'S';
        break;
      case this._tipos.TIPO_CONSULTA_FACTURA_DOCUMENTO_RELACIONADO:
        if (tipoComprobante === this._tipos.TIPO_DOCUMENTO_FACTURA) {
          this.consultaQuery.anticipo = 'S';
        }
        break;
      case this._tipos.TIPO_CONSULTA_RESUMEN_BOLETAS:
        this.consultaQuery.ticketResumen = ticket;
        break;
    }

    let fechaInicioTimestamp;
    let fechaFinTimestamp;
    let fechaString: any;
    let dia: number;
    let mes: number;
    let anio: number;

    fechaString = fechaDel.toString().split('/');
    dia = Number(fechaString[0]);
    mes = Number (fechaString[1]) - 1;
    anio = Number(fechaString[2]);

    fechaInicioTimestamp = this._utilsService.convertirATimestamp(anio, mes, dia, 0, 0, 0, 0);

    fechaString = fechaAl.toString().split('/');
    dia = Number(fechaString[0]);
    mes = Number (fechaString[1]) - 1;
    anio = Number(fechaString[2]);
    fechaFinTimestamp = this._utilsService.convertirATimestamp(anio, mes, dia, 23, 59, 59, 59);

    this.consultaQuery.fechaDel = fechaInicioTimestamp.toString();
    this.consultaQuery.fechaAl = fechaFinTimestamp.toString();
  }
  /**
   * Método para validar posibles casuisticas de error
   */
  public validacionesFiltroComprobante() {
    const that = this;
    this.flagConsulta = true;
    let titulo = '';
    that._translateService.get('mensajeNotificacionTituloAlerta').take(1)
      .subscribe(data => titulo = data);
    let tipo = '';
    let mensaje = '';
    that._translateService.get('mensajeNotificacionTipoAdvertencia').take(1).subscribe(data => tipo = data);
    if (this.consultaQuery.tipoDocumento === '' || this.consultaQuery.tipoDocumento === null) {
      if (this.consultaQuery.tipoDocumento) {
        that._translateService.get('mensajeNotificacionErrorTipoDocumentoComboSinSeleccionar').take(1)
          .subscribe(data => mensaje = data);
        this.modalNotificacion(titulo, mensaje, tipo);
        this.flagConsulta = false;
      }
    } else {
      if (this.consultaQuery.numeroDocumento === '' || this.consultaQuery.numeroDocumento === null ) {
        that._translateService.get('mensajeNotificacionErrorTipoDocumentoVacio').take(1)
          .subscribe(data => mensaje = data);
        //  this.modalNotificacion('Titulo Error Prueba', 'Mensaje Rpueba Error', 'warning');
        this.modalNotificacion(titulo, mensaje, tipo);
        this.flagConsulta = false;
      }
    }
    if (this.consultaQuery.serie === '' || this.consultaQuery.serie == null) {
      if ((this.consultaQuery.correlativoInicial !== '') || (this.consultaQuery.correlativoFinal !== '') ) {
        that._translateService.get('mensajeNotificacionErrorSerieComboSinSeleccionar').take(1)
          .subscribe(data => mensaje = data);
        this.modalNotificacion(titulo, mensaje, tipo);
        this.flagConsulta = false;
      }
    } else {
      if (this.consultaQuery.correlativoInicial === '' && this.consultaQuery.correlativoFinal !== '') {
        that._translateService.get('mensajeNotificacionErrorSerieRangoInvalido').take(1)
          .subscribe(data => mensaje = data);
        this.modalNotificacion(titulo, mensaje, tipo);
        this.flagConsulta = false;
      }
      if (this.consultaQuery.correlativoFinal !== '' && this.consultaQuery.correlativoInicial !== '') {
        if (Number(this.consultaQuery.correlativoInicial) > Number(this.consultaQuery.correlativoFinal)) {
          that._translateService.get('mensajeNotificacionErrorSerieRangoInvalido').take(1)
            .subscribe(data => mensaje = data);
          this.modalNotificacion(titulo, mensaje, tipo);
          this.flagConsulta = false;
        }
      }

    }
  }
  /**
   * Metodo que busca e invoca servicio para busqueda de comprobante
   */
  public filtroComprobante(cambiarAcciones: boolean = false) {
    this.setDtoFiltroComprobante();
    this.consultaQuery.numeroPagina = this.tablaComprobante.paginacion.pagina.getValue().toString();
    this.validacionesFiltroComprobante();
    if ( this.flagConsulta ) {
      this.setParametrosFiltroConsulta();
      this.urlConsulta = this._comprobantes.urlConsultaQuery;
      if (cambiarAcciones) {
      const nuevaAccionNotasCreditoYDebito: Accion[] = [
          new Accion('visualizar', new Icono('check-circle', 'btn-info'), TipoAccion.VISUALIZAR),
          new Accion('Dar de Baja', new Icono('check-circle', 'btn-info'), TipoAccion.ANULAR, 'chEstadocomprobantepago', [3]),
          new Accion('bitacora', new Icono('check-circle', 'btn-info'), TipoAccion.BITACORA)
        ];
        this.tablaComprobante.setAcciones(nuevaAccionNotasCreditoYDebito);

      }
      this.tablaComprobante.setParametros(this.parametrosConsulta);
      this.tablaComprobante.cargarData( );
      this.tipoConsultaGeneral = this._comprobantes.TIPO_ATRIBUTO_COMPROBANTES_QUERY;
    }
  }
}
