import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TipoDocumento } from '../models/tipo_documento';
import { Bajasfiltro } from '../models/bajas_filtro';
import { TiposService } from '../../general/utils/tipos.service';
import { DataTableComponent } from '../../general/data-table/data-table.component';
import { ConsultaResumenBajas } from '../models/consultaResumenBajas';
import { ModoVistaAccion } from '../../general/data-table/utils/modo-vista-accion';
import { Accion, Icono } from '../../general/data-table/utils/accion';
import { TipoAccion } from '../../general/data-table/utils/tipo-accion';
import { ComunicacionDeBaja } from '../models/comunicacion-de-baja';
import { DetalleBajaConsulta } from '../models/detalle-baja-consulta';
import { ComprobantesService } from '../../general/services/comprobantes/comprobantes.service';
import { ComprobantesQuery } from '../models/comprobantes-query';
import { Entidad } from '../../general/models/organizacion/entidad';
import { DocuemntosConsulta } from '../models/docuemntos-consulta';
// import { Serie } from '../../general/models/parametros/serie';
import { Serie } from '../../general/models/configuracionDocumento/serie';
import { SeriesService } from '../../general/services/configuracionDocumento/series.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EstadoDocumento } from '../../general/models/documento/estadoDocumento';
import { EstadoDocumentoService } from '../../general/services/documento/estadoDocumento.service';
import {HttpParams} from '@angular/common/http';
import {ConsultaDocumentoQuery} from '../../general/models/consultaDocumentoQuery';
import {ConsultaPercepcionRetencion} from '../../comprobantes/models/consultaPercepcionRecepcion';
import {ConsultaDocumentoRelacionado} from '../../general/models/consultaDocumentoRelacionado';
import {ConsultaComprobante} from '../../comprobantes/models/consultaComprobante';
import {NuevoDocumentoBajaService} from '../../general/services/documento/nuevoDocumentoBaja';
import {TablaMaestraService} from '../../general/services/documento/tablaMaestra.service';
import {TranslateService} from '@ngx-translate/core';
import {TABLA_MAESTRA_TIPO_COMPROBANTE, TablaMaestra} from '../../general/models/documento/tablaMaestra';
import {PersistenciaService} from '../../comprobantes/services/persistencia.service';
import {Comprobante} from '../../general/models/comprobantes/comprobante';
import {ValidadorPersonalizado} from '../../general/services/utils/validadorPersonalizado';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';
import {EstilosServices} from '../../general/utils/estilos.services';
declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-resumen-bajas-crear',
  templateUrl: './resumen-bajas-crear.component.html',
  styleUrls: ['./resumen-bajas-crear.css'],
  providers: [SeriesService, EstadoDocumentoService]
})
export class ResumenBajasCrearComponent implements OnInit {
  public tipoComprobanteRegistro: string;
  public parametrosConsulta: HttpParams;
  public urlConsultaRetencion: string;
  public tipoConsultaRetencion: string;
  public labelMensajeDarBaja: string;
  public flagNumeroDocumento: boolean;
  public tipoConsulta: number;
  public productFormGroup: FormGroup;
  public bajaFormGroup: FormGroup;
  private filtroBajas: Bajasfiltro;
  public  validadortabla: boolean;
  public comunicacionBaja: ComunicacionDeBaja;
  public detallebaja: DetalleBajaConsulta = new DetalleBajaConsulta();
  public detalleBajalist: DetalleBajaConsulta[] = [];
  //  public tipoDocumento: TipoDocumento[];
  public dtoOutConsultaDocumentoRelacionado: ConsultaDocumentoRelacionado[] = [];
  public dtoOutConsultaPercepcionRetencion: ConsultaPercepcionRetencion[] = [];
  public dtoOutConsultaComprobante: ConsultaComprobante[] = [];
  public comprobantes_query: ComprobantesQuery[] = [];
  public consultas: DocuemntosConsulta[] = [];
  public estados: BehaviorSubject<EstadoDocumento[]>;
  public estadocomprobantePago= '1'; // Emitido=1
  public esguia: number;
  public columnasTabla: ColumnaDataTable[];
  public listaBajas: ConsultaResumenBajas[] = [];
  public tipo: any = ModoVistaAccion.ICONOS;
  public series: Serie[] = [];
  public AccionesPrueba: Accion[] = [
    new Accion('editar', new Icono('edit', 'btn-success'), TipoAccion.EDITAR),
    new Accion('eliminar', new Icono('delete', 'btn-danger'), TipoAccion.ELIMINAR),
    // new Accion('Descargar', new Icono('file_download', 'btn-info'), null),
  ];
  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  public tipoDocumento: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  subscriptionSeries: Subscription;
  @ViewChild('tablaNormal') tablaNormal: DataTableComponent<ConsultaResumenBajas>;


