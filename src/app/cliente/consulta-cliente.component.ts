import { Component, ViewChild, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CatalogoDocumentoIdentidadService } from 'app/facturacion-electronica/general/utils/catalogo-documento-identidad.service';
import { TiposService } from 'app/facturacion-electronica/general/utils/tipos.service';
import { PersistenciaService } from 'app/facturacion-electronica/comprobantes/services/persistencia.service';
import { TablaMaestraService } from 'app/facturacion-electronica/general/services/documento/tablaMaestra.service';
import { SeriesService } from 'app/facturacion-electronica/general/services/configuracionDocumento/series.service';
import { EstadoDocumentoService } from 'app/facturacion-electronica/general/services/documento/estadoDocumento.service';
import { DataTableComponent } from 'app/facturacion-electronica/general/data-table/data-table.component';
import { ConsultaComprobante } from 'app/facturacion-electronica/comprobantes/models/consultaComprobante';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EstadoDocumento } from 'app/facturacion-electronica/general/models/documento/estadoDocumento';
import { BehaviorSubject } from 'rxjs';
import {
    TablaMaestra, TABLA_MAESTRA_TIPO_COMPROBANTE,
    TABLA_MAESTRA_DOCUMENTO_IDENTIDAD
} from 'app/facturacion-electronica/general/models/documento/tablaMaestra';
import { Accion, Icono } from 'app/facturacion-electronica/general/data-table/utils/accion';
import { TipoAccion } from 'app/facturacion-electronica/general/data-table/utils/tipo-accion';
import { ModoVistaAccion } from 'app/facturacion-electronica/general/data-table/utils/modo-vista-accion';
import { ConsultaDocumentoQuery } from 'app/facturacion-electronica/general/models/consultaDocumentoQuery';
import { ComprobantesClienteService } from 'app/cliente/service/comprobantes.service';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidadorPersonalizado } from 'app/facturacion-electronica/general/services/utils/validadorPersonalizado';
import { ComprobanteCorreoModel } from 'app/cliente/models/comprobante-correo.model';
import { SpinnerService } from 'app/cliente/service/spinner.service';
import { ColumnaDataTable } from '../facturacion-electronica/general/data-table/utils/columna-data-table';

declare var swal: any;
@Component({
    selector: 'app-consulta-cliente-component',
    templateUrl: 'consulta-cliente-component.html',
    styleUrls: ['./consulta-cliente.component.css']
})

export class ConsultaClienteComponent implements OnInit {
    public urlConsulta: string;
    public tipoConsultaGeneral: string;
    public tipoComprobanteFlag: boolean;
    public tipoDocumentoFlag: boolean;
    public ticketFlag: boolean;
    public estadoFlag: boolean;
    public flagConsulta: boolean;
    public loading = false;
    public tamanioTipoDocumento: number;
    public formatoTipoDocumento: number;
    public comprobanteVisualizar: ComprobanteCorreoModel;
    public consultaQuery: ConsultaDocumentoQuery = new ConsultaDocumentoQuery();
    public parametrosConsulta: HttpParams;
    public consultaFormGroup: FormGroup;
    public columnasTabla: ColumnaDataTable[];
    public estados: BehaviorSubject<EstadoDocumento[]>;
    public tiposComprobantes: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
    public tiposDocumentos: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
    public todosTiposComprobantes: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
    public todosTiposDocumentoIdentidad: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
    @ViewChild('tablaComprobanteCliente') tablaComprobanteCliente: DataTableComponent<ConsultaComprobante>;
    public AccionesConsultaComprobante: Accion[] = [
        new Accion('visualizar', new Icono('check-circle', 'btn-info'), TipoAccion.VISUALIZAR)
    ];
    public tipoAccion: any = ModoVistaAccion.COMBO;
    constructor(
        private _catalogoDocumentos: CatalogoDocumentoIdentidadService,
        private _tipos: TiposService,
        private _persistencia: PersistenciaService,
        private _estadoDocumentoService: EstadoDocumentoService,
        private _tablaMaestraService: TablaMaestraService,
        private _comprobantesCliente: ComprobantesClienteService,
        public _translateService: TranslateService,
        private _router: Router,
        private _route: ActivatedRoute,
        public spinnerService: SpinnerService
    ) {
        this.spinnerService.set(false).subscribe(
            data => {
              this.loading = data;
            }, err => {
                this.loading = false;
            });
        this.cargarServiciosArranque();
        this.formatoTipoDocumento = 0;
        this.tamanioTipoDocumento = 0;
        this.flagConsulta = true;
        this.comprobanteVisualizar = new ComprobanteCorreoModel();
        this.columnasTabla = [
            new ColumnaDataTable('rucEmisor', 'entidadproveedora.vcDocumento'),
            new ColumnaDataTable('tipoDocumento', 'entidadcompradora.vcTipoDocumento'),
            new ColumnaDataTable('numeroDocumento', 'entidadcompradora.vcDocumento'),
            new ColumnaDataTable('numeroSerie', 'vcSerie'),
            new ColumnaDataTable('correlativo', 'vcCorrelativo'),
            new ColumnaDataTable('fechaEmision', 'tsFechaemision'),
            new ColumnaDataTable('fechaEnvio', 'tsFechaenvio'),
            new ColumnaDataTable('estado', 'chEstadocomprobantepagocomp'),
            new ColumnaDataTable('importeTotal', 'dePagomontopagado', {'text-align': 'right'})
          ];
    }

