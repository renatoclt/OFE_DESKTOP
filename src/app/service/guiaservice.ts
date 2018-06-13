 import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { Guia, Articulo } from "app/model/guia";
import { ResponseError } from '../model/responseerror';
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from "app/utils/app.utils";
import {BASE_URL, URL_DETALLE_GUIA, URL_AGREGAR_GUIA_BORRADOR , URL_DETALLE_GUIA_BORRADOR, URL_AGREGAR_GUIA ,URL_DESCARTAR_GUIA_BORRADOR, URL_EXISTE_GUIA} from 'app/utils/app.constants';
import {Usuario} from "app/model/usuario";
import {GuiaMS, GDUPLOADMQ, GuiaDespacho, ItemGuia, ArchivoAdjunto} from "app/model/guiams";
import {TablaDeTabla} from "app/model/tabladetabla";

declare var DatatableFunctions: any;
@Injectable()
export class GuiaService {




  util: AppUtils;
  constructor(private http: Http) {

  }
  convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  }
  /*
  obtenerBorrador(idRfq: string): Observable<Guia> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('origen_datos', 'PEB2M');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    headers.append('tipo_empresa', 'P');
    headers.append('org_id', localStorage.getItem('org_id'));
    
    let items$ = this.http
      .get(this.urlGet + idRfq, { headers: this.getHeaders() })
      .map(this.extractData2)
      .catch(this.handleError);
    return items$;
  }*/

  agregar(item: Guia): Observable<any> {
//debugger;
        let headers = this.getHeaders();

    headers.append('tipo_empresa', 'P');
 
    let usuario:Usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    
    let guiaMS:GuiaMS = new GuiaMS();
    
    guiaMS.GDUPLOADMQ = new GDUPLOADMQ();
    guiaMS.GDUPLOADMQ.RucProveedor = item.rucproveedor;
    guiaMS.GDUPLOADMQ.RazonSocialProveedor = item.razonsocialproveedor;
    guiaMS.GDUPLOADMQ.GuiaDespacho = [];
    
    let guiaEntity:GuiaDespacho = new GuiaDespacho();
    
    //let listUnidadMedida_V:TablaDeTabla[] = JSON.parse(localStorage.getItem('listUnidadMedidaConTipo_V'));
    //let listUnidadMedida_m:TablaDeTabla[] = JSON.parse(localStorage.getItem('listUnidadMedidaConTipo_m'));
    let listUnidadMedida:TablaDeTabla[] = JSON.parse(localStorage.getItem('listUnidadMedida'));
    //let listUnidadMedidaVol:TablaDeTabla[] = JSON.parse(localStorage.getItem('listUnidadMedida'));
    let listMotivoGuia:TablaDeTabla[] = JSON.parse(localStorage.getItem('listMotivoGuia'));
    let listTipoDocIdentidad:TablaDeTabla[] = JSON.parse(localStorage.getItem('listTipoDocIdentidad'));
    let listTransporteGuia:TablaDeTabla[] = JSON.parse(localStorage.getItem('listTransporteGuia'));
    let unidadMedida;
    let unidadMedidaVol;
    
    //debugger;
    unidadMedida = listUnidadMedida.find(a => a.vc_DESC_CORTA == item.totalpesobrutound);
    unidadMedidaVol = listUnidadMedida.find(a => a.vc_DESC_CORTA == item.totalvolumenund);

    let motivoGuia = listMotivoGuia.find(a => a.vc_DESC_CORTA == item.motivoguia);
    let transporteGuia = listTransporteGuia.find(a => a.vc_DESC_CORTA == item.tipotransporte);
    let tipoDocIdentidad = listTipoDocIdentidad.find(a => a.vc_DESC_CORTA == item.tipodoctransporte);
    
    guiaEntity.IdTablaPeso = "10000";
    guiaEntity.IdRegistroPeso = (unidadMedida == null ? "" : unidadMedida.vc_IDREGISTRO)
    guiaEntity.IdTablaPeso = "10000";
    guiaEntity.IdRegistroVolumen = (unidadMedidaVol == null ? "" : unidadMedidaVol.vc_IDREGISTRO);
    guiaEntity.IsoPeso = item.totalpesobrutound;
    guiaEntity.IsoVolumen = item.totalvolumenund;
    guiaEntity.NumeroGuia = item.nroguia;
    guiaEntity.RucCliente = item.ruccliente;
    guiaEntity.RazonSocialCliente = item.razonsocialcliente;
    guiaEntity.FechaEmision = DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fechaemision));
    guiaEntity.FechaInicioTraslado = DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fechainiciotraslado));
    guiaEntity.FechaProbArribo = DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fechaprobablearribo));
    guiaEntity.IdTablaMotivoGuia = "10010";
    guiaEntity.IdRegistroMotivoGuia = (motivoGuia == null ? "" : motivoGuia.vc_IDREGISTRO);
    guiaEntity.MotivoGuia = item.motivoguia;
    guiaEntity.Observaciones = item.observaciones;
    guiaEntity.IdTablaTipDocTransportista = "10015";
    guiaEntity.IdRegistroTipDocTransportista = (tipoDocIdentidad == null ? "" : tipoDocIdentidad.vc_IDREGISTRO);
    guiaEntity.TipDocTransportista = item.tipodoctransporte;
    guiaEntity.NumDocTransportista = item.rucdnitransporte;
    guiaEntity.RazonSocialTransportista = item.razonsocialnombretransporte;
    guiaEntity.PlacaoNave = item.placatransporte;
    guiaEntity.DirTransportista = item.direcciontransporte;
    guiaEntity.RegistroMTC = item.codigomtctransporte;
    guiaEntity.IdTablaTipoTransporte = "10011";
    guiaEntity.IdRegistroTipoTransporte = (transporteGuia == null ? "" : transporteGuia.vc_IDREGISTRO);
    guiaEntity.TipoTransporte = item.tipotransporte;
    guiaEntity.PuntoPartida = item.puntopartida;
    guiaEntity.PuntoLlegada = item.puntollegada;
    guiaEntity.AlmacenDestino = item.alamcendestino;
    guiaEntity.TotalBultos = item.totalbultos;
    guiaEntity.TotalVolumen = item.totalvolumen;
    guiaEntity.TotalPesoBruto = item.totalpesobruto;
    guiaEntity.Tara = item.tara;
    guiaEntity.TotalPesoNeto = item.totalpesoneto;
    guiaEntity.IdOrganizacionCreacion = usuario.org_id;
    guiaEntity.IdUsuarioCreacion = usuario.id;
    guiaEntity.IdOrganizacionCompradora = item.idorgcompradora;
    guiaEntity.IdOrganizacionProveedora = usuario.org_id;
    guiaEntity.TipoGuia = item.tipoguia;
    guiaEntity.Estado = "Activa";
    guiaEntity.ItemGuia = [];
    guiaEntity.ArchivoAdjunto = [];
    guiaEntity.id_doc = item.id_doc;

    if (item.docadjuntos != null) {
      for (let docadjunto of item.docadjuntos) {
        let archivoAdjFactura: ArchivoAdjunto = new ArchivoAdjunto();
        
        archivoAdjFactura.Nombre = docadjunto.nombre;
        archivoAdjFactura.Descripcion = docadjunto.descripcion;
        archivoAdjFactura.URL = docadjunto.url;
        guiaEntity.ArchivoAdjunto.push(archivoAdjFactura);
      }
    }
 
    if (item.articulos != null){
      for (let articulo of item.articulos) {
        let itemGuia: ItemGuia = new ItemGuia();
      
        
        
        itemGuia.IdOc = articulo.idoc;

        /*
        let unidadMedidaArticulo = listUnidadMedida.find(a => a.vc_ISO == articulo.unidadmedidadespacho);
        articulo.IdTablaUnidad = "10000";
        articulo.IdRegistroUnidad = (unidadMedidaArticulo == null ? "" : unidadMedidaArticulo.vc_IDREGISTRO);
        */

        itemGuia.NumeroOrden = articulo.nrooc;
        itemGuia.NumeroParte = articulo.nroparte;
        itemGuia.DescripcionItem = articulo.descproducto;
        itemGuia.PesoNetoItem = articulo.pesoneto;
        //itemGuia.IdTablaunidadMedida = articulo.IdTablaUnidad;
        //itemGuia.IdRegistroUnidadMedida = articulo.IdRegistroUnidad;
        itemGuia.IdTablaunidadMedida = articulo.IdTablaUnidad;
        itemGuia.IdRegistroUnidadMedida = articulo.IdRegistroUnidad;

        itemGuia.IdProductoxOc = articulo.IdProductoOrden;
        itemGuia.NumeroItem = articulo.nroitem + "";
        itemGuia.NumeroItemOC = articulo.nroitemoc;
        itemGuia.UnidadPeso = articulo.unidadmedidapesoneto;
        itemGuia.CantidadPedido = articulo.cantidadpedido;
        itemGuia.Cantidadaf = articulo.cantidadrecibida;
        itemGuia.CantidadDespachada = articulo.cantidaddespachada;
        itemGuia.Destino = articulo.destino;
        itemGuia.UnidadMedidaItem = articulo.unidadmedidadespacho;
    
        guiaEntity.ItemGuia.push(itemGuia);
      }
    }
    
    guiaMS.GDUPLOADMQ.GuiaDespacho.push(guiaEntity);
    console.clear();
    console.log(JSON.stringify(guiaMS));
    let options = new RequestOptions({ headers: headers });
    return this.http.post(URL_AGREGAR_GUIA, guiaMS, options)
      //.map(this.extractData)
      .catch(this.handleError);
  }
  
  verificar_duplicados(numGuia: string, IdOrganizacionProveedora: string, IdOrganizacionCompradora: string): Observable<any> {
    let headers = this.getHeaders();
    headers.append('tipo_empresa', 'C');
    headers.append('org_id', localStorage.getItem('org_id'));
    
    let items$ = this.http
      .get(URL_EXISTE_GUIA + "?NumeroGuia=" + numGuia + "&IdOrganizacionProveedora=" + IdOrganizacionProveedora + "&IdOrganizacionCompradora=" + IdOrganizacionCompradora, { headers: headers })
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
    let guia = res.json();
    return guia;
  }
  
  guardar(item: Guia): Observable<any> {
    let headers = this.getHeaders();

    headers.append('tipo_empresa', 'P');
 
    let usuario:Usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    
    let guiaMS:GuiaMS = new GuiaMS();
    
    //guiaMS.GDUPLOADMQ = new GDUPLOADMQ();
    item.estado = "Borrador";
    guiaMS.guia = item;
    guiaMS.id_doc = item.id_doc;
    guiaMS.recurso = "guia";
    guiaMS.vc_numeroseguimiento = item.nroguia;
    guiaMS.session_id = localStorage.getItem('access_token');
    
    /*
    guiaMS.GDUPLOADMQ.RucProveedor = item.rucproveedor;
    guiaMS.GDUPLOADMQ.RazonSocialProveedor = item.razonsocialproveedor;
    guiaMS.GDUPLOADMQ.GuiaDespacho = [];
    */
    /*
    let guiaEntity:GuiaDespacho = new GuiaDespacho();
    
    let listUnidadMedida:TablaDeTabla[] = JSON.parse(localStorage.getItem('listUnidadMedida'));
    //let listUnidadMedidaVol:TablaDeTabla[] = JSON.parse(localStorage.getItem('listUnidadMedida'));
    let listMotivoGuia:TablaDeTabla[] = JSON.parse(localStorage.getItem('listMotivoGuia'));
    let listTipoDocIdentidad:TablaDeTabla[] = JSON.parse(localStorage.getItem('listTipoDocIdentidad'));
    let listTransporteGuia:TablaDeTabla[] = JSON.parse(localStorage.getItem('listTransporteGuia'));
    
    let unidadMedida = listUnidadMedida.find(a => a.vc_DESC_CORTA == item.totalpesobrutound);
    let unidadMedidaVol = listUnidadMedida.find(a => a.vc_DESC_CORTA == item.totalvolumenund);
    let motivoGuia = listMotivoGuia.find(a => a.vc_DESC_CORTA == item.motivoguia);
    let transporteGuia = listTransporteGuia.find(a => a.vc_DESC_CORTA == item.tipotransporte);
    let tipoDocIdentidad = listTipoDocIdentidad.find(a => a.vc_DESC_CORTA == item.tipodoctransporte);
    
    guiaEntity.IdTablaPeso = "10000";
    guiaEntity.IdRegistroPeso = (unidadMedida == null ? "" : unidadMedida.vc_IDREGISTRO)
    guiaEntity.IdTablaPeso = "10000";
    guiaEntity.IdRegistroVolumen = (unidadMedidaVol == null ? "" : unidadMedidaVol.vc_IDREGISTRO);
    guiaEntity.IsoPeso = item.totalpesobrutound;
    guiaEntity.IsoVolumen = item.totalvolumenund;
    guiaEntity.NumeroGuia = item.nroguia;
    guiaEntity.RucCliente = item.ruccliente;
    guiaEntity.RazonSocialCliente = item.razonsocialcliente;
    guiaEntity.FechaEmision = DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fechaemision));
    guiaEntity.FechaInicioTraslado = DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fechainiciotraslado));
    guiaEntity.FechaProbArribo = DatatableFunctions.FormatDatetimeForMicroServiceProducer(DatatableFunctions.ConvertStringToDatetime(item.fechaprobablearribo));
    guiaEntity.IdTablaMotivoGuia = "10010";
    guiaEntity.IdRegistroMotivoGuia = (motivoGuia == null ? "" : motivoGuia.vc_IDREGISTRO);
    guiaEntity.MotivoGuia = item.motivoguia;
    guiaEntity.Observaciones = item.observaciones;
    guiaEntity.IdTablaTipDocTransportista = "10015";
    guiaEntity.IdRegistroTipDocTransportista = (tipoDocIdentidad == null ? "" : tipoDocIdentidad.vc_IDREGISTRO);
    guiaEntity.TipDocTransportista = item.tipodoctransporte;
    guiaEntity.NumDocTransportista = item.rucdnitransporte;
    guiaEntity.RazonSocialTransportista = item.razonsocialnombretransporte;
    guiaEntity.PlacaoNave = item.placatransporte;
    guiaEntity.DirTransportista = item.direcciontransporte;
    guiaEntity.RegistroMTC = item.codigomtctransporte;
    guiaEntity.IdTablaTipoTransporte = "10011";
    guiaEntity.IdRegistroTipoTransporte = (transporteGuia == null ? "" : transporteGuia.vc_IDREGISTRO);
    guiaEntity.TipoTransporte = item.tipotransporte;
    guiaEntity.PuntoPartida = item.puntopartida;
    guiaEntity.PuntoLlegada = item.puntollegada;
    guiaEntity.AlmacenDestino = item.alamcendestino;
    guiaEntity.TotalBultos = item.totalbultos;
    guiaEntity.TotalVolumen = item.totalvolumen;
    guiaEntity.TotalPesoBruto = item.totalpesobruto;
    guiaEntity.Tara = item.tara;
    guiaEntity.Estado = "Borrador";
    guiaEntity.TotalPesoNeto = item.totalpesoneto;
    guiaEntity.IdOrganizacionCreacion = usuario.org_id;
    guiaEntity.IdUsuarioCreacion = usuario.id;
    guiaEntity.IdOrganizacionCompradora = item.idorgcompradora;
    guiaEntity.IdOrganizacionProveedora = usuario.org_id;
    guiaEntity.TipoGuia = item.tipoguia;
    guiaEntity.ItemGuia = [];

    if (item.articulos != null){
      for (let articulo of item.articulos) {
        let itemGuia: ItemGuia = new ItemGuia();
        let unidadMedidaArticulo = listUnidadMedida.find(a => a.vc_ISO == articulo.unidadmedidadespacho);
        
        itemGuia.IdOc = articulo.idoc;
        articulo.IdTablaUnidad = "10000";
        articulo.IdRegistroUnidad = (unidadMedidaArticulo == null ? "" : unidadMedidaArticulo.vc_IDREGISTRO);
        itemGuia.NumeroOrden = articulo.nrooc;
        itemGuia.NumeroParte = articulo.nroparte;
        itemGuia.DescripcionItem = articulo.descproducto;
        itemGuia.PesoNetoItem = articulo.pesoneto;
        itemGuia.IdTablaunidadMedida = articulo.IdTablaUnidad;
        itemGuia.IdRegistroUnidadMedida = articulo.IdRegistroUnidad;
        itemGuia.IdProductoxOc = articulo.IdProductoOrden;
        itemGuia.NumeroItem = articulo.nroitem + "";
        itemGuia.NumeroItemOC = articulo.nroitemoc;
        itemGuia.UnidadPeso = articulo.unidadmedidapesoneto;
        itemGuia.CantidadPedido = articulo.cantidadpedido;
        itemGuia.Cantidadaf = articulo.cantidadrecibida;
        itemGuia.CantidadDespachada = articulo.cantidaddespachada;
        itemGuia.Destino = articulo.destino;
        itemGuia.UnidadMedidaItem = articulo.unidadmedidadespacho;
        guiaEntity.ItemGuia.push(itemGuia);
      }
    }
    
    guiaMS.GDUPLOADMQ.GuiaDespacho.push(guiaEntity);
    */
    console.clear();
    console.log(JSON.stringify(guiaMS));
    let options = new RequestOptions({ headers: headers });
    return this.http.post(URL_AGREGAR_GUIA_BORRADOR, guiaMS, options)
      //.map(this.extractData)
      .catch(this.handleError);
  }

  obtener(idRfq: string, publicada: boolean = true): Observable<Guia> {
    /*idRfq = '4b2d44f8-5241-4b30-bf92-b1b4d4156fbb';

    publicada =false;*/

    let url = URL_DETALLE_GUIA_BORRADOR;
    if (publicada)
      url = URL_DETALLE_GUIA;
    let items$ = this.http
      .get(url + idRfq, { headers: this.getHeaders() })
      .map(this.mapGuia)
      .catch(this.handleError);
    return items$;
  }
  /*
  private extractData3(res: Response): Guia {
    //console.log('extractData2', res);
    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }

    let objeto_json = res.json();
    let nroguia = objeto_json.data.NroGuia;
    let parts = [];
    if (nroguia)
      parts = nroguia.split('-');

    let guia: Guia = {
      id: objeto_json.data.IdGuia,
      nroguia: nroguia,
      nroguia1: parts.length > 0 ? parts[0] : '',
      nroguia2: parts.length > 1 ? parts[1] : '',
      ruccliente: objeto_json.data.RucCliente,
      razonsocialcliente: objeto_json.data.RazonSocialCliente,
      rucproveedor: objeto_json.data.RucProveedor,
      razonsocialproveedor: objeto_json.data.RazonSocialProveedor,
      fechaemision: DatatableFunctions.ConvertStringToDatetime(objeto_json.data.FechaEmision),
      fechainiciotraslado: DatatableFunctions.ConvertStringToDatetime(objeto_json.data.FechaTraslado),
      fechaprobablearribo: DatatableFunctions.ConvertStringToDatetime(objeto_json.data.FechaArribo),
      motivoguia: objeto_json.data.MotivoGuia,
      observaciones: objeto_json.data.Observacion,
      tipodoctransporte: objeto_json.data.TipoDocumento,
      rucdnitransporte: objeto_json.data.NumDocumento,
      razonsocialnombretransporte: objeto_json.data.RazonSocialTransportista,
      placatransporte: objeto_json.data.NumPlaca,
      direcciontransporte: objeto_json.data.DireccionTransportista,
      codigomtctransporte: objeto_json.data.CodigoRegistroMTC,
      tipotransporte: objeto_json.data.TipoTransporte,
      puntopartida: objeto_json.data.PuntoPartida,
      puntollegada: objeto_json.data.PuntoLlegada,
      alamcendestino: objeto_json.data.AlamacenDestino,
      totalbultos: objeto_json.data.TotalBultos,
      totalvolumen: objeto_json.data.TotalVolumen,
      totalvolumenund: objeto_json.data.IsoVolumen,
      totalpesobruto: objeto_json.data.TotalPesoBruto,
      totalpesobrutound: objeto_json.data.IsoPeso,
      tara: objeto_json.data.Tara,
      //taraund: objeto_json.data.IsoPeso,
      totalpesoneto: objeto_json.data.TotalPesoNeto,
      //totalpesonetound: objeto_json.data.IsoPeso,
      nroerpdocmaterial: objeto_json.data.DocumentoMaterial,
      estado: 'GACTV',
      articulos: [],
      docadjuntos: [],
    };
    if (objeto_json.data.Productos) {
      let index = 1;
      for (let item of objeto_json.data.Productos) {
        let p = {
          nroitem: index++,
          nrooc: item.NroOC,
          nroitemoc: item.NroItemOC,
          codproducto: item.CodigoProducto,
          descproducto: item.Descripcion,
          //cantpedida: item.CantidadPedida,
          cantaceptadaorgcomp: item.CantidadAceptada ? item.CantidadAceptada : '',
          unidadmedidaorgcomp: item.Unidad ? item.Unidad : '',
          cantpendpedido: item.CantidadDespachada ? item.CantidadDespachada : '',
          unidadmedidapedido: item.Unidad ? item.Unidad : '',         
          pesoneto: item.PesoNeto ? item.PesoNeto : '',
          unidadmedidapesoneto: item.UnidadPesoNeto ? item.UnidadPesoNeto : '',
          estado: item.Estado ? item.Estado : '',

        }

        guia.articulos.push(p);
      }
    }
    guia.docadjuntos = [];
    if (objeto_json.data.Adjunto) {
      let index = 1;
      for (let adjunto of objeto_json.data.Adjunto) {
       

        guia.docadjuntos.push({
          id:index++,
          codigo: adjunto.Id? adjunto.Id : '',
          nombre: adjunto.Nombre? adjunto.Nombre : '',
          descripcion: adjunto.Descripcion? adjunto.Descripcion : '',
          url: adjunto.Url? adjunto.Url : '',
        });
      }
    }
    
    guia.docadjuntos.push({
      id:1,
      codigo: 1,
      nombre: 'test.pdf',
      descripcion: '',
      url:'https://sab2md.blob.core.windows.net/temp/11844480-b7c0-4e40-849c-6d45ad68a0d1',
    });
  
   
    return guia;
    //return body.data || {};
  }
  */
  /*
    add(item: RFQCompradorInsert): Observable<any> {
      let headers = this.getHeaders();
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.urlAdd, item, options)
        .map(this.extractData)
        .catch(this.handleError);
    }*/
  private mapGuia(res: Response): Guia {
    //console.log('extractData2', res);
    
    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }

    let objeto_json = res.json();
    
    if (objeto_json.guia)
        return objeto_json.guia;
        
    let nroguia = objeto_json.data.NroGuia;
    let parts = [];
    if (nroguia)
      parts = nroguia.split('-');

    let guia: Guia = {
      idorgcompradora2: objeto_json.data.IdOrganizacionCompradora,

      id: objeto_json.data.IdGuia,
      nroguia: nroguia,
      nroguia1: parts.length > 0 ? parts[0] : '',
      nroguia2: parts.length > 1 ? parts[1] : '',
      ruccliente: objeto_json.data.RucCliente,
      razonsocialcliente: objeto_json.data.RazonSocialCliente,
      rucproveedor: objeto_json.data.RucProveedor,
      razonsocialproveedor: objeto_json.data.RazonSocialProveedor,
      fechaemision: DatatableFunctions.ConvertStringToDatetime(objeto_json.data.FechaEmision),
      fechainiciotraslado: DatatableFunctions.ConvertStringToDatetime(objeto_json.data.FechaTraslado),
      fechaprobablearribo: DatatableFunctions.ConvertStringToDatetime(objeto_json.data.FechaArribo),
      motivoguia: objeto_json.data.MotivoGuia,
      observaciones: objeto_json.data.Observacion,
      motivorechazosap: objeto_json.data.MotivoRechazoSAP,
      motivoerrorsap: objeto_json.data.MotivoErrorSAP,
      tipodoctransporte: objeto_json.data.TipoDocumento,
      rucdnitransporte: objeto_json.data.NumDocumento,
      razonsocialnombretransporte: objeto_json.data.RazonSocialTransportista,
      placatransporte: objeto_json.data.NumPlaca,
      direcciontransporte: objeto_json.data.DireccionTransportista,
      codigomtctransporte: objeto_json.data.CodigoRegistroMTC,
      tipotransporte: objeto_json.data.TipoTransporte,
      puntopartida: objeto_json.data.PuntoPartida,
      puntollegada: objeto_json.data.PuntoLlegada,
      alamcendestino: objeto_json.data.AlamacenDestino,
      totalbultos: objeto_json.data.TotalBultos,
      totalvolumen: objeto_json.data.TotalVolumen,
      totalvolumenund: objeto_json.data.IsoVolumen,
      totalpesobruto: objeto_json.data.TotalPesoBruto,
      totalpesobrutound: objeto_json.data.IsoPeso,
      tara: objeto_json.data.Tara,
      //taraund: objeto_json.data.IsoPeso,
      totalpesoneto: objeto_json.data.TotalPesoNeto,
      //totalpesonetound: objeto_json.data.IsoPeso,
      nroerpdocmaterial: objeto_json.data.DocumentoMaterial,
      estado: objeto_json.data.Estado,
      articulos: [],
      docadjuntos: [],
    };
    if (objeto_json.data.Productos) {
      let index = 1;
      for (let item of objeto_json.data.Productos) {
        let p = {
          nroitem: index++,
          nrooc: item.NroOC,
          nroitemoc: item.NroItemOC,
          nroparte: ('CodigoProducto' in item) ? item.CodigoProducto : '',
          codproducto: item.CodigoProducto,
          descproducto: item.Descripcion,
          cantidadpedido:  ('CantidadPedida' in item) ? item.CantidadPedida : '',
          cantidadrecibida:  ('CantidadAceptada' in item) ? item.CantidadAceptada : '',
          unidadmedida: item.Unidad ? item.Unidad : '',
          cantidaddespachada: ('CantidadDespachada' in item) ? item.CantidadDespachada : '',
          cantidadatendida: ('CantidadAtentida' in item) ? item.CantidadAtentida : '',
          precioitemoc: ('PrecioItemOc' in item) ? item.PrecioItemOc : '',
          subtotalitemoc: ('SubtotalItemOc' in item) ? item.SubtotalItemOc : '',
          subtotalitemguia: ('SubtotalItemGuia' in item) ? item.SubtotalItemGuia : '',
          unidadmedidadespacho: item.UnidadDespacho ? item.UnidadDespacho : '', //FALTA
          pesoneto: item.PesoNeto ? item.PesoNeto : '',
          //unidadmedidapesoneto: item.UnidadPesoNeto ? item.UnidadPesoNeto : '',
          estado: item.Estado ? item.Estado : '',
          preciototal: item.PrecioTotalProducto,
          preciounitario: item.PrecioProducto,
          CodigoGuiaERP: item.CodigoGuiaERP,
          NumeroMaterial: item.NumeroMaterial,
          EjercicioGuia: item.EjercicioGuia,
          IdTablaUnidad: item.IdTablaUnidad,
          IdRegistroUnidad: item.IdRegistroUnidad,
          IdProdxGuia: item.IdProdxGuia
        }
        guia.articulos.push(p);
        console.log(p);
      }
    }
    guia.docadjuntos = [];
    if (objeto_json.data.Adjuntos) {
        let index = 1;
        for (let adjunto of objeto_json.data.Adjuntos) {
            guia.docadjuntos.push({
              id: index++,
              codigo: adjunto.IdArchivo ? adjunto.IdArchivo : '',
              nombre: adjunto.Nombre ? adjunto.Nombre : '',
              descripcion: adjunto.Descripcion ? adjunto.Descripcion : '',
              url: adjunto.UrlTemporal ? adjunto.UrlTemporal : '',
            });
        }
    }

    console.log(JSON.stringify(guia));
    return guia;
    //return body.data || {};
  }

  descartarBorrador(id: String): Observable<any> {
    let headers = this.getHeaders();

    headers.append('tipo_empresa', 'P');
    let body={
      id_doc:id,
    }
    let options = new RequestOptions({ headers: headers, body: body });
   
    return this.http.delete(URL_DESCARTAR_GUIA_BORRADOR, options)
      //.map(this.extractData)
      .catch(this.handleError);

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

  private getHeaders() {
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('origen_datos', 'PEB2M');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    headers.append("org_id", localStorage.getItem('org_id'));
    headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
    // headers.append("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
    //headers.append("origen_datos", 'PEB2M');
    //headers.append("tipo_empresa", 'C');
    //headers.append("org_id", 'ofcc5f20-5f35-404f-b1c8-6a3f8a46896f');
    // headers.append('Access-Control-Allow-Origin', '*');
    return headers;
  }

}
