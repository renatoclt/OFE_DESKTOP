import { Component } from '@angular/core';
import { PersistenciaService } from '../services/persistencia.service';
import { DetalleEbiz } from '../models/detalleEbiz';
import { RutasService } from '../../general/utils/rutas.service';
import { TiposService } from '../../general/utils/tipos.service';
import { ConstantesService } from '../../general/utils/constantes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { RefreshService } from 'app/facturacion-electronica/general/services/refresh.service';

@Component({
    selector: 'comprobante-editar-base',
    templateUrl: 'comprobante-editar-base.component.html'
})
export class ComprobanteEditarBaseComponent implements OnInit {
    public idPosicion: number;
    public producto: DetalleEbiz;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _persistenciaService: PersistenciaService,
        private _rutas: RutasService,
        private _tipos: TiposService,
        private Refresh: RefreshService
    ) {
        this.producto = new DetalleEbiz();
        const sub = this._route
        .params
        .subscribe(params => {
            this.idPosicion = +params['id'] ;
        });
        this.producto = this._persistenciaService.getItemProducto( this.idPosicion );
        // falta validación if producto no existe, no deberia haber ese problema,
        // si se redirecciona aqui es porque el producto sera editado y existe
        this.redireccionar();
    }
    ngOnInit() {
    }
    public redireccionar() {
        switch ( this.producto.tipoProducto ) {
            case this._tipos.TIPO_PRODUCTO_BIEN:
                switch ( this.producto.tipoComprobante ) {
                    case this._tipos.TIPO_DOCUMENTO_FACTURA:
                        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_BIEN_EDITAR + '/' + this.idPosicion );
                        break;
                    case this._tipos.TIPO_DOCUMENTO_BOLETA:
                    this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_BOLETA_BIEN_EDITAR + '/' + this.idPosicion );
                        break;
                }
                break;
            case this._tipos.TIPO_PRODUCTO_SERVICIO:
                switch ( this.producto.tipoComprobante ) {
                    case this._tipos.TIPO_DOCUMENTO_FACTURA:
                        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_SERVICIO_EDITAR + '/' + this.idPosicion );
                        break;
                    case this._tipos.TIPO_DOCUMENTO_BOLETA:
                    this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_BOLETA_SERVICIO_EDITAR + '/' + this.idPosicion );
                        break;
                }
                break;
        }
    }

    // FALTA
    // - REDIRECCIONAR SEGUN BOLETA O FACTURA
    // - MODIFICAR ROUTING EDITAR QUE UTILIZE ID
    // - MODIFICAR LOGICA EDITAR ITEM (RECUPERAR ID)
}
