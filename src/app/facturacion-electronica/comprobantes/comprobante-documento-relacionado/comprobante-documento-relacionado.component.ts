import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DtoOutTipoComprobante } from '../models/dtoOutTipoComprobante';
import { GuiaFiltros } from '../models/guia';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { RutasService } from '../../general/utils/rutas.service';
import { TiposService } from '../../general/utils/tipos.service';
import { PersistenciaService } from '../services/persistencia.service';
import { DataTableComponent } from '../../general/data-table/data-table.component';
import { ConsultaDocumentoRelacionado } from '../../general/models/consultaDocumentoRelacionado';
import { Accion, Icono } from '../../general/data-table/utils/accion';
import { TipoAccion } from '../../general/data-table/utils/tipo-accion';
import { ModoVistaAccion } from '../../general/data-table/utils/modo-vista-accion';
import { DetalleEbiz } from '../models/detalleEbiz';
import { DocumentoReferencia } from '../models/documentoReferencia';
import { element } from 'protractor';
import { FacturaEbiz } from 'app/facturacion-electronica/comprobantes/models/facturaEbiz';
import { TranslateService } from '@ngx-translate/core';
import {PadreComprobanteService} from '../services/padre-comprobante.service';
import { RefreshService } from 'app/facturacion-electronica/general/services/refresh.service';
import {ColumnaDataTable} from '../../general/data-table/utils/columna-data-table';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}
  declare var $, swal, await: any;
@Component({
    selector:       'app-comprobante-documento-relacionado',
    templateUrl:    'comprobante-documento-relacionado.component.html',
    styleUrls:      ['comprobante-documento-relacionado.css']
})
export class ComprobanteDocumentoRelacionadoComponent implements OnInit, AfterViewInit {

    public url: number;
    public titulo: string;
    public tipoDocumento: string;
    public labelBotonGenericoDataTable: string;
    public tituloModalFacturaAnticipo: string;
    public montoUsarModal: string;
    public ordenarPorElCampoTipoComprobante: string;
    public estadoItem: boolean;
    public esFactura: boolean;
    public flagComprobante: boolean;
    public flagItems: boolean;
    public documentoRelacionadoFormGroup: FormGroup;

    public columnasTabla: ColumnaDataTable[];
    public igvPorcentaje: number;

    public dtoComprobantes: DtoOutTipoComprobante[] = [];
    public itemEditarDocumentoReferencia: DocumentoReferencia = new DocumentoReferencia();
    public itemsDocumentoRelacionado: DocumentoReferencia[] = [];
    public AccionesDocumentoRelacionado: Accion[] = [
        new Accion('editar', new Icono('visibility', 'btn-info'), TipoAccion.EDITAR)
    ];
    public tipoAccion: any = ModoVistaAccion.ICONOS;
    @ViewChild('tablaDocumentoRelacionado') tablaDocumentoRelacionado: DataTableComponent<DocumentoReferencia>;

    constructor(
                    private _router: Router,
                    private _route: ActivatedRoute,
                    private _http: HttpClient,
                    private _tipos: TiposService,
                    private _rutas: RutasService,
                    private _persistencia: PersistenciaService,
                    public _translateService: TranslateService,
                    private _padreComprobanteService: PadreComprobanteService,
                    private _refresh: RefreshService) {
        this._translateService.get('agregarComprobante').subscribe(
            data => {
                this.labelBotonGenericoDataTable = data;
            }
        );
        this.tituloModalFacturaAnticipo = 'Ingresar el importe a usar de la Factura de Anticipo';
        this.titulo = 'Documento Relacionado';
        this.estadoItem = true;
        this.flagComprobante = false;
        this.igvPorcentaje = 18;
        this.ordenarPorElCampoTipoComprobante = 'nombreTipoDocumento';
        this.flagItems = true;
    }
    ngOnInit() {
        this._padreComprobanteService.actualizarComprobante(this._route.snapshot.data['codigo'], this._route.snapshot.data['mostrarCombo']);
        this.obtenerParametros();
        this.initForm();
      this.columnasTabla = [
        new ColumnaDataTable('comprobante', 'nombreTipoDocumento'),
        new ColumnaDataTable('serie', 'serieDocumentoDestino'),
        new ColumnaDataTable('numeroCorrelativo', 'correlativoDocumentoDestino'),
        new ColumnaDataTable('importeTotal', 'totalImporteDestino', {'text-align': 'right'}),
        new ColumnaDataTable('importeUsar', 'anticipo', {'text-align': 'right'})
      ];
    }

