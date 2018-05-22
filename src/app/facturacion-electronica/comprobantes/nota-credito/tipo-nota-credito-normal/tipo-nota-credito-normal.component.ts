import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TiposService} from '../../../general/utils/tipos.service';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {ValidadorPersonalizado} from '../../../general/services/utils/validadorPersonalizado';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DetalleNotaCredito} from '../modelos/detalleNotaCredito';
import {NotaCreditoService} from '../servicios/nota-credito.service';
import {Subscription} from 'rxjs/Subscription';
import {LeyendaComprobante} from '../../../general/models/leyendaComprobante';

@Component({
  selector: 'app-tipo-nota-credito-normal',
  templateUrl: './tipo-nota-credito-normal.component.html',
  styleUrls: ['./tipo-nota-credito-normal.component.css']
})
export class TipoNotaCreditoNormalComponent implements OnInit, OnDestroy {
  tipoNotaCredito: string;
  tipoNotaCreditoSubscription: Subscription;

  @Input('padreFormGroup') padreFormGroup: FormGroup;
  @Input('nombreControl') nombreControl: string;

  notaCreditoNormalFormGroup: FormGroup;

  leyendaComprobante: BehaviorSubject<LeyendaComprobante>;

  comprobanteReferenciaSubscription: Subscription;
  comprobanteReferencia: any;

  leyendaCambiada: LeyendaComprobante;
  estaModificandoDetalle: boolean;

  pasoAVistaPreviaSubscription: Subscription;

  nombreDescuento: string;

  constructor(private _tiposService: TiposService,
              private _estilosServices: EstilosServices,
              private _notaCreditoService: NotaCreditoService) {
  }

  verificarNotaCreditoPermitidos(data) {
    const tiposNotasCreditoPermitidos = [
      this._tiposService.TIPO_NOTA_CREDITO_ANULACION_DE_OPERACION,
      this._tiposService.TIPO_NOTA_CREDITO_ANULACION_POR_ERROR_RUC,
      this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_GLOBAL,
      this._tiposService.TIPO_NOTA_CREDITO_BONIFICACION,
      this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_TOTAL
    ];
    return (tiposNotasCreditoPermitidos.findIndex(item => item === data) !== -1);
  }

  ngOnInit() {
    this.leyendaComprobante = new BehaviorSubject(new LeyendaComprobante());
    this.leyendaCambiada = new LeyendaComprobante();
    this.nombreDescuento = 'descuento';
    this.estaModificandoDetalle = false;
    this.iniciarFormGroup();
    this.tipoNotaCreditoSubscription = this._notaCreditoService.tipoNotaCredito.subscribe(
      data => {
        if (this.verificarNotaCreditoPermitidos(data)) {
          this.tipoNotaCredito = data;
          this.notaCreditoNormalFormGroup.reset();
          this._notaCreditoService.detalleModificadoLista.next(this._notaCreditoService.obtenerDetalleOriginal());
          this.comprobanteReferenciaSubscription = this._notaCreditoService.comprobanteReferencia.subscribe(
            dataComprobanteReferencia => {
              this.comprobanteReferencia = dataComprobanteReferencia;
              if (this.comprobanteReferencia !== null) {
                if (this.verificarNotaCreditoPermitidos(this.tipoNotaCredito)) {
                  this.cargarDatosLeyenda(
                    this.comprobanteReferencia.dePagomontopagado,
                    this.comprobanteReferencia.deTotalcomprobantepago,
                    this.comprobanteReferencia.deImportereferencial,
                    this.comprobanteReferencia.deSubtotalcomprobantepago,
                    this.comprobanteReferencia.deDescuento,
                    this.comprobanteReferencia.deImpuesto1,
                    this.comprobanteReferencia.deImpuesto2,
                    this.comprobanteReferencia.deImpuesto3);
                  this.verificarTipoNotaCredito();
                }
              }
            }
          );
          this.reCargarDatos();
        }
      }
    );


    this.pasoAVistaPreviaSubscription = this._notaCreditoService.pasoAVistaPrevia.subscribe(
      data => {
        if (data) {
          this._notaCreditoService.setCabeceraNormal(this.leyendaCambiada);
          this._notaCreditoService.setDetalleNormal(this.obtenerDetalle());
        }
      }
    );
  }

  ngOnDestroy() {
    this.tipoNotaCreditoSubscription.unsubscribe();
    this.comprobanteReferenciaSubscription.unsubscribe();
    this.pasoAVistaPreviaSubscription.unsubscribe();
    this.padreFormGroup.removeControl(this.nombreControl);
  }

