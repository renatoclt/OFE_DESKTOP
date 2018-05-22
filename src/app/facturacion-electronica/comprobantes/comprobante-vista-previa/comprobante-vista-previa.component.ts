import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RutasService } from '../../general/utils/rutas.service';
import { PersistenciaService } from '../services/persistencia.service';
import { FacturaEbiz } from '../models/facturaEbiz';
import { DetalleEbiz } from '../models/detalleEbiz';
import { DataTableComponent } from '../../general/data-table/data-table.component';
import { ConsultaDocumentoRelacionado } from '../../general/models/consultaDocumentoRelacionado';
import { loadavg } from 'os';
import { CabeceraFactura } from 'app/facturacion-electronica/comprobantes/models/cabeceraFactura';
import { NuevoDocumentoService } from 'app/facturacion-electronica/general/services/documento/nuevoDocumento';
import { Post_retencion } from 'app/facturacion-electronica/percepcion-retencion/models/post_retencion';
import { CreacionComprobantes } from 'app/facturacion-electronica/general/services/comprobantes/creacionComprobantes';
import { ComprobanteEmitido } from 'app/facturacion-electronica/general/models/comprobantes/comprobanteEmitido';
import { MensajeService } from 'app/facturacion-electronica/general/services/utils/mensaje.service';
import {PadreComprobanteService} from '../services/padre-comprobante.service';
import { RefreshService } from 'app/facturacion-electronica/general/services/refresh.service';
import { DocumentoReferencia } from 'app/facturacion-electronica/comprobantes/models/documentoReferencia';
import { TiposService } from 'app/facturacion-electronica/general/utils/tipos.service';
import { TranslateService } from '@ngx-translate/core';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';
import { CatalogoDocumentoIdentidadService } from '../../general/utils/catalogo-documento-identidad.service';
declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}
declare var $, swal: any;
@Component({
    selector: 'app-vistaprevia',
    templateUrl: './comprobante-vista-previa.component.html',
    styleUrls: ['./comprobante-vista-previa.css']
})
export class ComprobanteVistaPreviaComponent implements OnInit {

    public vistaPreviaFormGroup: FormGroup;
    public tipoAccion: number;
    public idComporbante: number;
    public vistaPreviaFlag: boolean;
    public titulo: string;
    public fechaEmision: string;
    public tipoDocumento: string;
    public tituloComprobante: string;
    public labelContinuar: string;
    public labelSi: string;
    public columnasTabla: ColumnaDataTable[];
    public urlLogo: string;
    public comprobante: FacturaEbiz;
    public cabeceraDatosFactura: CabeceraFactura;
    public listaItemsFactura: DetalleEbiz[] = [];
    public listaDocumentosReferencia: DocumentoReferencia[] = [];
    public flagFactura: boolean;
    editMode = false;
    id: number;

    @ViewChild('tablaVistaPrevia') tabla: DataTableComponent<DetalleEbiz>;

    constructor(
        private _rutas: RutasService,
        private route: ActivatedRoute,
        private router: Router,
        private _nuevodocumento: NuevoDocumentoService,
        private _persistencia: PersistenciaService,
        private _creacionComprobantes: CreacionComprobantes,
        private _mensajeService: MensajeService,
        private _padreComprobanteService: PadreComprobanteService,
        private _tipos: TiposService,
        private _refresh: RefreshService,
        private _translate: TranslateService,
        private _catalogoDocumentosIdentidad: CatalogoDocumentoIdentidadService) {
            this._translate.get('continuar').subscribe(data => this.labelContinuar = data);
            this._translate.get('si').subscribe(data => this.labelSi = data);
            this._padreComprobanteService.actualizarComprobante(
                this.route.snapshot.data['codigo'], this.route.snapshot.data['mostrarCombo']);
            this.comprobante = new FacturaEbiz();
            this.columnasTabla = [
              new ColumnaDataTable('codigo', 'codigoItem'),
              new ColumnaDataTable('descripcion', 'descripcionItem', {'text-align': 'left'}),
              new ColumnaDataTable('cantidad', 'cantidad', {'text-align': 'right'}),
              new ColumnaDataTable('Unidad de Medida', 'detalle.unidadMedida'),
              new ColumnaDataTable('valorUnitario', 'precioUnitario', {'text-align': 'right'}),
              new ColumnaDataTable('igv', 'montoImpuesto', {'text-align': 'right'}),
              new ColumnaDataTable('isc', 'detalle.subtotalIsc', {'text-align': 'right'}),
              new ColumnaDataTable('descuento', 'detalle.descuento', {'text-align': 'right'}),
              new ColumnaDataTable('valorVenta', 'precioTotal', {'text-align': 'right'})
            ];
            this.flagFactura = true;
            this.vistaPreviaFlag = true;
            this.fechaEmision = '-';
            this.tipoDocumento = '';
            this.tituloComprobante = '';
            this.obtenerParametros();
            this.initForm();
    }

