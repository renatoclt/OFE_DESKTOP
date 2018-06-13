import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TablaMaestraService} from '../../general/services/documento/tablaMaestra.service';
import {TABLA_MAESTRA_TIPO_COMPROBANTE, TablaMaestra} from '../../general/models/documento/tablaMaestra';
import {EstadoDocumentoService} from '../../general/services/documento/estadoDocumento.service';
import {EstadoDocumento} from '../../general/models/documento/estadoDocumento';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TiposService} from '../../general/utils/tipos.service';
import {DataTableComponent} from '../../general/data-table/data-table.component';
import {ConsultaComprobante} from '../../comprobantes/models/consultaComprobante';
import {HttpParams} from '@angular/common/http';
import {ComprobantesService} from '../../general/services/comprobantes/comprobantes.service';
import {Accion, Icono} from '../../general/data-table/utils/accion';
import {TipoAccion} from '../../general/data-table/utils/tipo-accion';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {TIPO_ARCHIVO_CDR, TIPO_ARCHIVO_PDF, TIPO_ARCHIVO_XML} from '../../general/models/archivos/tipoArchivo';
import {ValidadorPersonalizado} from '../../general/services/utils/validadorPersonalizado';
import {EstilosServices} from '../../general/utils/estilos.services';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';

@Component({
  selector: 'app-resumen-bajas-crear',
  templateUrl: './resumen-bajas-listar.component.html',
  styleUrls: ['./resumen-bajas-listar.css']
})
export class ResumenBajasListarComponent {

  public resumenBajasFormGroup: FormGroup;

  public estados: BehaviorSubject<EstadoDocumento[]>;

  public tipoComprobanteRegistro: string;

