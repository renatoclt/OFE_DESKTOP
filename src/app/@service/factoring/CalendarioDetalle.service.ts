import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Header } from 'app/@core/header';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Calendario } from "app/@model/factoring/Calendario";
import { FactoringTopic } from "app/@model/factoring/FactoringTopic";
import { URI_CALENDARIO_CREAR, URI_CALENDARIO_LISTA } from "app/utils/app.constants";

@Injectable()
export class CalendarioDetalleService {
  private header:Header;
  private factoringTopic:FactoringTopic;
  constructor(
    private http: Http, 
    private httpClient: HttpClient    
  ) {
      this.header = new Header();
      this.factoringTopic = new FactoringTopic();
      this.factoringTopic.Topic = 'calendariodetalle';
  }

  public obtenerCalendarioDetallePorId(id: string){
    return this.http.get(URI_CALENDARIO_LISTA + id, this.header.getOptions([]))
      .map(this.extractData)
      .catch(this.handleError);
  }

  public editarCalendarioDetalle(calendario: Calendario) {
    this.factoringTopic.Objeto = calendario;
    return this.http.put(URI_CALENDARIO_CREAR, this.factoringTopic, this.header.getOptions([]))
      .catch(this.handleError);
  }

  /**
   * extractData
   * @param response 
   */
  private extractData(response: Response) {
    let body = response.json();
    return body || {};
  }
  /**
   * handleError
   * @param error 
   */
  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  } 
}