    ngOnInit() {
        this.getRUCOrganizacion();
        this.getFacturaVistaPrevia();
        this.setDetalleTotales();
        this.fechaEmision = this.obtenerFecha (this.comprobante.fechaEmision.toString() );
    }
    public getRUCOrganizacion() {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        this.urlLogo = usuarioActual.org_url_image != null ? usuarioActual.org_url_image : '';
    }
    public initForm() {
        this.vistaPreviaFormGroup = new FormGroup(
            {
                'txtOperacionesGrabadas': new FormControl({ value: '0.00', disabled: true }),
                'txtOperacionesInafectas': new FormControl({ value: '0.00', disabled: true }),
                'txtOperacionesExoneradas': new FormControl({ value: '0.00', disabled: true }),
                'txtTotalDescuentos': new FormControl({ value: '0.00', disabled: true }),
                'txtSumatoriaOtrosTributos': new FormControl({ value: '0.00', disabled: true }),
                'txtSumatoriaOtrosCargos': new FormControl({ value: '0.00', disabled: true }),
                'txtTotalAnticipos': new FormControl({ value: '0.00', disabled: true }),
                'txtSumatoriaIsc': new FormControl({ value: '0.00', disabled: true }),
                'txtSumatoriaIgv': new FormControl({ value: '0.00', disabled: true }),
                'txtSubTotal': new FormControl({ value: '0.00', disabled: true }),
                'txtDetraccion': new FormControl({ value: '0.00', disabled: true }),
                'txtImporteTotal': new FormControl({ value: '0.00', disabled: true }),
            }
        );
    }
    public setDetalleTotales() {
        this.vistaPreviaFormGroup.controls['txtOperacionesGrabadas'].setValue(this.formatearNumeroADecimales( this.comprobante.montoGravadas));
        this.vistaPreviaFormGroup.controls['txtOperacionesExoneradas'].setValue(this.formatearNumeroADecimales( this.comprobante.montoExoaneradas));
        this.vistaPreviaFormGroup.controls['txtOperacionesInafectas'].setValue(this.formatearNumeroADecimales( this.comprobante.montoInafectas));
        this.vistaPreviaFormGroup.controls['txtTotalDescuentos'].setValue(this.formatearNumeroADecimales(this.comprobante.totalDescuentos));
        this.vistaPreviaFormGroup.controls['txtTotalAnticipos'].setValue(this.formatearNumeroADecimales(this.comprobante.totalAnticipos));
        this.vistaPreviaFormGroup.controls['txtSumatoriaIsc'].setValue(this.formatearNumeroADecimales(this.comprobante.sumaIsc));
        this.vistaPreviaFormGroup.controls['txtSumatoriaIgv'].setValue(this.formatearNumeroADecimales(this.comprobante.sumaIgv));
        this.vistaPreviaFormGroup.controls['txtSubTotal'].setValue(this.formatearNumeroADecimales(this.comprobante.subTotal));
        this.vistaPreviaFormGroup.controls['txtImporteTotal'].setValue(this.formatearNumeroADecimales(this.comprobante.importeTotal));
        this.vistaPreviaFormGroup.controls['txtDetraccion'].setValue(this.formatearNumeroADecimales(this.comprobante.detraccion));
        this.vistaPreviaFormGroup.controls['txtSumatoriaOtrosCargos'].setValue(this.formatearNumeroADecimales(this.comprobante.sumaOtrosCargos));
        this.vistaPreviaFormGroup.controls['txtSumatoriaOtrosTributos'].setValue(this.formatearNumeroADecimales(this.comprobante.sumaOtrosTributos));
    }
    public formatearNumeroADecimales(valor: number, numeroDecimales = 2): string {
        return valor.toFixed(numeroDecimales);
    }

