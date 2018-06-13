import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EstilosServices} from '../../../general/utils/estilos.services';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TiposService} from '../../../general/utils/tipos.service';
import {Subscription} from 'rxjs/Subscription';
import {DetalleNotaDebito} from '../modelos/detalleNotaDebito';
import {NotaDebitoService} from '../servicios/nota-debito-service';

@Component({
  selector: 'app-tipo-nota-debito-editar-item',
  templateUrl: './tipo-nota-debito-editar-item.component.html',
  styleUrls: ['./tipo-nota-debito-editar-item.component.css']
})
export class TipoNotaDebitoEditarItemComponent implements OnInit, OnDestroy {
  tipoNotaDebito: string;
  tipoNotaDebitoSubscription: Subscription;

  editarItemFormGroup: FormGroup;
  detalleEbiz: DetalleNotaDebito;
  detalleEbizSinModificar: DetalleNotaDebito;

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
  detalleLista: DetalleNotaDebito[];

  @Input() idModal: string;
  @ViewChild('modalEditar') modalEditar: ElementRef;

  constructor(private _estilosService: EstilosServices,
              public _tiposService: TiposService,
              private _notaDebitoService: NotaDebitoService) {
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
      'txtValorVenta': new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(this.tamanioTxtValorVenta)])
    });
  }

  ngOnInit() {
    this.iniciarFormGroup();
    this.detalleLista = this._notaDebitoService.obtenerDetalleOriginal();
    this.tipoNotaDebitoSubscription = this._notaDebitoService.tipoNotaDebito.subscribe(
      data => {
        this.tipoNotaDebito = data;
      }
    );
  }

  ngOnDestroy() {
    this.tipoNotaDebitoSubscription.unsubscribe();
  }

  recalcularDetalleEbiz(txtACambiar: string, txtCantidad: string, txtValorUnitario: string, txtIgv: string, txtIsc: string,
                        txtDescuentos: string, txtValorVenta: string) {
    this.editarItemFormGroup.controls[txtACambiar].valueChanges.subscribe(
      data => {
        if (data && this.editarItemFormGroup.valid) {
          const cantidad = Number(this.editarItemFormGroup.controls[txtCantidad].value);
          const valorUnitario = Number(this.editarItemFormGroup.controls[txtValorUnitario].value);
          const isc = Number(this.editarItemFormGroup.controls[txtIsc].value);
          const auxPrecioVenta = cantidad * valorUnitario + isc;
          const igv = auxPrecioVenta * 0.18;
          const descuentos = Number(this.editarItemFormGroup.controls[txtDescuentos].value);
          const valorVenta = auxPrecioVenta + igv - descuentos;
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
    this.detalleEbiz.cantidad = this.editarItemFormGroup.controls['txtCantidad'].value;
    this.detalleEbiz.codigoItem = this.editarItemFormGroup.controls['txtCodigo'].value;
    this.detalleEbiz.descripcionItem = this.editarItemFormGroup.controls['txtDescripcion'].value;
    this.detalleEbiz.detalle.unidadMedida = this.editarItemFormGroup.controls['txtUnidadMedida'].value;
    this.detalleEbiz.precioUnitario = this.editarItemFormGroup.controls['txtValorUnitario'].value;
    this.detalleEbiz.detalle.subtotalIgv = this.editarItemFormGroup.controls['txtIgv'].value;
    this.detalleEbiz.detalle.subtotalIsc = this.editarItemFormGroup.controls['txtIsc'].value;
    this.detalleEbiz.detalle.descuento = this.editarItemFormGroup.controls['txtDescuento'].value;
    this.detalleEbiz.precioTotal = this.editarItemFormGroup.controls['txtValorVenta'].value;
    this.verificarSiCambioItem();
  }

  verificarSiCambioItem() {
    if (
      Number(this.detalleEbiz.precioUnitario) !== Number(this.detalleEbizSinModificar.precioUnitario)
    ) {
      this.detalleEbiz.cambioDetalle = true;
    } else {
      this.detalleEbiz.cambioDetalle = false;
    }
  }

  llenarDatosItem(detalleEbizEntrada: DetalleNotaDebito) {
    this.editarItemFormGroup.reset();
    this.detalleEbiz = detalleEbizEntrada;
    this.detalleEbizSinModificar = this.detalleLista.find(item => item.posicion === this.detalleEbiz.posicion);
    this.verificartipoNotaDebito();
    this.editarItemFormGroup.controls['txtCantidad'].setValue(this.detalleEbiz.cantidad);
    this.editarItemFormGroup.controls['txtCodigo'].setValue(this.detalleEbiz.codigoItem);
    this.editarItemFormGroup.controls['txtDescripcion'].setValue(this.detalleEbiz.descripcionItem);
    this.editarItemFormGroup.controls['txtUnidadMedida'].setValue(this.detalleEbiz.detalle.unidadMedida);
    this.editarItemFormGroup.controls['txtValorUnitario'].setValue(this.detalleEbiz.precioUnitario);
    this.editarItemFormGroup.controls['txtIgv'].setValue(this.detalleEbiz.detalle.subtotalIgv);
    this.editarItemFormGroup.controls['txtIsc'].setValue(this.detalleEbiz.detalle.subtotalIsc);
    this.editarItemFormGroup.controls['txtDescuento'].setValue(this.detalleEbiz.detalle.descuento);
    this.editarItemFormGroup.controls['txtValorVenta'].setValue(this.detalleEbiz.precioTotal);
    this._estilosService.eliminarEstilosTodosTag('is-empty', 'input');
    this._estilosService.eliminarEstilosTodosTag('is-empty', 'textarea');
  }

  verificartipoNotaDebito() {
    switch (this.tipoNotaDebito) {
      case (this._tiposService.TIPO_NOTA_DEBITO_AUMENTO_EN_EL_VALOR):
        this.detalleEbiz.precioUnitario = '0.00';
        this.habilitarFormsControl(
          ['txtValorUnitario'],
          ['txtDescripcion', 'txtDescuento', 'txtCantidad', 'txtValorVenta']);
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
              const valorOriginal = Number(this.detalleEbizSinModificar.precioUnitario);
              if (valor > 0) {
                this.editarItemFormGroup.controls['txtValorUnitario'].setErrors(null);
                this.estaValidadoFormGroup = true;
              } else {
                this.editarItemFormGroup.controls['txtValorUnitario'].setErrors({max: true});
                this.estaValidadoFormGroup = false;
              }
            }
          }
        );
        break;
    }
  }
}