    ngAfterViewInit() {
    }
    private initForm() {
        this.documentoRelacionadoFormGroup = new FormGroup({
            'cmbComprobante': new FormControl({value: '', disabled: true}, [Validators.required]),
            'cmbSerie': new FormControl({value: '', disabled: true}, [Validators.required]),
            'txtNumeroCorrelativo': new FormControl({value: '', disabled: true}, [Validators.required]),
            'txtImporteTotal': new FormControl({value: '', disabled: true}, [Validators.required]),
            'txtImporteAUsar': new FormControl({value: '', disabled: true} ,
                        [
                            Validators.required,
                            Validators.pattern('[0-9]+[.][0-9]{2}')
                        ])
        });
        // this.documentoRelacionadoFormGroup.controls['tipoComprobante'].disable();
    }
    public  regresar() {
        this._refresh.CargarPersistencia = true;
        const listaLocalDocumentoRelacionado: DocumentoReferencia [] =
            this._persistencia.getPersistenciaSimple('documentosReferenciaTemporal');
        this._persistencia.setListaDocumentosReferenciaSinValidacion(listaLocalDocumentoRelacionado);
        switch ( this.tipoDocumento ) {
            case this._tipos.TIPO_DOCUMENTO_BOLETA:
                this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_BOLETA_CREAR );
                break;
            case this._tipos.TIPO_DOCUMENTO_FACTURA:
                this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_CREAR );
                break;
        }
        // this._persistencia.removeItemFacturaDocumentoRelacionado();
        // this._persistencia.removeDocumentosReferencia();
        // const listaLocalDocumentoRelacionado = this._persistencia.getDocumentosReferencia();
        // this.itemsDocumentoRelacionado = this.tablaDocumentoRelacionado.getData();
        // for (let a = 0; a < this.itemsDocumentoRelacionado.length; a++ ) {
        //     if (this.itemsDocumentoRelacionado[a].estadoTemporal === false) {
        //         this.itemsDocumentoRelacionado.splice(a, 1);
        //         a--;
        //     }
        // }
    }
    public guardar() {
            this._refresh.CargarPersistencia = true;
            this.itemsDocumentoRelacionado = this.tablaDocumentoRelacionado.getData();
            if (this.itemsDocumentoRelacionado.length > 0) {
                for ( let a = 0 ; a < this.itemsDocumentoRelacionado.length ; a++ ) {
                    if ( this.itemsDocumentoRelacionado[a].anticipo === '0.00' ) {
                        this.modalMensajeSimple('Alerta', 'Hay documentos seleccionados sin un monto a usar.', 'warning', 'CONTINUAR', '#ff9800');
                        return;
                    }
                }
                for ( let a = 0; a < this.itemsDocumentoRelacionado.length ; a++ ) {
                    this.itemsDocumentoRelacionado[a].estadoTemporal = true;
                }
                this._persistencia.setListaDocumentosReferenciaSinValidacion(this.itemsDocumentoRelacionado);
                let comprobante = new FacturaEbiz();
                comprobante = this._persistencia.getFactura();
                comprobante.documentoReferencia = this.itemsDocumentoRelacionado;
                this._persistencia.setFactura(comprobante);
                this.modalMensajeSimple('Acción Exitosa', 'Los comprobantes fueron agregados correctamente.', 'success', 'CONTINUAR');
                switch ( this.tipoDocumento ) {
                    case this._tipos.TIPO_DOCUMENTO_BOLETA:
                        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_BOLETA_CREAR );
                        break;
                    case this._tipos.TIPO_DOCUMENTO_FACTURA:
                        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_CREAR );
                        break;
                }
            } else {
                this._persistencia.setListaDocumentosReferenciaSinValidacion(this.itemsDocumentoRelacionado);
                let comprobante = new FacturaEbiz();
                comprobante = this._persistencia.getFactura();
                comprobante.documentoReferencia = this.itemsDocumentoRelacionado;
                this._persistencia.setFactura(comprobante);
                this.modalMensajeSimple('Acción Exitosa', 'Los comprobantes fueron agregados correctamente.', 'success', 'CONTINUAR');
                switch ( this.tipoDocumento ) {
                    case this._tipos.TIPO_DOCUMENTO_BOLETA:
                        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_BOLETA_CREAR );
                        break;
                    case this._tipos.TIPO_DOCUMENTO_FACTURA:
                        this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_CREAR );
                        break;
                }
            }
    }
    public limpiarFormulario() {
        this.documentoRelacionadoFormGroup.reset();
        setTimeout(function () {
            $('input').each(function () {
                $(this.parentElement).addClass('is-empty');
            });
            $('select').each(function () {
                $(this.parentElement).addClass('is-empty');
            });
        }, 200);
    }
    public navigate(nav) {
        this._router.navigate(nav, { relativeTo: this._route });
    }
    private obtenerParametros() {
        this.tipoDocumento = this._route.snapshot.data['tipoDocumento'];
        this.setTipoDocumento();
    }
    private setTipoDocumento() {
        switch ( this.tipoDocumento ) {
            case this._tipos.TIPO_DOCUMENTO_BOLETA:
                                                    this.esFactura = false;
                                                    break;
            case this._tipos.TIPO_DOCUMENTO_FACTURA:
                                                    this.esFactura = true;
                                                    break;
        }
    }
    public eliminar(lista: DocumentoReferencia[]) {
        //  this.tablaDocumentoRelacionado.insertarData(lista);
        //  this._persistencia.setListaDocumentosReferenciaSinValidacion(lista);
        // const listota = this._persistencia.getDocumentosReferencia();
        // if ( listota.length === 0 ) {
        //     this.flagItems = true;
        // }
    }
    iniciarData(event) {
      this.cargarItemDocumentoRelacionado();
    }
    public cargarItemDocumentoRelacionado() {
        this.itemsDocumentoRelacionado = this._persistencia.getDocumentosReferencia();
        console.log(this.itemsDocumentoRelacionado);
        this.flagItems = true;
        if ( this.itemsDocumentoRelacionado.length > 0 ) {
            this.tablaDocumentoRelacionado.insertarData( this.itemsDocumentoRelacionado );
            this.flagItems = false;
        }
    }
    public editarItem() {
            const montoFactura =
                Number (this.formatearNumeroADecimales( Number ( this.itemEditarDocumentoReferencia.totalImporteDestino )));
            const montoAnticipoFactura = this.formatearNumeroADecimales( Number ( this.itemEditarDocumentoReferencia.anticipo ));
            let titulo: string;
            let nombreBotonAgregar: string;
            let nombreBotonRegresar: string;
            let montoFacturaAnticipoLabel: string;
            let formatoMontoSwal: string;
            this._translateService.get('agregar').subscribe(data => nombreBotonAgregar = data);
            this._translateService.get('regresar').subscribe(data => nombreBotonRegresar = data);
            this._translateService.get('editarImporteItem').subscribe(data => titulo = data);
            this._translateService.get('formatoMontoSwalLabel').subscribe(data => formatoMontoSwal = data);
            if (this.tipoDocumento === this._tipos.TIPO_DOCUMENTO_FACTURA) {
                this._translateService.get('ingreseMontoFacturaAnticipo').subscribe(data => montoFacturaAnticipoLabel = data);
            } else {
                this._translateService.get('ingreseMontoBoletaAnticipo').subscribe(data => montoFacturaAnticipoLabel = data);
            }
            const that = this;
            swal({
            title: titulo,
            html: '<div class="form-group label-floating" xmlns="http://www.w3.org/1999/html">' +
                    '<label class="control-label">' + montoFacturaAnticipoLabel + '<span class="star">*</span> </label>' +
                    '<input id="montoDocumentoRelacionado" type="text" class="form-control" value=' + montoAnticipoFactura + '> ' +
                    '<label>' + formatoMontoSwal + '</label>' +
            '</div>',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: nombreBotonAgregar,
            showLoaderOnConfirm: true,
            confirmButtonColor: '#2399e5',
            cancelButtonText: nombreBotonRegresar,
            cancelButtonColor: '#2399e5',
            preConfirm: () => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    let bandera = 0;
                    const regExp = /([0-9,]{1,9})|([.]([0-9]{2}))/g;
                    let montoDocumentoRelacionado = $('#montoDocumentoRelacionado').val();
                    montoDocumentoRelacionado = montoDocumentoRelacionado.split(',');
                    const montoDocumentoRelacionadoInvalidos = montoDocumentoRelacionado.filter(function(monto){
                      if (!regExp.test(monto)) {
                        bandera = 1;
                        return true;
                      } else {
                        if (Number(monto) <= 0 ) {
                          bandera = 2;
                          return true;
                        }
                        return false;
                      }
                    });
                    if (bandera){
                      switch(bandera) {
                        case 1: swal.showValidationError(), reject(new Error('Formato Inválido'));
                                break;
                        case 2: swal.showValidationError(), reject(new Error('Monto Inválido'));
                                break;
                      }
                    } else {
                      resolve(montoDocumentoRelacionado);
                    }
                  }, 500);
                });
              },
        }).then((result) => {
            if (montoFactura < Number(result)) {
                swal({
                    type: 'warning',
                    title: 'Alerta',
                    html:
                      '<div class="text-center">' +
                      ' Monto a usar ingresado inválido, el monto a usar debe ser menor o igual al monto de la factura de anticipo. ' +
                      '</div>',
                    confirmButtonText: 'CONTINUAR',
                    confirmButtonColor: '#ff9800'
                });
            } else {
                const index = that.findIndexPorUuid(that.itemEditarDocumentoReferencia);
                this.itemsDocumentoRelacionado = this.tablaDocumentoRelacionado.getData();
                //  this.itemEditarDocumentoReferencia.totalImporteDestino = that.formatearNumeroADecimales(Number(result));
                this.itemsDocumentoRelacionado[index].anticipo = that.formatearNumeroADecimales(Number(result));
                //  this._persistencia.editarItemDocumentoRelacionado( this.itemEditarDocumentoReferencia );
                this.modalMensajeSimple('Correcto', 'Item Editado Correctamente', 'success', 'Ok');
                that.tablaDocumentoRelacionado.insertarData( this.itemsDocumentoRelacionado );
                swal({
                    type: 'success',
                    title: 'Acción Exitosa',
                    confirmButtonText: 'CONTINUAR',
                    confirmButtonColor: '#4caf50'
                });
            }
        });
    }
    public findIndexPorUuid(item: DocumentoReferencia) {
        this.itemsDocumentoRelacionado = this.tablaDocumentoRelacionado.getData();
        for (let a = 0 ; a < this.itemsDocumentoRelacionado.length ; a++) {
            if (this.itemsDocumentoRelacionado[a].idDocumentoDestino === item.idDocumentoDestino) {
                return a;
            }
        }
    }
    public formatearNumeroADecimales(valor: number, numeroDecimales = 2): string {
        return valor.toFixed(numeroDecimales);
      }
    public ejecutarAccion(evento: [TipoAccion, DocumentoReferencia]) {
        const accion = evento[0];
        let itemSeleccionado: DocumentoReferencia = new DocumentoReferencia();
        itemSeleccionado = evento[1];
        this.itemEditarDocumentoReferencia = itemSeleccionado;
        console.log('ITEM DOCUMENTO REFERENCIA');
        console.log(itemSeleccionado);
        switch ( accion ) {
            case TipoAccion.EDITAR:
                this.editarItem();
                break;
        }
    }
    public validaItemExistenteGuiaRemision( item: DetalleEbiz ) {
        let itemValidacion: DetalleEbiz = new DetalleEbiz();
        itemValidacion = this._persistencia.validarCodigoItem( item.codigoItem );
        if ( itemValidacion ) {
            this.modalItemExistenteGuiaRemision( item, itemValidacion );
        } else {
            this._persistencia.agregarProducto( item );
        }
    }
    public modalItemExistenteGuiaRemision( item: DetalleEbiz, itemValidacion: DetalleEbiz ) {
        const that = this;
        swal(
            {
                title: 'Advertencia',
                text: 'El comprobante ya tiene un item con el codigo ' + item.codigoItem + ' ( '
                        + item.descripcionItem + ' ). Desea Reemplazarlo?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Reemplazar'
            }
        )
        .then(function (result) {
            if (result) {
                that._persistencia.eliminarItem( itemValidacion );
                that._persistencia.agregarProducto( itemValidacion );
                swal(
                    'Confirmacion',
                    'El item se ingreso correctamente.',
                    'success'
                );
            }   else {
                console.log('Cancelado');
            }
        }
        );
    }

    public cargarItemsGuiaRemision(): DetalleEbiz[] {
        let lista: DetalleEbiz[] = [];
        lista = [
            new DetalleEbiz(),
            new DetalleEbiz()
        ];
        return lista;
    }
    public validarMontoImporte() {
        let importeAUsar: number;
        let importeTotal: number;
        if ( this.documentoRelacionadoFormGroup.controls['txtImporteAUsar'].valid ) {
            importeAUsar = Number (this.documentoRelacionadoFormGroup.controls['txtImporteAUsar'].value);
            importeTotal = Number (this.documentoRelacionadoFormGroup.controls['txtImporteTotal'].value);
            console.log( importeAUsar + ' <= ' + importeTotal );
            if ( importeAUsar <= importeTotal && importeAUsar !== 0) {
                console.log( 'TRUE' );
                this.flagComprobante = true;
            } else {
                this.flagComprobante = false;
            }
            console.log( this.flagComprobante );
            console.log( !this.documentoRelacionadoFormGroup.valid );
            console.log( this.flagComprobante && (!this.documentoRelacionadoFormGroup.valid) );
        } else {
            this.flagComprobante = false;
        }
    }
    public eventoGenerico(data) {
        let listaElementos: DocumentoReferencia[] = [];
        switch ( this.tipoDocumento ) {
            case this._tipos.TIPO_DOCUMENTO_BOLETA:
                listaElementos = this.tablaDocumentoRelacionado.getData();
                this._persistencia.setListaDocumentosReferenciaSinValidacion(listaElementos);
                this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_BOLETA_DOCUMENTO_RELACIONADO_BUSCAR );
                break;
            case this._tipos.TIPO_DOCUMENTO_FACTURA:
                listaElementos = this.tablaDocumentoRelacionado.getData();
                this._persistencia.setListaDocumentosReferenciaSinValidacion(listaElementos);
                this._router.navigateByUrl( this._rutas.URL_COMPROBANTE_FACTURA_DOCUMENTO_RELACIONADO_BUSCAR );
                break;
        }
    }
    public eliminarEstiloInput(idHtml: string, estilo: string) {
        setTimeout(function () {
            $('#' + idHtml).parent().removeClass(estilo);
        }, 200);
    }
    public modalMensajeSimple(titulo: string, mensaje: string, tipoAlerta: string, botonLabel = 'CONTINUAR', colorButton = '#4caf50' ) {
        swal({
            title: titulo,
            html:
              '<div class="text-center"> ' + mensaje + '</div>',
            type: tipoAlerta,
            confirmButtonText: botonLabel,
            confirmButtonColor: colorButton
        });
    }
}