    public getFacturaVistaPrevia() {
        this.comprobante = this._persistencia.getFactura();
        console.log('COMPROBANTE');
        console.log(this.comprobante);
        this.listaItemsFactura = this.comprobante.detalleEbiz;
        this.getDocumentosRelacionados();

    }
    public getDocumentosRelacionados() {
        this.listaDocumentosReferencia = this._persistencia.getDocumentosReferencia();
    }
    private obtenerParametros() {
        this.titulo = this.route.snapshot.data['titulo'];
        this.tipoAccion = this.route.snapshot.data['tipoAccion'];
        this.tipoDocumento = this.route.snapshot.data['tipoDocumento'];
        let sub = this.route
            .params
            .subscribe(params => {
                this.idComporbante = +params['id'];
            });
        this.setTipoVistaPrevia();
    }
    public setTipoVistaPrevia() {
        switch (this.tipoAccion) {
            case 1: this.vistaPreviaFlag = false;
                break;
        }
        switch (this.tipoDocumento) {
            case this._tipos.TIPO_DOCUMENTO_FACTURA:
                this.flagFactura = true;
                this._translate.get('facturaElectronica').subscribe(
                    data =>
                        this.tituloComprobante = data
                );
                break;
            case this._tipos.TIPO_DOCUMENTO_BOLETA:
                this.flagFactura = false;
                this._translate.get('boletaElectronica').subscribe(
                    data =>
                        this.tituloComprobante = data
                );
                break;
        }
    }
    public regresar() {
        this._refresh.CargarPersistencia = true;
        switch (this.tipoDocumento) {
            case this._tipos.TIPO_DOCUMENTO_FACTURA:
                this.router.navigateByUrl(this._rutas.URL_COMPROBANTE_FACTURA_CREAR);
                break;
            case this._tipos.TIPO_DOCUMENTO_BOLETA:
                this.router.navigateByUrl(this._rutas.URL_COMPROBANTE_BOLETA_CREAR);
                break;
        }
    }