  showSwal() {
    swal({
      title: '¿Está Seguro?',
      html:
        '<div class="text-center"> Desea dar de baja a el/los comprobante(s) </div>',
      padding: '20',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'SÍ',
      cancelButtonText: 'NO',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).then(function () {
      swal({
        title: 'Acción Existosa',
        html:
          '<div class="text-center"> El/los comprobante(s) iniciarion proceso de baja. </div>',
        type: 'success',
        confirmButtonClass: 'btn btn-success',
        buttonsStyling: false
      });
    });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _estilosService: EstilosServices,
    private _tipos: TiposService,
    private _comprobantes: ComprobantesService,
    private _estadoDocumentoService: EstadoDocumentoService,
    private serieService: SeriesService,
    public _translateService: TranslateService,
    private _tablaMaestraService: TablaMaestraService,
    private comunicacionBajaService: NuevoDocumentoBajaService,
    private _persistencia: PersistenciaService
  ) {
    this.comunicacionBaja = new ComunicacionDeBaja();
    this.filtroBajas = new Bajasfiltro();
    this.columnasTabla = [
      new ColumnaDataTable('serie', 'vcSerie'),
      new ColumnaDataTable('correlativo', 'vcCorrelativo'),
      new ColumnaDataTable('fechaEmision', 'tsFechaemision'),
      new ColumnaDataTable('estado', 'chEstadocomprobantepagocomp'),
      new ColumnaDataTable('importeTotal', 'deTotalcomprobantepago', {'text-align': 'right'})
    ];
  }

  ngOnInit() {
    // this.serieService.obtenerTodo().subscribe((val) => {
    //   this.series = val;
    // });
    this.esguia = 0;
    /*
    this.route.params
      .subscribe(
      (params: Params) => {
        this.tipoDocumento = [
          new TipoDocumento(this._tipos.TIPO_DOCUMENTO_RETENCION, 'Retencion')
        ];
        this.initForm();
      }
      );*/
    this.initForm();
    this.initFormPost();
    const codigosComprobantes = [
        this._tipos.TIPO_DOCUMENTO_RETENCION,
        this._tipos.TIPO_DOCUMENTO_BOLETA,
        this._tipos.TIPO_DOCUMENTO_PERCEPCION,
        this._tipos.TIPO_DOCUMENTO_FACTURA
    ];
    this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
    this.tipoDocumento = this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);
    const idDeEstados = [ this._tipos.TIPO_ESTADO_AUTORIZADO, this._tipos.TIPO_ESTADO_AUTORIZADO_CON_OBSERVACIONES];
    this.estados = this._estadoDocumentoService.obtenerPorIdEstadoComprobante( idDeEstados);

    // this.productFormGroup.controls['cmbEstado'].setValue(this._tipos.TIPO_ESTADO_AUTORIZADO);
    // this.eliminarEstiloInput('cmbEstado', 'is-empty');
  }

