import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DetalleNotaCredito} from '../modelos/detalleNotaCredito';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {TiposService} from '../../../general/utils/tipos.service';
import {NotaCreditoService} from '../servicios/nota-credito.service';
import {Subscription} from 'rxjs/Subscription';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-tipo-nota-credito-editar-item',
  templateUrl: './tipo-nota-credito-editar-item.component.html',
  styleUrls: ['./tipo-nota-credito-editar-item.component.css']
})
export class TipoNotaCreditoEditarItemComponent implements OnInit, OnDestroy {
  tipoNotaCredito: string;
  tipoNotaCreditoSubscription: Subscription;

  editarItemFormGroup: FormGroup;
  detalleEbiz: DetalleNotaCredito;
  detalleEbizSinModificar: DetalleNotaCredito;

  tamanioTxtCantidad: number;
  tamanioTxtCodigo: number;
  tamanioTxtDescripcion: number;
  tamanioTxtUnidadMedida: number;
  tamanioTxtValorUnitario: number;
  tamanioTxtIgv: number;
  tamanioTxtIsc: number;
  tamanioTxtDescuento: number;
  tamanioTxtValorVenta: number;

  estaValidadoFormGroup: boolean;
  detalleLista: DetalleNotaCredito[];

  descuentoLimite: string;

  @Input() idModal: string;
  @ViewChild('modalEditar') modalEditar: ElementRef;

  constructor(private _estilosService: EstilosServices,
              public _tiposService: TiposService,
              private _notaCreditoService: NotaCreditoService,
              private _translateService: TranslateService) {
    this.iniciarTamanios();
  }

  iniciarTamanios() {
    this.tamanioTxtCantidad = 16;
    this.tamanioTxtCodigo = 30;
    this.tamanioTxtDescripcion = 250;
    this.tamanioTxtUnidadMedida = 3;
    this.tamanioTxtValorUnitario = 15;
    this.tamanioTxtIgv = 15;
    this.tamanioTxtIsc = 15;
    this.tamanioTxtDescuento = 15;
    this.tamanioTxtValorVenta = 15;
    this.estaValidadoFormGroup = false;
  }

