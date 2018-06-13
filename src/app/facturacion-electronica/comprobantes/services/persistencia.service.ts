import { Injectable } from '@angular/core';
import { PersistenceService, StorageType } from 'angular-persistence';
import { ConsultaDocumentoRelacionado } from '../../general/models/consultaDocumentoRelacionado';
import { TiposService } from '../../general/utils/tipos.service';
import { CabeceraFactura } from '../models/cabeceraFactura';
import { fail } from 'assert';
import { DetalleEbiz } from 'app/facturacion-electronica/comprobantes/models/detalleEbiz';
import { DocumentoReferencia } from 'app/facturacion-electronica/comprobantes/models/documentoReferencia';
import { FacturaEbiz } from 'app/facturacion-electronica/comprobantes/models/facturaEbiz';

@Injectable()
export class PersistenciaService {

    public lista: DetalleEbiz[] = [];
    public factura: DetalleEbiz;
    public listaConsultaDocumentoRelacionado: ConsultaDocumentoRelacionado[] = [];
    constructor (
        private persistenceService: PersistenceService,
        private _tipos: TiposService
    ) {
        this.factura =  new DetalleEbiz();
    }
    /**
     * Método que establece el estado de una factura de anticipo
     * @param check estado de factura anticipo
     */
    public setEstadoFacturaAnticipo(check: boolean) {
        this.persistenceService.remove('checkFacturaAnticipo', StorageType.LOCAL);
        this.persistenceService.set('checkFacturaAnticipo', check,  {type: StorageType.LOCAL, timeout: 3600000}, );
    }
    /**
     * Método que devuelve el estado de una factura de anticipo
     */
    public getEstadoFacturaAnticipo(): boolean {
        let estado: boolean;
        estado = this.persistenceService.get('checkFacturaAnticipo', StorageType.LOCAL);
        if (estado === undefined) {
            return null;
        }
        return estado;
    }

    public agregarProducto( item: DetalleEbiz ) {
        this.lista = this.getListaProductos();
        item.id = this.lista.length;
        this.lista.push( item );
        this.persistenceService.remove('listaProductos', StorageType.LOCAL);
        this.persistenceService.set('listaProductos', this.lista,  {type: StorageType.LOCAL, timeout: 3600000}, );
    }
    public editarProducto( item: DetalleEbiz, posicion: number ) {
        this.lista = this.getListaProductos();
        if ( this.lista.length == 0 ) {
            return;
        }
        item.id = this.lista[ posicion ].id;
        this.lista[ posicion ] = item;
        this.persistenceService.remove('listaProductos', StorageType.LOCAL);
        this.persistenceService.set('listaProductos', this.lista,  {type: StorageType.LOCAL}, );
    }
    public getListaProductos(): DetalleEbiz[] {
        let lista: DetalleEbiz[];
        lista = this.persistenceService.get('listaProductos', StorageType.LOCAL);
        if ( lista == undefined ) {
            return [];
        }
        return lista;
    }
    public mostrar() {
    }
    public eliminarListaItemsFactura() {
        this.persistenceService.remove('listaProductos', StorageType.LOCAL);
    }
    public eliminar( listaTmp: DetalleEbiz[] ) {
        this.persistenceService.remove('listaProductos', StorageType.LOCAL);
        listaTmp = this.reordenarLista( listaTmp );
        this.persistenceService.set('listaProductos', listaTmp,  {type: StorageType.LOCAL});
    }
    public eliminarItem( item: DetalleEbiz ) {
        let lista: DetalleEbiz[] = new Array<DetalleEbiz>();
        lista = this.getListaProductos();
        lista = this.reordenarListaItemsFacturaEliminacion( item );
        this.setListaProductos( lista );
        this.reordenarLista(lista);
        if ( !(lista == null) ) {
            this.eliminarListaItemsFactura();
            this.setListaProductos( lista );
        }

    }
    public reordenarListaItemsFacturaEliminacion( itemEliminar: DetalleEbiz ): DetalleEbiz[] {
        let listaItems: DetalleEbiz[] = [];
        listaItems = this.getListaProductos();
        for ( let a = itemEliminar.id ; a < listaItems.length - 1 ; a++ ) {
            listaItems[a] = listaItems[a + 1];
        }
        listaItems.pop();
        return listaItems;
    }
    public reordenarLista( listaTmp: DetalleEbiz[] ): DetalleEbiz[] {
        let posicion: number;
        for ( let a = 0 ; a < listaTmp.length ; a++ ) {
            if ( listaTmp[a].id != this.lista[a].id ) {
                posicion = a;
                break;
            }
        }
        for ( let a = posicion ; a < listaTmp.length ; a++ ) {
            listaTmp[a].id = a;
        }
        return listaTmp;
    }
    public getItemProducto( index: number ): DetalleEbiz {
        this.lista = this.getListaProductos();
        return this.lista[index];
    }
    public validarCodigoItem( codigo: string ): DetalleEbiz {
        let lista: DetalleEbiz[] = new Array<DetalleEbiz>();
        lista = this.getListaProductos();
        for ( let a = 0; a < lista.length ; a++ ) {
            if ( lista[a].codigoItem == codigo ) {
                return lista[a];
            }
        }
        return null;
    }

