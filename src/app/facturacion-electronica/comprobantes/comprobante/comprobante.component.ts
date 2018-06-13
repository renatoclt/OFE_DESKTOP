import { Component} from '@angular/core';
import { ProductosComprobanteService } from '../general/productos-comprobante.service';
import { Producto } from '../models/producto';
import { Router } from '@angular/router';
import { RutasService } from '../../general/utils/rutas.service';

@Component({
    selector:       'comprobante_component',
    templateUrl:    'comprobante.component.html'

})

export class ComprobanteComponent {

    public productitoMuestraEditar: Producto;
    constructor(
            private _itemsFactura: ProductosComprobanteService,
            private _router: Router,
            private _rutas: RutasService ) {
        this.cargarDataPrueba();
        // console.log( this.productitoMuestraEditar );
    }

    public verProductos() {
        console.log( 'PRODUCTOS' );
    }
    public cargarDataPrueba() {
        this.productitoMuestraEditar = new Producto();
        this.productitoMuestraEditar.cmbCalculoIsc = 1;
        this.productitoMuestraEditar.cmbDescripcionIgv = 1;
        this.productitoMuestraEditar.cmbIgv = 10;
        this.productitoMuestraEditar.cmbTipoPrecioVenta = 1;
        this.productitoMuestraEditar.cmbUnidadMedida = 1;
        this.productitoMuestraEditar.tipoProducto = 1;
        this.productitoMuestraEditar.txtCantidad = '20.00';
        this.productitoMuestraEditar.txtCodigo = '10-00';
        this.productitoMuestraEditar.txtDescripcion = 'Productito el mejor';
        this.productitoMuestraEditar.txtDescuento = '2.00';
        this.productitoMuestraEditar.txtIsc = '0.00';
        this.productitoMuestraEditar.txtValorUnitario = '0.00';
        this.productitoMuestraEditar.txtValorVenta = '50.00';
    }

    public irDocumentoRelacionado() {
        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_DOCUMENTO_RELACIONADO );
    }
    public irAgregarServicio() {
        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_SERVICIO_AGREGAR );
    }
    public irEditarServicio() {
        this._itemsFactura.setItemEditar( this.productitoMuestraEditar );
        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_SERVICIO_EDITAR );
    }
    public irAgregarBien() {
        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_BIEN_AGREGAR );
    }
    public irEditarBien() {
        this._itemsFactura.setItemEditar( this.productitoMuestraEditar );
        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_BIEN_EDITAR );
    }
    public irVistaPrevia() {
        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_VISTA_PREVIA );
    }
}
