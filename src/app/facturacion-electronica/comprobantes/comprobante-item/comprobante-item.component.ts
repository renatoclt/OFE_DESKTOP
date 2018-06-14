import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RutasService } from '../../general/utils/rutas.service';
import { Producto } from '../models/producto';
import { Igv } from '../models/igv';
import { ProductosComprobanteService } from '../general/productos-comprobante.service';
import { ConstantesService } from '../../general/utils/constantes.service';
import { DetalleEbiz } from '../models/detalleEbiz';
import { PersistenciaService } from '../services/persistencia.service';
import { TiposService } from '../../general/utils/tipos.service';
import { TablaMaestraService } from 'app/facturacion-electronica/general/services/documento/tablaMaestra.service';
import { BehaviorSubject } from 'rxjs';
import { TablaMaestra, TABLA_MAESTRA_UNIDADES_MEDIDA } from 'app/facturacion-electronica/general/models/documento/tablaMaestra';
import { ParametrosService } from 'app/facturacion-electronica/general/services/configuracionDocumento/parametros.service';
import { TipoPrecioVentaService } from 'app/facturacion-electronica/general/services/configuracionDocumento/tipoPrecioVenta.service';
import { TipoPrecioVenta } from 'app/facturacion-electronica/general/models/configuracionDocumento/tipoPrecioVenta';
import { TipoCalculoIscService } from 'app/facturacion-electronica/general/services/configuracionDocumento/tipoCalculoIsc.service';
import { TipoCalculoIsc } from 'app/facturacion-electronica/general/models/configuracionDocumento/tipoCalculoIsc';
import { TipoAfectacionIgvService } from 'app/facturacion-electronica/general/services/configuracionDocumento/tipoAfectacionIgv.service';
import { TipoAfectacionIgv } from 'app/facturacion-electronica/general/models/configuracionDocumento/tipoAfectacionIgv';
import { CatalogoIgvService } from 'app/facturacion-electronica/general/utils/catalogo-igv.service';
import { ProductoQry } from '../../general/models/productos/producto';
import { Observable } from 'rxjs/Observable';
import { EstilosServices } from 'app/facturacion-electronica/general/utils/estilos.services';
import {PadreComprobanteService} from '../services/padre-comprobante.service';
import { RefreshService } from 'app/facturacion-electronica/general/services/refresh.service';
import {ProductoServices} from '../../general/services/inventario/producto.services';
import { TranslateService } from '@ngx-translate/core';

declare var $, swal: any;

@Component({
    selector: 'app-comprobante-item-component',
    templateUrl: 'comprobante-item.component.html',
    styleUrls: ['comprobante-item.component.css']
})
export class ComprobanteItemComponent implements OnInit, AfterViewInit {

    public productoEditar: DetalleEbiz;
    public indice: number;
    public tipoAccion: number;
    public cmbIgvSeleccionado: number;
    public idPosicion: number;
    public igv: number;
    public flagTipoPrecioVenta: BehaviorSubject<number>;
    public titulo: string;
    public tipoDocumento: string;
    public labelContinuar: string;
    public labelSi: string;
    public esBien: boolean;
    public editable: boolean;
    public estadoIsc: boolean;
    public estadoEditar: boolean;
    public flagIgv: boolean;
    public flagTipoIgv: boolean;
    public estadoIgvSeleccionado: boolean;

    public dtoOutIgv: Igv[];
    public dtoOutIgvBase: Igv[] = [];
    public dtoOutIgvDescripcionTmp: Igv[] = [];
    public dtoOutIgvDescripcion: Igv[] = [];
    public producto: DetalleEbiz;
    public item: Producto;
    public itemFormGroup: FormGroup;

    public tipoItem: string;