  cargarDatosEnForm(total: number, descuentos: number, isc: number, igv: number) {
    const leyenda = new LeyendaComprobante();
    leyenda.total = Number(total).toFixed(2);
    leyenda.descuentos = Number(descuentos).toFixed(2);
    leyenda.isc = Number(isc).toFixed(2);
    leyenda.subTotal = leyenda.descuentos;
    leyenda.importeReferencial = leyenda.subTotal;
    leyenda.igv = Number(igv).toFixed(2);
    this.leyendaCambiada = leyenda;
    this.notaCreditoNormalFormGroup.controls['txtImporteTotal'].setValue(leyenda.total);
    this.notaCreditoNormalFormGroup.controls['txtDescuentos'].setValue(leyenda.descuentos);
    this.notaCreditoNormalFormGroup.controls['txtIsc'].setValue(leyenda.isc);
    this.notaCreditoNormalFormGroup.controls['txtIgv'].setValue(leyenda.igv);
    this._estilosServices.eliminarEstiloInput('txtImporteTotal', 'is-empty');
    this._estilosServices.eliminarEstiloInput('txtDescuentos', 'is-empty');
    this._estilosServices.eliminarEstiloInput('txtIsc', 'is-empty');
    this._estilosServices.eliminarEstiloInput('txtIgv', 'is-empty');
  }

  cargarDatosLeyenda(montoPagado: number, total: number, importeReferencial: number, subTotal: number,
                     descuentos: number, igv: number, isc: number, otroTributos: number) {
    const leyenda = new LeyendaComprobante();
    leyenda.montoPagado = Number(montoPagado).toFixed(2);
    leyenda.total = Number(total).toFixed(2);
    leyenda.importeReferencial = Number(importeReferencial).toFixed(2);
    leyenda.descuentos = Number(descuentos).toFixed(2);
    leyenda.isc = Number(isc).toFixed(2);
    leyenda.igv = Number(igv).toFixed(2);
    leyenda.subTotal = Number(subTotal).toFixed(2);
    leyenda.otrosTributos = Number(otroTributos).toFixed(2);
    this.leyendaComprobante.next(leyenda);
  }

  obtenerDetalle(): DetalleNotaCredito {
    if (this.estaModificandoDetalle) {
      const detalle = new DetalleNotaCredito();
      const comprobanteReferencia = this._notaCreditoService.comprobanteReferencia.value;
      detalle.detalle.idProducto = null;
      let encontroCodigos = false;
      for (const detalleReferencia of comprobanteReferencia.detalle) {
        if (detalleReferencia.inItipoAfectacionigv &&
            detalleReferencia.inItipoCalculoisc &&
            detalleReferencia.inItipoPrecioventa &&
            detalleReferencia.inCodigoAfectacionigv &&
            detalleReferencia.inCodigoCalculoisc &&
            detalleReferencia.inCodigoPrecioventa &&
            detalleReferencia.vcDescAfectacionigv &&
            detalleReferencia.vcDescCalculoisc &&
            detalleReferencia.vcDescPrecioventa
        ) {
          encontroCodigos = true;
          detalle.detalle.idTipoIgv = detalleReferencia.inItipoAfectacionigv;
          detalle.detalle.idTipoIsc = detalleReferencia.inItipoCalculoisc;
          detalle.detalle.idTipoPrecio = detalleReferencia.inItipoPrecioventa;

          detalle.detalle.codigoTipoIgv = detalleReferencia.inCodigoAfectacionigv;
          detalle.detalle.codigoTipoIsc = detalleReferencia.inCodigoCalculoisc;
          detalle.detalle.codigoTipoPrecio = detalleReferencia.inCodigoPrecioventa;

          detalle.detalle.descripcionTipoIgv = detalleReferencia.vcDescAfectacionigv;
          detalle.detalle.descripcionTipoIsc = detalleReferencia.vcDescCalculoisc;
          detalle.detalle.descripcionTipoPrecio = detalleReferencia.vcDescPrecioventa;
          break;
        }
      }
      const detalleReferencia = comprobanteReferencia.detalle[0];
      if (!encontroCodigos) {
        detalle.detalle.idTipoIgv = detalleReferencia.inItipoAfectacionigv;
        detalle.detalle.idTipoIsc = detalleReferencia.inItipoCalculoisc;
        detalle.detalle.idTipoPrecio = detalleReferencia.inItipoPrecioventa;

        detalle.detalle.codigoTipoIgv = detalleReferencia.inCodigoAfectacionigv;
        detalle.detalle.codigoTipoIsc = detalleReferencia.inCodigoCalculoisc;
        detalle.detalle.codigoTipoPrecio = detalleReferencia.inCodigoPrecioventa;

        detalle.detalle.descripcionTipoIgv = detalleReferencia.vcDescAfectacionigv;
        detalle.detalle.descripcionTipoIsc = detalleReferencia.vcDescCalculoisc;
        detalle.detalle.descripcionTipoPrecio = detalleReferencia.vcDescPrecioventa;
      }

      detalle.posicion = '1';
      detalle.detalle.numeroItem = '1';
      detalle.precioUnitario = Number(this.notaCreditoNormalFormGroup.controls['txtDescuentos'].value).toFixed(2);
      detalle.detalle.subtotalVenta = detalle.precioUnitario;
      detalle.detalle.subtotalIsc = Number(this.notaCreditoNormalFormGroup.controls['txtIsc'].value).toFixed(2);
      detalle.detalle.subtotalIgv = Number(this.notaCreditoNormalFormGroup.controls['txtIgv'].value).toFixed(2);
      detalle.montoImpuesto = detalle.detalle.subtotalIgv;
      detalle.precioTotal = Number(this.notaCreditoNormalFormGroup.controls['txtImporteTotal'].value).toFixed(2);
      detalle.detalle.precioUnitarioVenta = detalle.precioTotal;
      detalle.descripcionItem = this._notaCreditoService.notaCredito.value.motivoComprobante;
      return detalle;
    }
    return null;
  }

