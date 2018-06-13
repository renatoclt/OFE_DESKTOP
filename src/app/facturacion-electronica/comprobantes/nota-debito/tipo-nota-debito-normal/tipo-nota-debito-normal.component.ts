import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TiposService} from '../../../general/utils/tipos.service';
import {LeyendaComprobante} from '../../../general/models/leyendaComprobante';
import {Subscription} from 'rxjs/Subscription';
import {NotaDebitoService} from '../servicios/nota-debito-service';
import {DetalleNotaDebito} from '../modelos/detalleNotaDebito';

@Component({
  selector: 'app-tipo-nota-debito-normal',
  templateUrl: './tipo-nota-debito-normal.component.html',
  styleUrls: ['./tipo-nota-debito-normal.component.css']
})
export class TipoNotaDebitoNormalComponent implements OnInit, OnDestroy {
  tipoNotaDebito: string;
  tipoNotaDebitoSubscription: Subscription;

  @Input('padreFormGroup') padreFormGroup: FormGroup;
  @Input('nombreControl') nombreControl: string;

  notaDebitoNormalFormGroup: FormGroup;
  pasoAVistaPreviaSubscription: Subscription;

  constructor(private _tiposService: TiposService,
              private _estilosServices: EstilosServices,
              private _notaDebitoService: NotaDebitoService) {
  }

  ngOnInit() {
    this.iniciarFormGroup();
    this.tipoNotaDebitoSubscription = this._notaDebitoService.tipoNotaDebito.subscribe(
      data => {
        this.tipoNotaDebito = data;
        this._notaDebitoService.detalleModificadoLista.next(this._notaDebitoService.obtenerDetalleOriginal());
        this.cargarDatosEnForm();
      }
    );

    this.pasoAVistaPreviaSubscription = this._notaDebitoService.pasoAVistaPrevia.subscribe(
      data => {
        if (data) {
          this._notaDebitoService.setCabeceraNormal(this.obtenerLeyenda());
          this._notaDebitoService.setDetalleNormal(this.obtenerDetalle());
        }
      }
    );
  }

  ngOnDestroy() {
    this.tipoNotaDebitoSubscription.unsubscribe();
    this.pasoAVistaPreviaSubscription.unsubscribe();
    this.padreFormGroup.removeControl(this.nombreControl);
  }

  cargarDatosEnForm() {
    if (this._notaDebitoService.estaUsandoPersistencia.value) {
      this.notaDebitoNormalFormGroup.controls['txtMontoInteresPorMora']
        .setValue(this._notaDebitoService.notaDebito.value.totalComprobante);
      this._estilosServices.eliminarEstiloInput('txtMontoInteresPorMora', 'is-empty');
      this._notaDebitoService.estaUsandoPersistencia.next(false);
    } else {
      this.limpiar();
    }
  }

  obtenerLeyenda() {
    const leyenda = new LeyendaComprobante();
    const valorMonto = Number(this.notaDebitoNormalFormGroup.controls['txtMontoInteresPorMora'].value).toFixed(2);
    leyenda.total = valorMonto;
    leyenda.subTotal = valorMonto;
    leyenda.montoPagado = valorMonto;
    leyenda.importeReferencial = valorMonto;
    return leyenda;
  }

  obtenerDetalle(): DetalleNotaDebito {
    const detalle = new DetalleNotaDebito();
    const valorMonto = Number(this.notaDebitoNormalFormGroup.controls['txtMontoInteresPorMora'].value).toFixed(2);
    const comprobanteReferencia = this._notaDebitoService.comprobanteReferencia.value;
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
    detalle.cantidad = '0.00';
    detalle.precioUnitario = valorMonto;
    detalle.detalle.subtotalVenta = detalle.precioUnitario;
    detalle.precioTotal = valorMonto;
    detalle.detalle.precioUnitarioVenta = detalle.precioTotal;
    detalle.descripcionItem = this._notaDebitoService.notaDebito.value.motivoComprobante;
    return detalle;
  }

  limpiar() {
    this.notaDebitoNormalFormGroup.controls['txtMontoInteresPorMora'].setValue('0.00');
  }

  iniciarFormGroup() {
    this.notaDebitoNormalFormGroup = new FormGroup({
      'txtMontoInteresPorMora': new FormControl({value: '0.00', disabled: false},
        [Validators.required, Validators.min(0.01)])
    });
    this.padreFormGroup.addControl(this.nombreControl, this.notaDebitoNormalFormGroup);
  }

}
