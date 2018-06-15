import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TiposService} from '../../../general/utils/tipos.service';
import {TablaMaestraService} from '../../../general/services/documento/tablaMaestra.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PadreRetencionPercepcionService} from '../../services/padre-retencion-percepcion.service';
import {ComprobantesService} from '../../../general/services/comprobantes/comprobantes.service';
import {TABLA_MAESTRA_MONEDAS, TABLA_MAESTRA_TIPO_COMPROBANTE, TablaMaestra} from '../../../general/models/documento/tablaMaestra';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PercepcionComunService} from '../servicios/percepcion-comun.service';
import {PercepcionCrearDetalle} from '../modelos/percepcion-crear-detalle';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {PrecioPipe} from '../../../general/pipes/precio.pipe';
import {ValidadorPersonalizado} from '../../../general/services/utils/validadorPersonalizado';
import {ParametrosService} from '../../../general/services/configuracionDocumento/parametros.service';
import {Parametros} from '../../../general/models/parametros/parametros';
import {UtilsService} from '../../../general/utils/utils.service';
import {FormatoFecha} from '../../../general/utils/formato-fechas';
import {TranslateService} from '@ngx-translate/core';
import {Comprobante} from '../../../general/models/comprobantes/comprobante';
import {Subscription} from 'rxjs/Subscription';
import {DatePipe} from '@angular/common';
import {ManejoMensajes} from '../../../general/utils/manejo-mensajes';

declare var swal: any;

@Component({
  selector: 'app-percepcion-item-crear',
  templateUrl: './percepcion-item-crear.component.html',
  styleUrls: ['./percepcion-item-crear.component.css']
})
export class PercepcionItemCrearComponent implements OnInit, OnDestroy {