    public unidadesDeMedida: BehaviorSubject<TablaMaestra[]> = new BehaviorSubject<TablaMaestra[]>([]);
    public tipoPrecioVentaUnitario: BehaviorSubject<TipoPrecioVenta[]> = new BehaviorSubject<TipoPrecioVenta[]>([]);
    public tipoCalculoIsc: BehaviorSubject<TipoCalculoIsc[]> = new BehaviorSubject<TipoCalculoIsc[]>([]);
    public tipoAfectacionIgvObservable: BehaviorSubject<TipoAfectacionIgv[]>;
    public tipoAfectacionIgv: BehaviorSubject<TipoAfectacionIgv[]> = new BehaviorSubject<TipoAfectacionIgv[]>([]);
    public tipoAfectacionIgvListaCompleta: TipoAfectacionIgv[] = [];
    public productosDeAutocompletadoLista: BehaviorSubject<ProductoQry[]>;
    public estadoautocomplete: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        //  private _comprobanteService: ComprobanteProductosService,
        private _const: ConstantesService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _rutas: RutasService,
        private _itemsFactura: ProductosComprobanteService,
        private _persistenciaService: PersistenciaService,
        private _tipos: TiposService,
        private _tablaMaestraService: TablaMaestraService,
        private _parametros: ParametrosService,
        private _tipoPrecioVentaService: TipoPrecioVentaService,
        private _tipoCalculoIscService: TipoCalculoIscService,
        private _tipoAfectacionIgvService: TipoAfectacionIgvService,
        private _catalogoIgvService: CatalogoIgvService,
        private _productosService: ProductoServices,
        private _estilosService: EstilosServices,
        private _padreComprobanteService: PadreComprobanteService,
        private _refresh: RefreshService,
        private _translate: TranslateService) {
            this.flagTipoPrecioVenta = new BehaviorSubject(0);
            this._padreComprobanteService.actualizarComprobante(this._route.snapshot.data['codigo'],
                this._route.snapshot.data['mostrarCombo']);
            this.tipoAfectacionIgvObservable = new BehaviorSubject<TipoAfectacionIgv[]>([]);
            this.cmbIgvSeleccionado = 1;
            this.igv = this._catalogoIgvService.IGV_VALOR;
            this.estadoIsc = true;
            this.flagIgv = true;
            this.flagIgv = true;
            this.estadoIgvSeleccionado = true;
            this._translate.get('continuar').subscribe(data => this.labelContinuar = data);
            this._translate.get('si').subscribe(data => this.labelSi = data);
            this.item = new Producto();
            this.producto = new DetalleEbiz();
            this.initForm();
            this.productosDeAutocompletadoLista = new BehaviorSubject<ProductoQry[]>([]);
            this.cargarServicios();
    }
    ngOnInit() {
        this.obtenerParametros();
        this.setTipoAfectacionPorTipoIngresado();
        if (this.editable) {
            this.cargarProductoEditar();
        }
    }
    ngAfterViewInit() {
        setTimeout(function () {
            $('#divRadioIgv').removeClass('is-empty');
        }, 200);
    }
    /**
     * Método que establece los campos a mostrar del producto,
     * Bien => Todos los campos
     * Servicio => Omite la unidad de medida
     */
    public setEstadoCampos() {
        this.itemFormGroup.controls['txtIsc'].disable();
        // this.itemFormGroup.controls['txtValorVenta'].disable();
        if (this.esBien) {
            this.itemFormGroup.controls['cmbUnidadMedida'].enable();
        } else {
            this.itemFormGroup.controls['cmbUnidadMedida'].disable();
        }
    }
    /**
     * Método que carga todos los servicios que se usaran en el formulario
     */
    public cargarServicios() {
        this.unidadesDeMedida = this._tablaMaestraService.obtenerPorIdTabla(TABLA_MAESTRA_UNIDADES_MEDIDA);
        this.tipoPrecioVentaUnitario = this._tipoPrecioVentaService.obtenerTodosTiposPrecioVenta();
        this.tipoCalculoIsc = this._tipoCalculoIscService.obtenerTodosTiposCalculoIsc();
        this.tipoAfectacionIgvObservable = this._tipoAfectacionIgvService.obtenerTodosTiposAfectacionIgv();
    }
    /**
     * Método que establece la lista igv's a utilizarse
     */
    public getListaIgv() {
        //  let listaProductos: DetalleEbiz[] = [];
        //  listaProductos = this._persistenciaService.getListaProductos();
        this.tipoAfectacionIgvObservable.subscribe((data) => {
            this.tipoAfectacionIgv.next(data);
            this.setTipoAfectacionPorTipoIngresado();
        })
    }
    /**
     * Método que filtra la lista de igv's
     * Items ingresados 0, lista completa de igv's
     * Items ingresados mayor a 1, lista filtrada por el tipo de igv del primer item ingresado
     * Tipos => Gravadas, Inafectas o Exoneradas
     * @param listaProductos => lista con los items  ingresados actualmente
     * @param listaIgvs => lista de Igv's
     */
    public setTipoAfectacionPorTipoIngresado() {
        let productos: DetalleEbiz[] = [];
        productos = this._persistenciaService.getListaProductos();
        if (productos.length === 0) {
            this.filtrarTipoIgv('0');
            this.itemFormGroup.controls['radioTipoIgv'].setValidators(Validators.required);
        } else {
            this.itemFormGroup.controls['cmbTipoPrecioVenta'].disable();
            this.itemFormGroup.controls['cmbTipoPrecioVenta'].setValue(productos[0].detalle.codigoTipoPrecio);
            this.eliminarEstiloInput('cmbTipoPrecioVenta', 'is-empty');
            this.itemFormGroup.controls['radioTipoIgv'].disable();

            if (productos.length === 1) {
                if (this.tipoAccion === this._const.ITEM_BIEN_EDITAR || this.tipoAccion === this._const.ITEM_SERVICIO_EDITAR) {
                    this.itemFormGroup.controls['radioTipoIgv'].enable();
                }
            }
            const codigoIgv: number = this.getTipoIgv(Number(productos[0].detalle.codigoTipoIgv));
            this.itemFormGroup.controls['radioTipoIgv'].setValue(codigoIgv.toString());
            this.itemFormGroup.controls['radioTipoIgv'].setValidators(Validators.required);
            this.filtrarTipoIgv(codigoIgv.toString());
            //  this.itemFormGroup.controls['cmbIgv'].disable();
        }
    }
    public filtrarTipoIgv(tipoIgv: string) {
        const that = this;
        this.tipoAfectacionIgvObservable
            .subscribe(
            dataS => {
                if (dataS.length > 0) {
                    const dataOut = [];
                    for (let a = 0; a < dataS.length; a++) {
                        if (Number(that.itemFormGroup.controls['radioTipoIgv'].value) === that.getTipoIgv(Number(dataS[a].codigo))) {
                            dataOut.push(dataS[a]);
                        }
                    }
                    const cabeceraIgv: TipoAfectacionIgv = new TipoAfectacionIgv();
                    cabeceraIgv.idTipoAfectacion = -1;
                    cabeceraIgv.idIdioma = 1;
                    cabeceraIgv.estado = true;
                    cabeceraIgv.codigo = '-1';
                    cabeceraIgv.descripcion = 'Seleccione Tipo de IGV';
                    cabeceraIgv.afectaIgv = true;

                    dataOut.unshift(cabeceraIgv);
                    that.tipoAfectacionIgv.next(dataOut);
                    that.eliminarEstiloInput('cmbIgv', 'is-empty');
                }
            }
            );
        if (tipoIgv === '0') {
            this.itemFormGroup.controls['cmbIgv'].disable();
            return;
        }
        this.calcularValorTotal();
        this.itemFormGroup.controls['cmbIgv'].enable();
        this.flagIgv = false;
        this.itemFormGroup.controls['cmbIgv'].setValue('');
        //  this.agregarEstiloInput('cmbIgv', 'is-empty');
        console.log(this.itemFormGroup.controls['cmbIgv']);
        //  const tmpListaCompletaIgv: TipoAfectacionIgv[] = this.tipoAfectacionIgvListaCompleta;
        //  this.tipoAfectacionIgv = tmpListaCompletaIgv;
        //  this.eliminarEstiloInput('cmbIgv', 'is-empty');
    }
    /**
     * Método que obtiene y separa los Igv's en dos listas, segun su tipo
     */
    public setIgvDescripcion() {
        let idPadre = 0;
        let nombrePadre = '';
        for (let a = 0; a < this.dtoOutIgv.length; a++) {
            let tmpIgvPadre: Igv = new Igv();
            let tmpIgvHijo: Igv = new Igv();
            tmpIgvPadre.nombre = this.dtoOutIgv[a].nombre.slice(0, this.dtoOutIgv[a].nombre.search('-') - 1);
            if (idPadre === 0) {
                idPadre += 1;
                nombrePadre = tmpIgvPadre.nombre;
                tmpIgvPadre.id = idPadre;
                this.dtoOutIgvBase.push(tmpIgvPadre);
            } else {
                if (nombrePadre != tmpIgvPadre.nombre) {
                    idPadre += 1;
                    tmpIgvPadre.id = idPadre;
                    nombrePadre = tmpIgvPadre.nombre;
                    this.dtoOutIgvBase.push(tmpIgvPadre);
                }
            }
            tmpIgvHijo.id = this.dtoOutIgv[a].id;
            tmpIgvHijo.nombre = this.dtoOutIgv[a].nombre.slice(this.dtoOutIgv[a].nombre.search('-') + 2);
            tmpIgvHijo.idPadre = idPadre;
            this.dtoOutIgvDescripcionTmp.push(tmpIgvHijo);
        }
    }

    public selectIgv(idIgvPadre: number) {
        this.dtoOutIgvDescripcion = [];
        for (let a = 0; a < this.dtoOutIgvDescripcionTmp.length; a++) {
            let tmpIgv: Igv = new Igv();
            if (this.dtoOutIgvDescripcionTmp[a].idPadre == idIgvPadre) {
                tmpIgv.id = this.dtoOutIgvDescripcionTmp[a].id;
                tmpIgv.nombre = this.dtoOutIgvDescripcionTmp[a].nombre;
                this.dtoOutIgvDescripcion.push(tmpIgv);
            }
        }
    }
    /**
     * Método que extrae el tipo de producto y la accion que se realizara (Bien/Servicio => Crear/Editar)
     */
    private obtenerParametros() {
        this.tipoAccion = this._route.snapshot.data['tipoAccion'];
        this.tipoItem = this._route.snapshot.data['tipoItem'];
        this.tipoDocumento = this._route.snapshot.data['tipoDocumento'];
        let sub = this._route
            .params
            .subscribe(params => {
                this.idPosicion = +params['id'];
            });
        this.setTipoItem();
        this.setEstadoCampos();
    }
    /**
     * Método que deshabilita el formulario
     */
    public deshabilitar() {
        if (!this.esBien) {
            this.itemFormGroup.controls['cmbUnidadMedida'].disable();
        }
        this.itemFormGroup.disable();
        this.itemFormGroup.controls['radioTipoIgv'].disable();
        //this.itemFormGroup.invalid.valueOf();
    }
    /**
     * Método que habilita los controles del formulario para editar el producto
     */
    public habilitar() {
        this.itemFormGroup.enable();
        let productos: DetalleEbiz[] = [];
        productos = this._persistenciaService.getListaProductos();
        if ( productos.length > 0 ) {
            const codigoIgv: number = this.getTipoIgv(Number(productos[0].detalle.codigoTipoIgv));
            this.itemFormGroup.controls['radioTipoIgv'].setValue(codigoIgv.toString());
            this.itemFormGroup.controls['radioTipoIgv'].disable();
            this.itemFormGroup.controls['cmbTipoPrecioVenta'].disable();
            if (productos.length === 1) {
                this.itemFormGroup.controls['radioTipoIgv'].enable();
                this.itemFormGroup.controls['cmbTipoPrecioVenta'].enable();
            }
        }
        this.itemFormGroup.controls['txtIsc'].disable();
        if (!this.esBien) {
            this.itemFormGroup.controls['cmbUnidadMedida'].disable();
        } else {
            // this.itemFormGroup.controls['cmbUnidadMedida'].setValue(this.productoEditar.idRegistroUnidad);
            this.itemFormGroup.controls['cmbUnidadMedida'].enable();
        }

        //  this.setTipoAfectacionPorTipoIngresado();
    }
    /**
     * Método que establece si se esta editando o creando, un item o servicio
     */
    public setTipoItem() {
        switch (this.tipoAccion) {
            case this._const.ITEM_SERVICIO_CREAR:
                this.titulo = this._const.ITEM_SERVICIO_CREAR_TITULO;
                this.esBien = false;
                this.editable = false;
                break;
            case this._const.ITEM_SERVICIO_EDITAR:
                this.titulo = this._const.ITEM_SERVICIO_EDITAR_TITULO;
                this.esBien = false;
                this.editable = true;
                this.itemFormGroup.disable();
                break;
            case this._const.ITEM_BIEN_CREAR:
                this.titulo = this._const.ITEM_BIEN_CREAR_TITULO;
                this.esBien = true;
                this.editable = false;
                break;
            case this._const.ITEM_BIEN_EDITAR:
                this.titulo = this._const.ITEM_BIEN_EDITAR_TITULO;
                this.esBien = true;
                this.editable = true;
                this.itemFormGroup.disable();
                break;
        }
    }
    /**
     * Método que carga los campos defl formulario de un producto a editar
     */
    public cargarProductoEditar() {
        this.idPosicion = this._persistenciaService.getPersistenciaSimple('idEditarProducto');
        this.productoEditar = this._persistenciaService.getItemProducto(this.idPosicion);
        this.itemFormGroup.controls['txtCantidad'].setValue(this.productoEditar.cantidad);
        this.itemFormGroup.controls['txtCodigo'].setValue(this.productoEditar.codigoItem);
        this.itemFormGroup.controls['txtDescripcion'].setValue(this.productoEditar.descripcionItem);
        this.itemFormGroup.controls['cmbTipoPrecioVenta'].setValue(this.productoEditar.detalle.codigoTipoPrecio);
        this.itemFormGroup.controls['txtValorUnitario'].setValue(this.productoEditar.precioUnitario);
        this.itemFormGroup.controls['txtDescuento'].setValue(this.productoEditar.detalle.descuento);
        this.itemFormGroup.controls['cmbCalculoIsc'].setValue(this.productoEditar.detalle.codigoTipoIsc);
        this.seleccionarTipoIsc();
        this.filtrarTipoIgv(this.productoEditar.detalle.codigoTipoIgv);
        this.itemFormGroup.controls['txtIsc'].setValue(this.productoEditar.detalle.subtotalIsc);
        this.itemFormGroup.controls['cmbIgv'].setValue(this.productoEditar.detalle.codigoTipoIgv);
        this.itemFormGroup.controls['txtValorVenta'].setValue(this.productoEditar.precioTotal);
        if ( this._persistenciaService.getListaProductos().length === 1 ) {
            this.itemFormGroup.controls['cmbIgv'].enable();
        }
        if (!this.esBien) {
            this.itemFormGroup.controls['cmbUnidadMedida'].disable();
        } else {
            this.itemFormGroup.controls['cmbUnidadMedida'].setValue(this.productoEditar.idRegistroUnidad);
            this.itemFormGroup.controls['cmbUnidadMedida'].disable();
        }
        this.selectIgv(Number(this.productoEditar.detalle.codigoTipoIgv));
        setTimeout(function () {
            $('select').each(function () {
                $(this.parentElement).removeClass('is-empty');
            });
        }, 200);
        // if (this.productoEditar.detalle.subtotalIsc !== '0.00')  {
        //     this.estadoIsc = false;
        //     this.itemFormGroup.controls['txtIsc'].enable();
        // }

        this.deshabilitar();
        this.estadoEditar = true;
    }
    /**
     * Método que inicializa y crea los campos del formulario de Agregar/Editar Bien/Servicio
     */
    public initForm() {
        this.itemFormGroup = new FormGroup({
            'txtCantidad': new FormControl('', [
                Validators.required,
                Validators.pattern('[0-9]+[.][0-9]{2}'),
                Validators.minLength(4),
                Validators.maxLength(15)
            ]),
            'txtCodigo': new FormControl('', [
                Validators.required,
                Validators.pattern('[A-Za-z0-9áéíóúÁÉÍÓÚñÑ#.;*<>/%\\s-]+'),
                Validators.minLength(3),
                // Validators.maxLength(12)
            ]),
            'txtDescripcion': new FormControl('', [
                Validators.required,
                Validators.pattern('[A-Za-z0-9áéíóúÁÉÍÓÚ/%.\\s-]+'),
                Validators.minLength(1),
                Validators.maxLength(250)
            ]),
            'cmbUnidadMedida': new FormControl('', [
                Validators.required
            ]),
            'cmbTipoPrecioVenta': new FormControl('', [
                Validators.required
            ]),
            'txtValorUnitario': new FormControl('', [
                Validators.required,
                Validators.pattern('[0-9]+[.][0-9]{2}'),
                Validators.minLength(4),
                Validators.maxLength(15)
            ]),
            'txtDescuento': new FormControl('', [
                Validators.required,
                Validators.pattern('[0-9]+[.][0-9]{2}'),
                Validators.minLength(4),
                Validators.maxLength(15)
            ]),
            'cmbCalculoIsc': new FormControl('', [
                Validators.required
            ]),
            'txtIsc': new FormControl('', [
                Validators.required,
                Validators.pattern('[0-9]+[.][0-9]{2}'),
                Validators.minLength(4),
                Validators.maxLength(15)
            ]),
            'radioTipoIgv': new FormControl(''),
            'cmbIgv': new FormControl('', [
                Validators.required
            ]),
            // 'cmbDescripcionIgv': new FormControl('', [Validators.required]),
            'txtValorVenta': new FormControl('', [
                Validators.required,
                Validators.pattern('[0-9]+[.][0-9]{2}'),
                Validators.minLength(4),
                Validators.maxLength(15)
            ]),
        });
    }
    /**
     * Método que redirecciona a la pagina principal de factura
     */
    public regresar() {
        this._refresh.CargarPersistencia = true;this._refresh.CargarPersistencia = true;
        switch (this.tipoDocumento) {
            case this._tipos.TIPO_DOCUMENTO_FACTURA:
                this._router.navigateByUrl(this._rutas.URL_COMPROBANTE_FACTURA_CREAR);
                break;
            case this._tipos.TIPO_DOCUMENTO_BOLETA:
                this._router.navigateByUrl(this._rutas.URL_COMPROBANTE_BOLETA_CREAR);
                break;
        }
    }
    /**
     * Método que determina y retorna el valor del tipo de Igv que pertence un codigo,
     * Gravado, Inafecto o Exonerado
     * @param codigoIgv Codigo de Igv
     */
    public getTipoIgv(codigoIgv: number): number {
        if (codigoIgv > (this._catalogoIgvService.IGV_INAFECTO_RANGO - 1)) {
            if (codigoIgv > (this._catalogoIgvService.IGV_EXPORTACION_RANGO - 1)) {
                return this._catalogoIgvService.IGV_EXPORTACION_RANGO;
            } else {
                return this._catalogoIgvService.IGV_INAFECTO_RANGO;
            }
        } else {
            if (codigoIgv > (this._catalogoIgvService.IGV_EXONERADO_RANGO - 1)) {
                return this._catalogoIgvService.IGV_EXONERADO_RANGO;
            } else {
                return this._catalogoIgvService.IGV_GRAVADO_RANGO;
            }
        }
    }
    /**
     * Método que valida que todos los items de una factura dean del mismo tipo de Igv
     * Gravado, Exonerado o Inafecto
     */
    public validarTipoIgv(): boolean {
        const idIgv = Number(this.itemFormGroup.controls['cmbIgv'].value);
        let listaProductos: DetalleEbiz[] = [];
        listaProductos = this._persistenciaService.getListaProductos();
        const tipoIgvRango = this.getTipoIgv(idIgv);
        if (listaProductos.length > 0) {
            const tipoIgvRangoLista: number = this.getTipoIgv(Number(listaProductos[0].detalle.codigoTipoIgv));
            if (tipoIgvRangoLista === tipoIgvRango) {
                return true;
            } else {
                swal(
                    'Error',
                    'Los productos ingresados deben tener el mismo tipo de IGv (Gravado, Exonerado, Inafecto o Exportacion)',
                    'error'
                );
                return false;
            }
        } else {
            return true;
        }
    }
    /**
     * Método que valida que la informacion del producto sea valida
     */
    public validacionesFormulario(): boolean {
        if (this.itemFormGroup.controls['txtCantidad'].value === '0.00') {
            this.modalMensajeSimple('Advertencia', 'Cantidad Ingresada Inválida.', 'warning', this.labelContinuar, '#ffc107');
            return true;
        }
        if (this.itemFormGroup.controls['txtValorUnitario'].value === '0.00' ) {
            if (Number(this.itemFormGroup.controls['txtDescuento'].value) > 0) {
                this.modalMensajeSimple('Advertencia', 'Monto de descuento inválido.', 'warning', this.labelContinuar, '#ffc107');
                return true;
            }
            if (Number(this.itemFormGroup.controls['txtIsc'].value) > 0 && this.itemFormGroup.controls['txtIsc'].valid == true) {
                this.modalMensajeSimple('Advertencia', 'Monto de isc inválido.', 'warning', this.labelContinuar, '#ffc107');
                return true;
            }
        }
        return false;
    }
    /**
     * Método que agrega un producto y redirecciona a la pagina principal de Factura
     */
    public grabar() {
        //  Si no se cumple con alguna validacion este te lanza el mensaje de alerta y evita que grabe
        if (this.validacionesFormulario()) {
            return;
        }
        this.getDataFormulario();
        switch (this.tipoAccion) {
            case this._const.ITEM_BIEN_CREAR:
                if (this.validaItemExistente() === true) {
                    this.mostrarMensajeItemDuplicadoCodigo();
                    break;
                }
                this._persistenciaService.agregarProducto(this.producto);
                this.modalMensajeSimple('Acción Exitosa', 'El producto se agrego correctamente.', 'success', this.labelContinuar);
                this.regresar();
                break;
            case this._const.ITEM_BIEN_EDITAR:
                if (this._persistenciaService.validarCodigoItemEditar(this.producto.codigoItem, this.productoEditar.codigoItem) === false) {
                    this.mostrarMensajeItemDuplicadoCodigo();
                    break;
                }
                this._persistenciaService.editarProducto(this.producto, this.idPosicion);
                this.modalMensajeSimple('Acción Exitosa', 'El producto se editó correctamente.', 'success', this.labelContinuar);
                this.regresar();
                break;
            case this._const.ITEM_SERVICIO_CREAR:
                if (this.validaItemExistente() === true) {
                    this.mostrarMensajeItemDuplicadoCodigo();
                    break;
                }
                this._persistenciaService.agregarProducto(this.producto);
                this.modalMensajeSimple('Acción Exitosa', 'El producto se agrego correctamente.', 'success', this.labelContinuar);
                this.regresar();
                break;
            case this._const.ITEM_SERVICIO_EDITAR:
                if (this._persistenciaService.validarCodigoItemEditar(this.producto.codigoItem, this.productoEditar.codigoItem) === false) {
                    this.mostrarMensajeItemDuplicadoCodigo();
                    break;
                }
                this._persistenciaService.editarProducto(this.producto, this.idPosicion);
                this.modalMensajeSimple('Acción Exitosa', 'El producto se editó correctamente.', 'success', this.labelContinuar);
                this.regresar();
                break;
            default:
                // Se asume es un editar de un concepto de factura y/o boleta anticipo,
                // no se definio un tipo bien / servicio
                this._persistenciaService.editarProducto(this.producto, this.idPosicion);
                this.regresar();
                break;
        }
    }
    /**
     * Método que valida la existencia de un item con el mismo codigo
     * @returns true => el item ya existe, false => item no existe
     */
    public validaItemExistente(): boolean {
        let item: DetalleEbiz = new DetalleEbiz();
        item = this._persistenciaService.validarCodigoItem(this.itemFormGroup.controls['txtCodigo'].value);
        if (item == null) {
            return false;
        }
        return true;
    }
    /**
     * Método que graba un producto, y limpia el formulario para continuar agregando productos
     */
    public seguirGrabando() {
        let item: DetalleEbiz = new DetalleEbiz();
        this.getDataFormulario();
        item = this._persistenciaService.validarCodigoItem(this.itemFormGroup.controls['txtCodigo'].value);
        //  Si no se cumple con alguna validacion este te lanza el mensaje de alerta y evita que grabe
        if (this.validacionesFormulario()) {
            return;
        }
        if (this.validaItemExistente() === true) {
            this.mostrarMensajeItemDuplicadoCodigo();
        } else {
            this._persistenciaService.agregarProducto(this.producto);
            this.modalMensajeSimple('Acción Exitosa', 'El producto se agrego correctamente.', 'success', this.labelContinuar);
            this.limpiar();
            this.getListaIgv();
            //  this.obtenerParametros();
            // this.setTipoAfectacionPorTipoIngresado();

        }
    }
    /**
     * M´todo que determina si es un Bien o un Servicio
     */
    public setTipoProducto() {
        switch (this.tipoDocumento) {
            case this._tipos.TIPO_DOCUMENTO_FACTURA:
                this.producto.tipoComprobante = this._tipos.TIPO_DOCUMENTO_FACTURA;
                break;
            case this._tipos.TIPO_DOCUMENTO_BOLETA:
                this.producto.tipoComprobante = this._tipos.TIPO_DOCUMENTO_BOLETA;
                break;
        }
        if (this.esBien) {
            this.producto.tipoProducto = this._tipos.TIPO_PRODUCTO_BIEN;
        } else {
            this.producto.tipoProducto = this._tipos.TIPO_PRODUCTO_SERVICIO;
        }
    }
    /**
     * Método que habilita / Deshabilita el ingreso de ISC
     */
    public cambiarEstadoIsc() {
        if (this.estadoIsc) {
            this.estadoIsc = false;
            this.itemFormGroup.controls['txtIsc'].reset();
            this.itemFormGroup.controls['txtIsc'].enable();
        } else {
            this.estadoIsc = true;
            this.itemFormGroup.controls['txtIsc'].disable();
        }
    }
    /**
     * Método que limpia todos los campos del formulario
     */
    public limpiar() {
        this.itemFormGroup.reset();
        this.habilitar();
        this.setTipoAfectacionPorTipoIngresado();
        this.itemFormGroup.controls['txtCantidad'].setValue('');
        this.itemFormGroup.controls['txtCodigo'].setValue('');
        this.itemFormGroup.controls['txtDescripcion'].setValue('');
        this.itemFormGroup.controls['txtValorUnitario'].setValue('');
        this.itemFormGroup.controls['txtDescuento'].setValue('');
        this.itemFormGroup.controls['txtValorVenta'].setValue('');

        this.estadoIsc = true;
        this.itemFormGroup.controls['txtIsc'].disable();
        this.itemFormGroup.controls['txtIsc'].setValue('');
        this.agregarEstiloInput('txtCantidad', 'is-empty');
        this.agregarEstiloInput('txtCodigo', 'is-empty');
        this.agregarEstiloInput('txtDescripcion', 'is-empty');
        this.agregarEstiloInput('cmbUnidadMedida', 'is-empty');
        this.agregarEstiloInput('cmbTipoPrecioVenta', 'is-empty');
        this.agregarEstiloInput('txtValorUnitario', 'is-empty');
        this.agregarEstiloInput('txtDescuento', 'is-empty');
        this.agregarEstiloInput('cmbCalculoIsc', 'is-empty');
        this.agregarEstiloInput('txtIsc', 'is-empty');
        this.agregarEstiloInput('txtValorVenta', 'is-empty');
        if (!this.esBien) {
            this.itemFormGroup.controls['cmbUnidadMedida'].disable();
        } else {
            this.itemFormGroup.controls['cmbUnidadMedida'].setValue('');
            this.itemFormGroup.controls['cmbUnidadMedida'].enable();
        }
        setTimeout(function () {
            $('#divTxtCodigo').addClass('is-empty');
        }, 200);
    }
    /**
     * Método que elimina un estilo de una etiqueda Html mediante el id de la misma
     * @param idHtml Id Etiqueta Html
     * @param estilo Nombre del Estilo a eliminar
     */
    public eliminarEstiloInput(idHtml: string, estilo: string) {
        setTimeout(function () {
            $('#' + idHtml).parent().removeClass(estilo);
        }, 200);
    }
    public agregarEstiloInput(idHtml: string, estilo: string) {
        setTimeout(function () {
          $('#' + idHtml).parent().addClass(estilo);
        }, 200);
      }
    /**
     * Método que habilita el boton editar
     */
    public editar() {
        this.estadoEditar = false;
        this.habilitar();
    }
    /**
     * Método que Carga los datos para el JSON y para su guardado localmente
     */
    private getDataFormulario() {
        //  FALTA TIPO DE PRODUCTO, PARA SABER SI ES UN BIEN O SERVICIO
        this.producto.descripcionItem = this.itemFormGroup.controls['txtDescripcion'].value;
        // this.producto.idRegistroUnidad = Number(this.itemFormGroup.controls['cmbUnidadMedida'].value).toString();
        this.producto.cantidad = this.itemFormGroup.controls['txtCantidad'].value;
        if (this.itemFormGroup.controls['txtCodigo'].value.codigo == undefined) {
            this.producto.codigoItem = this.itemFormGroup.controls['txtCodigo'].value;
        } else {
            this.producto.codigoItem = this.itemFormGroup.controls['txtCodigo'].value.codigo;
        }
        this.producto.precioUnitario = this.itemFormGroup.controls['txtValorUnitario'].value;
        this.producto.detalle.descuento = this.itemFormGroup.controls['txtDescuento'].value;
        this.producto.detalle.subtotalIsc = this.itemFormGroup.controls['txtIsc'].value;

        if (this.itemFormGroup.controls['txtIsc'].disabled) {
            this.producto.detalle.subtotalIsc = '0.00';
        }
        this.producto.precioTotal = this.itemFormGroup.controls['txtValorVenta'].value;
        this.producto.detalle.precioUnitarioVenta = this.formatearNumeroADecimales(
            ( Number(this.producto.precioTotal) / Number(this.producto.cantidad) ));

        this.tipoAfectacionIgv.subscribe(data => {
            this.indice = data.findIndex(
                element => element.codigo == this.itemFormGroup.get('cmbIgv').value
            );
        })

        this.tipoAfectacionIgv.subscribe(data => {
            this.producto.detalle.descripcionTipoIgv = (data[this.indice].descripcion).toString();
            this.producto.detalle.idTipoIgv = (data[this.indice].idTipoAfectacion).toString();
            this.producto.detalle.codigoTipoIgv = (data[this.indice].codigo).toString();
        });
        //  this.producto.detalle.codigoTipoIgv = this.itemFormGroup.controls['cmbIgv'].value;
        //  this.producto.detalle.descripcionTipoIgv = ' ----- ';
        this.tipoCalculoIsc.subscribe(data => {
            this.indice = data.findIndex(
                element => element.codigo == this.itemFormGroup.get('cmbCalculoIsc').value
            );
        });
        this.tipoCalculoIsc.subscribe(
            data => {
                this.producto.detalle.idTipoIsc = (data[this.indice].idTipoCalculo).toString();
                this.producto.detalle.codigoTipoIsc = (data[this.indice].codigo).toString();;
                this.producto.detalle.descripcionTipoIsc = (data[this.indice].descripcion).toString();
            }
        );
        // this.producto.detalle.idTipoIsc = this.itemFormGroup.controls['cmbCalculoIsc'].value;
        // this.producto.detalle.codigoTipoIsc = '';
        // this.producto.detalle.descripcionTipoIsc = ' ----- ';
        //  this.producto.detalle.idTipoPrecio = this.itemFormGroup.controls['cmbTipoPrecioVenta'].value;

        this.estadoautocomplete.subscribe(
            data => {
                if (data === false) {
                    this.producto.detalle.idProducto = null;
                }
            }
        )
        const indexTipoPrecio: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
        this.tipoPrecioVentaUnitario.subscribe(data => {
            this.indice = data.findIndex(
                element => element.codigo == this.itemFormGroup.get('cmbTipoPrecioVenta').value
            );
        });
        this.tipoPrecioVentaUnitario.subscribe(
            data => {
                this.producto.detalle.codigoTipoPrecio = data[this.indice].codigo;
                this.producto.detalle.descripcionTipoPrecio = data[this.indice].descripcion;
                this.producto.detalle.idTipoPrecio = data[this.indice].idTipoPrecioVenta.toString();
            }
        );

        if (this.esBien) {
            this.unidadesDeMedida.subscribe(
                data => {
                    this.indice = data.findIndex(
                        element => element.codigo == this.itemFormGroup.controls['cmbUnidadMedida'].value
                    );
                    this.producto.detalle.unidadMedida = data[this.indice].iso;
                    // this.producto.detalle.unidadMedida = 'NIU';
                    // this.producto.codigoUnidadMedida = 'NIU';
                    this.producto.codigoUnidadMedida = data[this.indice].iso;
                    this.producto.idRegistroUnidad = (this.itemFormGroup.controls['cmbUnidadMedida'].value).toString();
                    this.producto.idTablaUnidad = data[this.indice].tabla.toString();;
                }
            );
            // this.producto.codigoUnidadMedida = this.itemFormGroup.controls['cmbUnidadMedida'].value;
            // this.producto.detalle.unidadMedida = this.itemFormGroup.controls['cmbUnidadMedida'].value;
        } else {
                    this.producto.detalle.unidadMedida = 'NIU';
                    this.producto.codigoUnidadMedida = 'NIU';
                    this.producto.idRegistroUnidad = '0000001';
                    this.producto.idTablaUnidad = '10000';

            // this.producto.codigoUnidadMedida = this.itemFormGroup.controls['cmbUnidadMedida'].value;
            // this.producto.detalle.unidadMedida = this.itemFormGroup.controls['cmbUnidadMedida'].value;
        }
        this.producto.posicion = (this._persistenciaService.getListaProductos().length + 1).toString();
        if (this.editable) {
            this.producto.posicion = this.productoEditar.posicion;
        }
        this.producto.precioTotal = this.itemFormGroup.controls['txtValorVenta'].value;
        this.producto.detalle.numeroItem = this.producto.posicion;

        if (this.getTipoIgv(Number(this.producto.detalle.codigoTipoIgv)) === this._catalogoIgvService.IGV_GRAVADO_RANGO) {
            this.producto.montoImpuesto = (
                (
                    (   Number(this.producto.cantidad) * Number(this.producto.precioUnitario) )
                    - Number(this.producto.detalle.descuento) + Number(this.producto.detalle.subtotalIsc)
                ) * this.igv
            ).toString();
            this.producto.montoImpuesto = this.formatearNumeroADecimales(Number(this.producto.montoImpuesto));
        } else {
            this.producto.montoImpuesto = '0.00';
        }
        this.producto.detalle.subtotalIgv = this.producto.montoImpuesto;
        this.producto.detalle.subtotalVenta = (
            (
                ((   Number(this.producto.cantidad) * Number(this.producto.precioUnitario) )
                - Number(this.producto.detalle.descuento) + Number(this.producto.detalle.subtotalIsc) ) + Number(this.producto.montoImpuesto)
            )
        ).toString();
        this.producto.porcentajeImpuesto = this.igv.toString();
        this.setTipoProducto();
    }

    private seleccionarTipoPrecioVenta() {
        $('radioTipoIgvGravado').disable = true;
        this.itemFormGroup.controls['radioTipoIgv'].reset()
        switch(this.itemFormGroup.controls['cmbTipoPrecioVenta'].value) {
            case this._tipos.TIPO_PRECIO_PRECIO_UNITARIO_CODIGO:
                $('#radioTipoIgvGravado').prop('disabled', false);
                $('#radioTipoIgvInafecto').prop('disabled', true);
                $('#radioTipoIgvExonerado').prop('disabled', true);
                // this.itemFormGroup.controls['radioTipoIgv'].setValue('10');
                break;
            case this._tipos.TIPO_PRECIO_VALOR_REFERENCIAL_UNITARIO_CODIGO:
                $('#radioTipoIgvGravado').prop('disabled', true);
                $('#radioTipoIgvInafecto').prop('disabled', false);
                $('#radioTipoIgvExonerado').prop('disabled', false);
                break;
        }
    }

    public seleccionarTipoIsc() {
        const tipoIsc = this.itemFormGroup.controls['cmbCalculoIsc'].value;
        this.itemFormGroup.controls['txtIsc'].setValue('0.00');
        this.eliminarEstiloInput('txtIsc', 'is-empty');
        // if (tipoIsc == this._tipos.CODIGO_TIPO_ISC_NO_TIENE) {
        if (tipoIsc == '00') {
            this.itemFormGroup.controls['txtIsc'].disable();
            this.estadoIsc = true;
            this.calcularValorTotal();
        } else {
            this.itemFormGroup.controls['txtIsc'].enable();
            this.estadoIsc = false;
        }
    }

    public formatearNumeroADecimales(valor: number, numeroDecimales = 2): string {
      return valor.toFixed(numeroDecimales);
    }
    /**
     * Método que calcula el Valor Venta del Item
     */
    public calcularValorTotal() {
        let cantidad: number;
        let valorUnitario: number;
        let descuento: number;
        let isc: number;
        let valorVenta: number;
        let montoIgv: number;
        cantidad = Number(this.itemFormGroup.controls['txtCantidad'].value);
        valorUnitario = Number(this.itemFormGroup.controls['txtValorUnitario'].value);
        descuento = Number(this.itemFormGroup.controls['txtDescuento'].value);
        isc = Number(this.itemFormGroup.controls['txtIsc'].value);
        if (this.itemFormGroup.controls['cmbIgv'].value == "") {
            return;
        }
        if (this.itemFormGroup.controls['txtCantidad'].value == "") {
            return;
        }
        if (this.itemFormGroup.controls['txtValorUnitario'].value == "") {
            return;
        }
        if (this.itemFormGroup.controls['txtDescuento'].value == "") {
            return;
        }
        if (this.itemFormGroup.controls['txtIsc'].value == "") {
            return;
        }

        valorUnitario = valorUnitario * cantidad;
        if (Number(this.itemFormGroup.controls['radioTipoIgv'].value) !== this._catalogoIgvService.IGV_GRAVADO_RANGO) {
            montoIgv = 0.00;
        } else {
            montoIgv = (valorUnitario - descuento + isc) * this.igv;
        }
        valorVenta = valorUnitario + isc - descuento + montoIgv;
        this.itemFormGroup.controls['txtValorVenta'].setValue(valorVenta.toFixed(2));
        this.eliminarEstiloInput('txtValorVenta', 'is-empty');
    }
    public setMontoIgv() {
        let cantidad, valorUnitario, descuento, isc, valorVenta, porcentajeIgv, montoIgv: number;
        cantidad = Number(this.itemFormGroup.controls['txtCantidad'].value);
        valorUnitario = Number(this.itemFormGroup.controls['txtValorUnitario'].value);
        descuento = Number(this.itemFormGroup.controls['txtDescuento'].value);
        isc = Number(this.itemFormGroup.controls['txtIsc'].value);
        valorVenta = Number(this.itemFormGroup.controls['txtValorVenta'].value);
        montoIgv = (valorVenta - (valorUnitario * cantidad)) + descuento;
        porcentajeIgv = (montoIgv / ((valorUnitario * cantidad) - descuento));
        this.producto.porcentajeImpuesto = porcentajeIgv.toString();
        this.producto.montoIgv = montoIgv.toString();
    }
    public onKey(event: any) {
        let cadena: string;
        cadena = event.target.value;
        const regex = /[^0-9.]/g;
        let respuesta: string;
        respuesta = cadena.replace(regex, '');
    }

    public formatoDeListaAutocompletado(data: any): string {
        return data['codigo'] + ' - ' + data['descripcion'];
    }
    public cambioAutocomplete() {
        if (typeof this.itemFormGroup.get('txtCodigo').value === 'object') {
          this.estadoautocomplete.next(true);
        } else {
          this.estadoautocomplete.next(false);
        }
      }
    public formatoDeValorAutocompletado(data: any): string {
        return data['codigo'];
    }

    public productoPorCodigoCambio(producto: ProductoQry) {
        console.log(producto);
        if (producto !== undefined) {
            this.itemFormGroup.get('txtDescripcion').setValue(producto.descripcion);
            this.itemFormGroup.get('txtValorUnitario').setValue(this.formatearNumeroADecimales(parseInt(producto.precioUnitario)));
            let index: number;
            this.tipoCalculoIsc.subscribe(
                data => {
                    index = data.findIndex(
                        element => element.idTipoCalculo === producto.idTipoCalc
                    );
                    if (index !== -1) {
                        this.itemFormGroup.get('cmbCalculoIsc').setValue(data[index].codigo);
                        this._estilosService.eliminarEstiloInput( 'cmbCalculoIsc', 'is-empty');
                        this.seleccionarTipoIsc();
                    }
                }
            );
            this.itemFormGroup.get('txtIsc').setValue(this.formatearNumeroADecimales( parseInt(producto.montoIsc)));
            this.unidadesDeMedida.subscribe(
                data => {
                    this.indice = data.findIndex(
                        element => element.iso == producto.unidadMedida
                    );
                    if (this.indice !== -1) {
                        this.itemFormGroup.get('cmbUnidadMedida').setValue(data[this.indice].codigo);
                        this._estilosService.eliminarEstiloInput( 'cmbUnidadMedida', 'is-empty');
                    }
                }
            );

            this.producto.detalle.idProducto = producto.id.toString();
            this._estilosService.eliminarEstiloInput( 'txtDescripcion', 'is-empty');
            this._estilosService.eliminarEstiloInput( 'txtValorUnitario', 'is-empty');
            this._estilosService.eliminarEstiloInput( 'txtIsc', 'is-empty');
        }
    }
    /**
     * Método que lista los productos para autocompletar
     * @param keyword
     */
    public listarProductosDeAutcompletado(keyword: any) {
        if (keyword) {
            return this._productosService.buscarPorCodigo(keyword, this.tipoItem);
        } else {
            return Observable.of([]);
        }
    }
    public mostrarMensajeItemDuplicadoCodigo() {
        swal(
            'Error',
            'Existe un producto ingresado con el mismo código.',
            'error'
        );
    }
    /**
     * Método genérico para mostrar mensajes
     * @param titulo
     * @param mensaje
     * @param tipoAlerta (succes, warning, danger)
     * @param botonLabel Label de Boton a mostrarse
     */
    public modalMensajeSimple(titulo: string, mensaje: string, tipoAlerta: string,
        botonLabel = this.labelSi, colorBoton = '#4caf50') {
        swal({
            title: titulo,
            html:
                '<div class="text-center"> ' + mensaje + '</div>',
            type: tipoAlerta,
            confirmButtonText: botonLabel,
            confirmButtonClass: 'btn btn-warning',
            confirmButtonColor: colorBoton
        });
    }

    public seleccionarIgv() {
        const tipoIgv = this.itemFormGroup.controls['cmbIgv'].value;
        if (tipoIgv === '-1') {
            this.estadoIgvSeleccionado = false;
        } else {
            this.calcularValorTotal();
            this.estadoIgvSeleccionado = true;
        }
    }
}