  iniciarFormGroup() {
    this.editarItemFormGroup = new FormGroup({
      'txtCantidad': new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(this.tamanioTxtCantidad)]),
      'txtCodigo': new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(this.tamanioTxtCodigo)]),
      'txtDescripcion':
        new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(this.tamanioTxtDescripcion)]),
      'txtUnidadMedida':
        new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(this.tamanioTxtUnidadMedida)]),
      'txtValorUnitario':
        new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(this.tamanioTxtValorUnitario)]),
      'txtIgv': new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(this.tamanioTxtIgv)]),
      'txtIsc': new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(this.tamanioTxtIsc)]),
      'txtDescuento': new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(this.tamanioTxtDescuento)]),
      'txtDescuentoNotaCredito': new FormControl({value: '0.00', disabled: true}, [Validators.required, Validators.maxLength(this.tamanioTxtDescuento)]),
      'txtValorVenta': new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(this.tamanioTxtValorVenta)])
    });
  }

  ngOnInit() {
    this.iniciarFormGroup();
    this.detalleLista = this._notaCreditoService.obtenerDetalleOriginal();

    this.tipoNotaCreditoSubscription = this._notaCreditoService.tipoNotaCredito.subscribe(
      data => {
          this.tipoNotaCredito = data;
      }
    );
  }

  ngOnDestroy() {
    this.tipoNotaCreditoSubscription.unsubscribe();
  }

  recalcularDetalleEbiz(txtACambiar: string, txtCantidad: string, txtValorUnitario: string,
                        txtIgv: string, txtIsc: string, txtDescuentos: string, txtValorVenta: string,
                        esDescuentoPorItem: boolean = false) {
    this.editarItemFormGroup.controls[txtACambiar].valueChanges.subscribe(
      data => {
        if (data && this.editarItemFormGroup.valid) {
          const cantidad = Number(this.editarItemFormGroup.controls[txtCantidad].value);
          const valorUnitario = Number(this.editarItemFormGroup.controls[txtValorUnitario].value);
          let isc = Number(this.editarItemFormGroup.controls[txtIsc].value);
          if (this.tipoNotaCredito === this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_POR_ITEM) {
            isc = (Number(this.detalleEbizSinModificar.detalle.subtotalIsc) / Number(this.detalleEbizSinModificar.cantidad)) * Number(cantidad);
            this.editarItemFormGroup.controls[txtIsc].setValue(isc.toFixed(2));
          }
          const auxPrecioVenta = cantidad * valorUnitario + isc;
          let igv = auxPrecioVenta * 0.18;
          const descuentos = Number(this.editarItemFormGroup.controls[txtDescuentos].value);
          let valorVenta = auxPrecioVenta + igv - descuentos;
          if (esDescuentoPorItem) {
            igv = descuentos * 0.18;
            valorVenta = descuentos + igv;
          }
          this.editarItemFormGroup.controls[txtIgv].setValue(Number(igv).toFixed(2));
          this.editarItemFormGroup.controls[txtValorVenta].setValue(Number(valorVenta).toFixed(2));
        }
      }
    );
  }

  abrirModal() {
    $('#' + this.idModal).modal('show');
  }

  habilitarFormsControl(nombresControlHabilitar: string[], nombresControlDeshabilitar: string[]) {
    for (const nombreControlDeshabilitar of nombresControlDeshabilitar) {
      this.editarItemFormGroup.controls[nombreControlDeshabilitar].disable();
      $('#' + nombreControlDeshabilitar).parent().children('label').children('span').remove();
    }

    for (const nombreControlHabilitar of nombresControlHabilitar) {
      this.editarItemFormGroup.controls[nombreControlHabilitar].enable();
      $('#' + nombreControlHabilitar).parent().children('label').children('span').remove();
      $('#' + nombreControlHabilitar).parent().children('label').append('<span class=\'star\'>*</span>');
    }
  }

  guardarItem() {
    if (this.tipoNotaCredito === this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_POR_ITEM) {
      this.detalleEbiz.cantidad = '1.00';
      this.detalleEbiz.codigoItem = this.editarItemFormGroup.controls['txtCodigo'].value;
      this.detalleEbiz.detalle.unidadMedida = this.editarItemFormGroup.controls['txtUnidadMedida'].value;
      this.detalleEbiz.precioUnitario = this.editarItemFormGroup.controls['txtDescuentoNotaCredito'].value;
      this.detalleEbiz.detalle.subtotalIgv = this.editarItemFormGroup.controls['txtIgv'].value;
      this.detalleEbiz.detalle.subtotalIsc = '0.00';
      this.detalleEbiz.detalle.descuento = this.editarItemFormGroup.controls['txtDescuentoNotaCredito'].value;
      this.detalleEbiz.precioTotal = this.editarItemFormGroup.controls['txtValorVenta'].value;
    } else {
      this.detalleEbiz.cantidad = this.editarItemFormGroup.controls['txtCantidad'].value;
      this.detalleEbiz.codigoItem = this.editarItemFormGroup.controls['txtCodigo'].value;
      this.detalleEbiz.descripcionItem = this.editarItemFormGroup.controls['txtDescripcion'].value;
      this.detalleEbiz.detalle.unidadMedida = this.editarItemFormGroup.controls['txtUnidadMedida'].value;
      this.detalleEbiz.precioUnitario = this.editarItemFormGroup.controls['txtValorUnitario'].value;
      this.detalleEbiz.detalle.subtotalIgv = this.editarItemFormGroup.controls['txtIgv'].value;
      this.detalleEbiz.detalle.subtotalIsc = this.editarItemFormGroup.controls['txtIsc'].value;
      this.detalleEbiz.detalle.descuento = this.editarItemFormGroup.controls['txtDescuento'].value;
      this.detalleEbiz.precioTotal = this.editarItemFormGroup.controls['txtValorVenta'].value;
    }
    this.verificarSiCambioItem();
  }

  verificarSiCambioItem() {
    if (Number(this.detalleEbiz.cantidad) <= Number(this.detalleEbizSinModificar.cantidad) ||
        Number(this.detalleEbiz.precioUnitario) !== Number(this.detalleEbizSinModificar.precioUnitario) ||
        this.detalleEbiz.descripcionItem.localeCompare(this.detalleEbizSinModificar.descripcionItem ) !== 0 ||
        Number(this.detalleEbiz.detalle.descuento) !== Number(this.detalleEbizSinModificar.detalle.descuento)
    ) {
      this.detalleEbiz.cambioDetalle = true;
    } else {
      this.detalleEbiz.cambioDetalle = false;
    }
  }

  llenarDatosItem(detalleEbizEntrada: DetalleNotaCredito) {
    this.editarItemFormGroup.reset();
    this.detalleEbiz = detalleEbizEntrada;
    this.detalleEbizSinModificar = this.detalleLista.find(item => item.posicion === this.detalleEbiz.posicion);
    this.descuentoLimite = Number(
      Number(this.detalleEbizSinModificar.cantidad) * Number(this.detalleEbizSinModificar.precioUnitario)).toFixed(2);
    this.verificarTipoNotaCredito();
    this.editarItemFormGroup.controls['txtCantidad'].setValue(this.detalleEbiz.cantidad);
    this.editarItemFormGroup.controls['txtCodigo'].setValue(this.detalleEbiz.codigoItem);
    this.editarItemFormGroup.controls['txtDescripcion'].setValue(this.detalleEbiz.descripcionItem);
    this.editarItemFormGroup.controls['txtUnidadMedida'].setValue(this.detalleEbiz.detalle.unidadMedida);
    this.editarItemFormGroup.controls['txtValorUnitario'].setValue(this.detalleEbiz.precioUnitario);
    this.editarItemFormGroup.controls['txtIgv'].setValue(this.detalleEbiz.detalle.subtotalIgv);
    this.editarItemFormGroup.controls['txtIsc'].setValue(this.detalleEbiz.detalle.subtotalIsc);
    this.editarItemFormGroup.controls['txtDescuento'].setValue(this.detalleEbiz.detalle.descuentoOriginal);
    this.editarItemFormGroup.controls['txtDescuentoNotaCredito'].setValue(this.detalleEbiz.detalle.descuento);
    this.editarItemFormGroup.controls['txtValorVenta'].setValue(this.detalleEbiz.precioTotal);
    this._estilosService.eliminarEstilosTodosTag('is-empty', 'input');
    this._estilosService.eliminarEstilosTodosTag('is-empty', 'textarea');
  }

  verificarTipoNotaCredito() {
    switch (this.tipoNotaCredito) {
      case (this._tiposService.TIPO_NOTA_CREDITO_CORRECCION_DE_LA_DESCRIPCION):
        this.habilitarFormsControl(
          ['txtDescripcion'],
          ['txtCantidad', 'txtDescuento', 'txtDescuentoNotaCredito', 'txtValorUnitario', 'txtValorVenta']);
        this.editarItemFormGroup.controls['txtDescripcion'].valueChanges.subscribe(
          data => {
            if (data) {
              if (this.detalleEbizSinModificar.descripcionItem.localeCompare(
                this.editarItemFormGroup.controls['txtDescripcion'].value) !== 0) {
                this.estaValidadoFormGroup = true;
              } else {
                this.editarItemFormGroup.controls['txtDescripcion'].setErrors({debeSerDiferenteDe: true});
                this.estaValidadoFormGroup = false;
              }
            }
          }
        );
        break;
      case (this._tiposService.TIPO_NOTA_CREDITO_DEVOLUCION_POR_ITEM):
        this.habilitarFormsControl(
          ['txtCantidad'],
          ['txtDescripcion', 'txtDescuento', 'txtDescuentoNotaCredito', 'txtValorUnitario', 'txtValorVenta']);
        this.recalcularDetalleEbiz(
          'txtCantidad',
          'txtCantidad',
          'txtValorUnitario',
          'txtIgv',
          'txtIsc',
          'txtDescuento',
          'txtValorVenta');
        this.editarItemFormGroup.controls['txtCantidad'].valueChanges.subscribe(
          data => {
            if (data) {
              const valor = Number(this.editarItemFormGroup.controls['txtCantidad'].value);
              if (valor <= 0) {
                this.editarItemFormGroup.controls['txtCantidad'].setErrors({min: true});
                this.estaValidadoFormGroup = false;
              } else {
                if (valor > Number(this.detalleEbizSinModificar.cantidad)) {
                  this.editarItemFormGroup.controls['txtCantidad'].setErrors({max: true});
                  this.estaValidadoFormGroup = false;
                } else {
                  this.editarItemFormGroup.controls['txtCantidad'].setErrors(null);
                  this.estaValidadoFormGroup = true;
                }
              }
            }
          }
        );

        break;
      case (this._tiposService.TIPO_NOTA_CREDITO_DESCUENTO_POR_ITEM):
        this.detalleEbiz.detalle.descuento = '0.00';
        this.habilitarFormsControl(
          ['txtDescuentoNotaCredito'],
          ['txtDescripcion', 'txtCantidad', 'txtDescuento', 'txtValorUnitario', 'txtValorVenta']);
        this.recalcularDetalleEbiz(
          'txtDescuentoNotaCredito',
          'txtCantidad',
          'txtValorUnitario',
          'txtIgv',
          'txtIsc',
          'txtDescuentoNotaCredito',
          'txtValorVenta',
          true);
        this.editarItemFormGroup.controls['txtValorVenta'].valueChanges.subscribe(
          data => {
            if (data) {
              const valor = Number(this.editarItemFormGroup.controls['txtValorVenta'].value);
              if (valor <= 0) {
                this.editarItemFormGroup.controls['txtValorVenta'].setErrors({min: true});
                this.estaValidadoFormGroup = false;
              } else {
                if (valor >= Number(this.detalleEbizSinModificar.precioTotal)) {
                  this.editarItemFormGroup.controls['txtValorVenta'].setErrors({max: true});
                  this.estaValidadoFormGroup = false;
                } else {
                  this.editarItemFormGroup.controls['txtValorVenta'].setErrors(null);
                  this.estaValidadoFormGroup = true;
                }
              }
            }
          }
        );

        this.editarItemFormGroup.controls['txtDescuentoNotaCredito'].valueChanges.subscribe(
          data => {
            if (data) {
              const valor = Number(this.editarItemFormGroup.controls['txtDescuentoNotaCredito'].value);
              const valorValorUnitario = Number(this.detalleEbizSinModificar.precioUnitario) * Number(this.detalleEbiz.cantidad);
              if (valor <= 0) {
                this.editarItemFormGroup.controls['txtDescuentoNotaCredito'].setErrors({min: true});
                this.estaValidadoFormGroup = false;
              } else {
                if (valor >= valorValorUnitario) {
                  this.editarItemFormGroup.controls['txtDescuentoNotaCredito'].setErrors({max: true});
                  this.estaValidadoFormGroup = false;
                } else {
                  this.editarItemFormGroup.controls['txtDescuentoNotaCredito'].setErrors(null);
                  this.estaValidadoFormGroup = true;
                }
              }
            }
          }
        );
        break;
      case (this._tiposService.TIPO_NOTA_CREDITO_BONIFICACION):
        this.habilitarFormsControl(
          ['txtCantidad', 'txtValorUnitario'],
          ['txtDescripcion', 'txtDescuento', 'txtDescuentoNotaCredito', 'txtValorVenta']);
        this.recalcularDetalleEbiz(
          'txtCantidad',
          'txtCantidad',
          'txtValorUnitario',
          'txtIgv',
          'txtIsc',
          'txtDescuento',
          'txtValorVenta');
        this.recalcularDetalleEbiz(
          'txtValorUnitario',
          'txtCantidad',
          'txtValorUnitario',
          'txtIgv',
          'txtIsc',
          'txtDescuento',
          'txtValorVenta');
        break;
      case (this._tiposService.TIPO_NOTA_CREDITO_DISMINUCION_EN_EL_VALOR):
        this.habilitarFormsControl(
          ['txtValorUnitario'],
          ['txtDescripcion', 'txtDescuento', 'txtDescuentoNotaCredito', 'txtCantidad', 'txtValorVenta']);
        this.recalcularDetalleEbiz(
          'txtValorUnitario',
          'txtCantidad',
          'txtValorUnitario',
          'txtIgv',
          'txtIsc',
          'txtDescuento',
          'txtValorVenta');
        this.editarItemFormGroup.controls['txtValorUnitario'].valueChanges.subscribe(
          data => {
            if (data) {
              const valor = Number(this.editarItemFormGroup.controls['txtValorUnitario'].value);
              if (valor <= 0) {
                this.editarItemFormGroup.controls['txtValorUnitario'].setErrors({min: true});
                this.estaValidadoFormGroup = false;
              } else {
                if (valor >= Number(this.detalleEbizSinModificar.precioUnitario)) {
                  this.editarItemFormGroup.controls['txtValorUnitario'].setErrors({max: true});
                  this.estaValidadoFormGroup = false;
                } else {
                  this.editarItemFormGroup.controls['txtValorUnitario'].setErrors(null);
                  this.estaValidadoFormGroup = true;
                }
              }
            }
          }
        );
        break;
    }
  }
}
