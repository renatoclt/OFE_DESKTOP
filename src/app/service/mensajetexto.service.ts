import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { URL_ENVIAR_MENSAJE_TEXTO } from 'app/utils/app.constants';
declare var DatatableFunctions: any;

@Injectable()
export class MensajeTextoService {

    constructor(private http: Http) {
    }

    enviar(numeros, codigos, mensaje:string) {
        let headers = this.getHeaders();
        let options = new RequestOptions({ headers: headers });

        for (var i = 0; i < numeros.length; i++) {
            let msg=JSON.stringify({ numero: numeros[i], codpais: codigos[i], mensaje: mensaje});
            this.http.post(URL_ENVIAR_MENSAJE_TEXTO, msg, options).catch(this.handleError).subscribe();
        }
    }

    private getHeaders() {
        // I included these headers because otherwise FireFox
        // will request text/html
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('origen_datos', 'PEB2M');
        headers.append("tipo_empresa", localStorage.getItem('tipo_empresa'));
        headers.append('org_id', localStorage.getItem('org_id'));
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
  //    headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
        headers.append("Ocp-Apim-Subscription-Key", "07a12d074c714f62ab037bb2f88e30d3");
    
        return headers;
    }
    
    private handleError(error: Response | any) {

        console.error('handleError', error.message || error);
        let  data= error ? error.json() || {} : {};     
        if (data && data.error && data.error === "invalid_token")
          DatatableFunctions.logout();
        return Observable.throw(error.message || error);
      }

}