    ngOnInit() {
        this.checkFullPageBackgroundImage();
        this.InitForm();
        this._persistencia.removePersistenciaSimple('ConsultaClienteComprobante');
    }
    public checkFullPageBackgroundImage() {
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if (image_src !== undefined) {
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    }
    private setTipoComprobante() {
        let codigosComprobantes: string[] = [];
        codigosComprobantes = [
            this._tipos.TIPO_DOCUMENTO_FACTURA,
            this._tipos.TIPO_DOCUMENTO_BOLETA,
            this._tipos.TIPO_DOCUMENTO_NOTA_CREDITO,
            this._tipos.TIPO_DOCUMENTO_NOTA_DEBITO,
            this._tipos.TIPO_DOCUMENTO_PERCEPCION,
            this._tipos.TIPO_DOCUMENTO_RETENCION
        ];
        this.tiposComprobantes =
            this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);

    }
    private InitForm() {
        const fecha = new Date();
        const fechaActual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
        this.consultaFormGroup = new FormGroup({
            'cmbTipoComprobante': new FormControl('', [Validators.required]),
            'cmbTipoDocumento': new FormControl('', [Validators.required]),
            'txtNumeroDocumento': new FormControl(''
                , [Validators.required]
            ),
            'txtSerie': new FormControl('', [Validators.required]),
            'txtNumeroCorrelativo': new FormControl('', [Validators.required]),
            'txtImporteTotal': new FormControl('', [Validators.required]),
            'dateFechaEmisionDel': new FormControl(fechaActual, [Validators.required, ValidadorPersonalizado.fechaDeberiaSerMenorAHoy('errorFecha')])
        });
        this.consultaFormGroup.controls['dateFechaEmisionDel'].setValue(fechaActual);
        this.setTipoComprobante();

        this.consultaFormGroup.controls['cmbTipoDocumento'].disable();
    }
    private cargarServiciosArranque() {
        this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
        this.todosTiposDocumentoIdentidad = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_DOCUMENTO_IDENTIDAD);
    }
    public setTipoDocumento() {
        // let itemSeleccionarDocumento = new TablaMaestra();
        // itemSeleccionarDocumento.codigo = '-1';
        // itemSeleccionarDocumento.descripcionCorta = 'Seleccione Documento';
        // itemSeleccionarDocumento.descripcionLarga = 'Seleccione Documento';
        // itemSeleccionarDocumento.descripcionLargaIngles = 'Seleccione Documento';
        // itemSeleccionarDocumento.habilitado = false;
        // itemSeleccionarDocumento.iso = '';
        // itemSeleccionarDocumento.organizacion = -1;
        // itemSeleccionarDocumento.tabla = -1;

        // this.tiposDocumentos.next(null);

        let codigosDocumentosIdentidad: string[] = [];
        switch (this.consultaFormGroup.controls['cmbTipoComprobante'].value) {
            case this._tipos.TIPO_DOCUMENTO_FACTURA:
                codigosDocumentosIdentidad = [
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC
                ];
                this.columnasTabla.pop();
                this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deTotalcomprobantepago', {'text-align': 'right'}) );
                break;
            case this._tipos.TIPO_DOCUMENTO_BOLETA:
                codigosDocumentosIdentidad = [
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA
                ];
                this.columnasTabla.pop();
                this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deTotalcomprobantepago', {'text-align': 'right'}) );
                break;
            case this._tipos.TIPO_DOCUMENTO_NOTA_CREDITO:
                codigosDocumentosIdentidad = [
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA
                ];
                this.columnasTabla.pop();
                this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deTotalcomprobantepago', {'text-align': 'right'}) );
                break;
            case this._tipos.TIPO_DOCUMENTO_NOTA_DEBITO:
                codigosDocumentosIdentidad = [
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA
                ];
                this.columnasTabla.pop();
                this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deTotalcomprobantepago', {'text-align': 'right'}) );
                break;
            case this._tipos.TIPO_DOCUMENTO_PERCEPCION:
                codigosDocumentosIdentidad = [
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC,
                ];
                this.columnasTabla.pop();
                this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deDctomonto', {'text-align': 'right'}) );
                break;
            case this._tipos.TIPO_DOCUMENTO_GUIA_REMISION_REMITENTE:
                codigosDocumentosIdentidad = [
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CEDULA_DIPLOMATICA_IDENTIDAD,
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_OTROS
                ];
                break;
            case this._tipos.TIPO_DOCUMENTO_RETENCION:
                codigosDocumentosIdentidad = [
                    this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC,
                ];
                this.columnasTabla.pop();
                this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deDctomonto', {'text-align': 'right'}) );
                break;
        }
        const that = this;
        this.tiposDocumentos =
            this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposDocumentoIdentidad, codigosDocumentosIdentidad);

        this.eliminarEstiloInput('cmbTipoDocumento', 'is-empty');
        this.consultaFormGroup.controls['cmbTipoDocumento'].enable();
        this.consultaFormGroup.controls['cmbTipoDocumento'].setValue('-1');
        // this.tiposDocumentos.subscribe(
        //     data => {
        //         if (data && (codigosDocumentosIdentidad.length) >= data.length) {
        //             this.eliminarEstiloInput('cmbTipoDocumento', 'is-empty');
        //             this.consultaFormGroup.controls['cmbTipoDocumento'].setValue(itemSeleccionarDocumento.codigo);
        //             this.setFormatoDocumento();
        //             data.unshift(itemSeleccionarDocumento);
        //             this.tiposDocumentos.next(data);
        //         }
        //     }
        // );
        // this.consultaFormGroup.controls['cmbTipoDocumento'].setValue('');
    }
    public setFormatoDocumento() {
        this.consultaFormGroup.controls['txtNumeroDocumento'].setValue('');
        switch (this.consultaFormGroup.controls['cmbTipoDocumento'].value) {
            case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI:
                this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_DNI_TAMANIO;
                this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_NUMERICO;
                this.consultaFormGroup.controls['txtNumeroDocumento'].enable();
                break;
            case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA:
                this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_CARNET_EXTRANJERIA_TAMANIO;
                this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_ALFANUMERICO;
                this.consultaFormGroup.controls['txtNumeroDocumento'].enable();
                break;
            case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE:
                this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_PASAPORTE_TAMANIO;
                this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_ALFANUMERICO;
                this.consultaFormGroup.controls['txtNumeroDocumento'].enable();
                break;
            case this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC:
                this.tamanioTipoDocumento = this._catalogoDocumentos.TIPO_DOCUMENTO_IDENTIDAD_RUC_TAMANIO;
                this.formatoTipoDocumento = this._tipos.TIPO_FORMATO_NUMERICO;
                this.consultaFormGroup.controls['txtNumeroDocumento'].enable();
                break;
            default:
                this.consultaFormGroup.controls['txtNumeroDocumento'].disable();
                break;
        }
        //  this.consultaFormGroup.controls['txtNumeroDocumento'].enable();
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
    public limpiar() {
        this.consultaFormGroup.reset();
        const fecha = new Date();
        const fechaActual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
        this.consultaFormGroup.controls['dateFechaEmisionDel'].setValue(fechaActual);
        this.consultaFormGroup.controls['cmbTipoComprobante'].setValue('');
        this.consultaFormGroup.controls['cmbTipoDocumento'].setValue('');
        this.consultaFormGroup.controls['txtNumeroDocumento'].setValue('');
        this.consultaFormGroup.controls['txtSerie'].setValue('');
        this.consultaFormGroup.controls['txtNumeroCorrelativo'].setValue('');
        this.consultaFormGroup.controls['txtImporteTotal'].setValue('');
        this.tiposDocumentos = new BehaviorSubject<TablaMaestra[]>([]);

        // $('#txtImporteTotal').addClass('is-empty');
        // $('#txtImporteTotal').removeClass('is-empty');
        setTimeout(function () {
            $('input').each(function () {
              $(this.parentElement).addClass('is-empty');
            });
            $('select').each(function () {
              $(this.parentElement).addClass('is-empty');
            });
          }, 200);

        this.eliminarEstiloInput('dateFechaEmisionDel', 'is-empty');
        // this.eliminarEstiloInput('cmbTipoComprobante', 'is-empty');
        // this.eliminarEstiloInput('cmbTipoDocumento', 'is-empty');
        // this.eliminarEstiloInput('txtNumeroDocumento', 'is-empty');
        // this.eliminarEstiloInput('txtSerie', 'is-empty');
        // this.eliminarEstiloInput('txtNumeroCorrelativo', 'is-empty');
        // this.eliminarEstiloInput('txtImporteTotal', 'is-empty');
        this.formatoTipoDocumento = 0;
        this.tamanioTipoDocumento = 0;
        //  this.filtroComprobante();
        this.parametrosConsulta = new HttpParams()
        .set('tipoComprobanteTabla', this.consultaQuery.tipoComprobanteTabla)
        .set('tipoComprobanteRegistro', '21')
        .set('tipoDocumento', '000')
        .set('nroDocumento', '0000')
        .set('nroSerie', '0000')
        .set('correlativo', '00000')
        .set('importeTotal', '9999999.99')
        .set('fechaEmision', '1518066000000')
        .set('ordenar', 'tsFechaemision');
      this.tablaComprobanteCliente.setParametros(this.parametrosConsulta);
      this.tablaComprobanteCliente.cargarData( );
    }
    public eliminarEstiloInput(idHtml: string, estilo: string) {
        setTimeout(function () {
            $('#' + idHtml).parent().removeClass(estilo);
        }, 200);
    }
    public buscar() {
        this.filtroComprobante();
    }/**
   * Metodo que busca e invoca servicio para busqueda de comprobante
   */
    public filtroComprobante() {
        this.setDtoFiltroComprobante();
        this.consultaQuery.numeroPagina = this.tablaComprobanteCliente.paginacion.pagina.getValue().toString();
        //  this.validacionesFiltroComprobante();
        if (this.flagConsulta) {
            this.setParametrosFiltroConsulta();
            this.urlConsulta = this._comprobantesCliente.urlConsultaQueryCliente;
            this.tablaComprobanteCliente.setParametros(this.parametrosConsulta);
            this.tablaComprobanteCliente.cargarData();
            this.tipoConsultaGeneral = this._comprobantesCliente.TIPO_ATRIBUTO_COMPROBANTES_QUERY;
        }
    }
    public setDtoFiltroComprobante() {
        const tipoDocumento = this.consultaFormGroup.get('cmbTipoDocumento').value;
        const numeroDocumento = this.consultaFormGroup.get('txtNumeroDocumento').value;
        const serie = this.consultaFormGroup.get('txtSerie').value;
        const correlativo = this.consultaFormGroup.get('txtNumeroCorrelativo').value;
        const fechaDel = this.consultaFormGroup.get('dateFechaEmisionDel').value;
        const tipoComprobante = this.consultaFormGroup.controls['cmbTipoComprobante'].value;
        const importeTotal = this.consultaFormGroup.controls['txtImporteTotal'].value;
        this.consultaQuery.idEntidadEmisora = localStorage.getItem('id_entidad');
        this.consultaQuery.registroPorPagina = '10';
        this.consultaQuery.ordenar = 'tsFechaemision';
        this.consultaQuery.tipoComprobanteRegistro = tipoComprobante;
        this.consultaQuery.tipoComprobanteTabla = '10007';
        this.consultaQuery.tipoDocumento = tipoDocumento;
        this.consultaQuery.correlativoInicial = correlativo;
        this.consultaQuery.numeroDocumento = numeroDocumento;
        this.consultaQuery.serie = serie;
        this.consultaQuery.importeTotal = importeTotal;
        // this.consultaQuery.fechaDel = fechaDel;

        let fechaInicioTimestamp: number;
        let fechaString: any;
        let dia: number;
        let mes: number;
        let anio: number;
        fechaString = fechaDel.toString().split('/');
        dia = Number(fechaString[0]);
        mes = Number (fechaString[1]) - 1;
        anio = Number(fechaString[2]);
        fechaInicioTimestamp = Number( new Date(anio, mes, dia, 0, 0, 0, 0));
        this.consultaQuery.fechaDel = fechaInicioTimestamp.toString();
      }
      /**
   * Métodos genericos para consulta
   */
  public setParametrosFiltroConsulta() {
    if (this.flagConsulta) {
      this.parametrosConsulta = new HttpParams()
        .set('tipoComprobanteTabla', this.consultaQuery.tipoComprobanteTabla)
        .set('tipoComprobanteRegistro', this.consultaQuery.tipoComprobanteRegistro)
        .set('tipoDocumento', this.consultaQuery.tipoDocumento)
        .set('nroDocumento', this.consultaQuery.numeroDocumento)
        .set('nroSerie', this.consultaQuery.serie)
        .set('correlativo', this.consultaQuery.correlativoInicial)
        .set('importeTotal', this.consultaQuery.importeTotal)
        .set('fechaEmision', this.consultaQuery.fechaDel)
        .set('ordenar', this.consultaQuery.ordenar  );
    }
  }
  /**
   * Método para validar posibles casuisticas de error
   */
  public validacionesFiltroComprobante() {
    const that = this;
    this.flagConsulta = true;
    if (this.consultaFormGroup.controls['cmbTipoDocumento'].value === '-1') {
        let titulo: string;
        let mensaje: string;
        let tipo: string;

        that._translateService.get('mensajeNotificacionTipoDocumentoInvalido').take(1).subscribe(data => mensaje = data);
        this.modalNotificacion(titulo, mensaje, tipo);
        this.flagConsulta = false;
    }
    // const that = this;
    // this.flagConsulta = true;
    // let titulo = '';
    // //  that._translateService.get('mensajeNotificacionTituloAdvertencia').take(1).subscribe(data => titulo = data);
    // let tipo = '';
    // let mensaje = '';
    // that._translateService.get('mensajeNotificacionTipoAdvertencia').take(1).subscribe(data => tipo = data);
    // if (this.consultaQuery.tipoDocumento === '' || this.consultaQuery.tipoDocumento === null) {
    //   if (this.consultaQuery.tipoDocumento) {
    //     that._translateService.get('mensajeNotificacionErrorTipoDocumentoComboSinSeleccionar').take(1)
    //       .subscribe(data => titulo = data);
    //     this.modalNotificacion(titulo, mensaje, tipo);
    //     this.flagConsulta = false;
    //   }
    // } else {
    //   if (this.consultaQuery.numeroDocumento === '' || this.consultaQuery.numeroDocumento === null ) {
    //     that._translateService.get('mensajeNotificacionErrorTipoDocumentoVacio').take(1)
    //       .subscribe(data => titulo = data);
    //     //  this.modalNotificacion('Titulo Error Prueba', 'Mensaje Rpueba Error', 'warning');
    //     this.modalNotificacion(titulo, mensaje, tipo);
    //     this.flagConsulta = false;
    //   }
    // }
    // if (this.consultaQuery.serie === '' || this.consultaQuery.serie == null) {
    //   if ((this.consultaQuery.correlativoInicial !== '') || (this.consultaQuery.correlativoFinal !== '') ) {
    //     that._translateService.get('mensajeNotificacionErrorSerieComboSinSeleccionar').take(1)
    //       .subscribe(data => titulo = data);
    //     this.modalNotificacion(titulo, mensaje, tipo);
    //     this.flagConsulta = false;
    //   }
    // } else {
    //   if (this.consultaQuery.correlativoInicial === '' && this.consultaQuery.correlativoFinal !== '') {
    //     that._translateService.get('mensajeNotificacionErrorSerieRangoInvalido').take(1)
    //       .subscribe(data => titulo = data);
    //     this.modalNotificacion(titulo, mensaje, tipo);
    //     this.flagConsulta = false;
    //   }
    //   if (this.consultaQuery.correlativoFinal !== '' && this.consultaQuery.correlativoInicial !== '') {
    //     if (Number(this.consultaQuery.correlativoInicial) > Number(this.consultaQuery.correlativoFinal)) {
    //       that._translateService.get('mensajeNotificacionErrorSerieRangoInvalido').take(1)
    //         .subscribe(data => titulo = data);
    //       this.modalNotificacion(titulo, mensaje, tipo);
    //       this.flagConsulta = false;
    //     }
    //   }

    // }
  }
  /**
   * Método que invoca modal para las notificaciones
   * @param titulo
   * @param mensaje
   * @param tipoAlerta
   * @param botonLabel
   */
  public modalNotificacion(titulo: string, mensaje: string, tipoAlerta: string, botonLabel = 'Sí') {
    swal({
      title: titulo,
      html:
      '<div class="text-center"> ' + mensaje + '</div>',
      type: tipoAlerta,
      confirmButtonText: botonLabel,
      confirmButtonClass: 'btn btn-danger',
    });
  }

  public iniciarData(event) {}

  public ejecutarAccion(evento: [TipoAccion, ConsultaComprobante]) {
    const tipoAccion = evento[0];
    let itemSeleccionado: ConsultaComprobante = new ConsultaComprobante();
    itemSeleccionado = evento[1];
    switch (evento[0]) {
      case TipoAccion.VISUALIZAR:
        this.comprobanteVisualizar.uuid = itemSeleccionado.inIdcomprobantepago;
        this.comprobanteVisualizar.serie = itemSeleccionado.vcSerie;
        this.comprobanteVisualizar.correlativo = itemSeleccionado.vcCorrelativo;
        this.comprobanteVisualizar.fechaCreacion = itemSeleccionado.tsFechacreacion;
        this.comprobanteVisualizar.tipoComprobante = itemSeleccionado.chIdtipocomprobante;
        this._persistencia.setPersistenciaSimple('ConsultaClienteComprobante', this.comprobanteVisualizar);
        this._persistencia.setTipoComprobanteConsultar(this.consultaQuery.tipoComprobanteRegistro);
        this._router.navigateByUrl('/consultacliente/visualizar');
        break;
    }
  }
  public regresar() {
    this._router.navigate(['../'], {relativeTo: this._route});
  }
}