  public setTipoComprobanteSeleccionado(comprobante: Comprobante) {

    const fecha = new Date(comprobante.fechaEmision);
    const fechaFormatoinicio = (fecha.getDate() + 1).toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    const fechaFormatofin = (fecha.getDate() + 2).toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.productFormGroup.controls['cmbtipodoc'].setValue(comprobante.tipoComprobante);
    this.setTipoDocumentocombo();
    this.productFormGroup.controls['cmbserie'].setValue(comprobante.vcSerie);
    this.productFormGroup.controls['correlativoinicio'].setValue(comprobante.vcCorrelativo);
    this.productFormGroup.controls['fechaemisioninicio'].setValue(fechaFormatoinicio);
    this.productFormGroup.controls['fechaemisionfin'].setValue(fechaFormatofin);
    this.productFormGroup.controls['cmbEstado'].setValue(comprobante.chEstadocomprobantepago);

    this.eliminarEstiloInput('cmbtipodoc', 'is-empty');
    this.eliminarEstiloInput('cmbserie', 'is-empty');
    this.eliminarEstiloInput('correlativoinicio', 'is-empty');
    this.eliminarEstiloInput('fechaemisioninicio', 'is-empty');
    this.eliminarEstiloInput('fechaemisionfin', 'is-empty');
    this.eliminarEstiloInput('cmbEstado', 'is-empty');
    this.buscar();
    console.log(this.productFormGroup);
  }

  private initForm() {

    const fecha = new Date();
    const fechaActual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.productFormGroup = new FormGroup({
      'cmbtipodoc': new FormControl('', Validators.required),
      'cmbserie': new FormControl(''),
      'correlativoinicio': new FormControl('', [
        Validators.pattern('[0-9]+'),
      ]),
      'correlativofinal': new FormControl(''),
      'cmbEstado': new FormControl('',  [
        Validators.required
      ]),
      'fechaemisioninicio': new FormControl(
        fechaActual, [
          Validators.required
        ]),
      'fechaemisionfin': new FormControl(
        fechaActual, [
          Validators.required
        ])
    }, Validators.compose([
      ValidadorPersonalizado.fechaDeberiaSerMenor('fechaemisioninicio', 'fechaemisionfin', 'errorFecha'),
      ValidadorPersonalizado.validarCorrelativos('cmbserie', 'correlativoinicio', 'correlativofinal')
    ]));
  }

  initFormPost() {
    this.bajaFormGroup = new FormGroup({
      'motivo': new FormControl('',  [
        Validators.required
      ])
    });
  }

  public onSubmit() {
    if (this.productFormGroup.get('cmbtipodoc').value == 7 || this.productFormGroup.get('cmbtipodoc').value == 6) {
      this.esguia = 1;
    } else {
      this.esguia = 0;
    }
  }

  public buscar() {
            this.tipoComprobanteRegistro = '07';
            this.filtroRetencion();
  }