    public emitir() {
        this.setJSONComprobante();
        switch (this.tipoDocumento) {
            case this._tipos.TIPO_DOCUMENTO_FACTURA:
                this._creacionComprobantes.crearFactura(this.comprobante).subscribe(
                    data => {
                        if (data !== null) {
                            console.log(data);
                            this._persistencia.setPersistenciaSimple<ComprobanteEmitido>( 'comprobanteEmitido', data);
                            this._persistencia.removePersistenciaSimple('factura');
                            this._persistencia.removePersistenciaSimple('listaProductos');
                            this._persistencia.removePersistenciaSimple('cabeceraFactura');
                            this._persistencia.removePersistenciaSimple('listaConsultaDocumentosRelacionados');
                            this._persistencia.removePersistenciaSimple('UUIDConsultaComprobante');
                            this._persistencia.removePersistenciaSimple('tipoComprobanteCodigo');
                            this._persistencia.removePersistenciaSimple('entidad');
                            this._persistencia.removePersistenciaSimple('checkFacturaAnticipo');
                            this._persistencia.removePersistenciaSimple('documentosReferenciaTemporal');
                            this._persistencia.removePersistenciaSimple('documentosReferencia');
                            this.router.navigate([this._rutas.URL_COMPROBANTE_FACTURA_EMITIR, data.id]);
                        }
                    }
                );
                break;
            case this._tipos.TIPO_DOCUMENTO_BOLETA:
                this._creacionComprobantes.crearBoleta(this.comprobante).subscribe(
                    data => {
                        if (data !== null) {
                            console.log(data);
                            this._persistencia.setPersistenciaSimple<ComprobanteEmitido>( 'comprobanteEmitido', data);
                            this._persistencia.removePersistenciaSimple('factura');
                            this._persistencia.removePersistenciaSimple('boleta');
                            this._persistencia.removePersistenciaSimple('listaProductos');
                            this._persistencia.removePersistenciaSimple('cabeceraFactura');
                            this._persistencia.removePersistenciaSimple('listaConsultaDocumentosRelacionados');
                            this._persistencia.removePersistenciaSimple('UUIDConsultaComprobante');
                            this._persistencia.removePersistenciaSimple('tipoComprobanteCodigo');
                            this._persistencia.removePersistenciaSimple('entidad');
                            this._persistencia.removePersistenciaSimple('checkFacturaAnticipo');
                            this._persistencia.removePersistenciaSimple('documentosReferenciaTemporal');
                            this._persistencia.removePersistenciaSimple('documentosReferencia');
                            this.router.navigate([this._rutas.URL_COMPROBANTE_BOLETA_EMITIR, data.id]);
                        }
                    }
                );
                break;
        }
    }
    public setJSONComprobante() {
        //  AQUI CONVERTIR A STRING LOS CAMPOS QUE ESTAN COMO NUMBER
        console.log('FACTURA');
        console.log(this.cabeceraDatosFactura);
        console.log(this.comprobante);
        let jsonFactura: FacturaEbiz = new FacturaEbiz();
        jsonFactura.importeReferencial = this.comprobante.importeReferencial;
        jsonFactura.totalComprobante = this.comprobante.totalComprobante;
        jsonFactura.idSerie = this.comprobante.idSerie;
        jsonFactura.numeroComprobante = this.comprobante.numeroComprobante;
        jsonFactura.rucProveedor = this.comprobante.rucProveedor;
        jsonFactura.rucComprador = this.comprobante.rucComprador;
        jsonFactura.idTablaTipoComprobante = this.comprobante.idTablaTipoComprobante;
        jsonFactura.idTipoComprobante = this.comprobante.idTipoComprobante;
        jsonFactura.idRegistroTipoComprobante = this.comprobante.idRegistroTipoComprobante;
        jsonFactura.razonSocialProveedor = this.comprobante.razonSocialProveedor;
        jsonFactura.razonSocialComprador = this.comprobante.razonSocialComprador;
        jsonFactura.observacionComprobante = this.comprobante.observacionComprobante;
        jsonFactura.tipoComprobante = this.comprobante.tipoComprobante;
        jsonFactura.montoPagado = this.comprobante.montoPagado;
        jsonFactura.igv = this.comprobante.igv;
        jsonFactura.isc = this.comprobante.isc;
        jsonFactura.otrosTributos = this.comprobante.otrosTributos;
        jsonFactura.descuento = this.comprobante.descuento;
        jsonFactura.subtotalComprobante = this.comprobante.subtotalComprobante;
        jsonFactura.tipoItem = this.comprobante.tipoItem;
        jsonFactura.moneda = this.comprobante.moneda;
        jsonFactura.idTablaMoneda = this.comprobante.idTablaMoneda;
        jsonFactura.idRegistroMoneda = this.comprobante.idRegistroMoneda;
        jsonFactura.fechaEmision = this.comprobante.fechaEmision;
        jsonFactura.fechaVencimiento = this.comprobante.fechaVencimiento;
        jsonFactura.porcentajeImpuesto = this.comprobante.porcentajeImpuesto;
        jsonFactura.usuarioCreacion = this.comprobante.usuarioCreacion;
        jsonFactura.usuarioModificacion = this.comprobante.usuarioModificacion;
        jsonFactura.detalleEbiz = this.comprobante.detalleEbiz;
        for (let a = 0; a < this.comprobante.detalleEbiz.length; a++) {
            let detalleEbiz = new DetalleEbiz();
            detalleEbiz.descripcionItem = this.comprobante.detalleEbiz[a].descripcionItem;
            detalleEbiz.codigoUnidadMedida = this.comprobante.detalleEbiz[a].codigoUnidadMedida;
            detalleEbiz.posicion = this.comprobante.detalleEbiz[a].posicion;
            detalleEbiz.codigoItem = this.comprobante.detalleEbiz[a].codigoItem;
            detalleEbiz.precioUnitario = this.comprobante.detalleEbiz[a].precioUnitario;
            detalleEbiz.precioTotal = this.comprobante.detalleEbiz[a].precioTotal;
            detalleEbiz.cantidad = this.comprobante.detalleEbiz[a].cantidad;
            detalleEbiz.montoImpuesto = this.comprobante.detalleEbiz[a].montoImpuesto;
            detalleEbiz.idRegistroUnidad = this.comprobante.detalleEbiz[a].idRegistroUnidad;
            detalleEbiz.idTablaUnidad = this.comprobante.detalleEbiz[a].idTablaUnidad;

            detalleEbiz.detalle.idTipoIgv = this.comprobante.detalleEbiz[a].detalle.idTipoIgv;
            detalleEbiz.detalle.idTipoIsc = this.comprobante.detalleEbiz[a].detalle.idTipoIsc;
            detalleEbiz.detalle.codigoTipoIgv = this.comprobante.detalleEbiz[a].detalle.codigoTipoIgv;
            detalleEbiz.detalle.descripcionTipoIgv = this.comprobante.detalleEbiz[a].detalle.descripcionTipoIgv;
            detalleEbiz.detalle.codigoTipoIsc = this.comprobante.detalleEbiz[a].detalle.codigoTipoIsc;
            detalleEbiz.detalle.descripcionTipoIsc = this.comprobante.detalleEbiz[a].detalle.descripcionTipoIsc;
            detalleEbiz.detalle.idTipoPrecio = this.comprobante.detalleEbiz[a].detalle.idTipoPrecio;
            detalleEbiz.detalle.codigoTipoPrecio = this.comprobante.detalleEbiz[a].detalle.codigoTipoPrecio;
            detalleEbiz.detalle.descripcionTipoPrecio = this.comprobante.detalleEbiz[a].detalle.descripcionTipoPrecio;
            detalleEbiz.detalle.idProducto = this.comprobante.detalleEbiz[a].detalle.idProducto;
            detalleEbiz.detalle.numeroItem = this.comprobante.detalleEbiz[a].detalle.numeroItem;
            detalleEbiz.detalle.unidadMedida = this.comprobante.detalleEbiz[a].detalle.unidadMedida;
            detalleEbiz.detalle.subtotalVenta = this.comprobante.detalleEbiz[a].detalle.subtotalVenta;
            detalleEbiz.detalle.subtotalIgv = this.comprobante.detalleEbiz[a].detalle.subtotalIgv;
            detalleEbiz.detalle.subtotalIsc = this.comprobante.detalleEbiz[a].detalle.subtotalIsc;
            detalleEbiz.detalle.precioUnitarioVenta = this.comprobante.detalleEbiz[a].detalle.precioUnitarioVenta;
            detalleEbiz.detalle.descuento = this.comprobante.detalleEbiz[a].detalle.descuento;

            this.comprobante.detalleEbiz[a] = new DetalleEbiz();
            this.comprobante.detalleEbiz[a] = detalleEbiz;
        }
        jsonFactura.documentoEntidad = this.comprobante.documentoEntidad;
        jsonFactura.documentoConcepto = this.comprobante.documentoConcepto;
        jsonFactura.documentoParametro = this.comprobante.documentoParametro;
        jsonFactura.documentoReferencia = this.comprobante.documentoReferencia;

        this.comprobante = new FacturaEbiz();
        this.comprobante = jsonFactura;

    }
    iniciarData(event) {
        this.tabla.insertarData(this.listaItemsFactura);
    }
    public modalMensajeSimple(titulo: string, mensaje: string, tipoAlerta: string, botonLabel = this.labelSi) {
        swal({
            title: titulo,
            html:
                '<div class="text-center"> ' + mensaje + '</div>',
            type: tipoAlerta,
            confirmButtonText: botonLabel,
            confirmButtonClass: 'btn btn-warning',
        });
    }
    public obtenerFecha(actualTimestamp: string): string {
        const dateConvertido = new Date(Number(actualTimestamp));
        const dia = dateConvertido.getDate();
        const mes = dateConvertido.getMonth() + 1;
        const anio = dateConvertido.getFullYear();
        return anio + '-' + this.ponerCeros(mes, 2) + mes + '-' + this.ponerCeros(dia, 2) + dia;
    }
    ponerCeros(numero: number, cantidadZeros: number) {
        return '0'.repeat(cantidadZeros - numero.toString().length);
      }

}
