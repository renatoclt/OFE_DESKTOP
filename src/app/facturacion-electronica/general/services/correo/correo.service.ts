import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Servidores} from '../servidores';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Correo } from "../../models/correo/correo";
import { error } from 'selenium-webdriver';
import { SpinnerService } from 'app/service/spinner.service';
import { TranslateService } from '@ngx-translate/core';
declare var swal;
@Injectable()
export class CorreoService {
  url: string = '/correo/enviar';
  public labelContinuar: string;

  constructor( private httpClient: HttpClient,
               private servidores: Servidores,
              private _spinner: SpinnerService,
              private _translate: TranslateService) {
    this.url = this.servidores.NOTIFIC + this.url;
  }

  enviarNotificacion(correos:string[],tipoComprobante,serie,correlativo,fechaEmision,ubicacion,ubicacionXml):BehaviorSubject<Boolean>{
    this._spinner.set(true);
    let oCorreo = new Correo();
    const that = this;
    oCorreo.tipoComprobante=tipoComprobante.toUpperCase();
    oCorreo.serie=serie;
    oCorreo.correlativo=correlativo;
    oCorreo.fechaEmision=fechaEmision;
    oCorreo.correos=correos;
    oCorreo.ubicacionPdf=ubicacion;
    oCorreo.ubicacionXml=ubicacionXml;
    console.log('Servicio de Correo - EnviarNotificacion');
    console.log(oCorreo);
    let respuesta: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
    this._translate.get('continuar').subscribe(data => { that.labelContinuar = data; });

    this.httpClient.post(this.url,oCorreo).subscribe(
        data => {
          this._spinner.set(false);
          swal({
            type: 'success',
            html: '<div class="text-center"> Se envió el correo a el/los destinatario(s). </div> ',
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: that.labelContinuar,
            buttonsStyling: false
          });
        }, error => {
          this._spinner.set(false);
          swal({
            type: 'error',
            title: 'No se pudo enviar el correo.',
            confirmButtonClass: 'btn btn-danger',
            confirmButtonText: that.labelContinuar,
            buttonsStyling: false
          });
        }
    );
    return respuesta;
  }
}
