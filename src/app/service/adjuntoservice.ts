import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response, ResponseContentType} from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Observable';

import {Archivo} from "app/model/archivo";
/*import { Configuration } from '../app.constants';*/
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {AppUtils} from "app/utils/app.utils";

declare var DatatableFunctions, CryptoJS: any;
@Injectable()
export class AdjuntoService {


  private urlAgregar: string;

  util: AppUtils;

  private AzureStorageKey: string = 'UfDrI36qq+Aes78m1C0yB6CAVganO7XrVlTzLZMssA53oFRkHHrZ/UWgu7/jlkJy2L5XRrCTl26/jhOlhU0Rrw==';
  private ContentMD5: string = '';
  private ContentType: string = 'image/jpeg,';
  private xmsversion: string = '2017-04-17';
  private myaccount: string = 'sab2md';
  private mycontainer: string = 'temp';

  constructor(private http: Http) {
    this.urlAgregar = "https://" + this.myaccount + ".blob.core.windows.net/" + this.mycontainer + "/";
  }

  ObtenerUrlDescarga(item: Archivo): string {

      let url = "https://" + this.myaccount + ".blob.core.windows.net/" + this.mycontainer + "/" + item.nombreblob;
      return url;
  }

  DescargarArchivo(item: Archivo): Observable<Blob> {
    let now = new Date();
    let date = now.toUTCString();
    let headers = new Headers();

    let urlarchivo = item.url;

    urlarchivo= urlarchivo.replace('https://','');
    urlarchivo= urlarchivo.replace('http://','');

    let parts=urlarchivo.split("/");

    //item.nombreblob=parts[parts.length-1];

    let container= parts[1];

    item.nombreblob=urlarchivo.replace( this.myaccount + ".blob.core.windows.net/" + container+ "/", "");

    console.log('item.nombreblob',item.nombreblob);



    headers.append("Authorization", 'SharedKeyLite ' + this.myaccount + ':' + this.getAuthorization('GET', date, '', item.nombreblob, null,container));
    headers.append('x-ms-date', date);
    headers.append('x-ms-version', this.xmsversion);
    headers.append('Content-Type', undefined);

    let options = new RequestOptions({ headers: headers });
    options.responseType = ResponseContentType.Blob;
    let url = "https://" + this.myaccount + ".blob.core.windows.net/" + container+ "/" + item.nombreblob;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  AgregarArchivo(item: Archivo): Observable<any> {
    let date = new Date();
    let headers = this.getHeaders('PUT', date.toUTCString(), item.contenido.type + ',', item.nombreblob, item.contenido.size, item);
    let options = new RequestOptions({ headers: headers });



    let url = this.urlAgregar + item.nombreblob;
    let body = item.contenido;

    return this.http.put(url, body, options)
      //.map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(response: Response) {


    let contentType = response.headers.get('content-type');
    let blob = new Blob([response.blob()], { type: contentType });
    return blob;

  }
  private handleError(error: Response | any) {
    console.error('handleError', error.message || error);
    return Observable.throw(error.message || error);
  }

  private getHeaders(verb: string, date: string, ContentType: string, namefile: string, ContentLength: number, item: Archivo) {
    // I included these headers because otherwise FireFox
    // will request text/html
    let headers = new Headers();

    headers.append("Authorization", 'SharedKeyLite ' + this.myaccount + ':' + this.getAuthorizationAgregar(verb, date, ContentType, namefile, 'BlockBlob', item));
    headers.append('x-ms-date', date);
    headers.append('x-ms-version', this.xmsversion);

    headers.append('x-ms-meta-nombreoriginal', item.nombre);
    headers.append('x-ms-meta-orgid', localStorage.getItem('org_id'));

    headers.append('x-ms-blob-type', 'BlockBlob');
    headers.append('Content-Type', undefined);
    //headers.append('Content-Length', ContentLength.toString());



    return headers;
  }



  private getAuthorization(verb: string, date: string, ContentType: string, namefile: string, blob_type: string, container:string) {

    var canHeaders = "";
    if (blob_type)
      canHeaders = "x-ms-blob-type:" + blob_type + "\n";

    canHeaders = canHeaders + "x-ms-date:" + date + "\n" +
      "x-ms-version:" + this.xmsversion + "\n";

    //Signature String
    let finalStr = verb + "\n";
    finalStr += this.ContentMD5 + "\n";
    finalStr += ContentType + "\n";
    finalStr += "\n";
    finalStr += canHeaders;
    finalStr += "/" + this.myaccount + "/" + container + "/" + namefile;
console.log(finalStr);
    let Authorization = CryptoJS.HmacSHA256(finalStr, CryptoJS.enc.Base64.parse(this.AzureStorageKey))
      .toString(CryptoJS.enc.Base64);
    return Authorization;
  }

  private getAuthorizationAgregar(verb: string, date: string, ContentType: string, namefile: string, blob_type: string,item: Archivo) {

        var canHeaders = "";
        if (blob_type)
          canHeaders = "x-ms-blob-type:" + blob_type + "\n";

        canHeaders = canHeaders + "x-ms-date:" + date + "\n" +
        "x-ms-meta-nombreoriginal:" + item.nombre + "\n"+
        "x-ms-meta-orgid:" + localStorage.getItem('org_id') + "\n"+
        "x-ms-version:" + this.xmsversion + "\n";


        //Signature String
        let finalStr = verb + "\n";
        finalStr += this.ContentMD5 + "\n";
        finalStr += ContentType + "\n";
        finalStr += "\n";
        finalStr += canHeaders;
        finalStr += "/" + this.myaccount + "/" + this.mycontainer + "/" + namefile;

        console.log(finalStr);

        let Authorization = CryptoJS.HmacSHA256(finalStr, CryptoJS.enc.Base64.parse(this.AzureStorageKey))
          .toString(CryptoJS.enc.Base64);
        return Authorization;
      }



}