  /**
   * Método que valida que el código de producto ingresado no se repita, a excepcion de su mismo código
   * @param {string} codigo
   * @param {string} codigoActual
   * @returns {boolean} => true | codigo valido, false | codigo invalido
   */
    public validarCodigoItemEditar( codigo: string, codigoEditar: string ): boolean {
      let lista: DetalleEbiz[] = new Array<DetalleEbiz>();
      lista = this.getListaProductos();
      for ( let a = 0; a < lista.length ; a++ ) {
        if ( lista[a].codigoItem === codigo ) {
          if (codigo === codigoEditar) {
            return true;
          } else  {
            return false;
          }
        }
      }
      return true;
    }
    public setListaProductos( lista: DetalleEbiz[] ) {
        this.persistenceService.remove('listaProductos', StorageType.LOCAL);
        this.persistenceService.set('listaProductos', lista,  {type: StorageType.LOCAL, timeout: 3600000}, );
    }

    // Factura
    public setFactura( factura: FacturaEbiz ) {
        this.persistenceService.remove('factura', StorageType.LOCAL);
        this.persistenceService.set( 'factura', factura, { type: StorageType.LOCAL } );
    }
    public getFactura(): FacturaEbiz {
        let factura: FacturaEbiz;
        factura = new FacturaEbiz();
        factura = this.persistenceService.get('factura', StorageType.LOCAL);
        if ( factura == undefined ) {
            return null;
        }
        return factura;
    }
    // Documento Relacionado Factura
    public setItemacturaDocumentoRelacionado( item: ConsultaDocumentoRelacionado ) {
        this.setItemListaDocumentoRelacionado( item );
        switch ( item.tipoComprobante ) {
            case this._tipos.TIPO_DOCUMENTO_FACTURA_ANTICIPO:
                let itemFacturaAnticipo: DetalleEbiz = new DetalleEbiz();
                itemFacturaAnticipo.cantidad = '1';
                itemFacturaAnticipo.codigoItem = '000';
                itemFacturaAnticipo.descripcionItem = 'Factura Anticipo';
                itemFacturaAnticipo.detalle.unidadMedida = '';
                itemFacturaAnticipo.precioUnitario = item.importeAUsar;
                itemFacturaAnticipo.igv = 0.00;
                itemFacturaAnticipo.detalle.subtotalIsc = '0.00';
                itemFacturaAnticipo.detalle.descuento = '0.00';
                itemFacturaAnticipo.precioTotal = item.importeAUsar;
                itemFacturaAnticipo.tipoComprobante = this._tipos.TIPO_DOCUMENTO_FACTURA;
                itemFacturaAnticipo.tipoProducto = this._tipos.TIPO_PRODUCTO_SERVICIO;
                itemFacturaAnticipo.productoBase = this._tipos.TIPO_DOCUMENTO_FACTURA_ANTICIPO;
                this.agregarProducto( itemFacturaAnticipo );
                break;
            case this._tipos.TIPO_DOCUMENTO_GUIA_REMISION_REMITENTE:
                break;
        }
    }
    public setItemListaDocumentoRelacionado ( item: ConsultaDocumentoRelacionado ) {
        let listaDocumentosRelacionados: ConsultaDocumentoRelacionado[] = [];
        listaDocumentosRelacionados = this.getListaDocumentoRelacionados();
        listaDocumentosRelacionados.push( item );
        this.persistenceService.remove('listaDocumentosRelacionados', StorageType.LOCAL);
        this.persistenceService.set('listaDocumentosRelacionados', listaDocumentosRelacionados,
                            {type: StorageType.LOCAL, timeout: 3600000}, );

    }
    public removeItemFacturaDocumentoRelacionado() {
        this.persistenceService.remove('consultaDocumentoRelacionado', StorageType.LOCAL);
    }
    // Consultas
    public setItemConsultaDocumentoRelacionado( item: ConsultaDocumentoRelacionado ) {
        this.listaConsultaDocumentoRelacionado = this.getListaConsultaDocumentoRelacionados();
        item.id = this.lista.length;
        this.listaConsultaDocumentoRelacionado.push( item );

        this.persistenceService.remove('consultaDocumentoRelacionado', StorageType.LOCAL);
        this.persistenceService.set('consultaDocumentoRelacionado', item, {type: StorageType.LOCAL, timeout: 3600000} );

        this.persistenceService.remove('listaConsultaDocumentosRelacionados', StorageType.LOCAL);
        this.persistenceService.set('listaConsultaDocumentosRelacionados',
                                        this.listaConsultaDocumentoRelacionado, {type: StorageType.LOCAL, timeout: 3600000} );
    }
    public getItemDocumentoRelacionado() {
        let item: ConsultaDocumentoRelacionado;
        item = this.persistenceService.get('consultaDocumentoRelacionado', StorageType.LOCAL);
        if ( item == undefined ) {
            return null;
        }
        return item;
    }
    public getListaDocumentoRelacionados(): ConsultaDocumentoRelacionado[] {
        let lista: ConsultaDocumentoRelacionado[];
        lista = this.persistenceService.get('listaDocumentosRelacionados', StorageType.LOCAL);
        if ( lista == undefined ) {
            return [];
        }
        return lista;
    }
    public getListaConsultaDocumentoRelacionados(): ConsultaDocumentoRelacionado[] {
        let lista: ConsultaDocumentoRelacionado[];
        lista = this.persistenceService.get('listaConsultaDocumentosRelacionados', StorageType.LOCAL);
        if ( lista == undefined ) {
            return [];
        }
        return lista;
    }
    // Factura de Anticipo Referencia
    public setDocumentosReferencia( documento: DocumentoReferencia ) {
        let documentosReferencia: DocumentoReferencia[] = [];
        documentosReferencia = this.getDocumentosReferencia();
        documento.id = documentosReferencia.length;
        documentosReferencia.push( documento );
        this.persistenceService.remove('documentosReferencia', StorageType.LOCAL);
        this.persistenceService.set( 'documentosReferencia', documentosReferencia, { type: StorageType.LOCAL, timeout: 3600000 } );
    }
    /**
     * Método que inserta la lista de documentos de referencia, y a su vez valida que no hayan items duplicados
     * @param listaComprobantes lista nueva de items
     */
    public setListaDocumentosReferencia( listaComprobantes: DocumentoReferencia[] ) {
        let lista: DocumentoReferencia [] = [];
        lista = this.getDocumentosReferencia();
        if ( lista.length === 0) {
            this.persistenceService.set( 'documentosReferencia',
                                        listaComprobantes, { type: StorageType.LOCAL, timeout: 3600000 } );
        } else {
            for ( let a = 0 ; a < lista.length ; a++ ) {
                for ( let b = 0 ; b < listaComprobantes.length ; b++) {
                    if ( lista[a].idDocumentoDestino === listaComprobantes[b].idDocumentoDestino ) {
                        listaComprobantes.splice(b, 1);
                        b--;
                    }
                }
            }
            for ( let a = 0 ; a < listaComprobantes.length ; a++) {
                lista.push(listaComprobantes[a]);
            }
            this.persistenceService.remove('documentosReferencia', StorageType.LOCAL);
            this.persistenceService.set( 'documentosReferencia',
                                        lista, { type: StorageType.LOCAL, timeout: 3600000 } );
        }
    }
    public setListaDocumentosReferenciaSinValidacion(listaComprobantes: DocumentoReferencia[]) {
        this.persistenceService.remove('documentosReferencia', StorageType.LOCAL);
        this.persistenceService.set( 'documentosReferencia', listaComprobantes, { type: StorageType.LOCAL, timeout: 3600000 } );
    }

