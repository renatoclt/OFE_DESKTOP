import {Injectable} from '@angular/core';
import {TiposService} from '../../general/utils/tipos.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TABLA_MAESTRA_TIPO_COMPROBANTE, TablaMaestra} from '../../general/models/documento/tablaMaestra';
import {TablaMaestraService} from '../../general/services/documento/tablaMaestra.service';

@Injectable()
export class PadreRetencionPercepcionService {
  private _mostrarCombo: BehaviorSubject<boolean>;
  private _soloCambiarMostrarCombo: boolean;

  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]>;
  private _tiposDeComprobantes: BehaviorSubject<TablaMaestra[]>;
  private _comprobanteSeleccionado: BehaviorSubject<TablaMaestra>;

  get soloCambiarMostrarCombo(): boolean {
    return this._soloCambiarMostrarCombo;
  }

  get comprobanteSeleccionado(): BehaviorSubject<TablaMaestra> {
    return this._comprobanteSeleccionado;
  }

  set comprobanteSeleccionado(value: BehaviorSubject<TablaMaestra>) {
    this._comprobanteSeleccionado = value;
  }

  get tiposDeComprobantes(): BehaviorSubject<TablaMaestra[]> {
    return this._tiposDeComprobantes;
  }

  set tiposDeComprobantes(value: BehaviorSubject<TablaMaestra[]>) {
    this._tiposDeComprobantes = value;
  }

  get mostrarCombo(): BehaviorSubject<boolean> {
    return this._mostrarCombo;
  }

  set mostrarCombo(value: BehaviorSubject<boolean>) {
    this._mostrarCombo = value;
  }

  constructor(private _tiposService: TiposService,
              private _tablaMaestraService: TablaMaestraService) {
    this.inicializarVariables();
    this.cargarTiposComprobantes();
  }

  inicializarVariables() {
    this._mostrarCombo = new BehaviorSubject(true);
    this._comprobanteSeleccionado = new BehaviorSubject(null);
    this._soloCambiarMostrarCombo = false;
  }

  actualizarComprobante(codigo: string, mostrarCombo: boolean = true, soloCambiarMostrarCombo: boolean = true) {
    if (soloCambiarMostrarCombo) {
      this._soloCambiarMostrarCombo = true;
      this.mostrarCombo.next(mostrarCombo);
    } else {
      this._soloCambiarMostrarCombo = false;
      this.buscarPorCodigo(codigo);
      this.mostrarCombo.next(true);
    }
  }

  buscarPorCodigo(codigo: string) {
    this._tablaMaestraService.obtenerPorCodigoDeTablaMaestra(this.todosTiposComprobantes, codigo).subscribe(
      data => {
        if (data) {
          this.comprobanteSeleccionado.next(data);
        }
      }
    );
  }

  cargarTiposComprobantes() {
    this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
    const codigosComprobantes = [
      this._tiposService.TIPO_DOCUMENTO_PERCEPCION,
      this._tiposService.TIPO_DOCUMENTO_RETENCION
    ];
    this._tiposDeComprobantes =
    this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);
    // const percepcion = new TablaMaestra();
    // percepcion.codigo = this._tiposService.TIPO_DOCUMENTO_PERCEPCION;
    // percepcion.organizacion = 0;
    // percepcion.tabla = 10007;
    // percepcion.descripcionCorta = 'Percepcion';
    // percepcion.descripcionLarga = 'Percepcion';
    // percepcion.descripcionLargaIngles = '';
    // percepcion.iso = '';
    // percepcion.habilitado = true;
    // const retencion = new TablaMaestra();
    // retencion.codigo = this._tiposService.TIPO_DOCUMENTO_RETENCION;
    // retencion.organizacion = 0;
    // retencion.tabla = 10007;
    // retencion.descripcionCorta = 'Retencion';
    // retencion.descripcionLarga = 'Retencion';
    // retencion.descripcionLargaIngles = '';
    // retencion.iso = '';
    // retencion.habilitado = true;
    // this.todosTiposComprobantes = new BehaviorSubject([
    //   retencion,
    //   percepcion
    // ]);
    // this._tiposDeComprobantes = new BehaviorSubject([
    //   retencion,
    //   percepcion
    // ]);
    this.buscarPorCodigo(this._tiposService.TIPO_DOCUMENTO_RETENCION);
  }
}