  public tiposComprobantes: BehaviorSubject<TablaMaestra[]>;
  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]>;

  public columnasTabla: ColumnaDataTable[];

  public parametrosResumenBajas: HttpParams;
  public tipoAtributoResumenBajas: string;
  public urlResumenBajasService: string;
  public mostrarEstado= true;
  public accionesEnCabecera: Accion[];

  @ViewChild('tablaResumenBajas') tablaResumenBajas: DataTableComponent<ConsultaComprobante>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _tiposService: TiposService,
              private _tablaMaestraService: TablaMaestraService,
              private _estadoDocumentoService: EstadoDocumentoService,
              public _comprobantesService: ComprobantesService,
              public _archivoService: ArchivoService,
              private _estilosService: EstilosServices) {
    this.tiposComprobantes = new BehaviorSubject<TablaMaestra[]>([]);
    this.todosTiposComprobantes = new BehaviorSubject<TablaMaestra[]>([]);
    this.iniciarResumenBajasFormGroup();
    this.cargarParametros();
  }

  cargarParametros() {
    const idDeEstados = [ this._tiposService.TIPO_ESTADO_BLOQUEADO, this._tiposService.TIPO_ESTADO_DADO_DE_BAJA, this._tiposService.TIPO_ESTADO_RECHAZADO];
    this.estados = this._estadoDocumentoService.obtenerPorIdEstadoComprobante( idDeEstados);
    this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
    this.accionesEnCabecera = [
      new Accion('PDF',
        new Icono('file_download', 'btn-info'),
        TipoAccion.DESCARGAR_PDF,
        'chEstadocomprobantepago',
        [
          this._tiposService.TIPO_ESTADO_AUTORIZADO,
          this._tiposService.TIPO_ESTADO_AUTORIZADO_CON_OBSERVACIONES,
          this._tiposService.TIPO_ESTADO_RECHAZADO,
          this._tiposService.TIPO_ESTADO_BLOQUEADO,
          this._tiposService.TIPO_ESTADO_ERROR,
          this._tiposService.TIPO_ESTADO_PENDIENTE_DE_ENVIO,
          this._tiposService.TIPO_ESTADO_DADO_DE_BAJA
        ]
      ),
      new Accion('XML',
        new Icono('file_download', 'btn-info'),
        TipoAccion.DESCARGAR_XML,
        'chEstadocomprobantepago',
        [
          this._tiposService.TIPO_ESTADO_AUTORIZADO,
          this._tiposService.TIPO_ESTADO_AUTORIZADO_CON_OBSERVACIONES,
          this._tiposService.TIPO_ESTADO_RECHAZADO,
          this._tiposService.TIPO_ESTADO_BLOQUEADO,
          this._tiposService.TIPO_ESTADO_PENDIENTE_DE_ENVIO,
          this._tiposService.TIPO_ESTADO_DADO_DE_BAJA
        ]
      ),
      new Accion('CDR',
        new Icono('file_download', 'btn-info'),
        TipoAccion.DESCARGAR_CDR,
        'chEstadocomprobantepago',
        [
          this._tiposService.TIPO_ESTADO_AUTORIZADO,
          this._tiposService.TIPO_ESTADO_AUTORIZADO_CON_OBSERVACIONES,
          this._tiposService.TIPO_ESTADO_RECHAZADO,
          this._tiposService.TIPO_ESTADO_DADO_DE_BAJA
        ]
      )
    ];
    this.columnasTabla = [
      new ColumnaDataTable('ticket', 'vcParamTicket'),
      new ColumnaDataTable('N° Comprobante', 'serieCorrelativo'),
      new ColumnaDataTable('fechaEmision', 'tsFechaemision'),
      new ColumnaDataTable('PDF', TipoAccion.DESCARGAR_PDF),
      new ColumnaDataTable('XML', TipoAccion.DESCARGAR_XML),
      new ColumnaDataTable('CDR', TipoAccion.DESCARGAR_CDR),
      new ColumnaDataTable('estado', 'chEstadocomprobantepagocomp')
    ];
    this.tipoAtributoResumenBajas = this._comprobantesService.TIPO_ATRIBUTO_COMPROBANTES_QUERY;
    this.filtrarTipoComprobante();
  }


  cambioDocumentos() {
    let codigosEstados: number[] = [];
    const tiposResumenBajas = [
      this._tiposService.TIPO_DOCUMENTO_COMUNICACION_BAJA_FACTURA_BOLETA_NOTAS,
      this._tiposService.TIPO_DOCUMENTO_COMUNICACION_BAJA_RETENCIONES_PERCEPCIONES
    ];
    if (tiposResumenBajas.includes(this.resumenBajasFormGroup.controls['tipoComprobanteRegistro'].value)) {
    // codigosEstados = [this._tiposService.TIPO_ESTADO_DADO_DE_BAJA];
      this.mostrarEstado = true;
      this._estilosService.agregarEstiloInput('estado', 'is-empty');
      this.resumenBajasFormGroup.controls['estado'].disable();
    } else {
      this.mostrarEstado = false;
      this.resumenBajasFormGroup.controls['estado'].enable();
      codigosEstados = [
      this._tiposService.TIPO_ESTADO_BLOQUEADO,
      this._tiposService.TIPO_ESTADO_DADO_DE_BAJA,
      this._tiposService.TIPO_ESTADO_RECHAZADO];
    }
    this.estados = this._estadoDocumentoService.obtenerPorIdEstadoComprobante( codigosEstados);
  }

  filtrarTipoComprobante() {
    const codigosComprobantes = [
      this._tiposService.TIPO_DOCUMENTO_COMUNICACION_BAJA_RETENCIONES_PERCEPCIONES,
      this._tiposService.TIPO_DOCUMENTO_COMUNICACION_BAJA_FACTURA_BOLETA_NOTAS
    ];
    this.tiposComprobantes = this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);
  }
  iniciarResumenBajasFormGroup() {
    const fecha = new Date();
    const fechaActual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.resumenBajasFormGroup = new FormGroup({
      'tipoComprobanteRegistro': new FormControl('', [Validators.required]),
      // 'estado': new FormControl('', [Validators.required]),
      'ticket': new FormControl(''),
      'fechaEmisionDel': new FormControl(fechaActual, [Validators.required]),
      'fechaEmisionAl': new FormControl(fechaActual, [Validators.required]),
      'fechaBajaDel': new FormControl(''),
      'fechaBajaAl': new FormControl('')
    }, Validators.compose(
      [
        ValidadorPersonalizado.fechaDeberiaSerMenor('fechaEmisionDel', 'fechaEmisionAl', 'errorFechaEmision')
      ]));
  }


  buscarResumenBajas() {
    this.llenarEntradaConsultaComprobantes();
  }

  llenarEntradaConsultaComprobantes() {
    let fechabajadel = this.resumenBajasFormGroup.get('fechaEmisionDel').value;
    let fechabajaal =  this.resumenBajasFormGroup.get('fechaEmisionAl').value;

    let fechaInicioTimestamp: string;
    let fechaFinTimestamp: string;
    let fechaString: any;
    let dia: number;
    let mes: number;
    let anio: number;

      fechaString = fechabajadel.toString().split('/');
      dia = Number(fechaString[0]);
      mes = Number (fechaString[1]) - 1;
      anio = Number(fechaString[2]);
      fechaInicioTimestamp = (Number( new Date(anio, mes, dia, 0, 0, 0, 0))).toString();

      fechaString = fechabajaal.toString().split('/');
      dia = Number(fechaString[0]);
      mes = Number (fechaString[1]) - 1;
      anio = Number(fechaString[2]);
      fechaFinTimestamp = (Number( new Date(anio, mes, dia, 23, 59, 59, 59))).toString();


    this.urlResumenBajasService = this._comprobantesService.obtenerUrlDocumentoQuery();
    this.parametrosResumenBajas = new HttpParams()
      .set('idEntidadEmisora', localStorage.getItem('id_entidad'))
      .set('tipoComprobanteTabla', TABLA_MAESTRA_TIPO_COMPROBANTE.toString())
      .set('tipoComprobanteRegistro', this.resumenBajasFormGroup.get('tipoComprobanteRegistro').value)
      .set('fechaEmisionDel', fechaInicioTimestamp)
      .set('fechaEmisionAl',  fechaFinTimestamp)
      .set('tipoDocumento', '')
      .set('nroDocumento', '')
      .set('ticket', '')
      .set('estado', '')
      .set('nroSerie', '')
      .set('correlativoInicial', '')
      .set('correlativoFinal', '')
      .set('nroPagina', '')
      .set('regXPagina', '')
      .set('ordenar', 'tsFechaemision')
      .set('fechaBajaDel', '')
      .set('fechaBajaAl', '')
      .set('ticketBaja', this.resumenBajasFormGroup.get('ticket').value)
      .set('seriecorrelativo', '')
      .set('ticketResumen', '')
      .set('anticipo', 'N');
    this.tablaResumenBajas.setParametros(this.parametrosResumenBajas);
    this.tablaResumenBajas.cargarData();
  }
  limpiar() {
    this.resumenBajasFormGroup.controls['estado'].enable();
    this.mostrarEstado = true;
    this.resumenBajasFormGroup.reset();
    this.resumenBajasFormGroup.controls['estado'].setValue('');
    this.resumenBajasFormGroup.controls['fechaBajaDel'].setValue('');
    this.resumenBajasFormGroup.controls['fechaBajaAl'].setValue('');
    this.resumenBajasFormGroup.controls['ticket'].setValue('');
    setTimeout(function () {
      $('input').each(function () {
        $(this.parentElement).addClass('is-empty');
      });
      $('select').each(function () {
        $(this.parentElement).addClass('is-empty');
      });
    }, 200);

    const fecha = new Date();
    const fechaActual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.resumenBajasFormGroup.controls['fechaEmisionDel'].setValue(fechaActual);
    this.resumenBajasFormGroup.controls['fechaEmisionAl'].setValue(fechaActual);
    this.eliminarEstiloInput('fechaEmisionDel', 'is-empty');
    this.eliminarEstiloInput('fechaEmisionAl', 'is-empty');
    this.parametrosResumenBajas = new HttpParams()
      .set('idEntidadEmisora', localStorage.getItem('id_entidad'))
      .set('tipoComprobanteTabla', TABLA_MAESTRA_TIPO_COMPROBANTE.toString())
      .set('tipoComprobanteRegistro', '')
      .set('fechaEmisionDel', '')
      .set('fechaEmisionAl', '')
      .set('tipoDocumento', '')
      .set('nroDocumento', '')
      .set('ticket', '')
      .set('estado', '')
      .set('nroSerie', '')
      .set('correlativoInicial', '')
      .set('correlativoFinal', '')
      .set('nroPagina', '')
      .set('regXPagina', '')
      .set('ordenar', 'tsFechaemision')
      .set('fechaBajaDel', '')
      .set('fechaBajaAl', '')
      .set('ticketBaja', '');
    this.tablaResumenBajas.setParametros(this.parametrosResumenBajas);
    this.tablaResumenBajas.cargarData();
  }

  public eliminarEstiloInput(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().removeClass(estilo);
    }, 200);
  }

  public ejecutarAccionComoAtributo(evento) {
    const tipoAccion = evento[0];
    const archivoDeBaja = evento[1];
    console.log(tipoAccion);
    switch ( tipoAccion ) {
      case TipoAccion.DESCARGAR_PDF:
        this._archivoService.descargararchivotipo( archivoDeBaja['inIdcomprobantepago'] , TIPO_ARCHIVO_PDF.idArchivo);
        break;
      case TipoAccion.DESCARGAR_XML:
        this._archivoService.descargararchivotipo( archivoDeBaja['inIdcomprobantepago'] , TIPO_ARCHIVO_XML.idArchivo);
        break;
      case TipoAccion.DESCARGAR_CDR:
        this._archivoService.descargararchivotipo( archivoDeBaja['inIdcomprobantepago'] , TIPO_ARCHIVO_CDR.idArchivo);
        break;
    }
  }
}
