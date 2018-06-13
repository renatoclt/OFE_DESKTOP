import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { OrdenCompra, Producto, CambioEstado } from 'app/model/sm-ordencompra';
import { ResponseError } from 'app/model/responseerror';
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from 'app/utils/app.utils';
import { Factura, DetalleFactura } from 'app/model/factura/cl-factura';
import { FacturaMS, FACUPLOADMQ, Factura as Factura2, ItemFactura, ArchivoAdjunto } from 'app/model/sm-facturams';
import { URL_DESCARTAR_CP_BORRADOR, URL_DETALLE_CP, URL_AGREGAR_CP_BORRADOR, URL_AGREGAR_CP, URL_DETALLE_CP_BORRADOR,
         URL_BUSCAR_CP, URL_BUSCAR_CP_BORRADOR } from 'app/utils/app.constants';
import { Usuario } from 'app/model/usuario';
import { TablaDeTabla } from 'app/model/tabladetabla';

declare var DatatableFunctions, numeral: any;

@Injectable()
export class FacturaService {

  //test
  util: AppUtils;
  constructor(private http: Http) {
  }

  convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  }

  descartarBorrador(id: String): Observable<any> {
    let headers = this.getHeaders('P');
    let body={
      id_doc:id,
    }
    let options = new RequestOptions({ headers: headers, body: body });
   
    return this.http.delete(URL_DESCARTAR_CP_BORRADOR, options)
      //.map(this.extractData)
      .catch(this.handleError);
  }

  guardar(item: Factura): Observable<any> {
    let headers = this.getHeaders("P");

    headers.append('org_id', localStorage.getItem('org_id'));

    let usuario: Usuario = JSON.parse(localStorage.getItem('usuarioActual'));

    let listMonedas: TablaDeTabla[] = JSON.parse(localStorage.getItem('listMonedas'));
    let listTipoComprobante: TablaDeTabla[] = JSON.parse(localStorage.getItem('listTipoComprobante'));
    let listUnidadMedida: TablaDeTabla[] = JSON.parse(localStorage.getItem('listUnidadMedida'));

    let moneda = listMonedas.find(a => a.vc_DESC_CORTA == item.moneda);
    let tipodocumento = listTipoComprobante.find(a => a.vc_DESC_CORTA == item.tipodocumento);

    let facturaMS: FacturaMS = new FacturaMS();

    //facturaMS.FACUPLOADMQ = new FACUPLOADMQ();
    item.estado = "Borrador";
    facturaMS.factura = item;
    facturaMS.recurso = "factura";
    facturaMS.id_doc = item.id_doc;
    facturaMS.vc_numeroseguimiento = item.nocomprobantepago;
    facturaMS.session_id = localStorage.getItem('access_token');
    /*facturaMS.FACUPLOADMQ.IdUsrProveedor = usuario.id;
    facturaMS.FACUPLOADMQ.IdOrgProveedor = usuario.org_id;
    facturaMS.FACUPLOADMQ.RucProveedor = item.rucproveedor;
    facturaMS.FACUPLOADMQ.RazonSocialProveedor = item.razonsocialproveedor;
    facturaMS.FACUPLOADMQ.DireccionProveedor = "";
    facturaMS.FACUPLOADMQ.Factura = [];*/

    /*let facturaEntity: Factura2 = new Factura2();

    facturaEntity.NumeroFactura = item.nocomprobantepago;
    facturaEntity.NumeroGuia = "";
    facturaEntity.NumeroOC = "";
    facturaEntity.IdOrgCliente = item.IdOrgCliente.toString();
    facturaEntity.RucCliente = item.ruccliente;
    facturaEntity.RazonSocialCliente = item.razonsocialcliente;
    facturaEntity.FechaRegistro = DatatableFunctions.FormatDatetimeForMicroServiceProducer(item.fecharegistro);
    facturaEntity.FechaEnvio = DatatableFunctions.FormatDatetimeForMicroServiceProducer(new Date());
    facturaEntity.FechaEmision = DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fechaemision));
    facturaEntity.PlazoPago = " ";
    facturaEntity.PeriodoPlazoPago = " ";
    facturaEntity.CondicionPago = (item.condicionpago == null ? "" : item.condicionpago);

    facturaEntity.SubTotal = (item.subtotal != null ? DatatableFunctions.StringToNumber(item.subtotal.toString()).toString() : "0");
    facturaEntity.Impuesto1 = (item.impuesto1 != null ? DatatableFunctions.StringToNumber(item.impuesto1.toString()).toString() : "0");
    facturaEntity.Impuesto2 = (item.impuesto2 != null ? DatatableFunctions.StringToNumber(item.impuesto2.toString()).toString() : "0");
    facturaEntity.Impuesto3 = (item.impuesto3 != null ? DatatableFunctions.StringToNumber(item.impuesto3.toString()).toString() : "0");
    facturaEntity.ImpuestoReferencial = (item.importereferencial != null ? DatatableFunctions.StringToNumber(item.importereferencial.toString()).toString() : "0");
    facturaEntity.ImpuestoGVR = "";
    facturaEntity.Total = (item.importetotal != null ? DatatableFunctions.StringToNumber(item.importetotal.toString()).toString() : "0");
    facturaEntity.Observaciones = (item.observaciones == null ? "" : item.observaciones);

    facturaEntity.FechaVencimiento =null;// DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fechavencimiento));
    facturaEntity.FechaRecepcion =null;// DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fecharecepcion));
    facturaEntity.FechaPago = " ";
    facturaEntity.FechaProgramadaPago = " ";
    facturaEntity.FormaPago = item.formapago;
    facturaEntity.DocumentoPago = "";
    facturaEntity.DocumentoERP = "";
    facturaEntity.PagoTipoDocumento = "";
    facturaEntity.PagoNroDocumento = "";
    facturaEntity.PagoMoneda = (moneda == null ? "" : moneda.vc_DESC_CORTA);
    facturaEntity.Moneda = (moneda == null ? "" : moneda.vc_DESC_CORTA);

    facturaEntity.PagoMontoPagado = "";
    facturaEntity.PagoBanco = "";
    facturaEntity.DctoTipoDocumento = "";
    facturaEntity.DctoNroDocumento = "";
    facturaEntity.DctoMoneda = (moneda == null ? "" : moneda.vc_DESC_CORTA);
    facturaEntity.DctoMonto = item.dsctomonto;
    facturaEntity.Almacen = "";
    facturaEntity.IdCierres = "";
    facturaEntity.Status = "3909";
    facturaEntity.IdTablaEstado = "10005";
    facturaEntity.IdRegistroEstadoProv = "0000052";
    facturaEntity.IdRegistroEstadoComp = "0000053";
    facturaEntity.ISOEstadoProv = "B";
    facturaEntity.ISOEstadoComp = "B";
    facturaEntity.Estado = "Borrador";
    facturaEntity.EstadoComprador = "Borrador";
    facturaEntity.CodigoERPProveedor = "";
    facturaEntity.CodigoSociedad = "";
    facturaEntity.IndicadorDetraccion = "";
    facturaEntity.CodigoBien = "";
    facturaEntity.DescripcionBien = "";
    facturaEntity.PorcentajeDetraccion = "";
    facturaEntity.IdCondicionPago = "";
    facturaEntity.DescripcionCondicionPago = "";
    facturaEntity.IndImpuesto = "";
    facturaEntity.TipoRegistro = "";
    facturaEntity.CodigoErp = "";
    facturaEntity.NumeroNota = "";
    facturaEntity.TipoNota = "";
    facturaEntity.Motivo = "";
    facturaEntity.Actividad = "";
    facturaEntity.PorcentajeImpuestoRetenido = "0";
    facturaEntity.IdTablaMoneda = "10001";
    facturaEntity.IdRegistroMoneda = (moneda == null ? "" : moneda.vc_IDREGISTRO);
    facturaEntity.IdTablaTipoComprobante = "10007";
    facturaEntity.IdRegistroTipoComprobante = (tipodocumento == null ? "" : tipodocumento.vc_IDREGISTRO);
    facturaEntity.IdTablaTipoEmision = "10016";
    facturaEntity.IdRegistroTipoEmision = item.esfisico ? "01" : "02";
    facturaEntity.TipoFactura = item.esguiamaterial ? "M" : "S";
    facturaEntity.ItemFactura = [];

    if (item.detallefactura != null) {
      for (let articulo of item.detallefactura) {
        let itemFactura: ItemFactura = new ItemFactura();

        let unidadmedida = listUnidadMedida.find(a => a.vc_ISO == articulo.unidadmedida);

        itemFactura.NumGuiaItem = articulo.noguia;
        itemFactura.NumeroItemOC = articulo.noitemoc;
        itemFactura.IdGuia = articulo.IdGuia;
        itemFactura.IdProdxGuia = articulo.IdProdxGuia;
        itemFactura.NumeroParte = articulo.noparte;
        itemFactura.DescripcionItem = articulo.descproducto;
        itemFactura.CantidadItem = articulo.cantidad;
        let preciounitreferencial: number = (articulo.preciounitreferencial == null ? 0 : Number(articulo.preciounitreferencial));
        itemFactura.PrecioUnitario = preciounitreferencial.toString();
        itemFactura.PrecioTotal = (Number(articulo.cantidad) * preciounitreferencial) + "";
        itemFactura.NumeroGuiaItem = articulo.noitem.toString();
        itemFactura.NumeroOcItem = articulo.nooc;
        itemFactura.Posicion = articulo.posicion;
        itemFactura.CodigoGuiaERP = articulo.CodigoGuiaERP;
        itemFactura.EjercicioGuia = articulo.EjercicioGuia;
        itemFactura.IdTablaUnidad = "10000";
        itemFactura.IdRegistroUnidad = (unidadmedida == null ? "" : unidadmedida.vc_IDREGISTRO);
        itemFactura.DocumentoMaterial = [];
        facturaEntity.ItemFactura.push(itemFactura);
        //itemFactura.EjercicioGuia = 
      }
    }

    facturaMS.FACUPLOADMQ.Factura.push(facturaEntity);

    console.clear();
    console.log(JSON.stringify(facturaMS));*/

    /*facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;*/

    let options = new RequestOptions({ headers: headers });
    return this.http.post(URL_AGREGAR_CP_BORRADOR, facturaMS, options)
      //.map(this.extractData)
      .catch(this.handleError);
  }

  agregar(item: Factura): Observable<any> {

    let headers = this.getHeaders("P");

    headers.append('org_id', localStorage.getItem('org_id'));

    let usuario: Usuario = JSON.parse(localStorage.getItem('usuarioActual'));

    let listMonedas: TablaDeTabla[] = JSON.parse(localStorage.getItem('listMonedas'));
    let listTipoComprobante: TablaDeTabla[] = JSON.parse(localStorage.getItem('listTipoComprobante'));
    let listUnidadMedida: TablaDeTabla[] = JSON.parse(localStorage.getItem('listUnidadMedida'));

    let moneda = listMonedas.find(a => a.vc_DESC_CORTA == item.moneda);
    let tipodocumento = listTipoComprobante.find(a => a.vc_DESC_CORTA == item.tipodocumento);

    let facturaMS: FacturaMS = new FacturaMS();

    facturaMS.FACUPLOADMQ = new FACUPLOADMQ();
    facturaMS.FACUPLOADMQ.IdUsrProveedor = usuario.id;
    facturaMS.FACUPLOADMQ.IdOrgProveedor = usuario.org_id;
    facturaMS.FACUPLOADMQ.RucProveedor = item.rucproveedor;
    facturaMS.FACUPLOADMQ.RazonSocialProveedor = item.razonsocialproveedor;
    facturaMS.FACUPLOADMQ.DireccionProveedor = "";
    facturaMS.FACUPLOADMQ.Factura = [];

    let facturaEntity: Factura2 = new Factura2();

    facturaEntity.IdBorrador = item.IdBorrador;
    facturaEntity.NumeroFactura = item.nocomprobantepago;
    facturaEntity.NumeroGuia = '';
    facturaEntity.NumeroOC = '';
    facturaEntity.IdOrgCliente = item.IdOrgCliente.toString();
    facturaEntity.RucCliente = item.ruccliente;
    facturaEntity.RazonSocialCliente = item.razonsocialcliente;
    facturaEntity.FechaRegistro = DatatableFunctions.FormatDatetimeForMicroServiceProducer(item.fecharegistro);
    facturaEntity.FechaEnvio = DatatableFunctions.FormatDatetimeForMicroServiceProducer(new Date());
    facturaEntity.FechaEmision = DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fechaemision));
    facturaEntity.PlazoPago = ' ';
    facturaEntity.PeriodoPlazoPago = ' ';
    facturaEntity.CondicionPago = (item.condicionpago == null ? '' : item.condicionpago);

    facturaEntity.SubTotal = (item.subtotal != null ? DatatableFunctions.StringToNumber(item.subtotal.toString()).toString() : "0");
    facturaEntity.Impuesto1 = (item.impuesto1 != null ? DatatableFunctions.StringToNumber(item.impuesto1.toString()).toString() : "0");
    facturaEntity.Impuesto2 = (item.impuesto2 != null ? DatatableFunctions.StringToNumber(item.impuesto2.toString()).toString() : "0");
    facturaEntity.Impuesto3 = (item.impuesto3 != null ? DatatableFunctions.StringToNumber(item.impuesto3.toString()).toString() : "0");
    facturaEntity.ImpuestoReferencial = (item.importereferencial != null ? DatatableFunctions.StringToNumber(item.importereferencial.toString()).toString() : "0");
    facturaEntity.ImpuestoGVR = '';
    facturaEntity.Total = (item.importetotal != null ? DatatableFunctions.StringToNumber(item.importetotal.toString()).toString() : "0");
    facturaEntity.Observaciones = (item.observaciones == null ? "" : item.observaciones);

    facturaEntity.FechaVencimiento = null;//DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fechavencimiento));
    facturaEntity.FechaRecepcion = null;//DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fecharecepcion));
    facturaEntity.FechaPago = " ";
    facturaEntity.FechaProgramadaPago = " ";
    facturaEntity.FormaPago = item.formapago;
    facturaEntity.DocumentoPago = "";
    facturaEntity.DocumentoERP = "";
    facturaEntity.PagoTipoDocumento = "";
    facturaEntity.PagoNroDocumento = "";
    facturaEntity.PagoMoneda = (moneda == null ? "" : moneda.vc_DESC_CORTA);
    facturaEntity.PagoMontoPagado = "";
    facturaEntity.PagoBanco = "";
    facturaEntity.DctoTipoDocumento = "";
    facturaEntity.DctoNroDocumento = "";
    facturaEntity.DctoMoneda = (moneda == null ? "" : moneda.vc_DESC_CORTA);
    facturaEntity.DctoMonto = item.dsctomonto;
    facturaEntity.Almacen = "";
    facturaEntity.IdCierres = "";
    facturaEntity.Status = "3909";
    facturaEntity.IdTablaEstado = "10005";
    facturaEntity.IdRegistroEstadoProv = "0000052";
    facturaEntity.IdRegistroEstadoComp = "0000053";
    facturaEntity.ISOEstadoProv = "B";
    facturaEntity.ISOEstadoComp = "Q";
    facturaEntity.Estado = "Activa";
    facturaEntity.EstadoComprador = "Publicada";
    facturaEntity.CodigoERPProveedor = "";
    facturaEntity.CodigoSociedad = "";
    facturaEntity.IndicadorDetraccion = "";
    facturaEntity.CodigoBien = "";
    facturaEntity.DescripcionBien = "";
    facturaEntity.PorcentajeDetraccion = "";
    facturaEntity.IdCondicionPago = "";
    facturaEntity.DescripcionCondicionPago = "";
    facturaEntity.IndImpuesto = "";
    facturaEntity.TipoRegistro = "";
    facturaEntity.CodigoErp = "";
    facturaEntity.NumeroNota = "";
    facturaEntity.TipoNota = "";
    facturaEntity.Motivo = "";
    facturaEntity.Actividad = "";
    facturaEntity.PorcentajeImpuestoRetenido = "0";
    facturaEntity.IdTablaMoneda = "10001";
    facturaEntity.IdRegistroMoneda = (moneda == null ? "" : moneda.vc_IDREGISTRO);
    facturaEntity.IdTablaTipoComprobante = "10007";
    facturaEntity.IdRegistroTipoComprobante = (tipodocumento == null ? "" : tipodocumento.vc_IDREGISTRO);
    facturaEntity.IdTablaTipoEmision = "10016";
    facturaEntity.IdRegistroTipoEmision = item.esfisico ? "01" : "02";

    if (item.basefactura === 'guia') {
        facturaEntity.TipoFactura = 'M';
    }else if (item.basefactura === 'has') {
        facturaEntity.TipoFactura = 'S';
    }else if (item.basefactura === 'ticket') {
        facturaEntity.TipoFactura = 'T';
    }
    //facturaEntity.TipoFactura = item.esguiamaterial ? "M" : "S";
    facturaEntity.ItemFactura = [];
    facturaEntity.ArchivoAdjunto = [];

    if (item.docadjuntos != null) {
      for (let docadjunto of item.docadjuntos) {
          let archivoAdjFactura: ArchivoAdjunto = new ArchivoAdjunto();

          archivoAdjFactura.Nombre = docadjunto.nombre;
          archivoAdjFactura.Descripcion = docadjunto.descripcion;
          archivoAdjFactura.URL = docadjunto.url;
          facturaEntity.ArchivoAdjunto.push(archivoAdjFactura);
      }
    }

    if (item.detallefactura != null) {
      for (let articulo of item.detallefactura) {
        let itemFactura: ItemFactura = new ItemFactura();
        
        let unidadmedida: TablaDeTabla;

        if(facturaEntity.TipoFactura == "M"){
          unidadmedida = listUnidadMedida.find(a => a.vc_ISO == articulo.unidadmedida);
        }else{
          unidadmedida = listUnidadMedida.find(a => a.vc_EQUIVALENCIA == articulo.unidadmedida);
        }

        itemFactura.NumGuiaItem = articulo.noguia;
        itemFactura.NumeroItemOC = articulo.noitemoc;
        itemFactura.IdGuia = articulo.IdGuia;
        itemFactura.IdProdxGuia = articulo.IdProdxGuia;
        itemFactura.NumeroParte = articulo.noparte;
        itemFactura.DescripcionItem = articulo.descproducto;
        itemFactura.CantidadItem = numeral(articulo.cantidad).value().toString();
        let preciounitreferencial: number = (articulo.preciounitreferencial == null ? 0 : Number.parseFloat(articulo.preciounitreferencial.replace(/,/g, "")));
        itemFactura.PrecioUnitario = preciounitreferencial.toString();
      //  itemFactura.PrecioTotal = (Number(articulo.cantidad) * preciounitreferencial) + "";
        itemFactura.PrecioTotal = DatatableFunctions.StringToNumber(articulo.subtotalitemguia)+'';        
        itemFactura.NumeroGuiaItem = articulo.noitem.toString();
        itemFactura.NumeroOcItem = articulo.nooc;
        itemFactura.Posicion = articulo.posicion;
        itemFactura.CodigoGuiaERP = articulo.CodigoGuiaERP;
        itemFactura.EjercicioGuia = articulo.EjercicioGuia;
        itemFactura.IdTablaUnidad = "10000";

        

        itemFactura.IdRegistroUnidad = articulo.IdRegistroUnidad;//(unidadmedida == null ? "" : unidadmedida.vc_IDREGISTRO);
        itemFactura.DocumentoMaterial = [];
        facturaEntity.ItemFactura.push(itemFactura);
        //itemFactura.EjercicioGuia = 
      }
    }

    facturaMS.FACUPLOADMQ.Factura.push(facturaEntity);

    console.clear();
    console.log(JSON.stringify(facturaMS));

    /*facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;
    facturaMS.FACUPLOADMQ.Factura.RazonSocialCliente = item.razonsocialcliente;*/

    let options = new RequestOptions({ headers: headers });
    return this.http.post(URL_AGREGAR_CP, facturaMS, options)
      //.map(this.extractData)
      .catch(this.handleError);
  }
  
  verificar_duplicados(numFactura: string, rucProveedor: string, rucCliente: string): Observable<any> {
    let headers = this.getHeaders("P");

    headers.append('org_id', localStorage.getItem('org_id'));
    
    let items$ = this.http
      .get(URL_BUSCAR_CP + "?draw=0&start=0&length=-1&NumeroFactura=" + numFactura + "&RucProveedor=" + rucProveedor + "&RucCliente=" + rucCliente + "&column_names=IdComprobante,Estado,NumeroFactura", { headers: headers })
      .map(this.mapDuplicados)
      .catch(this.handleError);
        
    return items$;
  }

  verificar_duplicados_borrador(numFactura: string, rucProveedor: string, rucCliente: string): Observable<any> {
    let headers = this.getHeaders("P");

    headers.append('org_id', localStorage.getItem('org_id'));
    
    let items$ = this.http
      .get(URL_BUSCAR_CP_BORRADOR + "?draw=0&start=0&length=-1&NumeroFactura=" + numFactura + "&RucProveedor=" + rucProveedor + "&RucCliente=" + rucCliente + "&column_names=IdComprobante,Estado,NumeroFactura", { headers: headers })
      .map(this.mapDuplicados)
      .catch(this.handleError);
        
    return items$;
  }
  
  private mapDuplicados(res: Response): any{
    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }
    let fac = res.json();
    return fac;
  }

  obtener(idRfq: string, tipo_empresa: string, publicada: boolean = true): Observable<Factura> {

    /* idRfq='36cf6703-0458-455f-a5f7-6c97f7b87410';
     publicada=false;*/
    let url = URL_DETALLE_CP_BORRADOR;
    if (publicada) {
      url = URL_DETALLE_CP;
    }

    const items$ = this.http
      .get(url + idRfq, { headers: this.getHeaders(tipo_empresa) })
      .map(this.mapComprobantePago)
      .catch(this.handleError);
    return items$;
  }

  private mapComprobantePago(res: Response): Factura {
    // console.log('extractData2', res);
    const respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }

    const fac_json = res.json();
    console.log(fac_json)

    if (fac_json.factura) {
      return fac_json.factura;
    }
    let fac = new Factura();

    let nofactura = fac_json.data.NumeroFactura;
    let parts = [];
    if (nofactura) {
      parts = nofactura.split('-');
    }

    fac.nocomprobantepago = fac_json.data.NumeroFactura;
    fac.nocomprobantepago1 = parts.length > 0 ? parts[0] : '';
    fac.nocomprobantepago2 = parts.length > 1 ? parts[1] : '';
    fac.id = fac_json.data.IdComprobante;
    fac.ruccliente = fac_json.data.RucCliente;
    fac.razonsocialcliente = fac_json.data.RazonSocialCliente;
    fac.rucproveedor = fac_json.data.RucProveedor;
    fac.razonsocialproveedor = fac_json.data.RazonSocialProveedor;

    fac.esfisico = (fac_json.data.TipoEmision === 'F');
    fac.eselectronico = (fac_json.data.TipoEmision === 'E');

    fac.fechaemision = DatatableFunctions.ConvertStringToDatetime2(fac_json.data.FechaEmision);
    fac.tipodocumento = fac_json.data.TipoComprobante;
    fac.moneda = fac_json.data.Moneda;

    fac.motivorechazosap = fac_json.data.MotivoRechazoSAP;
    fac.motivoerrorsap = fac_json.data.MotivoErrorSAP;

    fac.subtotal = DatatableFunctions.FormatNumber(fac_json.data.SubTotal,4);
    fac.igv = DatatableFunctions.FormatNumber(fac_json.data.Impuesto1,4);
    fac.dsctomonto = DatatableFunctions.FormatNumber(fac_json.data.DctoMonto,2);
    fac.impuesto1 = DatatableFunctions.FormatNumber(fac_json.data.Impuesto1,2);
    fac.impuesto2 = DatatableFunctions.FormatNumber(fac_json.data.Impuesto2,2);
    fac.impuesto3 = DatatableFunctions.FormatNumber(fac_json.data.Impuesto3,2);
    fac.importetotal = DatatableFunctions.FormatNumber(fac_json.data.ImporteTotal,2);
    fac.total = DatatableFunctions.FormatNumber(fac_json.data.ImporteTotal,4);
    fac.totaltexto = fac_json.data.ImporteTotalCadena;

    fac.importereferencial = fac_json.data.ImporteReferencial;
    fac.observaciones = DatatableFunctions.ReplaceToken(fac_json.data.Observaciones);
    fac.documentoerp = fac_json.data.DocumentoErp;
    fac.guiasdespacho = fac_json.data.GuiasDespacho;
    fac.ordencompraserviciocontrato = fac_json.data.OrdenesCompra;
    fac.fechavencimiento = DatatableFunctions.ConvertStringToDatetime2(fac_json.data.FechaVencimiento);
    fac.fecharecepcion = DatatableFunctions.ConvertStringToDatetime2(fac_json.data.FechaRecepcion);
    fac.fecharegistro = DatatableFunctions.ConvertStringToDatetime2(fac_json.data.FechaRegistro);
    fac.formapago = fac_json.data.FormaPago;
    fac.bienserviciodetraccion = fac_json.data.CodigoBien;
    fac.estado = fac_json.data.EstadoProveedor;
    fac.estadocomprador = fac_json.data.EstadoComprador;
    fac.condicionpago = fac_json.data.CondicionPago;
    fac.tipopago = fac_json.data.PagoTipoDocumento;
    fac.nrodocumento = fac_json.data.PagoNroDocumento;
    fac.banco = fac_json.data.PagoBanco;
    fac.fechapago = DatatableFunctions.ConvertStringToDatetime2(fac_json.data.FechaPago);
    fac.monto = DatatableFunctions.FormatNumber(fac_json.data.PagoMontoPagado,2);
    fac.datospagomoneda = fac_json.data.PagoMoneda;
    fac.nrocheque = fac_json.data.NroCheque;
    fac.tipodescuento = fac_json.data.DctoTipoDocumento;
    fac.nrocomprobante = fac_json.data.DctoNroDocumento;
    fac.dsctomonto = DatatableFunctions.FormatNumber(fac_json.data.DctoMonto,2);
    fac.dsctomoneda = fac_json.data.DctoMoneda;
    /*
    if (!fac_json.data.ObservacionesPago) {
      fac_json.data.ObservacionesPago = '<![CDATA[%BSP%%BTBB%%BTR%%BSP%%BTD%%BSP%%BST%%WSP%Documento%WSP%%EST%%ESP%%ETD%%BTD%%BSP%%BST%%WSP%Moneda Documento%WSP%%EST%%ESP%%ETD%%BTD%%BSP%%BST%%WSP%Tipo de Documento%WSP%%EST%%ESP%%ETD%%BTD%%BSP%%BST%%WSP%Fecha de Emisión%WSP%%EST%%ESP%%ETD%%BTD%%BSP%%BST%%WSP%Importe M de Pago%WSP%%EST%%ESP%%ETD%%ESP%%ETR%%BSP%%BTD%%BSP%%WSP%01-0F001-0000161%WSP%%ESP%%ETD%%BTD%%BSP%%WSP%PEN%WSP%%ESP%%ETD%%BTD%%BSP%%WSP%Factura%WSP%%ESP%%ETD%%BTD%%BSP%%WSP%10-05-2017%WSP%%ESP%%ETD%%BTD%%BSP%%WSP%75586.56%WSP%%ESP%%ETD%%ESP%%ETR%%BSP%%BTD%%BSP%%WSP%01-0F001-0000176%WSP%%ESP%%ETD%%BTD%%BSP%%WSP%PEN%WSP%%ESP%%ETD%%BTD%%BSP%%WSP%Factura%WSP%%ESP%%ETD%%BTD%%BSP%%WSP%10-05-2017%WSP%%ESP%%ETD%%BTD%%BSP%%WSP%152819.39%WSP%%ESP%%ETD%%ESP%%ETR%%ETB%%ESP%]]>';
    }
    */
    fac.obscomprobantepago = DatatableFunctions.ReplaceToken(fac_json.data.ObservacionesPago);

    fac.detallefactura = [];
    let xI: number = 1;
    for (let item of fac_json.data.Productos) {
      let p = new DetalleFactura();
      p.IdGuia = item.IdGuia;
      p.IdOc = item.IdOc;
      p.noitem = xI+'';
      p.noguia = item.NumGuiaItem;
      p.nooc = item.NumeroOcItem;
      p.noitemoc = item.NumeroItemOC;
      p.noparte = item.NumeroParte ? item.NumeroParte : '';
      p.descproducto = item.DescripcionItem?item.DescripcionItem:'';
      p.preciounitreferencial =  DatatableFunctions.FormatNumber(item.PrecioUnitario);
      p.cantidad =  DatatableFunctions.FormatNumber(item.CantidadItem);
      p.importetotalitem =  DatatableFunctions.FormatNumber(item.PrecioTotal);
      p.estado = "";
      fac.detallefactura.push(p);
      xI++;
    }
    fac.docadjuntos = [];
    if (fac_json.data.Adjuntos) {
      let index = 1;
      for (let adjunto of fac_json.data.Adjuntos) {


        fac.docadjuntos.push({
          id: index++,
          codigo: adjunto.Id ? adjunto.IdArchivo : '',
          nombre: adjunto.Nombre ? adjunto.Nombre : '',
          descripcion: adjunto.Descripcion ? adjunto.Descripcion : '',
          url: adjunto.UrlTemporal ? adjunto.UrlTemporal : '',
        });
      }
    }
    /*fac.docadjuntos.push({
      id:1,
      codigo: 1,
      nombre: 'test.pdf',
      descripcion: '',
      url:'https://sab2md.blob.core.windows.net/temp/11844480-b7c0-4e40-849c-6d45ad68a0d1',
    });*/

    console.log(JSON.stringify(fac));
    return fac;
    //return body.data || {};
  }
  private extractData(res: Response) {

    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }
    return respuesta;
    //return body.data || {};
  }
  private handleError(error: Response | any) {
    console.error('handleError', error.message || error);
    let  data= error ? error.json() || {} : {};     
    if (data && data.error && data.error === "invalid_token")
      DatatableFunctions.logout();
    return Observable.throw(error.message || error);
  }

  private getHeaders(tipo_empresa: string) {
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('origen_datos', 'PEB2M');

    if (tipo_empresa != "") {
      headers.append("tipo_empresa", tipo_empresa);
    }

    headers.append("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
    headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));



    return headers;
  }

}