    public getDocumentosReferencia(): DocumentoReferencia[] {
        let documentosReferencia: DocumentoReferencia[] = [];
        documentosReferencia = this.persistenceService.get('documentosReferencia', StorageType.LOCAL);
        if ( documentosReferencia == undefined ) {
            return [];
        }
        return documentosReferencia;
    }
    public removeDocumentosReferencia() {
        this.persistenceService.remove('documentosReferencia', StorageType.LOCAL);
    }
    /**
     * Método que edita un item de la lista de Documentos Relacionados, a partir del id
     */
    public editarItemDocumentoRelacionado( itemEditar: DocumentoReferencia ) {
        let documentosReferencia: DocumentoReferencia[] = [];
        documentosReferencia = this.getDocumentosReferencia();
        for ( let a = 0 ; a < documentosReferencia.length ; a++ ) {
            if ( documentosReferencia[a].idComprobante === itemEditar.idComprobante ) {
                documentosReferencia[a].totalImporteDestino = itemEditar.totalImporteDestino;
            }
        }
        this.persistenceService.remove('documentosReferencia', StorageType.LOCAL);
        this.persistenceService.set( 'documentosReferencia', documentosReferencia, { type: StorageType.LOCAL, timeout: 3600000 } );
    }
    /**
     * Metodo que retorna la posicion de un elemento, busca por el idDocumentoDestino
     * Retorna -1 si no existe el elemento
     * @param item => item a buscar
     */
    public findItemDocumentoReferencia( item: DocumentoReferencia ): number {
        let documentosReferencia: DocumentoReferencia[] = [];
        documentosReferencia = this.getDocumentosReferencia();
        if ( documentosReferencia.length > 0 ) {
            for ( let a = 0 ; a < documentosReferencia.length ; a++ ) {
                if ( item.idDocumentoDestino == documentosReferencia[a].idDocumentoDestino ) {
                    return a;
                }
            }
        }
        return -1;
    }
    // CABECERA FACTURA
    public setCabeceraFactura( cabecera: CabeceraFactura) {
        this.removeCabeceraFactura();
        this.persistenceService.set( 'cabeceraFactura', cabecera, { type: StorageType.LOCAL, timeout: 1800000 } );
    }
    public getCabeceraFactura(): CabeceraFactura {
        let cabecera: CabeceraFactura = new CabeceraFactura();
        cabecera = this.persistenceService.get( 'cabeceraFactura', StorageType.LOCAL );
        if ( cabecera === undefined ) {
            return null;
        }
        return cabecera;
    }

