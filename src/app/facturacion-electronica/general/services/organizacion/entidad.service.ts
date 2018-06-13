import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Servidores} from '../servidores';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Entidad} from '../../models/organizacion/entidad';
import {SpinnerService} from '../../../../service/spinner.service';
import {Comprobante} from '../../models/comprobantes/comprobante';
import {Post_retencion} from '../../../percepcion-retencion/models/post_retencion';
import {ArchivoSubir} from '../../../configuracion/models/archivoSubir';
import {Observable} from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
declare var $, swal: any;

@Injectable()
export class EntidadService {
  private url = '/organizaciones/';
  private labelContinuar: string;

  constructor( private httpClient: HttpClient,
               private servidores: Servidores,
               private _spinner: SpinnerService,
               private _translate: TranslateService) {
    this.url = this.servidores.ORGAQRY + this.url;
    this._translate.get('continuar').subscribe(data => this.labelContinuar = data);
  }

  buscar(parametros: HttpParams): BehaviorSubject<Entidad[]> {
    const entidades: BehaviorSubject<Entidad[]> = new BehaviorSubject<Entidad[]>([]);
    this.httpClient.get(this.url, {
      params: parametros
    }).subscribe(
      data => {
        if ( data['_embedded']['organizacionQueries'] ) {
          entidades.next(data['_embedded']['organizacionQueries']);
        }
      }
    );
    return entidades;
  }

  buscar_uno(parametros: string): BehaviorSubject<Entidad> {
    const that = this;
    this._spinner.set(true);
    const entidades: BehaviorSubject<Entidad> = new BehaviorSubject<Entidad>(null);
    this.httpClient.get<Entidad>(this.url + parametros).subscribe(
      data => {
        this._spinner.set(false);
        if (data) {
          entidades.next(data);
        }
      },
      error => {
        this._spinner.set(false);
        swal({
          type: 'error',
          title: 'No se encontró la organización. Inténtelo en otro momento.',
          confirmButtonClass: 'btn btn-danger',
          confirmButtonText: that.labelContinuar,
          buttonsStyling: false
        });
      }
    );
    return entidades;
  }

  buscarPorRuc(numeroDocumento: string): BehaviorSubject<Entidad> {
    return this.buscar_uno(numeroDocumento);
  }

  buscarPorRazonSocialAutocomplete(razonSocial: string, idTipoDoc: string): Observable<Entidad[]> {
    const parametros = new HttpParams()
      .set('denominacion', razonSocial)
      .set('idTipoDocumento', idTipoDoc);
    return this.httpClient.get<Entidad[]>(this.url, {
      params: parametros
    }).map(
      data => {
        return data['_embedded']['organizacionQueries'];
      }
    );
  }

  buscarPorRazonSocial(razonSocial: string, idtipodoc: string): BehaviorSubject<Entidad[]> {
    const parametros = new HttpParams()
      .set('denominacion', razonSocial)
      .set('idTipoDocumento', idtipodoc);
    // http://127.0.0.1:8088/api/fe/ms-organizaciones-command/v1/organizaciones/?denominacion=A&idTipoDocumento=1
    return this.buscar(parametros);
  }

  buscarRazonSocialAutoCompletado(razonSocial: string, idTipoDocumento: string, pagina: string, tamanio: string) {
    const parametros = new HttpParams()
      .set('denominacion', razonSocial)
      .set('idTipoDocumento', idTipoDocumento)
      .set('page', pagina)
      .set('size', tamanio);
    return this.httpClient.get(this.url, {
      params: parametros
    }).map(
      data => {
        const dataNueva: Entidad[] = data['_embedded']['organizacionQueries'];
        return dataNueva;
      }
    );
  }

  actualizar_entidad(archivo: ArchivoSubir): BehaviorSubject<ArchivoSubir> {
    this._spinner.set(true);
    const that = this;
    const dataRespuesta: BehaviorSubject<ArchivoSubir> = new BehaviorSubject<ArchivoSubir>(null);
    this.httpClient.put<ArchivoSubir>(this.url, JSON.stringify(archivo))
      .subscribe(
        data => {
          this._spinner.set(false);
          let accionExitosa = '';
          this._translate.get('accionExitosa').take(1).subscribe(traducir => accionExitosa = traducir);
          let mensajeExitosoActualizarDatos = '';
          this._translate.get('mensajeExitosoActualizarDatos').take(1).subscribe(traducir => mensajeExitosoActualizarDatos = traducir);
          swal({
            type: 'success',
            title: accionExitosa,
            html:
              '<div class="text-center">' + mensajeExitosoActualizarDatos + '</div>',
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: that.labelContinuar,
            buttonsStyling: false
          }).then(
            (result) => {
              dataRespuesta.next(data);
            }, (dismiss) => {
              dataRespuesta.next(null);
            });
        },
        error => {
          this._spinner.set(false);
          let mensajeErrorActualizarDatos = '';
          this._translate.get('mensajeErrorActualizarDatos').take(1).subscribe(traducir => mensajeErrorActualizarDatos = traducir);
          swal({
            type: 'error',
            title: mensajeErrorActualizarDatos,
            confirmButtonClass: 'btn btn-danger',
            confirmButtonText: that.labelContinuar,
            buttonsStyling: false
          });
          dataRespuesta.next(null);
        }
      );
    return dataRespuesta;
  }

}
