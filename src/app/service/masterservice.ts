import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Observable';
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {BASE_URL} from 'app/utils/app.constants';

declare var DatatableFunctions: any;
@Injectable()
export class MasterService {

  //private urlList: string = 'http://b2miningdata.com/params/v1/master/list/%s/%s';

  private urlList: string = BASE_URL +'maestro/msmaestro/v1/params/?idorganizacion=%s&idtabla=%s&portal=PEB2M';
  private urlListTipo: string = BASE_URL +'maestro/msmaestro/v1/params/?idorganizacion=%s&idtabla=%s&tipo=%s&portal=PEB2M';
  private urlListJerarquia: string = BASE_URL +'maestro/msmaestro/v1/params/?idorganizacion=%s&idtabla=%s&portal=PEB2M&idtablapadre=%s&idregistropadre=%s';



  constructor(private http: Http) {
  }

  listar(vc_org: string, vc_id_tabla: string): Observable<any> {

    let items$ = this.http
      .get(this.urlList.replace(/%s/, vc_org).replace(/%s/, vc_id_tabla), { headers: this.getHeaders() })
      .map(this.extractData)
      .catch(this.handleError);
    return items$;
  }

  listarConTipo(vc_org: string, vc_id_tabla: string, tipo: string): Observable<any> {

    let items$ = this.http
      .get(this.urlListTipo.replace(/%s/, vc_org).replace(/%s/, vc_id_tabla).replace(/%s/, tipo), { headers: this.getHeaders() })
      .map(this.extractData)
      .catch(this.handleError);
    return items$;
  }

  listarConJerarquia(vc_org: string, vc_id_tabla: string, idtabla_padre: string, idregistro_padre: string): Observable<any> {
    //vc_org= localStorage.getItem('org_id');
    let items$ = this.http
      .get(this.urlListJerarquia.replace(/%s/, vc_org).replace(/%s/, vc_id_tabla).replace(/%s/, idtabla_padre).replace(/%s/, idregistro_padre),
      { headers: this.getHeaders() })
      .map(this.extractData)
      .catch(this.handleError);
    return items$;
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
    //console.error(error.message || error);
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
    headers.append("tipo_empresa", localStorage.getItem('tipo_empresa'));
    headers.append('org_id', localStorage.getItem('org_id'));

    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
    return headers;
  }

}