  reCargarDatos() {
    if (!this.estaModificandoDetalle) {
      this.leyendaComprobante.subscribe(
        leyenda => {
          this.notaCreditoNormalFormGroup.controls['txtDescuentos'].setValue(leyenda.descuentos);
          this.notaCreditoNormalFormGroup.controls['txtImporteTotal'].setValue(leyenda.total);
          this.notaCreditoNormalFormGroup.controls['txtIsc'].setValue(leyenda.isc);
          this.notaCreditoNormalFormGroup.controls['txtIgv'].setValue(leyenda.igv);
          this.leyendaCambiada = leyenda;
        }
      );
    } else {
      if (this._notaCreditoService.estaUsandoPersistencia.value) {
        this.cargarDatosEnForm(
          Number(this._notaCreditoService.notaCredito.value.totalComprobante),
          Number(this._notaCreditoService.notaCredito.value.subtotalComprobante),
          Number(this._notaCreditoService.notaCredito.value.isc),
          Number(this._notaCreditoService.notaCredito.value.igv)
        );
        this._notaCreditoService.estaUsandoPersistencia.next(false);
      } else {
        this.limpiar();
      }
    }
  }

  reCalcularImporteTotal() {
    const descuento = Number(this.notaCreditoNormalFormGroup.controls['txtDescuentos'].value);
    const isc = Number(this.notaCreditoNormalFormGroup.controls['txtIsc'].value);
    let importeTotal = descuento + isc;
    const igv = importeTotal * 0.18;
    this.notaCreditoNormalFormGroup.controls['txtIgv'].setValue(Number(igv).toFixed(2));
    importeTotal += igv;
    this.notaCreditoNormalFormGroup.controls['txtImporteTotal'].setValue(Number(importeTotal).toFixed(2));

    if (this.estaModificandoDetalle) {
      const leyenda = new LeyendaComprobante();
      leyenda.total = this.notaCreditoNormalFormGroup.controls['txtImporteTotal'].value;
      leyenda.isc = this.notaCreditoNormalFormGroup.controls['txtIsc'].value;
      leyenda.igv = this.notaCreditoNormalFormGroup.controls['txtIgv'].value;
      leyenda.montoPagado = leyenda.total;
      leyenda.subTotal = this.notaCreditoNormalFormGroup.controls['txtDescuentos'].value;
      this.leyendaCambiada = leyenda;
    }

  }

  limpiar() {
    this.notaCreditoNormalFormGroup.controls['txtDescuentos'].setValue('0.00');
    this.notaCreditoNormalFormGroup.controls['txtIsc'].setValue('0.00');
    this.notaCreditoNormalFormGroup.controls['txtIgv'].setValue('0.00');
    this.notaCreditoNormalFormGroup.controls['txtImporteTotal'].setValue('0.00');
  }

