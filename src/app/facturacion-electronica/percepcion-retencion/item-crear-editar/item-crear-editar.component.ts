import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Series} from '../models/series';
import {Retencionebiz} from '../models/retencionebiz';
import {PersistenciaServiceRetencion} from '../services/persistencia.service';
import { TiposService } from '../../general/utils/tipos.service';
import { Moneda } from '../../comprobantes/models/moneda';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TablaMaestraService} from '../../general/services/documento/tablaMaestra.service';
import {TABLA_MAESTRA_MONEDAS, TABLA_MAESTRA_TIPO_COMPROBANTE, TablaMaestra} from '../../general/models/documento/tablaMaestra';
import {Validadortabla} from '../services/validadortabla';
import {ValidadorPersonalizado} from '../../general/services/utils/validadorPersonalizado';
import {RefreshService} from '../../general/services/refresh.service';
import {PadreRetencionPercepcionService} from '../services/padre-retencion-percepcion.service';
import {ManejoMensajes} from '../../general/utils/manejo-mensajes';
declare var swal: any;

@Component({
  selector: 'app-item-crear-editar',
  templateUrl: './item-crear-editar.component.html',
  styleUrls: ['./item-crear-editar.css']
})
export class ItemCrearEditarComponent implements OnInit {
  public titulo: string;
  public editable: boolean;
  public editableaceptar: boolean;
  public tipoaccion: number;
  public itemFormGroup: FormGroup;
  public validarporcentajes: boolean;
  public serie: Series[];
  public retencionEbiz: Retencionebiz;
  public retencionEbizedit: Retencionebiz;
  public monedas: Moneda[] = [];
  public mesnorm: string;
  public tipoAccion: number;
  public tipoDocumento: string;
  public idPosicion: number;
  public editablelimpiar = true;
  public dianorm: string;
  public fechaedicion = true;
  public flagedit = '';
  public tiposComprobantes: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  public todosTiposMonedas: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
  private todosTiposComprobantes: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);


  constructor(private route: ActivatedRoute, private router: Router,
              private persistenciaService: PersistenciaServiceRetencion,
              private _tipos: TiposService,
              private manejoMensajes: ManejoMensajes,
              private _tablaMaestraService: TablaMaestraService,
              private Refresh: RefreshService,
              private _padreRetencionPerpcionService: PadreRetencionPercepcionService) {
                this._padreRetencionPerpcionService.actualizarComprobante(this.route.snapshot.data['codigo'],
                  this.route.snapshot.data['mostrarCombo'], true);
                this.cargarServiciosArranque();
                this.retencionEbiz = new Retencionebiz();
                this.flagedit = 'FLAG EDIT';
                this.mesnorm = '';
                this.dianorm = '';
              }

  public deshabilitar() {
    this.itemFormGroup.disable();
    $('#datefechaemision').prop('disabled', true);
    this.fechaedicion = false;
  }

  private cargarServiciosArranque() {
    this.todosTiposComprobantes = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_TIPO_COMPROBANTE);
    this.todosTiposMonedas = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_MONEDAS);
  }

  private setTipoComprobante() {
    let codigosComprobantes: string[] = [];
        codigosComprobantes = [
          this._tipos.TIPO_DOCUMENTO_FACTURA,
          this._tipos.TIPO_DOCUMENTO_NOTA_CREDITO,
          this._tipos.TIPO_DOCUMENTO_NOTA_DEBITO
        ];
    this.tiposComprobantes = this._tablaMaestraService.obtenerPorCodigosDeTablaMaestra(this.todosTiposComprobantes, codigosComprobantes);
  }

  public setTipoItem() {
    switch ( this.tipoaccion ) {
      case 1:
        this.editable = false;
        this.editableaceptar = true;
        this.editablelimpiar = false;
        break;
      case 2:
        this.editable = false;
        this.editableaceptar = false;
        this.cargarProductoEditar();
        break;
    }
  }

  validarporcentaje(): boolean {
    const sd = this.itemFormGroup.valid;
      if ( (this.itemFormGroup.controls['txtretencionxciento'].value.length <= 0) && (sd == true)) {
        this.validarporcentajes = false;
      } else {
        this.validarporcentajes = true;
      }
    return this.validarporcentajes;
  }

  private obtenerParametros() {
    this.tipoAccion = this.route.snapshot.data['tipoAccion'];
    this.tipoDocumento = this.route.snapshot.data['tipoDocumento'];
    const sub = this.route
      .params
      .subscribe(params => {
        this.idPosicion = +params['id'] ;
      });
    this.setTipoItem();
  }

  ngOnInit() {
    this.obtenerParametros();
    this.initForm();
    this.titulo = this.route.snapshot.data['titulo'];
    this.tipoaccion = this.route.snapshot.data['tipoaccion'];
    this.setTipoItem();
    this.itemFormGroup.controls['txtTipoCambio'].disable();
  }

  public seleccionarMoneda() {
    let codigoMoneda: string;
    codigoMoneda = this.itemFormGroup.controls['cmbMoneda'].value;
    switch ( codigoMoneda ) {
      case this._tipos.TIPO_MONEDA_SOL:
        this.itemFormGroup.controls['txtTipoCambio'].disable();
        this.itemFormGroup.controls['txtImporteSoles'].disable();
        this.itemFormGroup.controls['txtTipoCambio'].setValue((1).toFixed(2));
        this.tipoCambio();
        this.calcular_porcentaje_retencion();
        this.ready();
        this.eliminarEstiloInputNormal('txtTipoCambio', 'is-empty');
        break;
      default:
        this.itemFormGroup.controls['txtTipoCambio'].enable();
        this.itemFormGroup.controls['txtImporteSoles'].disable();
        if ( this.flagedit != 'EDICION') {
          this.itemFormGroup.get('txtTipoCambio').reset();
        }
        this.flagedit = 'FLAG EDITADO';
        this.tipoCambio();
        this.calcular_porcentaje_retencion();
        this.ready();
        break;
    }
  }

  tipoCambio() {
    const importeTotal = this.itemFormGroup.get('txtmonto').value;
    const tipoCambio = this.itemFormGroup.get('txtTipoCambio').value;
    this.calcular_porcentaje_retencion();
    if ((Number(importeTotal) > 0) && (Number(tipoCambio) > 0)) {
      const importeTot = this.itemFormGroup.get('txtmonto').value;
      const tipoCam = this.itemFormGroup.get('txtTipoCambio').value;
      const totalSoles = Number(importeTot * tipoCam).toFixed(2);
      this.itemFormGroup.controls['txtImporteSoles'].setValue(totalSoles);
      setTimeout(function () {
        $('input').each(function () {
          $(this.parentElement).removeClass('is-empty');
        });
      }, 200);
    } else {
      this.itemFormGroup.controls['txtImporteSoles'].setValue('');
    }
  }

  public eliminarEstiloInputNormal(idHtml: string, estilo: string) {
    setTimeout(function () {
      $('#' + idHtml).parent().removeClass(estilo);
    }, 200);
  }

  editaritem() {
    this.Refresh.CargarPersistencia = true;
    console.log('this.Refresh.CargarPersistencia - EDITAR ');
    console.log(this.Refresh.CargarPersistencia);
      if (this.validarMontoMinimoRetencion() || this.validarMontoMinimoRetencionsoles()) {
        this.editaritemproducto();
        swal({
          type: 'success',
          title: 'Acción Exitosa',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'CONTINUAR',
        });
        this.router.navigateByUrl('percepcion-retencion/retencion/crear/individual');
      } else {
        swal({
          title: 'Alerta',
          html:
            '<div class="text-center">  El Importe Total debe ser mayor a 700.00 Soles.</div>',
          type: 'warning',
          confirmButtonText: 'CONTINUAR',
          confirmButtonClass: 'btn btn-warning',
        });
      }
  }

  editaritemproducto() {
    this.fillProducto();
    this.persistenciaService.editarProducto(this.retencionEbiz, this.idPosicion );
  }

  agregaritem() {
    if ( this.validarMontoMinimoRetencion() || this.validarMontoMinimoRetencionsoles() ) {
      swal({
        type: 'success',
        title: 'Acción Exitosa',
        buttonsStyling: false,
        confirmButtonText: 'CONTINUAR',
        confirmButtonClass: 'btn btn-success'
      });
      this.grabar();
    } else {
      swal({
          title: 'Alerta',
          html:
            '<div class="text-center"> El Importe Total debe ser mayor a 700.00 Soles.</div>',
          type: 'warning',
          confirmButtonText: 'CONTINUAR',
          confirmButtonClass: 'btn btn-warning',
        });
    }
  }

  public validarMontoMinimoRetencion(): boolean {
    if ( Number(this.itemFormGroup.controls['txtmonto'].value) > 700.00 ) {
      return true;
    }
    return false;
  }

  public validarMontoMinimoRetencionsoles(): boolean {
    if ( Number(this.itemFormGroup.controls['txtImporteSoles'].value) > 700.00 ) {
      return true;
    }
    return false;
  }

  public ready () {
    this.tipoCambio();
    this.calcular_porcentaje_retencion();
    this.calcular_porcentaje_retencion();
  }

  public calcular_porcentaje_retencion () {
    const importeTotal = this.itemFormGroup.get('txtImporteSoles').value;
    const montoRetenido = this.itemFormGroup.get('txtretencion').value;
    if ((Number(montoRetenido) <= Number(importeTotal)) && (Number(importeTotal) > 0) && (Number(montoRetenido) > 0)) {
      if ((importeTotal != '') && (montoRetenido != '')) {
        const importeTot = this.itemFormGroup.get('txtImporteSoles').value;
        const montoReten = this.itemFormGroup.get('txtretencion').value;
        const totalporcentaje = montoReten / importeTot;
        const porcentaje = (totalporcentaje * 100).toFixed(2);
        this.itemFormGroup.controls['txtretencionxciento'].setValue(porcentaje);
        setTimeout(function () {
          $('input').each(function () {
            $(this.parentElement).removeClass('is-empty');
          });
        }, 200);
      }
    } else {
      this.itemFormGroup.controls['txtretencionxciento'].setValue('');
    }
  }

  cancelaritem() {
    this.Refresh.CargarPersistencia = true;
    console.log('this.Refresh.CargarPersistencia - EDITAR ');
    console.log(this.Refresh.CargarPersistencia);
    this.router.navigateByUrl('percepcion-retencion/retencion/crear/individual');
  }

  private initForm() {
    const fecha = new Date();
    const fecha_actual = fecha.getDate().toString() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear().toString();
    this.itemFormGroup = new FormGroup({
      'cmbtipodocrp': new FormControl('' , [Validators.required]),
      'txtserie': new FormControl('', [
        Validators.required,
        Validators.pattern('[A-Z0-9]{4}'),
        Validators.minLength(4),
        Validators.maxLength(4)
      ]),
      'txtcorrelativo': new FormControl('', [
        Validators.required
      ]),
      'txtmonto': new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]+[.][0-9]{2}'),
        Validators.minLength(4),
        Validators.maxLength(15),
        Validadortabla.HayValoresenlaTabla()
      ]),
      'txtretencion': new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]+[.][0-9]{2}'),
        Validators.minLength(4),
        Validators.maxLength(15),
        Validadortabla.HayValoresenlaTabla()
      ]),
      'txtretencionxciento':  new FormControl({value: '', disabled: true}, [
        Validators.required,
        Validators.pattern('[0-9]+[.][0-9]{2}'),
        Validators.minLength(4),
        Validators.maxLength(15),
        Validadortabla.HayValoresenlaTabla()
      ]),
      'datefechaemision': new FormControl(fecha_actual, [Validators.required, ValidadorPersonalizado.fechaDeberiaSerMenorAHoy('errorFecha')]),
      'cmbMoneda': new FormControl('', [Validators.required]),
      'txtTipoCambio': new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]+[.][0-9]{2}'),
        Validators.minLength(4),
        Validators.maxLength(15),
        Validadortabla.HayValoresenlaTabla()
      ]),
      'txtImporteSoles': new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]+[.][0-9]{2}'),
        Validators.minLength(4),
        Validators.maxLength(15),
        Validadortabla.HayValoresenlaTabla()
      ])
    });
    this.setTipoComprobante();
  }

  public cargarProductoEditar() {
    this.retencionEbizedit = this.persistenciaService.getItemProducto( this.idPosicion );
    if (this.retencionEbizedit != null) {
      this.itemFormGroup.controls['cmbtipodocrp'].setValue( this.retencionEbizedit.tipoDocumentoDestino );
      this.itemFormGroup.controls['txtserie'].setValue( this.retencionEbizedit.serieDocumentoDestino   );
      this.itemFormGroup.controls['txtcorrelativo'].setValue( this.retencionEbizedit.correlativoDocumentoDestino );
      this.itemFormGroup.controls['txtmonto'].setValue( this.retencionEbizedit.totalImporteDestino );
      this.itemFormGroup.controls['txtretencion'].setValue( this.retencionEbizedit.totalImporteAuxiliarDestino);
      this.itemFormGroup.controls['txtretencionxciento'].setValue( this.retencionEbizedit.totalPorcentajeAuxiliarDestino );
      const fechaEdicion = this.retencionEbizedit.fechaEmisionDestino.split('-');
      const anio = fechaEdicion[0];
      const mes = fechaEdicion[1];
      const dia = fechaEdicion[2];
      const fechalocalstorage = mes + '/' + dia + '/' + anio;
      const fechaFormat = new Date(fechalocalstorage);
      const anioFormat = fechaFormat.getFullYear().toString();
      const mesFormat = (fechaFormat.getMonth() + 1).toString();
      const diaFormat = fechaFormat.getDate().toString();
      const fechadefinitiva = diaFormat + '/' +  mesFormat + '/' + anioFormat;
      this.itemFormGroup.controls['datefechaemision'].setValue(fechadefinitiva);
      this.itemFormGroup.controls['cmbMoneda'].setValue( this.retencionEbizedit.idMoneda);
      this.itemFormGroup.controls['txtImporteSoles'].setValue( this.retencionEbizedit.totalMonedaDestino);
      this.itemFormGroup.controls['txtTipoCambio'].setValue( this.retencionEbizedit.auxiliar1);
      setTimeout(function () {
        $('select').each(function () {
          $(this.parentElement).removeClass('is-empty');
        });
      }, 200);
      this.deshabilitar();
    } else {
      this.router.navigateByUrl('percepcion-retencion/retencion/crear/individual');
    }
  }

  limpiar($event) {
    this.itemFormGroup.reset();
  }

  cambiarestado() {
    this.fechaedicion = false;
    $('#datefechaemision').prop('disabled', false);
    this.editablelimpiar = false;
    this.editable = true;
    this.itemFormGroup.enable();
    this.itemFormGroup.controls['txtretencionxciento'].disable();
    this.flagedit = 'EDICION';
    this.seleccionarMoneda();
  }

  filtro($event) {
    this.fillProducto();
  }

  fillProducto() {
    const fechastr = this.itemFormGroup.get('datefechaemision').value.toString().split('/');
    const dia = fechastr[0];
    const mes = fechastr[1];
      if ((mes.length < 2) && (Number(mes) < 10)) {
        this.mesnorm = '0' + mes;
      } else {
        this.mesnorm = mes;
      }
      if ((dia.length < 2) && (Number(dia) < 10)) {
        this.dianorm = '0' + dia;
      } else {
        this.dianorm = dia;
      }
    const anio = fechastr[2];
    this.retencionEbiz.fechaEmisionDestino = anio + '-' + this.mesnorm + '-' + this.dianorm;
    const indexTipo = this.tiposComprobantes.getValue().findIndex(element => element.codigo == this.itemFormGroup.get('cmbtipodocrp').value);
    this.retencionEbiz.tipoDocumentoDestino = this.itemFormGroup.get('cmbtipodocrp').value;
    this.retencionEbiz.tipoDocumentoDestinoDescripcion = indexTipo == -1 ? '' : this.tiposComprobantes.getValue()[indexTipo].descripcionLarga;
    this.retencionEbiz.tipoDocumentoOrigen = '20';
    this.retencionEbiz.tipoDocumentoOrigenDescripcion = 'RETENCION';
    this.retencionEbiz.correlativoDocumentoDestino = this.itemFormGroup.get('txtcorrelativo').value;
    this.retencionEbiz.serieDocumentoDestino = this.itemFormGroup.get('txtserie').value;
    this.retencionEbiz.totalMonedaDestino =  this.itemFormGroup.get('txtmonto').value;
    this.retencionEbiz.totalImporteAuxiliarDestino = this.itemFormGroup.get('txtretencion').value;
    this.retencionEbiz.totalPorcentajeAuxiliarDestino = this.itemFormGroup.get('txtretencionxciento').value;
    this.retencionEbiz.idMoneda = this.itemFormGroup.get('cmbMoneda').value;
    this.retencionEbiz.polizaFactura = '-';
    const indexTipoMoneda = this.todosTiposMonedas.getValue().findIndex(element => element.codigo == this.itemFormGroup.get('cmbMoneda').value);
    this.retencionEbiz.monedaDestino = indexTipo == -1 ? '' : this.todosTiposMonedas.getValue()[indexTipoMoneda].descripcionCorta;
      if (this.retencionEbiz.monedaDestino == 'PEN') {
        this.retencionEbiz.totalImporteDestino = this.itemFormGroup.get('txtmonto').value;
        this.retencionEbiz.auxiliar1 = (1).toFixed(2);
      } else {
        this.retencionEbiz.auxiliar1 = this.itemFormGroup.get('txtTipoCambio').value;
        this.retencionEbiz.totalImporteDestino = this.itemFormGroup.get('txtImporteSoles').value;
      }
    this.retencionEbiz.auxiliar2 = ((Number(this.retencionEbiz.totalMonedaDestino) * Number(this.retencionEbiz.auxiliar1))
        - Number(this.retencionEbiz.totalImporteAuxiliarDestino)).toString();
  }

  public grabar() {
    this.Refresh.CargarPersistencia = true;
    console.log('this.Refresh.CargarPersistencia - EDITAR ');
    console.log(this.Refresh.CargarPersistencia);
    this.fillProducto();
    if (this.verificarExistenciaItem()) {
      this.manejoMensajes.mostrarMensajeAdvertencia('itemRegistrado', 'verificarItemRetencionPercepcion');
    } else {
      this.persistenciaService.agregarProducto(this.retencionEbiz);
      this.router.navigateByUrl('percepcion-retencion/retencion/crear/individual');
    }
  }

  verificarExistenciaItem() {
    for (const detalle of this.persistenciaService.getListaProductos()) {
      if (
        detalle.tipoDocumentoDestino === this.retencionEbiz.tipoDocumentoDestino &&
        detalle.serieDocumentoDestino === this.retencionEbiz.serieDocumentoDestino &&
        detalle.correlativoDocumentoDestino === this.retencionEbiz.correlativoDocumentoDestino
        // && detalle.fechaEmisionDestino === this.retencionEbiz.fechaEmisionDestino
      ) {
        return true;
      }
      return false;
    }

  }


}