  public filtroRetencion() {
    this.flagNumeroDocumento = true;
    const estado = this.productFormGroup.get('cmbEstado').value;
    const serie = this.productFormGroup.get('cmbserie').value ? this.productFormGroup.get('cmbserie').value : '';
    const correlativoini = this.productFormGroup.get('correlativoinicio').value;
    const correlativofin = this.productFormGroup.get('correlativofinal').value;
    const fecha_del = this.productFormGroup.get('fechaemisioninicio').value;
    const fecha_al = this.productFormGroup.get('fechaemisionfin').value;
    const nropagina = this.tablaNormal.paginacion.pagina.getValue().toString();
    const regxpag = this.tablaNormal.paginacion.tamanio.getValue().toString();

    const ordenar = this.tablaNormal.paginacion.orden.getValue();
    const tipoComprobanteTabla = '10007';
    this.tipoComprobanteRegistro = this.productFormGroup.controls['cmbtipodoc'].value;

    const consultaRetencion: ConsultaDocumentoQuery = new ConsultaDocumentoQuery();
    consultaRetencion.idEntidadEmisora = localStorage.getItem('id_entidad');
    consultaRetencion.tipoComprobanteTabla = '10007';
    consultaRetencion.tipoComprobanteRegistro = this.productFormGroup.controls['cmbtipodoc'].value;
    consultaRetencion.fechaDel = fecha_del;
    consultaRetencion.fechaAl = fecha_al;
    consultaRetencion.numeroPagina = '0';
    consultaRetencion.registroPorPagina = '10';
    consultaRetencion.ordenar = ordenar;
    consultaRetencion.ticketBaja = '';
    let fechaInicioTimestamp: string;
    let fechaFinTimestamp: string;
    let fechaString: any;
    let dia: number;
    let mes: number;
    let anio: number;

    fechaString = consultaRetencion.fechaDel.toString().split('/');
    dia = Number(fechaString[0]);
    mes = Number (fechaString[1]) - 1;
    anio = Number(fechaString[2]);
    fechaInicioTimestamp = (Number( new Date(anio, mes, dia, 0, 0, 0, 0))).toString();

    fechaString = consultaRetencion.fechaAl.toString().split('/');
    dia = Number(fechaString[0]);
    mes = Number (fechaString[1]) - 1;
    anio = Number(fechaString[2]);
    fechaFinTimestamp = (Number( new Date(anio, mes, dia, 23, 59, 59, 59))).toString();

    switch (this.productFormGroup.controls['cmbtipodoc'].value) {
      case this._tipos.TIPO_DOCUMENTO_FACTURA:
        this.columnasTabla.pop();
        this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deTotalcomprobantepago', {'text-align': 'right'}) );
        break;
      case this._tipos.TIPO_DOCUMENTO_BOLETA:
        this.columnasTabla.pop();
        this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deTotalcomprobantepago', {'text-align': 'right'}) );
        break;
      case this._tipos.TIPO_DOCUMENTO_RETENCION:
        this.columnasTabla.pop();
        this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deDctomonto', {'text-align': 'right'}) );
        break;
      case this._tipos.TIPO_DOCUMENTO_PERCEPCION:
        this.columnasTabla.pop();
        this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deDctomonto', {'text-align': 'right'}) );
        break;
      case this._tipos.TIPO_DOCUMENTO_NOTA_CREDITO:
        this.columnasTabla.pop();
        this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deTotalcomprobantepago', {'text-align': 'right'}) );
        break;
      case this._tipos.TIPO_DOCUMENTO_NOTA_DEBITO:
        this.columnasTabla.pop();
        this.columnasTabla.push( new ColumnaDataTable('importeTotal', 'deTotalcomprobantepago', {'text-align': 'right'}) );
        break;
    }



    if (estado === '' || !estado) {
      if (correlativofin === '' || !correlativofin) {
        console.log('SERIES - CI');
        consultaRetencion.serie = serie;
        consultaRetencion.correlativoInicial = correlativoini;
      } else {
        console.log('SERIES - CI - CF');
        consultaRetencion.serie = serie;
        consultaRetencion.correlativoInicial = correlativoini;
        consultaRetencion.correlativoFinal = correlativofin;
      }
    } else {
      if (correlativofin === '' || !correlativofin) {
        consultaRetencion.serie = serie;
        consultaRetencion.estado = estado;
        consultaRetencion.correlativoInicial = correlativoini;
        console.log('SERIES - ESTADO - CI');
      } else {
        console.log('SERIES - ESTADO - CI - CF');
        consultaRetencion.serie = serie;
        consultaRetencion.estado = estado;
        consultaRetencion.correlativoInicial = correlativoini;
        consultaRetencion.correlativoFinal = correlativofin;
      }
    }
    if (this.flagNumeroDocumento) {
      this.parametrosConsulta = new HttpParams()
        .set('idEntidadEmisora', consultaRetencion.idEntidadEmisora)
        .set('tipoComprobanteTabla', consultaRetencion.tipoComprobanteTabla)
        .set('tipoComprobanteRegistro', consultaRetencion.tipoComprobanteRegistro)
        .set('fechaEmisionDel', fechaInicioTimestamp)
        .set('fechaEmisionAl', fechaFinTimestamp)
        .set('tipoDocumento', consultaRetencion.tipoDocumento)
        .set('nroDocumento', consultaRetencion.numeroDocumento)
        .set('ticket', consultaRetencion.ticket)
        .set('estado', consultaRetencion.estado)
        .set('nroSerie', consultaRetencion.serie)
        .set('correlativoInicial', consultaRetencion.correlativoInicial)
        .set('correlativoFinal', consultaRetencion.correlativoFinal)
        .set('nroPagina', '')
        .set('regXPagina', '')
        .set('ordenar', 'tsFechaemision')
        .set('fechaBajaDel',  '')
        .set('fechaBajaAl', '')
        .set('ticketBaja', consultaRetencion.ticketBaja)
        .set('seriecorrelativo', '')
        .set('ticketResumen', '')
        .set('anticipo', 'N');
      // this.urlConsultaRetencion = this._comprobantes.urlConsultaQuery;
      this.tablaNormal.setParametros(this.parametrosConsulta);
      this.tablaNormal.cargarData( );
      this.tipoConsultaRetencion = this._comprobantes.TIPO_ATRIBUTO_COMPROBANTES_QUERY;
    }
  }

