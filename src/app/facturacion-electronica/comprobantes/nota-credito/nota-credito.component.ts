import {
  Component, OnDestroy, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ComprobantesService} from '../../general/services/comprobantes/comprobantes.service';
import {TablaMaestraService} from '../../general/services/documento/tablaMaestra.service';
import {
  TABLA_MAESTRA_MONEDAS, TABLA_MAESTRA_TIPO_COMPROBANTE, TABLA_MAESTRA_UNIDADES_MEDIDA,
  TablaMaestra
} from '../../general/models/documento/tablaMaestra';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TiposService} from '../../general/utils/tipos.service';
import {Parametros} from '../../general/models/parametros/parametros';
import {ParametrosService} from '../../general/services/configuracionDocumento/parametros.service';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {TiposVistasNotaCredito} from './utils/TiposVistaNotaCredito';
import {ActivatedRoute, Router} from '@angular/router';
import {SeriesService} from '../../general/services/configuracionDocumento/series.service';
import {Serie} from '../../general/models/configuracionDocumento/serie';
import {EstilosServices} from '../../general/utils/estilos.services';
import {NotaCredito} from './modelos/notaCredito';
import {JsonDocumentoParametroNotaCredito} from './modelos/jsonDocumentoParametroNotaCredito';
import {ConceptoDocumentoService} from '../../general/services/documento/conceptoDocumento.service';
import {ConceptoDocumento} from '../../general/models/documento/conceptoDocumento';
import {NotaCreditoService} from './servicios/nota-credito.service';
import {ValidadorPersonalizado} from '../../general/services/utils/validadorPersonalizado';
import {PadreComprobanteService} from '../services/padre-comprobante.service';
import { Comprobante } from '../../general/models/comprobantes/comprobante';
import { PersistenciaService } from '../services/persistencia.service';
import {TranslateService} from '@ngx-translate/core';

declare var swal: any;

@Component({
  selector: 'app-nota-credito',
  templateUrl: './nota-credito.component.html',
  styleUrls: ['./nota-credito.component.css']
})
export class NotaCreditoComponent implements OnInit, OnDestroy {
  titulo = 'notaCreditoElectronica';
  notaDeCreditoFormGroup: FormGroup;