    public removeCabeceraFactura() {
        this.persistenceService.remove('cabeceraFactura', StorageType.LOCAL);
    }

    //  CONSULTA COMPROBANTES
    /**
     *
     * @param tipoComprobante
     */
    public setTipoComprobanteConsultar(tipoComprobante: string) {
        this.persistenceService.remove('tipoComprobanteCodigo', StorageType.LOCAL);
        this.persistenceService.set('tipoComprobanteCodigo', tipoComprobante, {type: StorageType.LOCAL, timeout: 3600000});
    }
    public getTipoComprobanteConsultar (): string {
        let tipoComprobante: string;
        tipoComprobante = this.persistenceService.get('tipoComprobanteCodigo', StorageType.LOCAL);
        if ( tipoComprobante === undefined ) {
            return null;
        }
        return tipoComprobante;
    }
    /**
     * Metodo que envia UUID de Retencion de Consultas
     */
    public setUUIDConsultaRetencion ( uuid: string ) {
        this.persistenceService.remove('UUIDConsultaRetencion', StorageType.LOCAL);
        this.persistenceService.set('UUIDConsultaRetencion', uuid, {type: StorageType.LOCAL, timeout: 3600000});
    }
    public getUUIDConsultaRetenecion (): string {
        let uuid: string;
        uuid = this.persistenceService.get('UUIDConsultaRetencion', StorageType.LOCAL);
        if ( uuid === undefined ) {
            return null;
        }
        return uuid;
    }


    /**
     *
     * @param nombre Nombre de Persistencia
     * @param valor Valor a guardar
     */
    public setPersistenciaSimple<T>(nombre: string, valor: T) {
        this.persistenceService.remove(nombre, StorageType.LOCAL);
        this.persistenceService.set(nombre, valor, {type: StorageType.LOCAL, timeout: 3600000});
    }
    /**
     * Método Generico de Set para valor individuales
     * @param nombre Nombre de Persistencia
     */
    public getPersistenciaSimple<T> (nombre: string): T {
        let valor: T;
        valor = this.persistenceService.get(nombre, StorageType.LOCAL);
        if ( valor === undefined ) {
            return null;
        }
        return valor;
    }

    public removePersistenciaSimple<T> (nombre: string) {
      this.persistenceService.remove(nombre, StorageType.LOCAL);
    }

    public removePersistencias() {
        this.persistenceService.removeAll(StorageType.SESSION);
        this.persistenceService.remove('factura', StorageType.LOCAL);
        this.persistenceService.remove('listaProductos', StorageType.LOCAL);
        this.persistenceService.remove('cabeceraFactura', StorageType.LOCAL);
        this.persistenceService.remove('listaConsultaDocumentosRelacionados', StorageType.LOCAL);
        this.persistenceService.remove('UUIDConsultaComprobante', StorageType.LOCAL);
        this.persistenceService.remove('tipoComprobanteCodigo', StorageType.LOCAL);
        this.persistenceService.remove('entidad', StorageType.LOCAL);
        this.persistenceService.remove('checkFacturaAnticipo', StorageType.LOCAL);
        this.persistenceService.remove('documentosReferenciaTemporal', StorageType.LOCAL);
        this.persistenceService.remove('documentosReferencia', StorageType.LOCAL);
    }
}
