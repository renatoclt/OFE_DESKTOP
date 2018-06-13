import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { RFQCompradorInsert } from '../model/rfqcomprador';
import { ResponseError } from '../model/responseerror';
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class RFQCompradorService {

  private urlSearch: string = 'http://b2miningdata.com/rfqc/v1/rfqcomprador/v1/listvm/1';
  private urlAdd: string = 'http://b2miningdata.com/irfq/v1/postrfq/';
  private urlGet: string = 'http://b2miningdata.com/rfqcd/v1/rfqcompradordetalles/v1/list/';

  constructor(private http: Http) {
  }

  buscar(): Observable<any> {
    
    let items$ = this.http
      .get(this.urlSearch, { headers: this.getHeaders() })
      .map(this.extractData)
      .catch(this.handleError);
    return items$;
  }
  
  obtener(idRfq: number): Observable<any> {
    
    let items$ = this.http
      .get(this.urlGet + idRfq, { headers: this.getHeaders() })
      .map(this.extractData)
      .catch(this.handleError);
    return items$;
  }

  add(item: RFQCompradorInsert): Observable<any> {
    let headers = this.getHeaders();
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.urlAdd, item, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {    
    
    let respuesta = {
      status: res ? res.status : -1,
      statusText: res ? res.statusText : "ERROR",
      data: res? res.json() || {}:{},
    }
    return respuesta;
    //return body.data || {};
  }
  private handleError(error: Response | any) {
    //console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  private getHeaders() {
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    return headers;
  }

}