  public tiposComprobantes: BehaviorSubject<TablaMaestra[]>;
  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]>;

  public tiposPercepcion: BehaviorSubject<Parametros[]>;

  public tiposMonedas: BehaviorSubject<TablaMaestra[]>;

  public escogioUnComprobante: BehaviorSubject<boolean>;

  public itemFormGroup: FormGroup;

  public esEditable: BehaviorSubject<boolean>;

  itemAEditar: PercepcionCrearDetalle;
  comprobanteReferencia: BehaviorSubject<Comprobante>;

  comprobanteSubscription: Subscription;

  titulo: string;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private manejoMensajes: ManejoMensajes,
              private _comprobantesService: ComprobantesService,
              private _tiposService: TiposService,
              private _tablaMaestraService: TablaMaestraService,
              private _percepcionComunService: PercepcionComunService,
              private _estilosService: EstilosServices,
              private _utilsService: UtilsService,
              private _precioPipe: PrecioPipe,
              private _datePipe: DatePipe,
              private _translateService: TranslateService,
              private _parametrosService: ParametrosService,
              private _padreRetencionPerpcionService: PadreRetencionPercepcionService) {
    this._padreRetencionPerpcionService.actualizarComprobante(this.route.snapshot.data['codigo'],
      this.route.snapshot.data['mostrarCombo'], true);
  }

  ngOnInit() {
    this.inicializarVariables();
  }

  ngOnDestroy() {
    if (this.comprobanteSubscription) {
      this.comprobanteSubscription.unsubscribe();
    }
  }

  inicializarVariables() {
    this.titulo = 'agregarItem';
    this.escogioUnComprobante = new BehaviorSubject(false);
    this.comprobanteReferencia = new BehaviorSubject(null);
    this.filtrarComprobantes();
    this.obtenerTiposMonedas();
    this.obtenerTiposPercepcion();
    this.initForm();
    this.obtenerParametros();
  }

  obtenerTiposPercepcion() {
    this.tiposPercepcion = this._parametrosService.obtenerParametrosPorId(this._tiposService.PARAMETRO_REGIMENES_PERCEPCION);
  }

  obtenerParametros() {
    this.esEditable = new BehaviorSubject(this.route.snapshot.data['esEditable']);
    this.itemAEditar = new PercepcionCrearDetalle();
    if (this._percepcionComunService.hayPersistencia()) {
      if (this.esEditable.value) {
        this.itemAEditar = this._percepcionComunService.itemDetalleEditar.value;
        if (this.itemAEditar) {
          this.cargarDatosItem();
        } else {
          this.regresar();
        }
      } else {
        this._estilosService.eliminarEstiloInput('cmbPorcentajePercepcion', 'is-empty');
        this.itemFormGroup.controls['cmbPorcentajePercepcion'].setValue(
          this._percepcionComunService.percepcionAuxiliar.value.cabecera.tipoPorcentajePercepcion
        );
        this.itemFormGroup.controls['txtMontoPorcentajePercepcion'].setValue(
          this._percepcionComunService.percepcionAuxiliar.value.cabecera.porcentajePercepcion.toFixed(2)
        );
      }
    } else {
      this.regresar();
    }
  }

  cargarDatosItem() {
    this.itemFormGroup.controls['cmbTipoComprobante'].setValue(this.itemAEditar.tipoComprobante);
    this.itemFormGroup.controls['txtSerieComprobante'].setValue(this.itemAEditar.serieComprobante);
    this.itemFormGroup.controls['txtCorrelativoComprobante'].setValue(this.itemAEditar.correlativoComprobante);
    this.itemFormGroup.controls['txtMontoComprobante'].setValue(this.itemAEditar.importeTotalComprobante);
    this.itemFormGroup.controls['cmbMonedaComprobante'].setValue(this.itemAEditar.monedaComprobante);
    this.itemFormGroup.controls['txtFechaEmisionComprobante'].setValue(this.itemAEditar.fechaEmisionComprobante);
    this.itemFormGroup.controls['txtTipoCambioComprobante'].setValue(this.itemAEditar.tipoCambioComprobante);
    this.itemFormGroup.controls['txtImporteSoles'].setValue(this.itemAEditar.importeSolesComprobante);
    this.itemFormGroup.controls['cmbPorcentajePercepcion'].setValue(this.itemAEditar.tipoPorcentajePercepcion);
    this.itemFormGroup.controls['txtMontoPorcentajePercepcion'].setValue(this.itemAEditar.porcentajePercepcion.toFixed(2));
    this.itemFormGroup.controls['txtMontoPercepcion'].setValue(this.itemAEditar.montoPercepcion);

    this._estilosService.eliminarEstiloInput('cmbTipoComprobante', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtSerieComprobante', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtCorrelativoComprobante', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtMontoComprobante', 'is-empty');
    this._estilosService.eliminarEstiloInput('cmbMonedaComprobante', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtFechaEmisionComprobante', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtTipoCambioComprobante', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtImporteSoles', 'is-empty');
    this._estilosService.eliminarEstiloInput('cmbPorcentajePercepcion', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtMontoPorcentajePercepcion', 'is-empty');
    this._estilosService.eliminarEstiloInput('txtMontoPercepcion', 'is-empty');
    this.itemFormGroup.disable(true);
    this.escogioUnComprobante.next(this.itemAEditar.comprobante === null ? false : true);
  }

  filtrarComprobantes() {
    this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
    const codigosComprobantes = [
      this._tiposService.TIPO_DOCUMENTO_FACTURA,
      this._tiposService.TIPO_DOCUMENTO_BOLETA,
      // this._tiposService.TIPO_DOCUMENTO_NOTA_CREDITO,
      // this._tiposService.TIPO_DOCUMENTO_NOTA_DEBITO
    ];
    this.tiposComprobantes = this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(
      this.todosTiposComprobantes,
      codigosComprobantes
    );
  }

  obtenerTiposMonedas() {
    this.tiposMonedas = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_MONEDAS);
  }

  regresar() {
    let regresarA = '../';
    if (this.esEditable) {
      regresarA = '../../';
    }
    this.router.navigate([regresarA], {relativeTo: this.route});
  }

  private initForm() {
    const fecha = new Date();
    const fecha_actual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.itemFormGroup = new FormGroup({
      'cmbTipoComprobante': new FormControl('', [Validators.required]),
      'txtSerieComprobante': new FormControl('' , [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4)
      ]),
      'txtCorrelativoComprobante': new FormControl('' , [Validators.required]),
      'txtMontoComprobante': new FormControl('0.00', [
        Validators.required,
        Validators.pattern('[0-9]+[.][0-9]{2}'),
        Validators.minLength(4),
        Validators.maxLength(15),
        Validators.min(0.01),
      ]),
      'txtMontoPercepcion': new FormControl({value: '0.00', disabled: true}, [
        Validators.required,
        Validators.pattern('[0-9]+[.][0-9]{2}'),
        Validators.minLength(4),
        Validators.maxLength(15)
      ]),
      'cmbPorcentajePercepcion':  new FormControl({value: '', disabled: true}, [
        Validators.required,
        ValidadorPersonalizado.validarSelectForm('seleccioneUnTipoDePercepcion', null)
      ]),
      'txtMontoPorcentajePercepcion':  new FormControl({value: '0.00', disabled: true}, [
        Validators.required
      ]),
      'txtFechaEmisionComprobante': new FormControl(fecha_actual, [
        Validators.required,
        ValidadorPersonalizado.fechaDeberiaSerMenorAHoy('errorFecha')
      ]),
      'cmbMonedaComprobante': new FormControl('', [
        Validators.required,
        ValidadorPersonalizado.validarSelectForm('seleccioneUnaMoneda', null)
      ]),
      'txtTipoCambioComprobante': new FormControl({value: '0.00', disabled: true}, [
        Validators.required,
        Validators.pattern('[0-9]+[.][0-9]{2}'),
        Validators.minLength(4),
        Validators.maxLength(15),
        Validators.min(0.01),
      ]),
      'txtImporteSoles': new FormControl({value: '0.00', disabled: true}, [
        Validators.required,
        Validators.pattern('[0-9]+[.][0-9]{2}'),
        Validators.minLength(4),
        Validators.maxLength(15)
      ])
    });
    this.escucharEventosForm();
  }

  limpiar() {
    this.itemFormGroup.reset();
  }

  buscarComprobante() {
    this.cambioComprobante();
    this.comprobanteSubscription = this._comprobantesService.buscarPorTipoComprobanteSerieCorrelativo(
      this.itemFormGroup.controls['cmbTipoComprobante'].value.codigo,
      this.itemFormGroup.controls['txtSerieComprobante'].value,
      this.itemFormGroup.controls['txtCorrelativoComprobante'].value
    ).subscribe(
      comprobante => {
        if (comprobante) {
          let continuarText = '';
          this._translateService.get('continuar').take(1).subscribe(item => continuarText = item);
          let accionExitosa = '';
          this._translateService.get('accionExitosa').take(1).subscribe(item => accionExitosa = item);
          if (this._utilsService.verificarEstadoComprobante(comprobante['chEstadocomprobantepago'])) {
            swal({
              type: 'success',
              title: accionExitosa,
              confirmButtonText: continuarText,
              confirmButtonColor: '#4caf50'
            });
            this.comprobanteReferencia.next(comprobante);
            this.escogioUnComprobante.next(true);
            this.itemFormGroup.get('txtMontoComprobante').setValue(this._precioPipe.transform(comprobante.deTotalcomprobantepago));
            this.itemFormGroup.get('cmbMonedaComprobante').setValue(
              this.tiposMonedas.value.find(item => item.codigo === comprobante.vcIdregistromoneda)
            );
            this.itemFormGroup.get('txtFechaEmisionComprobante').setValue(this._datePipe.transform(comprobante.tsFechaemision, 'dd/MM/yyyy');
            this._estilosService.eliminarEstiloInput('cmbMonedaComprobante', 'is-empty');
            this.cambioMoneda();
            this.itemFormGroup.controls['cmbMonedaComprobante'].disable(true);
            this.itemFormGroup.controls['txtMontoComprobante'].disable(true);
          } else {
            this.escogioUnComprobante.next(false);
            this.comprobanteReferencia.next(null);
            this.itemFormGroup.get('cmbMonedaComprobante').reset(null);
            this.itemFormGroup.get('txtMontoComprobante').reset('0.00');
            this.itemFormGroup.controls['cmbMonedaComprobante'].enable(true);
            this.itemFormGroup.controls['txtMontoComprobante'].enable(true);
            let mensajeError = '';
            this._translateService.get('mensajeErrorComprobanteNoAutorizado').take(1).subscribe(item => mensajeError = item);
            swal({
              type: 'warning',
              title: mensajeError,
              confirmButtonText: continuarText,
              confirmButtonClass: 'btn btn-warning',
              buttonsStyling: false
            });
          }
        } else {
          this.itemFormGroup.get('cmbMonedaComprobante').reset(null);
          this.itemFormGroup.get('txtMontoComprobante').reset('0.00');
          this.itemFormGroup.controls['cmbMonedaComprobante'].enable(true);
          this.itemFormGroup.controls['txtMontoComprobante'].enable(true);
          this.escogioUnComprobante.next(false);
          this.comprobanteReferencia.next(null);
        }
      }
    );
  }

  compararTablaMaestra(opcion, seleccion) {
    if (seleccion) {
      if (opcion) {
        return opcion.codigo === seleccion.codigo;
      } else {
        return false;
      }
    }
    return true;
  }

  compararParametros(opcion, seleccion) {
    if (seleccion) {
      if (opcion) {
        return opcion.id_dominio === seleccion.id_dominio;
      } else {
        return false;
      }
    }
    return true;
  }

  obtenerNuevaDataItem() {
    this.itemAEditar.tipoComprobante = this.itemFormGroup.controls['cmbTipoComprobante'].value;
    const comprobante = this.comprobanteReferencia.value;
    if (comprobante) {
      this.itemAEditar.comprobante = comprobante;
      this.itemAEditar.idComprobante = comprobante.inIdcomprobantepago;
      this.itemAEditar.serieComprobante = comprobante.vcSerie;
      this.itemAEditar.correlativoComprobante = comprobante.vcCorrelativo;
      this.itemAEditar.numeroComprobante = comprobante.vcSerie + '-' + comprobante.vcCorrelativo;
    } else {
      this.itemAEditar.comprobante = null;
      this.itemAEditar.idComprobante = null;
      this.itemAEditar.serieComprobante = this.itemFormGroup.controls['txtSerieComprobante'].value;
      this.itemAEditar.correlativoComprobante = this.itemFormGroup.controls['txtCorrelativoComprobante'].value;
      this.itemAEditar.numeroComprobante = this.itemAEditar.serieComprobante + '-' + this.itemAEditar.correlativoComprobante;
    }
    this.itemAEditar.importeTotalComprobante = this.itemFormGroup.controls['txtMontoComprobante'].value;
    this.itemAEditar.monedaComprobante = this.itemFormGroup.controls['cmbMonedaComprobante'].value;
    this.itemAEditar.fechaEmisionComprobante =
      this._utilsService.convertirFechaAFormato(
        this.itemFormGroup.controls['txtFechaEmisionComprobante'].value,
        '/',
        FormatoFecha.DIA_MES_ANIO,
        FormatoFecha.DIA_MES_ANIO,
        '/'
        );
    this.itemAEditar.tipoCambioComprobante = this.itemFormGroup.controls['txtTipoCambioComprobante'].value;
    this.itemAEditar.importeSolesComprobante = this.itemFormGroup.controls['txtImporteSoles'].value;
    this.itemAEditar.tipoPorcentajePercepcion = this.itemFormGroup.controls['cmbPorcentajePercepcion'].value;
    this.itemAEditar.montoPercepcion = this.itemFormGroup.controls['txtMontoPercepcion'].value;
  }

  guardarItem(esEditable: boolean) {
    if (esEditable) {
      this.itemFormGroup.controls['cmbTipoComprobante'].enable(true);
      this.itemFormGroup.controls['txtSerieComprobante'].enable(true);
      this.itemFormGroup.controls['txtCorrelativoComprobante'].enable(true);
      this.itemFormGroup.controls['txtTipoCambioComprobante'].enable(true);
      this.esEditable.next(false);
      if (!this.escogioUnComprobante.value) {
        this.itemFormGroup.controls['cmbMonedaComprobante'].enable(true);
        this.itemFormGroup.controls['txtMontoComprobante'].enable(true);
      }
    } else {
      this.obtenerNuevaDataItem();
      if (this.verificarExistenciaItem()) {
        this.manejoMensajes.mostrarMensajeAdvertencia('itemRegistrado', 'verificarItemRetencionPercepcion');
      } else {
        this._percepcionComunService.itemDetalleEditar.next(this.itemAEditar);
        // this.manejoMensajes.mostrarMensajeAdvertencia('itemRegistrado', 'verificarItemRetencionPercepcion');
        this.manejoMensajes.mostrarMensajeExitoso();
        this.regresar();
      }
    }
  }

  verificarExistenciaItem() {
    for (const detalle of this._percepcionComunService.percepcionAuxiliar.value.detalle) {
      if (
        detalle.tipoComprobante.codigo === this.itemAEditar.tipoComprobante.codigo &&
        detalle.serieComprobante === this.itemAEditar.serieComprobante &&
        detalle.correlativoComprobante === this.itemAEditar.correlativoComprobante
        // && detalle.fechaEmisionComprobante === this.itemAEditar.fechaEmisionComprobante
      ) {
        return true;
      }
      return false;
    }
  }

  cambioMoneda() {
    const moneda: TablaMaestra = this.itemFormGroup.controls['cmbMonedaComprobante'].value;
    if (moneda.iso === this._tiposService.TIPO_MONEDA_PEN_ISO) {
      this.itemFormGroup.controls['txtTipoCambioComprobante'].setValue('1.00');
      this.itemFormGroup.controls['txtTipoCambioComprobante'].disable(true);
    } else {
      this.itemFormGroup.controls['txtTipoCambioComprobante'].setValue('0.00');
      this.itemFormGroup.controls['txtTipoCambioComprobante'].enable(true);
    }
    this.itemFormGroup.controls['txtTipoCambioComprobante'].markAsUntouched();
    this._estilosService.eliminarEstiloInput('txtTipoCambioComprobante', 'is-empty');
    this.calcularImporteEnSoles();
  }

  escucharEventosForm() {
    this.calcularEventoImporteEnSoles();
  }

  calcularEventoImporteEnSoles() {
    this.itemFormGroup.controls['txtTipoCambioComprobante'].valueChanges.subscribe(
      valor => {
        if (Number(valor) === 0) {
          this.itemFormGroup.controls['txtTipoCambioComprobante'].markAsTouched();
        }
        this.calcularImporteEnSoles();
      }
    );
    this.itemFormGroup.controls['txtMontoComprobante'].valueChanges.subscribe(
      valor => {
        if (Number(valor) === 0) {
          this.itemFormGroup.controls['txtMontoComprobante'].markAsTouched();
        }
        this.calcularImporteEnSoles();
      }
    );
  }

  calcularImporteEnSoles() {
    let montoComprobante = this.itemFormGroup.controls['txtMontoComprobante'].value;
    let tasaCambio = this.itemFormGroup.controls['txtTipoCambioComprobante'].value;
    montoComprobante = Number(montoComprobante === '' ? 0 : montoComprobante);
    tasaCambio = Number(tasaCambio === '' ? 0 : tasaCambio);
    const importeSoles = montoComprobante * tasaCambio;
    this.itemFormGroup.controls['txtImporteSoles'].setValue(importeSoles.toFixed(2));

    this.ponerErrorMin('txtMontoComprobante', montoComprobante);
    this.ponerErrorMin('txtTipoCambioComprobante', tasaCambio);
    this.calcularMontoPercepcion();
  }

  ponerErrorMin(nombreControl: string, valorControl: number) {
    if (valorControl === 0) {
      this.itemFormGroup.controls[nombreControl].setErrors({min: true});
    } else {
      this.itemFormGroup.controls[nombreControl].setErrors(null);
    }
  }

  cambioTipoComprobante() {
    this.itemFormGroup.controls['txtSerieComprobante'].reset();
    this.itemFormGroup.controls['txtCorrelativoComprobante'].reset();
    this.cambioComprobante();
    this._estilosService.eliminarEstiloInput('cmbTipoComprobante', 'is-empty');
  }

  cambioComprobante() {
    const fecha = new Date();
    const fecha_actual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.itemFormGroup.controls['txtFechaEmisionComprobante'].reset(fecha_actual);
    this.itemFormGroup.controls['cmbMonedaComprobante'].reset(null);
    this.itemFormGroup.controls['txtMontoComprobante'].reset('0.00');
    this.itemFormGroup.controls['txtMontoComprobante'].markAsUntouched();
    this.itemFormGroup.controls['txtTipoCambioComprobante'].reset('0.00');
    this.itemFormGroup.controls['txtTipoCambioComprobante'].markAsUntouched();
    this.itemFormGroup.controls['txtImporteSoles'].reset('0.00');
    this.itemFormGroup.controls['txtMontoPercepcion'].reset('0.00');
    this._estilosService.eliminarEstiloInput('cmbMonedaComprobante', 'is-empty');

    this.escogioUnComprobante.next(false);
    this.comprobanteReferencia.next(null);
  }

  calcularMontoPercepcion() {
    const importeTotalSoles = Number(this.itemFormGroup.controls['txtImporteSoles'].value);
    const porcentajePercepcion = this._percepcionComunService.percepcionAuxiliar.value.cabecera.porcentajePercepcion;
    const montoPercepcion = importeTotalSoles * porcentajePercepcion / 100;
    this.itemFormGroup.controls['txtMontoPercepcion'].setValue(montoPercepcion.toFixed(2));
  }
}
