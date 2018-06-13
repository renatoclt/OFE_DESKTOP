import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { Cotizacion, Primero, Producto, AtributoxProducto} from "app/model/sm-cotizacion";
import { ResponseError } from '../model/responseerror';
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from "app/utils/app.utils";
import { URL_DETALLE_QT, URL_CREAR_QT , URL_GENERAR_NUMSEG_QT, URL_AGREGAR_QT_BORRADOR, URL_DETALLE_QT_BORRADOR} from 'app/utils/app.constants';
import { Usuario } from "app/model/usuario";
import { RFQCompradoBuscar} from "app/model/sm-rfqcomprador";

//import { CotizacionMS, CotizacionM, Atributo, ProductoM, Archivos, POSTQT} from 'app/model/sm-cotizacionms';
import { CotizacionMS, POSTQT, Cotizacion as Cotizacion_MS, Atributo as Atributo_MS, Producto as Producto_MS, AtributoxProducto as AtributoxProducto_MS, Archivo as Archivo_MS} from 'app/model/sm-cotizacionms';
import {TablaDeTabla} from "app/model/tabladetabla";

//import { Producto } from 'app/facturacion-electronica/general/models/producto';
//import { Producto } from 'app/model/requerimiento';


declare var DatatableFunctions, moment, swal: any;

@Injectable()
export class CotizacionService {
  util: AppUtils;

  constructor(private http: Http) {

  }

  convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  } 

  generarNumeroDeSeguimiento(): Observable<string> {
      let items$ = this.http
      .get(URL_GENERAR_NUMSEG_QT, { headers: this.getHeaders(localStorage.getItem('tipo_empresa')) })
      .map(this.mapNumSeg);
      // .catch(this.handleError);
      return items$;
  }

  private mapNumSeg(res: Response): string {
      let respuesta = {
          status: res ? res.status : -1,
          statusText: res ? res.statusText : "ERROR",
          data: res ? res.json() || {} : {},
      }

      let objeto_json = res.json();
      return objeto_json.numgenerado?objeto_json.numgenerado:'';
  }


  guardar(item: Cotizacion): Observable<any> {
    let headers = this.getHeaders("P");

    headers.append('org_id', localStorage.getItem('org_id'));

    let usuario: Usuario = JSON.parse(localStorage.getItem('usuarioActual'));
/*
    let listMonedas: TablaDeTabla[] = JSON.parse(localStorage.getItem('listMonedas'));
    let listTipoComprobante: TablaDeTabla[] = JSON.parse(localStorage.getItem('listTipoComprobante'));
    let listUnidadMedida: TablaDeTabla[] = JSON.parse(localStorage.getItem('listUnidadMedida'));

    let moneda = listMonedas.find(a => a.vc_DESC_CORTA == item.moneda);
    let tipodocumento = listTipoComprobante.find(a => a.vc_DESC_CORTA == item.tipodocumento);
*/
    let cotizacionMS: CotizacionMS = new CotizacionMS();

    //facturaMS.FACUPLOADMQ = new FACUPLOADMQ();
    item.estado = "Borrador";
    
    cotizacionMS.cotizacion = item;
    cotizacionMS.recurso = "cotizacion";
    cotizacionMS.id_doc = item.id_doc;
    cotizacionMS.vc_numeroseguimiento = item.numeroseguimiento;
    cotizacionMS.session_id = localStorage.getItem('access_token');
    


    let options = new RequestOptions({ headers: headers });
    return this.http.post(URL_AGREGAR_QT_BORRADOR, cotizacionMS, options)
      //.map(this.extractData)
      .catch(this.handleError);
  }


  agregar(item: Cotizacion): Observable<any> {

    let headers = this.getHeaders(localStorage.getItem('tipo_empresa'));
    //let headers = this.getHeaders("P");
    let usuario: Usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    
    let listUnidadMedida:TablaDeTabla[] = JSON.parse(localStorage.getItem('listUnidadMedida'));


    let cotizacionMS: CotizacionMS = new CotizacionMS();// aca se guarda la cotizacionMS (campos criticos)

    cotizacionMS.POSTQT = new POSTQT();
    cotizacionMS.POSTQT.IdRfq = item.idrfq;        
    cotizacionMS.POSTQT.NumeroRfq = item.numerorfq;


    /*****UNIDADES PARA LA TABLA */
   
    //cotizacionMS.POSTQT.Cotizacion = [];

    //unidadMedida = listUnidadMedida.find(a => a.vc_DESC_CORTA == item.PrecioUnitarioUnidad);
    //unidadMedidaVol = listUnidadMedida.find(a => a.vc_DESC_CORTA == item.totalvolumenund);

    cotizacionMS.POSTQT.Cotizacion = new Cotizacion_MS();

    cotizacionMS.POSTQT.Cotizacion.VersionCotizacion = item.version;
    cotizacionMS.POSTQT.Cotizacion.NombreVendedor = item.nomusupro;
    cotizacionMS.POSTQT.Cotizacion.CodigoProveedor = item.orgpro;
    cotizacionMS.POSTQT.Cotizacion.FechaCotizacion = DatatableFunctions.FormatDatetimeForMicroServiceProducer(new Date());
    cotizacionMS.POSTQT.Cotizacion.Moneda = item.idmoneda;
    cotizacionMS.POSTQT.Cotizacion.Notas = item.mensaje;
    cotizacionMS.POSTQT.Cotizacion.NumeroSeguimiento= item.numeroseguimiento;
    cotizacionMS.POSTQT.Cotizacion.NomOrgCom = item.nomorgcom;

    
    cotizacionMS.POSTQT.Cotizacion.Atributo = [];
    cotizacionMS.POSTQT.Cotizacion.Archivos = [];
    cotizacionMS.POSTQT.Cotizacion.Producto = [];

    /*****************COT CONDICIONES GENERALES******** */

    if (item.atributos != null){
      for (let articulo of item.atributos) {
        let cotCondGenerales: Atributo_MS = new Atributo_MS();
      
        
        cotCondGenerales.atributonombre = articulo.nombreatributo;
        cotCondGenerales.atributovalor = articulo.valorenviado;
        cotCondGenerales.atributovalorunidad = articulo.nombreunidad;
        cotCondGenerales.atributovaloreditable = articulo.modificable;
        cotCondGenerales.atributoobligatorio = articulo.mandatorio;
        cotCondGenerales.atributovalortipodato = articulo.atributovalortipodato;
        //itemGuia.IdTablaunidadMedida = articulo.IdTablaUnidad;
        //itemGuia.IdRegistroUnidadMedida = articulo.IdRegistroUnidad;

        cotizacionMS.POSTQT.Cotizacion.Atributo.push(cotCondGenerales);
      }
    }
    /*****************COT ARTICULOS******** */

    if (item.productos != null){
      let i=0;
      for (let detalles of item.productos) {
        let cotArticulos: Producto_MS = new Producto_MS();
      
        
        //  cotArticulos.Id = detalles.id + "";
        cotArticulos.codigoproducto = detalles.codigoproducto;
        //cotArticulos.Posicion = detalles.posicion;
        cotArticulos.nombreproducto = detalles.nombreproducto;
        cotArticulos.descripcionproducto = detalles.descripcionproducto;
        //cotArticulos.CantidadSolicitada = detalles.cantidad + "";
        //cotArticulos.PrecioUnitario = detalles.precio + "";

        //itemGuia.IdTablaunidadMedida = articulo.IdTablaUnidad;
        //itemGuia.IdRegistroUnidadMedida = articulo.IdRegistroUnidad;


        for (let objAxP of item.productos[i].atributos) {
            let artxProd: AtributoxProducto_MS = new AtributoxProducto_MS();
            artxProd.atributoproductonombre = objAxP.nombre;
            artxProd.atributoproductoobligatorio = objAxP.obligatorio;          
            artxProd.atributoproductovalor = objAxP.valor;
            artxProd.atributoproductovaloreditable = objAxP.valoreditable;
            artxProd.atributoproductovalortipodato = objAxP.valortipodato;
            artxProd.atributoproductovalorunidad = objAxP.valorunidad;               
          // artxProd.atributoproductoobligatorio = objAxP.;          
            cotArticulos.atributoproducto.push(artxProd);
        }

        cotizacionMS.POSTQT.Cotizacion.Producto.push(cotArticulos);
        i++;
      }
    }

      /********************ARCHIVO ADJUNTO ***********************/
      if (item.docadjuntos != null) {
          for (let docadjunto of item.docadjuntos) {
              let archivoAdjCotizacion: Archivo_MS = new Archivo_MS();
              
              archivoAdjCotizacion.nombre = docadjunto.nombre;
              archivoAdjCotizacion.archivo = docadjunto.descripcion;
              archivoAdjCotizacion.url = docadjunto.url;

              cotizacionMS.POSTQT.Cotizacion.Archivos.push(archivoAdjCotizacion);
          }
      }


      //cotizacionMS.POSTQT.Cotizacion.push(cotizacionEntity);
     // console.clear();
      console.log(JSON.stringify(cotizacionMS));
      let options = new RequestOptions({ headers: headers });
      return this.http.post(URL_CREAR_QT, cotizacionMS, options)
        //.map(this.extractData)
        .catch(this.handleError);


}/////agregar


