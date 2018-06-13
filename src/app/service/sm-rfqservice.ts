import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { RFQCompradorInsert, Atributo, ProveedorInvitado, Proveedor, Producto,  AtributoxProducto, ProveedorDirigido, CambioEstado } from "app/model/sm-rfqcomprador";
import { Archivo } from "app/model/archivo"
import { ResponseError } from '../model/responseerror';
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppUtils } from "app/utils/app.utils";
import { URL_DETALLE_RFQ, URL_CAMBIO_ESTADO_RFQ } from 'app/utils/app.constants';
import { Usuario } from "app/model/usuario";
import { Articulo } from 'app/model/guia';
//import { Producto } from 'app/facturacion-electronica/comprobantes/models/producto';

declare var DatatableFunctions: any;
@Injectable()
export class RfqService {
  util: AppUtils;
  constructor(private http: Http) {
  }

  convertStringToDate(strDate: string): Date {
    return new Date(strDate);
  } 

  //ESTA OBTENIENDO DOS CAMPOS QUE SON LOS PARAMETROS DE JSON DE DETRACCIONES 
  //obtener(id: string, tipo_empresa: string): Observable<Detracciones> {
  obtener(id: string ): Observable <RFQCompradorInsert> {
    let items$ = this.http
      //.get(URL_DETALLE_DETRACCION + id, { headers: this.getHeaders(tipo_empresa) })
      .get(URL_DETALLE_RFQ + id, { headers: this.getHeaders() })
      .map(this.mapRFQComprador)
      .catch(this.handleError);
    return items$;
  }

  private mapRFQComprador(res: Response): RFQCompradorInsert {
    //console.log('extractData2', res);
    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res ? res.json() || {} : {},
    }

    let objeto_json = res.json();
    let rfq: RFQCompradorInsert = {
      
      idrfq:objeto_json.data.idrfq,
      nroreq:objeto_json.data.nroreq,
      prioridad: objeto_json.data.prioridad,
      observacion: objeto_json.data.observacion,
      almacen:objeto_json.data.almacen,
      propietario: objeto_json.data.propietario,
      fechainicio: DatatableFunctions.ConvertStringToDatetime2(objeto_json.data.fechainicio),
      fechafin: DatatableFunctions.ConvertStringToDatetime2(objeto_json.data.fechafin),
      moneda:objeto_json.data.codmoneda,
      estado: objeto_json.data.estado,
      rucOrgCompradora: objeto_json.data.rucOrgCompradora,
      logoOrgCompradora: objeto_json.data.logoOrgCompradora,
      
      area: objeto_json.data.area,
      mensaje: objeto_json.data.mensaje,
      notas: objeto_json.data.notas,
      comentarios: objeto_json.data.comentarios,
      nomorgcompradora: objeto_json.data.nomorgcompradora,

      codestado: objeto_json.data.codestado,


      atributos:[],
      productos:[],
      docadjuntos:[],
      proveedores:[],
      proveedoresinvitados:[], 
      proveedorDirigido:[],
    };



    if (objeto_json.data.proveedorDirigido) {
      let index = 1, numItem = 1;
      for (let item of objeto_json.data.proveedorDirigido) {
        let provDir:ProveedorDirigido = new ProveedorDirigido();

        /*provDir.usuario = item.usuario;*/
        provDir.razonsocial = item.razonsocial;
        provDir.rucproveedordirigido = item.rucproveedordirigido;
        /*provDir.idusuario = item.idusuario;*/
        provDir.codigoorganizacion = item.codigoorganizacion;
        provDir.rucproveedor = item.rucproveedor;
        provDir.codestado = item.codestado;    
        provDir.estado = item.estado;
        provDir.codproveedor = item.codproveedor;        
        rfq.proveedorDirigido.push(provDir);
      }
    };



    //let provDir


    if (objeto_json.data.atributos) {
      let index = 1, numItem = 1;
      for (let item of objeto_json.data.atributos) {
        let d: Atributo = {

          id: item.id?item.id:'',
          nombreatributo: item.nombreatributo?item.nombreatributo:'',
          valor: item.valor?item.valor:'',
          unidad: item.unidad?item.unidad:'',
          modificable: item.modificable?item.modificable:'',
          mandatorio: item.mandatorio?item.mandatorio:'',
          atributovalortipodato:item.atributovalortipodato?item.atributovalortipodato:'', 
        }

        rfq.atributos.push(d);
      }
    };