  habilitarFormsControl(nombresControlHabilitar: string[], nombresControlDeshabilitar: string[]) {
    for (const nombreControlDeshabilitar of nombresControlDeshabilitar) {
      this.notaCreditoNormalFormGroup.controls[nombreControlDeshabilitar].disable();
      $('#' + nombreControlDeshabilitar).parent().children('label').children('span').remove();
    }

    for (const nombreControlHabilitar of nombresControlHabilitar) {
      this.notaCreditoNormalFormGroup.controls[nombreControlHabilitar].enable();
      $('#' + nombreControlHabilitar).parent().children('label').children('span').remove();
      $('#' + nombreControlHabilitar).parent().children('label').append('<span class=\'star\'>*</span>');
    }
  }

  iniciarFormGroup() {
    this.notaCreditoNormalFormGroup = new FormGroup({
      'txtImporteTotal': new FormControl({value: '0.00', disabled: true}, [Validators.required]),
      'txtIsc': new FormControl({value: '0.00', disabled: true}, [Validators.required]),
      'txtIgv': new FormControl({value: '0.00', disabled: true}, [Validators.required]),
      'txtDescuentos': new FormControl({value: '0.00', disabled: true}, [Validators.required]),
    }, Validators.compose([
      ValidadorPersonalizado.formGroupAsyncMenorQue('txtDescuentos', this.leyendaComprobante,
        'subTotal', true, this._notaCreditoService.tipoNotaCredito,
        [this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_GLOBAL, this._tiposService.TIPO_NOTA_CREDITO_BONIFICACION]),
      ValidadorPersonalizado.formGroupAsyncMenorQue('txtIsc', this.leyendaComprobante, 'isc', true, this._notaCreditoService.tipoNotaCredito,
        [this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_GLOBAL, this._tiposService.TIPO_NOTA_CREDITO_BONIFICACION]),
      ValidadorPersonalizado.formGroupAsyncMenorQue('txtImporteTotal', this.leyendaComprobante, 'total')
    ]));
    this.padreFormGroup.addControl(this.nombreControl, this.notaCreditoNormalFormGroup);
  }

  verificarTipoNotaCredito() {
    switch (this.tipoNotaCredito) {
      case (this._tiposService.TIPO_NOTA_CREDITO_ANULACION_DE_OPERACION):
        this.estaModificandoDetalle = false;
        this.nombreDescuento = 'descuento';
        this.habilitarFormsControl(
          [],
          ['txtDescuentos', 'txtImporteTotal', 'txtIsc', 'txtIgv']);
        break;
      case (this._tiposService.TIPO_NOTA_CREDITO_ANULACION_POR_ERROR_RUC):
        this.estaModificandoDetalle = false;
        this.nombreDescuento = 'descuento';
        this.habilitarFormsControl(
          [],
          ['txtDescuentos', 'txtImporteTotal', 'txtIsc', 'txtIgv']);
        break;
      case (this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_GLOBAL):
        this.estaModificandoDetalle = true;
        this.nombreDescuento = 'descuentoGlobal';
        let paraHabilitarDescuentoGlobal = ['txtDescuentos'];
        let paraDeshabilitarDescuentoGlobal = ['txtImporteTotal', 'txtIsc', 'txtIgv'];
        if (Number(this.leyendaComprobante.value.isc) > 0) {
          paraHabilitarDescuentoGlobal = ['txtDescuentos', 'txtIsc'];
          paraDeshabilitarDescuentoGlobal = ['txtImporteTotal', 'txtIgv'];
        }
        this.habilitarFormsControl(
          paraHabilitarDescuentoGlobal,
          paraDeshabilitarDescuentoGlobal);
        break;
      case (this._tiposService.TIPO_NOTA_CREDITO_BONIFICACION):
        this.estaModificandoDetalle = true;
        this.nombreDescuento = 'descuentoGlobal';
        let paraHabilitarBonificacion = ['txtDescuentos'];
        let paraDeshabilitarBonificacion = ['txtImporteTotal', 'txtIsc', 'txtIgv'];
        if (Number(this.leyendaComprobante.value.isc) > 0) {
          paraHabilitarBonificacion = ['txtDescuentos', 'txtIsc'];
          paraDeshabilitarBonificacion = ['txtImporteTotal', 'txtIgv'];
        }
        this.habilitarFormsControl(
          paraHabilitarBonificacion,
          paraDeshabilitarBonificacion);
        break;
      case (this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_TOTAL):
        this.estaModificandoDetalle = false;
        this.nombreDescuento = 'descuento';
        this.habilitarFormsControl(
          [],
          ['txtDescuentos', 'txtImporteTotal', 'txtIsc', 'txtIgv']);
        break;
    }
  }

}