/****************GET COTIZACION**************** */

  obtener(id: string, publicada:boolean = true): Observable<Cotizacion> {
      let url = URL_DETALLE_QT_BORRADOR;
      if (publicada)
      url = URL_DETALLE_QT
      let items$ = this.http
        .get(url + id, { headers: this.getHeaders(localStorage.getItem('tipo_empresa')) })
        .map(this.mapCotizacion)
        .catch(this.handleError);
      return items$;
  }

  private mapCotizacion(res: Response): Cotizacion {
      //console.log('extractData2', res);
      let respuesta = {
        status: res ? res.status : -1,
        statusText: res ? res.statusText : "ERROR",
        data: res ? res.json() || {} : {},
      }
  
      let objeto_json = res.json();
      console.log(objeto_json)

      if(objeto_json.cotizacion)
      return objeto_json.cotizacion;
      let cot = new Cotizacion();

      let cs: Cotizacion = {

        idrfq:objeto_json.data.cotizacion.idrfq,
        estadorfqcomprador: objeto_json.data.cotizacion.estadorfqcomprador,
        //estadorfqcomprador: 'OCSSS',
        numerorfq:objeto_json.data.cotizacion.numerorfq,
        version:objeto_json.data.cotizacion.version,
        orgpro:objeto_json.data.cotizacion.orgpro,
        orgcom:objeto_json.data.cotizacion.orgcom,
        nomorgcom:objeto_json.data.cotizacion.nomorgcom,
        nomorgpro :objeto_json.data.cotizacion.nomorgpro,
        nomusucom:objeto_json.data.cotizacion.nomusucom?objeto_json.data.cotizacion.nomusucom:'',
        nomusupro:objeto_json.data.cotizacion.nomusupro,
        fechacreacion:DatatableFunctions.ConvertStringToDatetime2(objeto_json.data.cotizacion.fechacreacion),
        numeroseguimiento:objeto_json.data.cotizacion.numeroseguimiento,
        area:objeto_json.data.cotizacion.area,
        estado:objeto_json.data.cotizacion.estado,
        estadolargo:objeto_json.data.cotizacion.estadolargo,
        idmoneda:objeto_json.data.cotizacion.idmoneda,
        mensaje:objeto_json.data.cotizacion.mensaje,
        //habilitado:objeto_json.data.cotizacion.habilitado,

        atributos: [],
        productos: [],
        docadjuntos: [],
      };

      if (objeto_json.data.atributo) {
        let index = 1, numItem = 1;
        for (let item of objeto_json.data.atributo) {
          let p: Primero = {
              idatributo: item.idatributo?item.idatributo:'',              
              nombreatributo: item.atributonombre?item.atributonombre:'',
              valorenviado: item.atributovalor?item.atributovalor:'',
              nombreunidad: item.atributovalorunidad?item.atributovalorunidad:'',
              modificable: item.atributovaloreditable?item.atributovaloreditable:'',
              mandatorio: item.atributoobligatorio?item.atributoobligatorio:'',
              atributovalortipodato: item.atributovalortipodato?item.atributovalortipodato:''
              //habilitado: item.habilitado, 
          }
          cs.atributos.push(p);
        }
      }


      if (objeto_json.data.producto) {
         // let index = 1, numItem = 1;
          for (let item of objeto_json.data.producto) {
              //alert(item.codproductoorg);
              let pr: Producto = {
                  //id:0,
                  idproducto:item.in_idproducto?item.in_idproducto:'',
//                  posicion: item.posicion,
//alert(item.nombreprodcuto);
                  codigoproducto:item.codigoProducto?item.codigoProducto:'',
                  nombreproducto:item.nombreproducto?item.nombreproducto:'',
                  descripcionproducto:item.descripcionProducto?item.descripcionProducto:'',
//                  unidad:item.unidadcotizada,
                  //cantidad:('cantidadcotizada' in item) ? item.cantidadcotizada : '',
                  //precio:('precioproducto' in item) ? item.precioproducto : '',
 //                 cantidad:item.cantidadcotizada,
//                  precio:item.precioproducto,
//                 fechaentrega: DatatableFunctions.ConvertStringToDatetime2(item.fchentregapro), 
                  atributos: []
              }

              for (let itemAxP of item.atributoproducto) {

                  let artxProd: AtributoxProducto = new AtributoxProducto();

                  artxProd.idatributo=itemAxP.idatributo,   
                  artxProd.nombre=itemAxP.atributoproductonombre;
                  artxProd.obligatorio=itemAxP.atributoproductoobligatorio;
                  artxProd.valor=itemAxP.atributoproductovalor;
                  artxProd.valoreditable=itemAxP.atributoproductovaloreditable;
                  artxProd.valortipodato=itemAxP.atributoproductovalortipodato;
                  artxProd.valorunidad=itemAxP.atributoproductovalorunidad;


/*
                  nombreatributo: item.atributoproductonombre?item.atributoproductonombre:'',
                  valorenviado: item.atributoproductovalor?item.atributoproductovalor:'',
                  nombreunidad: item.atributoproductovalorunidad?item.atributoproductovalorunidad:'',
                  modificable: item.atributoproductovaloreditable?item.atributoproductovaloreditable:'',
                  mandatorio: item.atributoproductoobligatorio?item.atributoproductoobligatorio:'',
                  tipodato: item.atributoproductovalortipodato?item.atributoproductovalortipodato:'',      
                  */            
                  /*
                  "nombreatributo" : "Fecha de entrega",
                  "valorenviado" : "10/05/2018",
                  "habilitado" : 0,
                  "operadoa" : "Text",
                  "unidadmedida" : "",
                  "operadorb" : "",
                  "valororiginal" : "10/05/2018",
                  "unidadoriginal" : "N/A"
                  */

                  pr.atributos.push(artxProd);
              }
             



              cs.productos.push(pr);
          }
      }

      cs.docadjuntos = [];
      if (objeto_json.data.archivo) {
          let index = 1;
          for (let adjunto of objeto_json.data.archivo) {
              cs.docadjuntos.push({
                id: index++,
                codigo: adjunto.IdArchivo ? adjunto.IdArchivo : '',
                nombre: adjunto.nombrefile ? adjunto.nombrefile : '',
                descripcion: adjunto.descripcionfile ? adjunto.descripcionfile : '',
                url: adjunto.rutafile ? adjunto.rutafile : '',
              });
          }
      }

      console.log(cs);
      return cs;
      //return body || {};
  
    }

    private handleError(error: Response | any) {
        console.error('handleError', error.message || error);
        let  data= error ? error.json() || {} : {};     
        if (data && data.error && data.error === "invalid_token")
          DatatableFunctions.logout();
        return Observable.throw(error.message || error);
    }
  
    private getHeaders(tipo_empresa:string) {
        // I included these headers because otherwise FireFox
        // will request text/html
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('origen_datos', 'PEB2M');
        headers.append("tipo_empresa", localStorage.getItem('tipo_empresa'));
        
      /* if (tipo_empresa != "") {
          headers.append("tipo_empresa", tipo_empresa);
        }
        */
        headers.append('org_id', localStorage.getItem('org_id'));
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        // headers.append('Access-Control-Allow-Origin', '*');
    
        headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
        return headers;
    }
  
  }
  