    if (objeto_json.data.productos) {
      let i = 0;
      for (let item of objeto_json.data.productos) {
          let pro: Producto = new Producto();

          pro.id=i+1;
          pro.idproducto=item.idproducto?item.idproducto:'';
          pro.posicion=item.posicion?item.posicion:'';
          pro.codigoproducto=item.codigoproducto?item.codigoproducto:'';
          pro.nombreproducto=item.nombreproducto?item.nombreproducto:'';
          pro.descripcionproducto=item.descripcionproducto?item.descripcionproducto:'';
          pro.atributos=new Array();

          let j = 0;
          for (let itemAxP of objeto_json.data.productos[i].atributoxproducto) {
              let atr: AtributoxProducto = new AtributoxProducto ();

              atr.nombreatributo=itemAxP.nombreatributo?itemAxP.nombreatributo:'',
              atr.valorenviado=itemAxP.valorenviado?itemAxP.valorenviado:'',
              atr.nombreunidad=itemAxP.nombreunidad?itemAxP.nombreunidad:'',
              atr.modificable=itemAxP.modificable?itemAxP.modificable:'',
              atr.mandatorio=itemAxP.mandatorio?itemAxP.mandatorio:'',
              atr.atributovalortipodato= itemAxP.atributovalortipodato?itemAxP.atributovalortipodato:'',
              atr.idproductoxrfq= itemAxP.idproductoxrfq?itemAxP.idproductoxrfq:'',
              atr.idrfq= itemAxP.idrfq?itemAxP.idrfq:'',
              atr.idatributo= itemAxP.idatributo?itemAxP.idatributo:''

              j++;
              pro.atributos.push(atr);
          }

          i++;
          rfq.productos.push(pro);
      }
    };

   if (objeto_json.data.archivos) {
      for (let docadjuntos of objeto_json.data.archivos) {
        let index = 1;
        rfq.docadjuntos.push({
          nombre:docadjuntos.vc_nombre? docadjuntos.vc_nombre:'',
          descripcion: docadjuntos.Archivo?docadjuntos.Archivo:'',
          url:docadjuntos.url?docadjuntos.url:'',
        }) 
      }
    }

    if(objeto_json.data.proveedorDirigido){
      let index = 1, numItem = 1;
      for (let item of objeto_json.data.proveedorDirigido) {

        let pro: Proveedor = {

          //id: index++,
          razonsocial:item.razonsocial?item.razonsocial:'',
          estado:item.estado?item.estado:'',
          //rucproveedordirigido: item.rucproveedordirigido?item.rucproveedordirigido:'',
          usuario:item.usuario?item.usuario:'',
          //rucproveedor:item.rucproveedor?item.rucproveedor:'',
    
        }


        rfq.proveedores.push(pro);
      }
    }

    if(objeto_json.data.proveedorinvitado){
      let index = 1, numItem = 1;
      for (let item of objeto_json.data.proveedorinvitado) {
        let pi: ProveedorInvitado = {

          //id: index++,
          razonsocial:item.razonSocial?item.razonsocial:'',
          ruc: item.ruc?item.ruc:'',
          email:item.email?item.email:'',
        }
        rfq.proveedoresinvitados.push(pi);
      }
    }
    
    console.log(rfq);
    return rfq;
    //return body || {};

  }

  cambioEstado(item: CambioEstado): Observable<any> {
    let headers = this.getHeaders();
    let options = new RequestOptions({ headers: headers });
    options.withCredentials = true;
    ////return this.http.put(this.urlCambioEstado, item, options)

    return this.http.put(URL_CAMBIO_ESTADO_RFQ, item, options)
      //.map(this.extractData)
      .catch(this.handleError);
  }


  private handleError(error: Response | any) {

    console.error('handleError', error.message || error);
    let  data = error ? error.json() || {} : {};     
    if (data && data.error && data.error === "invalid_token")
      //DatatableFunctions.logout();
    return Observable.throw(error.message || error);
  
  }

  private getHeaders() {
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('origen_datos', 'PEB2M');
    headers.append('tipo_empresa', localStorage.getItem('tipo_empresa') )
    headers.append('org_id', localStorage.getItem('org_id'));
    /*
    if (tipo_empresa != "") {
      headers.append("tipo_empresa", tipo_empresa);
    }
    */
    
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    // headers.append('Access-Control-Allow-Origin', '*');

    headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
    return headers;
  }
}
