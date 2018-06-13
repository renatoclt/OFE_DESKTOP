import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ComprobantesService} from '../../general/services/comprobantes/comprobantes.service';
import {ParametrosService} from '../../general/services/configuracionDocumento/parametros.service';
import {TablaMaestraService} from '../../general/services/documento/tablaMaestra.service';
import {EstilosServices} from '../../general/utils/estilos.services';
import {ActivatedRoute, Router} from '@angular/router';
import {TiposService} from '../../general/utils/tipos.service';
import {ArchivoService} from '../../general/services/archivos/archivo.service';
import {SeriesService} from '../../general/services/configuracionDocumento/series.service';
import {
  TABLA_MAESTRA_MONEDAS, TABLA_MAESTRA_TIPO_COMPROBANTE, TABLA_MAESTRA_UNIDADES_MEDIDA,
  TablaMaestra
} from '../../general/models/documento/tablaMaestra';
import {Serie} from '../../general/models/configuracionDocumento/serie';
import {Parametros} from '../../general/models/parametros/parametros';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {ConceptoDocumento} from '../../general/models/documento/conceptoDocumento';
import {ConceptoDocumentoService} from '../../general/services/documento/conceptoDocumento.service';
import {TiposVistasNotaDebito} from './utils/tipos-vistas-nota-debito';
import {NotaDebito} from './modelos/notaDebito';
import {NotaDebitoService} from './servicios/nota-debito-service';
import {JsonDocumentoParametroNotaDebito} from './modelos/jsonDocumentoParametroNotaDebito';
import {ValidadorPersonalizado} from '../../general/services/utils/validadorPersonalizado';
import {PadreComprobanteService} from '../services/padre-comprobante.service';
import {TranslateService} from '@ngx-translate/core';
import { Comprobante } from 'app/facturacion-electronica/general/models/comprobantes/comprobante';
import { PersistenciaService } from '../services/persistencia.service';

declare var swal: any;

@Component({
  selector: 'app-nota-debito',
  templateUrl: './nota-debito.component.html',
  styleUrls: ['./nota-debito.component.css']
})
export class NotaDebitoComponent implements OnInit, OnDestroy {
  titulo = 'notaDebitoElectronica';
  notaDeDebitoFormGroup: FormGroup;