  validartabla(): boolean {
    const items = this.tablaNormal.getItemsSeleccionados();
    const validador1 = this.bajaFormGroup.valid;
    const validador2 = items.length > 0;
    const validador3 = items != null;
    const validador4 = validador2 && validador3;
    const validador5 = (validador1 && validador4);
    if (validador5) {
      this.validadortabla = true;
    } else  {
      this.validadortabla = false;
    }
    return this.validadortabla;
  }

  comunicacionbaja() {
    const that = this;
    this._translateService.get('mensajeDarBajaComprobante').subscribe( data => { this.labelMensajeDarBaja = data;});

    swal({
      type: 'warning',
      title: '¿Está seguro?',
      html:
        '<div class="text-center">' + that.labelMensajeDarBaja + '</div>',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'SÍ',
      cancelButtonText: 'NO'
    }).catch((result) => {})
    .then(
      (result) => {
        if (result) {
          that.detalleBajalist = [];
          const itemselecionados = that.tablaNormal.getItemsSeleccionados();
          console.log('item selecionado');
          console.log(itemselecionados);
          console.log(that.tablaNormal.getItemsSeleccionados());
          for (let i = 0; i < itemselecionados.length; i++) {
            that.detallebaja = new DetalleBajaConsulta();
            that.detallebaja.correlativo = Number(itemselecionados[i]['vcCorrelativo']);
            that.detallebaja.serie = itemselecionados[i]['vcSerie'];
            that.detallebaja.idComprobante = itemselecionados[i]['inIdcomprobantepago'];
            that.detallebaja.tipoComprobante = itemselecionados[i]['vcIdregistrotipocomprobante'];
            that.detallebaja.motivo = that.bajaFormGroup.get('motivo').value;
            that.detalleBajalist.push(that.detallebaja);
          }
          that.fillProducto();
          that.comunicacionBajaService.subir(that.comunicacionBaja).subscribe(
            data => {
              if ( data != null) {
                if (data) {
                  that.limpiar();
                  // that.filtroRetencion();
                } else {
                  that.limpiar();
                }
              }
            }
          );

        }
    });

    // this._spiner.set(true);
    // setTimeout( function () {
    //   // that.filtroRetencion();
    //   that.limpiar();
    //   }, 3000);

  }

  setTipoDocumentocombo() {
    this.serieService.filtroSecundarioSeries( localStorage.getItem('id_entidad'), this.productFormGroup.controls['cmbtipodoc'].value)
      .subscribe(
        valor => {
          this.series = valor;
          this.productFormGroup.controls['cmbserie'].reset();
          this._estilosService.agregarEstiloInput('cmbserie', 'is-empty');
        });
  }