  public escogioUnComprobante: BehaviorSubject<boolean>;

  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]>;
  public tiposDeComprobantes: BehaviorSubject<TablaMaestra[]>;

  private todosTiposDeNotasDeCreditos: BehaviorSubject<Parametros[]>;
  public tiposDeNotasDeCreditos: BehaviorSubject<Parametros[]>;

  public habilitarPorTipoDeNotaDeCredito: number;

  TiposVistasNotaCredito = TiposVistasNotaCredito;
  public tiposVistasDeNotaCredito = TiposVistasNotaCredito;

  public todasSeries: BehaviorSubject<Serie[]>;
  public series: BehaviorSubject<Serie[]>;

  public seriesComprobante: BehaviorSubject<Serie[]>;

  public notaCredito: NotaCredito;

  private todosTipoConceptos: BehaviorSubject<ConceptoDocumento[]>;

  private tiposConceptos: BehaviorSubject<ConceptoDocumento[]>;

  private todosTiposMonedas: BehaviorSubject<TablaMaestra[]>;

  private todosTiposUnidades: BehaviorSubject<TablaMaestra[]>;

  controlNameVistaNormal: string;
  controlNameVistaDataTable: string;

  esValidadoDataTableNotaCredito: boolean;

  constructor(private _comprobantesService: ComprobantesService,
              private _tablaMaestraService: TablaMaestraService,
              private _tiposService: TiposService,
              private _parametrosServicie: ParametrosService,
              private _archivoService: ArchivoService,
              private _seriesService: SeriesService,
              private router: Router,
              private route: ActivatedRoute,
              private _translateService: TranslateService,
              private _estilosService: EstilosServices,
              private _conceptoDocumentoService: ConceptoDocumentoService,
              private _notaCreditoService: NotaCreditoService,
              private _padreComprobanteService: PadreComprobanteService,
              private _persistencia: PersistenciaService) {
    this._padreComprobanteService.actualizarComprobante(this.route.snapshot.data['codigo'], this.route.snapshot.data['mostrarCombo'],
      false);
  }

  ngOnInit() {
    this._notaCreditoService.pasoAVistaPrevia.next(false);
    this.inicializarVariables();
    this.cargarSeries();
    this.iniciarNotaDeCreditoFormGroup();
    this.cargarTiposDeComprobantes();
    this.cargarDatosNotaCreditoPersistencia();
    this.cargarPersistencia();
  }

  ngOnDestroy() {
  }
  cargarPersistencia() {
    let comprobantePersistencia: Comprobante = new Comprobante();
    comprobantePersistencia = this._persistencia.getPersistenciaSimple<Comprobante>('comprobanteConsultaSeleccionado');
    if (comprobantePersistencia) {
      this.notaDeCreditoFormGroup.controls['cmbTipoComprobante'].setValue(comprobantePersistencia.tipoComprobante);
      this.cambioTipoComprobante();
      const serieCorrelativo = comprobantePersistencia.numeroComprobante.split('-');
      this.notaDeCreditoFormGroup.controls['txtDocumento'].setValue(comprobantePersistencia.vcDocumentoCliente);
      this.notaDeCreditoFormGroup.controls['txtRazonSocial'].setValue(comprobantePersistencia.vcDenominacionCliente);
      this.notaDeCreditoFormGroup.controls['txtMoneda'].setValue(comprobantePersistencia.moneda);
      this.notaDeCreditoFormGroup.controls['cmbSerieComprobante'].setValue( serieCorrelativo[0] );
      this.notaDeCreditoFormGroup.controls['txtCorrelativoComprobante'].setValue(serieCorrelativo[1]);
      this._estilosService.eliminarEstiloInput('cmbSerieComprobante', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtCorrelativoComprobante', 'is-empty');
      this._estilosService.eliminarEstiloInput('cmbTipoComprobante', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtDocumento', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtRazonSocial', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtMoneda', 'is-empty');
      this._notaCreditoService.buscarComprobanteReferencia(comprobantePersistencia.inIdcomprobantepago, this.todosTiposUnidades);
      this._notaCreditoService.comprobanteReferencia.subscribe(
        data => {
          this.escogioUnComprobante.next(data != null);
        }
      );
      this._persistencia.removePersistenciaSimple('comprobanteConsultaseleccionedo');
    }
  }

  inicializarVariables() {
    this.escogioUnComprobante = new BehaviorSubject(false);
    this.habilitarPorTipoDeNotaDeCredito = -1;
    this.esValidadoDataTableNotaCredito = true;
    this.controlNameVistaNormal = 'vistaNormal';
    this.controlNameVistaDataTable = 'vistaDataTable';
    this.notaCredito = new NotaCredito();
    this.todosTiposDeNotasDeCreditos =
      this._parametrosServicie.obtenerParametrosPorId(this._tiposService.PARAMETRO_TIPO_NOTA_CREDITO_ELECTRONICA);
    this.todosTipoConceptos =
      this._conceptoDocumentoService.obtenerTodosConceptosDocumentos();
    const codigosConceptosAUtilizar = [
      this._tiposService.CONCEPTO_OPERACION_GRAVADA_CODIGO,
      this._tiposService.CONCEPTO_OPERACION_INAFECTAS_CODIGO,
      this._tiposService.CONCEPTO_OPERACION_EXONERADO_CODIGO,
      this._tiposService.CONCEPTO_OPERACION_GRATUITA_CODIGO,
      this._tiposService.CONCEPTO_OPERACION_SUB_TOTAL_VENTA_CODIGO,
      this._tiposService.CONCEPTO_OPERACION_TOTAL_DESCUENTOS_CODIGO
    ];
    this.tiposConceptos = this._conceptoDocumentoService.obtenerPorCodigos(this.todosTipoConceptos, codigosConceptosAUtilizar);
    this.todosTiposMonedas = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_MONEDAS);
    this.todosTiposUnidades = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_UNIDADES_MEDIDA);
  }

  cargarSeries() {
    this.todasSeries = this._seriesService.filtroSeries(
      localStorage.getItem('id_entidad'), this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO, this._tiposService.TIPO_SERIE_ONLINE.toString()
    );
    this.seriesComprobante = new BehaviorSubject([]);
  }

  filtrarSeriesComprobante() {
    this.seriesComprobante = this._seriesService.filtroSeries(
      localStorage.getItem('id_entidad'),
      this.notaDeCreditoFormGroup.controls['cmbTipoComprobante'].value,
      this._tiposService.TIPO_SERIE_ONLINE.toString()
    );
  }

  filtrarSeries(esPersistencia: boolean = false) {
    const tipoComprobanteAux = this.notaDeCreditoFormGroup.controls['cmbTipoComprobante'].value;
    this.notaDeCreditoFormGroup.controls['cmbSerie'].reset('-1');
    this.notaDeCreditoFormGroup.controls['cmbSerie'].enable();
    this._estilosService.eliminarEstiloInput('cmbSerie', 'is-empty');
    this.series = this._seriesService
      .filtrarSeriesPorIdTipoComprobante(this.todasSeries, tipoComprobanteAux);
    if (esPersistencia) {
      this.series.subscribe(
        seriesResp => {
          if (seriesResp.length > 0) {
            const serieAux = seriesResp.find(item => item.serie === this.notaCredito.numeroComprobante);
            this.notaDeCreditoFormGroup.controls['cmbSerie'].setValue(serieAux.idSerie);
          }
        }
      );
    }
  }

  cargarDatosNotaCreditoPersistencia() {
    this._notaCreditoService.obtenerNotaCreditoPersistencia();
    if (this._notaCreditoService.estaUsandoPersistencia.value) {
      this.notaCredito = this._notaCreditoService.notaCredito.value;
      this.cargarCabecera();
      this.cargarDocumentoReferencia();
      this.cargarDocumentoParametro();
      this._notaCreditoService.eliminarNotaCreditoPersistencia();
    }
  }

  cargarDocumentoReferencia() {
    if (this.notaCredito.documentoReferencia[0] !== undefined) {
      this.notaDeCreditoFormGroup.controls['cmbTipoComprobante'].setValue(this.notaCredito.documentoReferencia[0].tipoDocumentoDestino);
      this.filtrarSeries(true);
      this.filtrarSeriesComprobante();
      this.notaDeCreditoFormGroup.controls['cmbSerieComprobante'].setValue(
        this.notaCredito.documentoReferencia[0].serieDocumentoDestino
      );
      this.notaDeCreditoFormGroup.controls['txtCorrelativoComprobante'].setValue(
        this.notaCredito.documentoReferencia[0].correlativoDocumentoDestino);
      this.escogioUnComprobante.next(true);
      this._estilosService.eliminarEstiloInput('cmbSerieComprobante', 'is-empty');
      this._estilosService.eliminarEstiloInput('cmbTipoComprobante', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtCorrelativoComprobante', 'is-empty');

      this.notaDeCreditoFormGroup.controls['cmbSerieComprobante'].enable();
      this.notaDeCreditoFormGroup.controls['txtCorrelativoComprobante'].enable();
    }
  }

  cargarDocumentoParametro() {
    if (this.notaCredito.documentoParametro[0] !== undefined) {
      this.cargarTiposDeNotasDeCredito(true);
    }
  }

  cargarCabecera() {
    this.notaDeCreditoFormGroup.controls['txtMotivoNotaCredito'].setValue(this.notaCredito.motivoComprobante);
    this.notaDeCreditoFormGroup.controls['txtObservacionesNotaCredito'].setValue(this.notaCredito.observacionComprobante);
    this.notaDeCreditoFormGroup.controls['txtDocumento'].setValue(this.notaCredito.rucComprador);
    this.notaDeCreditoFormGroup.controls['txtRazonSocial'].setValue(this.notaCredito.razonSocialComprador);
    this.notaDeCreditoFormGroup.controls['txtMoneda'].setValue(this.notaCredito.moneda);

    this._estilosService.eliminarEstiloInput('txtMotivoNotaCredito', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtObservacionesNotaCredito', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtDocumento', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtRazonSocial', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtMoneda', 'is-empty');
  }

  cargarTiposDeNotasDeCredito(esPersistencia: boolean = false) {
    let listaCodigos = [];
    switch (this.notaDeCreditoFormGroup.get('cmbTipoComprobante').value) {
      case this._tiposService.TIPO_DOCUMENTO_FACTURA:
        listaCodigos = [
          this._tiposService.TIPO_NOTA_CREDITO_ANULACION_DE_OPERACION,
          this._tiposService.TIPO_NOTA_CREDITO_ANULACION_POR_ERROR_RUC,
          this._tiposService.TIPO_NOTA_CREDITO_CORRECCION_DE_LA_DESCRIPCION,
          this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_GLOBAL,
          this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_POR_ITEM,
          this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_TOTAL,
          this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_POR_ITEM,
          this._tiposService.TIPO_NOTA_CREDITO_BONIFICACION,
          this._tiposService.TIPO_NOTA_CREDITO_DISMINUCION_EN_EL_VALOR
        ];
        break;
      case this._tiposService.TIPO_DOCUMENTO_BOLETA:
        listaCodigos = [
          this._tiposService.TIPO_NOTA_CREDITO_ANULACION_DE_OPERACION,
          this._tiposService.TIPO_NOTA_CREDITO_ANULACION_POR_ERROR_RUC,
          this._tiposService.TIPO_NOTA_CREDITO_CORRECCION_DE_LA_DESCRIPCION,
          this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_TOTAL,
          this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_POR_ITEM,
          this._tiposService.TIPO_NOTA_CREDITO_DISMINUCION_EN_EL_VALOR
        ];
        break;
    }
    this.notaDeCreditoFormGroup.controls['cmbTipoNotaCredito'].reset('-1');
    this._estilosService.eliminarEstiloInput('cmbTipoNotaCredito', 'is-empty');
    this.escogioUnComprobante.subscribe(
      escogio => {
        if (escogio) {
          this.tiposDeNotasDeCreditos =
            this._parametrosServicie.obtenerPorCodigoDeTipoDeComprobante(this.todosTiposDeNotasDeCreditos, listaCodigos);
          this.notaDeCreditoFormGroup.controls['cmbTipoNotaCredito'].enable();
          if (esPersistencia) {
            if (this.notaCredito.documentoParametro[0] !== undefined) {
              const jsonDocumentoParametro: JsonDocumentoParametroNotaCredito = JSON.parse(this.notaCredito.documentoParametro[0].json);
              this.tiposDeNotasDeCreditos.subscribe(
                tiposNotasCreditoList => {
                  if (tiposNotasCreditoList.length > 0) {
                    this.notaDeCreditoFormGroup.controls['cmbTipoNotaCredito'].setValue(jsonDocumentoParametro.auxiliarCaracter);
                    this.cambioTipoNotaCredito();
                  }
                }
              );
            }
          }
        } else {
          this.notaDeCreditoFormGroup.get('cmbTipoNotaCredito').disable();
        }
      }
    );
  }

  cargarTiposDeComprobantes() {
    this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
    const codigosComprobantes = [
      this._tiposService.TIPO_DOCUMENTO_FACTURA,
      this._tiposService.TIPO_DOCUMENTO_BOLETA
    ];
    this.tiposDeComprobantes = this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);
  }

  iniciarNotaDeCreditoFormGroup() {
    this.notaDeCreditoFormGroup = new FormGroup({
      'cmbSerie': new FormControl({value: '', disabled: true},
        [Validators.required, ValidadorPersonalizado.validarSelectForm('seleccioneUnaSerie')]),
      'cmbTipoComprobante': new FormControl('', [Validators.required]),
      'cmbSerieComprobante': new FormControl({value: '', disabled: true}, [Validators.required]),
      'txtCorrelativoComprobante': new FormControl({value: '', disabled: true}, [Validators.required]),
      'cmbTipoNotaCredito': new FormControl({value: '', disabled: true},
        [Validators.required, ValidadorPersonalizado.validarSelectForm('seleccioneUnTipoDeNotaDeCredito')]),
      'txtMotivoNotaCredito': new FormControl('', [Validators.required, Validators.maxLength(250)]),
      'txtObservacionesNotaCredito': new FormControl('', [Validators.maxLength(250)]),
      'txtDocumento': new FormControl({value: '', disabled: true}, [Validators.required]),
      'txtRazonSocial': new FormControl({value: '', disabled: true}, [Validators.required]),
      'txtMoneda': new FormControl({value: '', disabled: true}, [Validators.required])
    });
  }

  verificarEstadoComprobante(estadoComprobante: string) {
    const tiposEstadosAceptados = [
      this._tiposService.TIPO_ESTADO_AUTORIZADO,
      this._tiposService.TIPO_ESTADO_AUTORIZADO_CON_OBSERVACIONES
    ];
    return tiposEstadosAceptados.findIndex(item => item === Number(estadoComprobante)) !== -1;
  }

  buscarComprobante() {
    this._comprobantesService.buscarPorTipoComprobanteSerieCorrelativo(
      this.notaDeCreditoFormGroup.controls['cmbTipoComprobante'].value,
      this.notaDeCreditoFormGroup.controls['cmbSerieComprobante'].value,
      this.notaDeCreditoFormGroup.controls['txtCorrelativoComprobante'].value
    ).subscribe(
      comprobante => {
        if (comprobante) {
          let mensajeError = '';
          this._translateService.get('mensajeErrorBusquedaComprobanteEnNotaCredito').take(1).subscribe(item => mensajeError = item);
          if (this.verificarEstadoComprobante(comprobante['chEstadocomprobantepago'])) {
            this.escogioUnComprobante.next(true);
            this._notaCreditoService.cargandoDetalleComprobante(comprobante, this.todosTiposUnidades);
            this.notaDeCreditoFormGroup.get('txtDocumento').setValue(comprobante.entidadcompradora.vcDocumento);
            this.notaDeCreditoFormGroup.get('txtRazonSocial').setValue(comprobante.entidadcompradora.vcDenominacion);
            this.notaDeCreditoFormGroup.get('txtMoneda').setValue(comprobante.chMonedacomprobantepago);
            this._estilosService.eliminarEstiloInput( 'txtDocumento', 'is-empty');
            this._estilosService.eliminarEstiloInput( 'txtRazonSocial', 'is-empty');
            this._estilosService.eliminarEstiloInput( 'txtMoneda', 'is-empty');
          } else {
            this.escogioUnComprobante.next(false);
            swal({
              type: 'error',
              title: mensajeError,
              confirmButtonClass: 'btn btn-danger',
              buttonsStyling: false
            });
          }
        } else {
          this.limpiar();
          this.escogioUnComprobante.next(false);
        }
      }
    );
  }

  visualizarComprobanteReferencia() {
    this._archivoService.retornarArchivoRetencionPercepcionbase(
      this._notaCreditoService.comprobanteReferencia.value.inIdcomprobantepago)
      .subscribe(
        data => {
          if (data) {
            const winparams =
              'dependent = yes, locationbar = no, menubar = yes, resizable, screenX = 50, screenY = 50, width = 800, height = 800';
            const htmlPop = '<embed width=100% height=100% type="application/pdf" src="data:application/pdf;base64,' + data + '"> </embed>';
            const printWindow = window.open('', 'PDF', winparams);
            printWindow.document.write(htmlPop);
          }
        }
      );
  }

  limpiar() {
    this.habilitarPorTipoDeNotaDeCredito = -1 ;
    this.notaDeCreditoFormGroup.get('txtDocumento').reset();
    this._estilosService.agregarEstiloInput('txtDocumento', 'is-empty');

    this.notaDeCreditoFormGroup.get('txtRazonSocial').reset();
    this._estilosService.agregarEstiloInput('txtRazonSocial', 'is-empty');

    this.notaDeCreditoFormGroup.get('txtMoneda').reset();
    this._estilosService.agregarEstiloInput('txtMoneda', 'is-empty');

    this.notaDeCreditoFormGroup.get('txtMotivoNotaCredito').reset();
    this._estilosService.agregarEstiloInput('txtMotivoNotaCredito', 'is-empty');

    this.notaDeCreditoFormGroup.get('txtObservacionesNotaCredito').reset();
    this._estilosService.agregarEstiloInput('txtObservacionesNotaCredito', 'is-empty');

    this.notaDeCreditoFormGroup.controls['cmbTipoNotaCredito'].reset('-1');
    this._estilosService.eliminarEstiloInput('cmbTipoNotaCredito', 'is-empty');
    this.notaCredito = new NotaCredito();
  }

  cambioTipoNotaCredito() {
    if (!this._notaCreditoService.estaUsandoPersistencia) {
      this.notaDeCreditoFormGroup.get('txtMotivoNotaCredito').reset();
      this._estilosService.agregarEstiloInput('txtMotivoNotaCredito', 'is-empty');

      this.notaDeCreditoFormGroup.get('txtObservacionesNotaCredito').reset();
      this._estilosService.agregarEstiloInput('txtObservacionesNotaCredito', 'is-empty');
    }
    const tipoNotaCreditoAux = this.notaDeCreditoFormGroup.get('cmbTipoNotaCredito').value;
    this._notaCreditoService.ponerTipoNotaCredito(tipoNotaCreditoAux);
    switch ( tipoNotaCreditoAux ) {
      case this._tiposService.TIPO_NOTA_CREDITO_ANULACION_DE_OPERACION:
        this.cargarAnulacionOperacion();
        break;
      case this._tiposService.TIPO_NOTA_CREDITO_ANULACION_POR_ERROR_RUC:
        this.cargarErrorRuc();
        break;
      case this._tiposService.TIPO_NOTA_CREDITO_CORRECCION_DE_LA_DESCRIPCION:
        this.cargarCoreccionDescripcion();
        break;
      case this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_GLOBAL:
        this.cargarDescuentoGlobal();
        break;
      case this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_POR_ITEM:
        this.cargarDescuentoItem();
        break;
      case this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_TOTAL:
        this.cargarDevolucionTotal();
        break;
      case this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_POR_ITEM:
        this.cargarDevolucionItem();
        break;
      case this._tiposService.TIPO_NOTA_CREDITO_BONIFICACION:
        this.cargarBonificacion();
        break;
      case this._tiposService.TIPO_NOTA_CREDITO_DISMINUCION_EN_EL_VALOR:
        this.cargarDisminucionValor();
        break;
    }
  }

  cargarAnulacionOperacion() {
    this.habilitarPorTipoDeNotaDeCredito = this.tiposVistasDeNotaCredito.NORMAL;
  }

  cargarErrorRuc() {
    this.habilitarPorTipoDeNotaDeCredito = this.tiposVistasDeNotaCredito.NORMAL;
  }

  cargarCoreccionDescripcion() {
    this.habilitarPorTipoDeNotaDeCredito = this.tiposVistasDeNotaCredito.TABLA;
  }

  cargarDescuentoGlobal() {
    this.habilitarPorTipoDeNotaDeCredito = this.tiposVistasDeNotaCredito.NORMAL;
  }

  cargarDescuentoItem() {
    this.habilitarPorTipoDeNotaDeCredito = this.tiposVistasDeNotaCredito.TABLA;
  }
  cargarDevolucionTotal() {
    this.habilitarPorTipoDeNotaDeCredito = this.tiposVistasDeNotaCredito.NORMAL;
  }

  cargarDevolucionItem() {
    this.habilitarPorTipoDeNotaDeCredito = this.tiposVistasDeNotaCredito.TABLA;
  }

  cargarBonificacion() {
    this.habilitarPorTipoDeNotaDeCredito = this.tiposVistasDeNotaCredito.NORMAL;
  }

  cargarDisminucionValor() {
    this.habilitarPorTipoDeNotaDeCredito = this.tiposVistasDeNotaCredito.TABLA;
  }

  cambioTipoComprobante() {
    this.notaDeCreditoFormGroup.get('txtDocumento').reset();
    this.notaDeCreditoFormGroup.get('txtRazonSocial').reset();
    this.notaDeCreditoFormGroup.get('txtMoneda').reset();
    this.notaDeCreditoFormGroup.get('cmbSerieComprobante').reset();
    this.notaDeCreditoFormGroup.get('txtCorrelativoComprobante').reset();
    this._estilosService.agregarEstiloInput('txtDocumento', 'is-empty');
    this._estilosService.agregarEstiloInput('txtRazonSocial', 'is-empty');
    this._estilosService.agregarEstiloInput('txtMoneda', 'is-empty');
    this._estilosService.agregarEstiloInput('cmbSerieComprobante', 'is-empty');
    this._estilosService.agregarEstiloInput('txtCorrelativoComprobante', 'is-empty');

    this.habilitarPorTipoDeNotaDeCredito = -1;
    this.escogioUnComprobante.next(false);
    this.filtrarSeries();
    this.cargarTiposDeNotasDeCredito();
    this.notaDeCreditoFormGroup.get('cmbSerieComprobante').enable();
    this.notaDeCreditoFormGroup.get('txtCorrelativoComprobante').enable();
    this.filtrarSeriesComprobante();
  }

  vistaPrevia() {
    this._notaCreditoService.notaCredito.value.motivoComprobante = this.notaDeCreditoFormGroup.controls['txtMotivoNotaCredito'].value;
    this._notaCreditoService.notaCredito.value.observacionComprobante =
      this.notaDeCreditoFormGroup.controls['txtObservacionesNotaCredito'].value;
    this._notaCreditoService.setDatosPersistencia(
      this.tiposConceptos,
      this.tiposDeNotasDeCreditos,
      this.notaDeCreditoFormGroup.controls['cmbTipoNotaCredito'].value,
      this.series,
      this.notaDeCreditoFormGroup.controls['cmbSerie'].value,
      this.notaDeCreditoFormGroup.controls['txtMotivoNotaCredito'].value,
      this.notaDeCreditoFormGroup.controls['txtObservacionesNotaCredito'].value
      );
    this._notaCreditoService.notaCredito.value.auxMonedaTablaMaestra =
      this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposMonedas,
        [this._notaCreditoService.comprobanteReferencia.value.vcIdregistromoneda] ).value[0];
    this._notaCreditoService.pasoAVistaPrevia.next(true);
    this.router.navigate(['./vistaPrevia'], {relativeTo: this.route});
  }

  estaValidadoNotaCreditoDataTable(event) {
    this.esValidadoDataTableNotaCredito = event;
  }

  seInicioDataTable(event) {
    if (!event) {
      this.esValidadoDataTableNotaCredito = true;
    }
  }
}