  public escogioUnComprobante: BehaviorSubject<boolean>;

  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]>;
  public tiposDeComprobantes: BehaviorSubject<TablaMaestra[]>;

  private todosTiposDeNotasDeDebito: BehaviorSubject<Parametros[]>;
  public tiposDeNotasDeDebito: BehaviorSubject<Parametros[]>;

  public habilitarPorTipoDeNotaDeDebito: number;

  TiposVistasNotaDebito = TiposVistasNotaDebito;
  public tiposVistasDeNotaDebito = TiposVistasNotaDebito;

  public todasSeries: BehaviorSubject<Serie[]>;
  public series: BehaviorSubject<Serie[]>;

  public seriesComprobante: BehaviorSubject<Serie[]>;

  public notaDebito: NotaDebito;

  private todosTipoConceptos: BehaviorSubject<ConceptoDocumento[]>;

  private tiposConceptos: BehaviorSubject<ConceptoDocumento[]>;

  private todosTiposMonedas: BehaviorSubject<TablaMaestra[]>;

  private todosTiposUnidades: BehaviorSubject<TablaMaestra[]>;

  controlNameVistaNormal: string;
  controlNameVistaDataTable: string;

  esValidadoDataTableNotaDebito: boolean;

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
              private _notaDebitoService: NotaDebitoService,
              private _padreComprobanteService: PadreComprobanteService,
              private _persistencia: PersistenciaService) {
    this._padreComprobanteService.actualizarComprobante(this.route.snapshot.data['codigo'], this.route.snapshot.data['mostrarCombo'],
      false);
  }

  ngOnInit() {
    this._notaDebitoService.pasoAVistaPrevia.next(false);
    this.inicializarVariables();
    this.cargarSeries();
    this.iniciarNotaDeDebitoFormGroup();
    this.cargarTiposDeComprobantes();
    this.cargarDatosNotaDebitoPersistencia();
    this.cargarPersistencia();
  }

  ngOnDestroy() {
  }
  cargarPersistencia() {
    let comprobantePersistencia: Comprobante = new Comprobante();
    comprobantePersistencia = this._persistencia.getPersistenciaSimple<Comprobante>('comprobanteConsultaSeleccionado');
    if (comprobantePersistencia) {
      this.notaDeDebitoFormGroup.controls['cmbTipoComprobante'].setValue(comprobantePersistencia.tipoComprobante);
      this.cambioTipoComprobante();
      const serieCorrelativo = comprobantePersistencia.numeroComprobante.split('-');
      this.notaDeDebitoFormGroup.controls['txtDocumento'].setValue(comprobantePersistencia.vcDocumentoCliente);
      this.notaDeDebitoFormGroup.controls['txtRazonSocial'].setValue(comprobantePersistencia.vcDenominacionCliente);
      this.notaDeDebitoFormGroup.controls['txtMoneda'].setValue(comprobantePersistencia.moneda);
      this.notaDeDebitoFormGroup.controls['cmbSerieComprobante'].setValue( serieCorrelativo[0] );
      this.notaDeDebitoFormGroup.controls['txtCorrelativoComprobante'].setValue(serieCorrelativo[1]);
      this._estilosService.eliminarEstiloInput('cmbSerieComprobante', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtCorrelativoComprobante', 'is-empty');
      this._estilosService.eliminarEstiloInput('cmbTipoComprobante', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtDocumento', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtRazonSocial', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtMoneda', 'is-empty');
      this._notaDebitoService.buscarComprobanteReferencia(comprobantePersistencia.inIdcomprobantepago, this.todosTiposUnidades);
      this._notaDebitoService.comprobanteReferencia.subscribe(
        data => {
          this.escogioUnComprobante.next(data != null);
        }
      );
      this._persistencia.removePersistenciaSimple('comprobanteConsultaSeleccionado');
    }
  }

  inicializarVariables() {
    this.escogioUnComprobante = new BehaviorSubject(false);
    this.habilitarPorTipoDeNotaDeDebito = -1;
    this.esValidadoDataTableNotaDebito = true;
    this.controlNameVistaNormal = 'vistaNormal';
    this.controlNameVistaDataTable = 'vistaDataTable';
    this.notaDebito = new NotaDebito();
    this.todosTiposDeNotasDeDebito =
      this._parametrosServicie.obtenerParametrosPorId(this._tiposService.PARAMETRO_TIPO_NOTA_DEBITO_ELECTRONICA);
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
      localStorage.getItem('id_entidad'), this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO, this._tiposService.TIPO_SERIE_ONLINE.toString());
    this.seriesComprobante = new BehaviorSubject([]);
  }

  filtrarSeriesComprobante() {
    this.seriesComprobante = this._seriesService.filtroSeries(
      localStorage.getItem('id_entidad'),
      this.notaDeDebitoFormGroup.controls['cmbTipoComprobante'].value,
      this._tiposService.TIPO_SERIE_ONLINE.toString()
    );
  }

  filtrarSeries(esPersistencia: boolean = false) {
    const tipoComprobanteAux = this.notaDeDebitoFormGroup.controls['cmbTipoComprobante'].value;
    this.notaDeDebitoFormGroup.controls['cmbSerie'].reset('-1');
    this.notaDeDebitoFormGroup.controls['cmbSerie'].enable();
    this._estilosService.eliminarEstiloInput('cmbSerie', 'is-empty');
    this.series = this._seriesService
      .filtrarSeriesPorIdTipoComprobante(this.todasSeries, tipoComprobanteAux);
    if (esPersistencia) {
      this.series.subscribe(
        seriesResp => {
          if (seriesResp.length > 0) {
            const serieAux = seriesResp.find(item => item.serie === this.notaDebito.numeroComprobante);
            this.notaDeDebitoFormGroup.controls['cmbSerie'].setValue(serieAux.idSerie);
          }
        }
      );
    }
  }

  cargarDatosNotaDebitoPersistencia() {
    this._notaDebitoService.obtenerNotaDebitoPersistencia();
    if (this._notaDebitoService.estaUsandoPersistencia.value) {
      this.notaDebito = this._notaDebitoService.notaDebito.value;
      this.cargarCabecera();
      this.cargarDocumentoReferencia();
      this.cargarDocumentoParametro();
      this._notaDebitoService.eliminarNotaDebitoPersistencia();
    }
  }

  cargarDocumentoReferencia() {
    if (this.notaDebito.documentoReferencia[0] !== undefined) {
      this.notaDeDebitoFormGroup.controls['cmbTipoComprobante'].setValue(this.notaDebito.documentoReferencia[0].tipoDocumentoDestino);
      this.filtrarSeries(true);
      this.filtrarSeriesComprobante();
      this.notaDeDebitoFormGroup.controls['cmbSerieComprobante'].setValue(
        this.notaDebito.documentoReferencia[0].serieDocumentoDestino
      );
      this.notaDeDebitoFormGroup.controls['txtCorrelativoComprobante'].setValue(
        this.notaDebito.documentoReferencia[0].correlativoDocumentoDestino);
      this.escogioUnComprobante.next(true);
      this._estilosService.eliminarEstiloInput('cmbSerieComprobante', 'is-empty');
      this._estilosService.eliminarEstiloInput('cmbTipoComprobante', 'is-empty');
      this._estilosService.eliminarEstiloInput('txtCorrelativoComprobante', 'is-empty');

      this.notaDeDebitoFormGroup.controls['cmbSerieComprobante'].enable();
      this.notaDeDebitoFormGroup.controls['txtCorrelativoComprobante'].enable();
    }
  }

  cargarDocumentoParametro() {
    if (this.notaDebito.documentoParametro[0] !== undefined) {
      this.cargarTiposDeNotasDeDebito(true);
    }
  }

  cargarCabecera() {
    this.notaDeDebitoFormGroup.controls['txtMotivoNotaDebito'].setValue(this.notaDebito.motivoComprobante);
    this.notaDeDebitoFormGroup.controls['txtObservacionesNotaDebito'].setValue(this.notaDebito.observacionComprobante);
    this.notaDeDebitoFormGroup.controls['txtDocumento'].setValue(this.notaDebito.rucComprador);
    this.notaDeDebitoFormGroup.controls['txtRazonSocial'].setValue(this.notaDebito.razonSocialComprador);
    this.notaDeDebitoFormGroup.controls['txtMoneda'].setValue(this.notaDebito.moneda);


    this._estilosService.eliminarEstiloInput('txtMotivoNotaDebito', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtObservacionesNotaDebito', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtDocumento', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtRazonSocial', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtMoneda', 'is-empty');
  }

  cargarTiposDeNotasDeDebito(esPersistencia: boolean = false) {
    let listaCodigos = [];
    switch (this.notaDeDebitoFormGroup.get('cmbTipoComprobante').value) {
      case this._tiposService.TIPO_DOCUMENTO_FACTURA:
        listaCodigos = [
          this._tiposService.TIPO_NOTA_DEBITO_INTERES_POR_MORA,
          this._tiposService.TIPO_NOTA_DEBITO_AUMENTO_EN_EL_VALOR
        ];
        break;
      case this._tiposService.TIPO_DOCUMENTO_BOLETA:
        listaCodigos = [
          this._tiposService.TIPO_NOTA_DEBITO_INTERES_POR_MORA,
          this._tiposService.TIPO_NOTA_DEBITO_AUMENTO_EN_EL_VALOR
        ];
        break;
    }
    this.notaDeDebitoFormGroup.controls['cmbTipoNotaDebito'].reset('-1');
    this._estilosService.eliminarEstiloInput('cmbTipoNotaDebito', 'is-empty');
    this.escogioUnComprobante.subscribe(
      escogio => {
        if (escogio) {
          this.tiposDeNotasDeDebito =
            this._parametrosServicie.obtenerPorCodigoDeTipoDeComprobante(this.todosTiposDeNotasDeDebito, listaCodigos);
          this.notaDeDebitoFormGroup.get('cmbTipoNotaDebito').enable();
          this.notaDeDebitoFormGroup.controls['cmbTipoNotaDebito'].enable();
          if (esPersistencia) {
            if (this.notaDebito.documentoParametro[0] !== undefined) {
              const jsonDocumentoParametro: JsonDocumentoParametroNotaDebito = JSON.parse(this.notaDebito.documentoParametro[0].json);
              this.tiposDeNotasDeDebito.subscribe(
                tiposNotasDebitoList => {
                  if (tiposNotasDebitoList.length > 0) {
                    this.notaDeDebitoFormGroup.controls['cmbTipoNotaDebito'].setValue(jsonDocumentoParametro.auxiliarCaracter);
                    this.cambioTipoNotaDebito();
                  }
                }
              );
            }
          }
        } else {
          this.notaDeDebitoFormGroup.get('cmbTipoNotaDebito').disable();
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

  iniciarNotaDeDebitoFormGroup() {
    this.notaDeDebitoFormGroup = new FormGroup({
      'cmbSerie': new FormControl({value: '', disabled: true},
        [Validators.required, ValidadorPersonalizado.validarSelectForm('seleccioneUnaSerie')]),
      'cmbTipoComprobante': new FormControl('', [Validators.required]),
      'cmbSerieComprobante': new FormControl({value: '', disabled: true}, [Validators.required]),
      'txtCorrelativoComprobante': new FormControl({value: '', disabled: true}, [Validators.required]),
      'cmbTipoNotaDebito': new FormControl({value: '', disabled: true},
        [Validators.required, ValidadorPersonalizado.validarSelectForm('seleccioneUnTipoDeNotaDeDebito')]),
      'txtMotivoNotaDebito': new FormControl('', [Validators.required, Validators.maxLength(250)]),
      'txtObservacionesNotaDebito': new FormControl('', [Validators.maxLength(250)]),
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
      this.notaDeDebitoFormGroup.controls['cmbTipoComprobante'].value,
      this.notaDeDebitoFormGroup.controls['cmbSerieComprobante'].value,
      this.notaDeDebitoFormGroup.controls['txtCorrelativoComprobante'].value
    ).subscribe(
      comprobante => {
        if (comprobante) {
          let mensajeError = '';
          this._translateService.get('mensajeErrorBusquedaComprobanteEnNotaDebito').take(1).subscribe(item => mensajeError = item);
          if (this.verificarEstadoComprobante(comprobante['chEstadocomprobantepago'])) {
            this.escogioUnComprobante.next(true);
            this._notaDebitoService.cargandoDetalleComprobante(comprobante, this.todosTiposUnidades);
            this.notaDeDebitoFormGroup.get('txtDocumento').setValue(comprobante.entidadcompradora.vcDocumento);
            this.notaDeDebitoFormGroup.get('txtRazonSocial').setValue(comprobante.entidadcompradora.vcDenominacion);
            this.notaDeDebitoFormGroup.get('txtMoneda').setValue(comprobante.chMonedacomprobantepago);
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
      this._notaDebitoService.comprobanteReferencia.value.inIdcomprobantepago)
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
    this.habilitarPorTipoDeNotaDeDebito = -1 ;
    this.notaDeDebitoFormGroup.get('txtDocumento').reset();
    this._estilosService.agregarEstiloInput('txtDocumento', 'is-empty');

    this.notaDeDebitoFormGroup.get('txtRazonSocial').reset();
    this._estilosService.agregarEstiloInput('txtRazonSocial', 'is-empty');

    this.notaDeDebitoFormGroup.get('txtMoneda').reset();
    this._estilosService.agregarEstiloInput('txtMoneda', 'is-empty');

    this.notaDeDebitoFormGroup.get('txtMotivoNotaDebito').reset();
    this._estilosService.agregarEstiloInput('txtMotivoNotaDebito', 'is-empty');

    this.notaDeDebitoFormGroup.get('txtObservacionesNotaDebito').reset();
    this._estilosService.agregarEstiloInput('txtObservacionesNotaDebito', 'is-empty');

    this.notaDeDebitoFormGroup.controls['cmbTipoNotaDebito'].reset('-1');
    this._estilosService.eliminarEstiloInput('cmbTipoNotaDebito', 'is-empty');
    this.notaDebito = new NotaDebito();
  }

  cambioTipoNotaDebito() {
    if (!this._notaDebitoService.estaUsandoPersistencia) {
      this.notaDeDebitoFormGroup.get('txtMotivoNotaDebito').reset();
      this._estilosService.agregarEstiloInput('txtMotivoNotaDebito', 'is-empty');

      this.notaDeDebitoFormGroup.get('txtObservacionesNotaDebito').reset();
      this._estilosService.agregarEstiloInput('txtObservacionesNotaDebito', 'is-empty');
    }
    const tipoNotaDebitoAux = this.notaDeDebitoFormGroup.get('cmbTipoNotaDebito').value;
    this._notaDebitoService.ponerTipoNotaDebito(tipoNotaDebitoAux);
    switch ( tipoNotaDebitoAux ) {
      case this._tiposService.TIPO_NOTA_DEBITO_INTERES_POR_MORA:
        this.cargarInteresPorMora();
        break;
      case this._tiposService.TIPO_NOTA_DEBITO_AUMENTO_EN_EL_VALOR:
        this.cargarAumentoValor();
        break;
    }
  }

  cargarInteresPorMora() {
    this.habilitarPorTipoDeNotaDeDebito = this.tiposVistasDeNotaDebito.NORMAL;
  }

  cargarAumentoValor() {
    this.habilitarPorTipoDeNotaDeDebito = this.tiposVistasDeNotaDebito.TABLA;
  }

  listarProductosDeAutcompletado(keyword: any) {
    if (keyword) {
      const valorTxtNumeroComprobante = this.notaDeDebitoFormGroup.get('cmbTipoComprobante').value;
      if (valorTxtNumeroComprobante != null) {
        return this._comprobantesService.buscarParaAutoComplete(valorTxtNumeroComprobante, keyword.toUpperCase());
      }
    } else {
      return Observable.of([]);
    }
  }

  cambioTipoComprobante() {
    this.notaDeDebitoFormGroup.get('txtDocumento').reset();
    this.notaDeDebitoFormGroup.get('txtRazonSocial').reset();
    this.notaDeDebitoFormGroup.get('txtMoneda').reset();
    this.notaDeDebitoFormGroup.get('cmbSerieComprobante').reset();
    this.notaDeDebitoFormGroup.get('txtCorrelativoComprobante').reset();
    this._estilosService.agregarEstiloInput('txtDocumento', 'is-empty');
    this._estilosService.agregarEstiloInput('txtRazonSocial', 'is-empty');
    this._estilosService.agregarEstiloInput('txtMoneda', 'is-empty');
    this._estilosService.agregarEstiloInput('cmbSerieComprobante', 'is-empty');
    this._estilosService.agregarEstiloInput('txtCorrelativoComprobante', 'is-empty');

    this.habilitarPorTipoDeNotaDeDebito = -1;
    this.escogioUnComprobante.next(false);
    this.filtrarSeries();
    this.cargarTiposDeNotasDeDebito();
    this.notaDeDebitoFormGroup.get('cmbSerieComprobante').enable();
    this.notaDeDebitoFormGroup.get('txtCorrelativoComprobante').enable();
    this.filtrarSeriesComprobante();
  }

  vistaPrevia() {
    this._notaDebitoService.notaDebito.value.motivoComprobante = this.notaDeDebitoFormGroup.controls['txtMotivoNotaDebito'].value;
    this._notaDebitoService.notaDebito.value.observacionComprobante =
      this.notaDeDebitoFormGroup.controls['txtObservacionesNotaDebito'].value;
    this._notaDebitoService.setDatosPersistencia(
      this.tiposConceptos,
      this.tiposDeNotasDeDebito,
      this.notaDeDebitoFormGroup.controls['cmbTipoNotaDebito'].value,
      this.series,
      this.notaDeDebitoFormGroup.controls['cmbSerie'].value,
      this.notaDeDebitoFormGroup.controls['txtMotivoNotaDebito'].value,
      this.notaDeDebitoFormGroup.controls['txtObservacionesNotaDebito'].value
    );
    this._notaDebitoService.notaDebito.value.auxMonedaTablaMaestra =
      this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposMonedas,
        [this._notaDebitoService.comprobanteReferencia.value.vcIdregistromoneda] ).value[0];
    this._notaDebitoService.pasoAVistaPrevia.next(true);
    this.router.navigate(['./vistaPrevia'], {relativeTo: this.route});
  }

  estaValidadoNotaDebitoDataTable(event) {
    this.esValidadoDataTableNotaDebito = event;
  }

  seInicioDataTable(event) {
    if (!event) {
      this.esValidadoDataTableNotaDebito = true;
    }
  }
}
