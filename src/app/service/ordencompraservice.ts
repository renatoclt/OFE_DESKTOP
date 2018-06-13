import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { OrdenCompra, Producto, CambioEstado } from "app/model/ordencompra";
import { ResponseError } from '../model/responseerror';
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from "app/utils/app.utils";
import { BASE_URL, URL_DETALLE_OC, URL_CAMBIO_ESTADO_OC } from 'app/utils/app.constants';
declare var DatatableFunctions: any;
@Injectable()
export class OrdenCompraService {

  private urlGet: string = URL_DETALLE_OC;
  // private urlCambioEstado: string = BASE_URL + 'api/msproductor/v1/comandos/oc?accion=cambioestado';
  private urlCambioEstado: string = URL_CAMBIO_ESTADO_OC;
  // http://40.76.86.5:8080/api/msproductor/v1/comandos/cp/ comprobante de pago
  // http://40.76.86.5:8080/api/msproductor/v1/comandos/guias/ guias
  // http://40.76.86.5:8080/api/msproductor/v1/comandos/has/ aceptacion de servicio
  util: AppUtils;

  constructor(private http: Http) {
  }

  convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  }

  obtener(id: string, tipo_empresa: string, origen_guia: boolean = false): Observable<OrdenCompra> {
    let items$ = this.http
      .get(this.urlGet + id + (origen_guia ? "/?cabecera=1&solo_productos=2" : ""), { headers: this.getHeaders(tipo_empresa) })
      .map(this.mapOC)
      .catch(this.handleError);
    return items$;
  }

  cambioEstado(id: string, org_id: string, item: CambioEstado): Observable<any> {
    const headers = this.getHeadersCambioEstado(org_id);
    const options = new RequestOptions({ headers: headers });
    options.withCredentials = true;
    ////return this.http.put(this.urlCambioEstado, item, options)

    return this.http.put(this.urlCambioEstado, item, options)
      // .map(this.extractData)
      .catch(this.handleError);
  }


  /*
  
  */

  /*
    add(item: RFQCompradorInsert): Observable<any> {
      let headers = this.getHeaders();
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.urlAdd, item, options)
        .map(this.extractData)
        .catch(this.handleError);
    }*/


  private mapOC(res: Response): OrdenCompra {

    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }

    let oc_json = res.json();
    let oc = new OrdenCompra();

    console.log(oc_json);
    var myRegexp = /%TIT%(.*?)%TAB%(.*?)%/ig;
    var matches;
    oc.terminos = [];
    var id = 1;
    if (oc_json.data.Terminos && oc_json.data.Terminos !== '') {
      while (matches = myRegexp.exec(oc_json.data.Terminos)) {
        const a = {
          id: id++,
          nombre: DatatableFunctions.ConvertToText(DatatableFunctions.ReplaceToken(matches[1])),
          valor: matches[2],
        }
        oc.terminos.push(a);

      }
    }
    oc.tiene_condiciones = oc.terminos.length <= 0 ? false : true;



    oc.comprador = oc_json.data.RazonSocialComprador ? oc_json.data.RazonSocialComprador : '';
    if (oc.comprador.toLowerCase().includes('wong')) {
      oc.idorgcompradora = 'wong';
    } else if (oc.comprador.toLowerCase().includes('centenario')) {
      oc.idorgcompradora = 'centenario';
    } else {
      oc.idorgcompradora = 'abinbev.png';
    }
    oc.ruccomprador = oc_json.data.NITComprador; // DatatableFunctions.ConvertStringToRUC( oc_json.data.NITComprador);
    oc.tipo = oc_json.data.TipoOrden;
    oc.nroordencompra = oc_json.data.NumeroOrden;
    oc.proveedor = oc_json.data.NombreVendedor; // falta
    oc.rucproveedor = oc_json.data.NITVendedor; // DatatableFunctions.ConvertStringToRUC(oc_json.data.NITVendedor);//falta
    oc.fecharegistro = DatatableFunctions.ConvertStringToDatetimeLong(oc_json.data.FechaCreacion);
    oc.codigoproveedor = oc_json.data.OrgIDVendedor; // falta

    oc.version = oc_json.data.Version;
    oc.moneda = oc_json.data.MonedaOrden;


    oc.condiciones_generales = DatatableFunctions.ReplaceToken(oc_json.data.CondicionesGenerales);


    oc.atenciona_html = DatatableFunctions.ReplaceToken(oc_json.data.AtencionA);
    oc.atenciona = DatatableFunctions.ConvertToText(oc.atenciona_html);



    oc.contactarcon_html = DatatableFunctions.ReplaceToken(oc_json.data.EmailContacto);
    oc.contactarcon = DatatableFunctions.ConvertToText(oc.contactarcon_html);


    oc.creadorpor_html = DatatableFunctions.ReplaceToken(oc_json.data.CreadoPor);
    oc.creadorpor = DatatableFunctions.ConvertToText(oc.creadorpor_html);

    oc.estadocomprador = oc_json.data.EstadoComprador;
    oc.estadoproveedor = oc_json.data.EstadoProveedor;

    // oc.estadocomprador = 'OEMIT';
    // oc.estadoproveedor = 'ONVIS';



    oc.facturara_html = DatatableFunctions.ReplaceToken(oc_json.data.EmitirA);
    oc.facturara_texto = DatatableFunctions.ConvertToText(oc.facturara_html);

    oc.recepcionfactura_html = DatatableFunctions.ReplaceToken(oc_json.data.EnviarComprobanteA);
    oc.recepcionfactura_texto = DatatableFunctions.ConvertToText(oc.recepcionfactura_html);



    oc.formapago = oc_json.data.CondicionPago;
    oc.fechainiciocontrato = DatatableFunctions.ConvertStringToDatetimeLong(oc_json.data.FechaIniContrato);
    oc.fechafincontrato = DatatableFunctions.ConvertStringToDatetimeLong(oc_json.data.FechaFinContrato);;

    oc.grupocompra_html = DatatableFunctions.ReplaceToken(oc_json.data.GrupoCompra);
    oc.grupocompra = DatatableFunctions.ConvertToText(oc.grupocompra_html);



    //    oc.autorizadopor = oc_json.data.AprobadoPor;
    oc.aprobadopor = [];
    oc.narrativa_html = DatatableFunctions.ReplaceToken(oc_json.data.Narrativa);

    myRegexp = /Nivel(.*?):(.*?)%/ig;
    matches;


    while (matches = myRegexp.exec(oc_json.data.AprobadoPor)) {
      let a = {
        id: matches[1],
        nombre: matches[2],
      }
      oc.aprobadopor.push(a);
    }

    if (oc.aprobadopor.length <= 0) {
      oc.autorizadopor_html = DatatableFunctions.ReplaceToken(oc_json.data.AprobadoPor);
      oc.autorizadopor = DatatableFunctions.ConvertToText(oc.autorizadopor_html);
    }

    oc.comentarioproveedor = oc_json.data.ComentarioProveedor;
    oc.subtotal = DatatableFunctions.FormatNumber(oc_json.data.ValorVentaNeto);//falta
    // oc.utilidades = DatatableFunctions.FormatNumber(oc_json.data.Utilidades);//falta
    oc.valorventa = DatatableFunctions.FormatNumber(oc_json.data.ValorVenta);
    // oc.gastosgenerales = DatatableFunctions.FormatNumber(oc_json.data.GastosGen);//falta
    oc.impuestos = DatatableFunctions.FormatNumber(oc_json.data.Impuestos);

    // oc.porcentaje_impuestos =oc_json.data.PorcentajeImpuestos? oc_json.data.PorcentajeImpuestos: '18.0000%';

    let porcentaje_impuestos = oc_json.data.PorcentajeImpuestos ? oc_json.data.PorcentajeImpuestos * 100 : 18;
    oc.porcentaje_impuestos = DatatableFunctions.FormatNumber(porcentaje_impuestos) + '%';


    oc.valortotal = DatatableFunctions.FormatNumber(oc_json.data.MontoAPagar);
    // oc.condiciones= oc_json.data.condicionpago;
    oc.direccionfactura = oc_json.data.DireccionFactura;

    oc.productos = [];
    let index = 1;

    for (const item of oc_json.data.ProductosOrden) {

      const p = new Producto();
      p.parentid = 0;
      p.id = index++;
      p.posicion = item.PosicionProducto;
      p.micodigo = item.CodigoProducto;
      p.IdProductoOrden = item.IdProductoxOc;
      p.desccorta = item.DescripcionProducto ? item.DescripcionProducto : '';
      p.nombre = item.DescripcionProducto ? item.DescripcionProducto : '';
      if (item.DescripcionLarga && item.DescripcionLarga != '') {
        p.nombre = p.nombre + ' <br\>' + DatatableFunctions.ReplaceToken(item.DescripcionLarga);
      }
      p.descripcion = DatatableFunctions.ConvertToText(p.nombre);

      p.estado = item.EstadoProducto ? item.EstadoProducto : '';
      p.atributos = new Array();

      if ('AtributosProducto' in item && item.AtributosProducto != null) {

        for (const atributo of item.AtributosProducto) {

          if (atributo.NombreAtributoOrden === 'Centro') {
            p.centro = atributo.ValorAtributoProducto ? atributo.ValorAtributoProducto : ' ';
          }
          if (atributo.NombreAtributoOrden === 'Solicitud de pedido') {
            p.solicitudpedido = atributo.ValorAtributoProducto ? atributo.ValorAtributoProducto : ' ';
          }

          let atr = {
            nombre: atributo.NombreAtributoOrden,
            operador: atributo.OperadorAtributoProducto,
            valor: atributo.ValorAtributoProducto,
            unidad: atributo.UnidadAtributoProducto,

          }
          p.atributos.push(atr);
        }
      }

      p.cantidad = item.CantidadProducto ? item.CantidadProducto : '';

      p.cantidadRecibida = item.CantidadRecibida ? item.CantidadRecibida : 0;
      p.cantidadDespachada = item.CantidadDespachada ? item.CantidadDespachada : 0;

      p.unidad = item.UnidadProducto ? item.UnidadProducto : '';
      p.IdTablaUnidadMedida = item.IdTablaunidadMedida;
      p.IdRegistroUnidadMedida = item.IdRegistroUnidadMedida;

      p.preciounitario = DatatableFunctions.FormatNumber(item.PrecioUnitarioProducto);
      p.total = DatatableFunctions.FormatNumber(item.PrecioProducto);

      p.igv = DatatableFunctions.FormatNumber(item.Impuestos)

      p.fechaentrega = item.FechaEntregaProducto && item.FechaEntregaProducto != '' ? DatatableFunctions.FormatDatetimeForDisplay(new Date(item.FechaEntregaProducto)) : null;
      p.es_subitem = false;
      p.tienesubitem = false;

      oc.productos.push(p);

      if ('SubItemsProducto' in item && item.SubItemsProducto != null) {

        for (const subitem of item.SubItemsProducto) {
          p.cantidad = '';
          p.preciounitario = '';
          p.unidad = '';
          p.fechaentrega = '';
          p.tienesubitem = true;
          const subproducto = new Producto();
          subproducto.parentid = p.id;
          subproducto.id = index++;
          subproducto.posicion = subitem.Posicion;
          subproducto.micodigo = subitem.CodigoProducto;
          subproducto.nombre = subitem.DescripcionLarga ? subitem.DescripcionLarga : '';

          subproducto.atributos = new Array();
          subproducto.estado = subitem.EstadoProducto ? subitem.EstadoProducto : '';

          for (const subatributo of subitem.AtributosSubItem) {
              if (subatributo.NombreAtributo === 'Centro') {
                subproducto.centro = subatributo.ValorEnviado ? subatributo.ValorEnviado : ' ';
              }
              if (subatributo.NombreAtributo === 'Solicitud de pedido') {
                subproducto.solicitudpedido = subatributo.ValorEnviado ? subatributo.ValorEnviado : ' ';
              }

              const atr = {
                nombre: subatributo.NombreAtributo ? subatributo.NombreAtributo : null,
                operador: subatributo.OperadorAtributoSubProducto ? subatributo.OperadorAtributoSubProducto : null,
                valor: subatributo.ValorEnviado ? subatributo.ValorEnviado : null,
                unidad: subatributo.NombreUnidad ? subatributo.NombreUnidad : null,
              }
              subproducto.atributos.push(atr);
          }

          subproducto.cantidad = subitem.Cantidad ? subitem.Cantidad : '';
          subproducto.unidad = subitem.UnidadSubProducto ? subitem.UnidadSubProducto : '';
          subproducto.preciounitario = DatatableFunctions.FormatNumber(subitem.Precio);
          subproducto.total = DatatableFunctions.FormatNumber(subitem.PrecioTotal);
          subproducto.igv = DatatableFunctions.FormatNumber(subitem.Impuestos);
          subproducto.fechaentrega = subitem.FechaEntrega && subitem.FechaEntrega !== '' ? DatatableFunctions.FormatDatetimeForDisplay(new Date(subitem.FechaEntrega)) : null;
          subproducto.es_subitem = true;
          oc.productos.push(subproducto);

        }
      }
    }

    return oc;
    // return body.data || {};
  }

  private extractData(res: Response) {

    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }
    return respuesta;
    // return body.data || {};
  }

  private handleError(error: Response | any) {
    // console.error('handleError',error);
    console.error('handleError', error.message || error);
    let  data= error ? error.json() || {} : {};     
    if (data && data.error && data.error === "invalid_token") {
      DatatableFunctions.logout();
    }

    return Observable.throw(error.message || error);
  }

  private getHeaders(tipo_empresa) {
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('origen_datos', 'PEB2M');
    headers.append('tipo_empresa', tipo_empresa);
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    headers.append('Ocp-Apim-Subscription-Key', localStorage.getItem('Ocp_Apim_Subscription_Key'));
    // headers.append('Access-Control-Allow-Origin', '*');
    return headers;
  }

  private getHeadersCambioEstado(org_id: string) {
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    // headers.append('Access-Control-Request-Method', 'PUT');

    headers.append('origen_datos', 'PEB2M');
    headers.append('tipo_empresa', 'P');
    headers.append('org_id', org_id);
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    headers.append('Ocp-Apim-Subscription-Key', localStorage.getItem('Ocp_Apim_Subscription_Key'));
    return headers;
  }

}