  limpiar() {
    this._persistencia.removePersistenciaSimple<Comprobante>('comprobanteConsultaSeleccionado');
    this.series = [];
    this.productFormGroup.reset();
    this.bajaFormGroup  .reset();
    console.log('reset');
    setTimeout(function () {
      $('input').each(function () {
        $(this.parentElement).addClass('is-empty');
      });
      $('select').each(function () {
        $(this.parentElement).addClass('is-empty');
      });
    }, 200);
   this.eliminarEstiloInput('fechaemisioninicio', 'is-empty');
   this.eliminarEstiloInput('fechaemisionfin', 'is-empty');


    const fecha = new Date();
    const fechaActual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.productFormGroup.controls['cmbserie'].setValue('');
    this.productFormGroup.controls['cmbEstado'].setValue('');
    this.productFormGroup.controls['cmbtipodoc'].setValue('');
    this.productFormGroup.controls['correlativoinicio'].setValue('');
    // this.bajaFormGroup.controls['motivo'].setValue('');
    this.productFormGroup.controls['correlativofinal'].setValue('');
    this.productFormGroup.controls['fechaemisioninicio'].setValue(fechaActual);
    this.productFormGroup.controls['fechaemisionfin'].setValue(fechaActual);
    $('#fechaemisioninicio').removeClass('is-empty');
    this.parametrosConsulta = new HttpParams()
      .set('idEntidadEmisora', localStorage.getItem('id_entidad'))
      .set('tipoComprobanteTabla', '')
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
      .set('ticketBaja', '')
      .set('seriecorrelativo', '')
      .set('ticketResumen', '')
      .set('anticipo', 'N');
    this.tablaNormal.setParametros(this.parametrosConsulta);
    this.tablaNormal.cargarData( );
  }

  iniciarData(event) {
    let comprobantePersistencia: Comprobante = new Comprobante();
    comprobantePersistencia = this._persistencia.getPersistenciaSimple<Comprobante>('comprobanteConsultaSeleccionado');
    if (!comprobantePersistencia) {
      this.buscar();
    } else {
      this.setTipoComprobanteSeleccionado(comprobantePersistencia);
    }
  }
  public eliminar() { }

  fillProducto() {
    const fecha = new Date().getTime();
    // const fecha_actual = fecha.getDate().toString() + '/' + fecha.getMonth().toString() + '/' + fecha.getFullYear().toString();

    const rrPermitidos = [
      this._tipos.TIPO_DOCUMENTO_PERCEPCION,
      this._tipos.TIPO_DOCUMENTO_RETENCION
    ];
    const ra = [
      this._tipos.TIPO_DOCUMENTO_FACTURA,
      this._tipos.TIPO_DOCUMENTO_BOLETA,
      this._tipos.TIPO_DOCUMENTO_NOTA_CREDITO,
      this._tipos.TIPO_DOCUMENTO_NOTA_DEBITO
    ];

    const codigoComprobanteElegido = this.productFormGroup
      .controls['cmbtipodoc'].value;
    this.comunicacionBaja.idTipoComprobante =
      rrPermitidos.findIndex(item => item === codigoComprobanteElegido) !== -1 ? 'RR' : 'RA';
    this.comunicacionBaja.idEntidad = localStorage.getItem('id_entidad');
    this.comunicacionBaja.rucProveedor =  localStorage.getItem('org_ruc');
    this.comunicacionBaja.tipoDocumento = '6';
    this.comunicacionBaja.razonSocialProveedor = localStorage.getItem('org_nombre');
    this.comunicacionBaja.fechaEmisionDocumentoBaja = fecha;
    this.comunicacionBaja.correo = localStorage.getItem('org_email');
    this.comunicacionBaja.tipoSerie = 0;
    this.comunicacionBaja.detalleBaja = this.detalleBajalist;
    this.comunicacionBaja.usuarioCreacion = localStorage.getItem('username');
  }

  eliminarEstiloInput(idHtml: string, estilo: string) {
          setTimeout(function () {
              $('#' + idHtml).parent().removeClass(estilo);
          }, 200);
      }
}
