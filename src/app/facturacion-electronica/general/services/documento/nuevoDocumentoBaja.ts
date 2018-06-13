import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Servidores} from '../servidores';
import {ComunicacionDeBaja} from '../../../resumen-bajas/models/comunicacion-de-baja';
import {SpinnerService} from '../../../../service/spinner.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
declare var swal: any;


@Injectable()
export class NuevoDocumentoBajaService {
  private url = '/comunicacionesDeBaja';


  constructor(private httpClient: HttpClient,
              private servidores: Servidores,
              private _spinner: SpinnerService) {
    this.url = this.servidores.DOCUCMD + this.url;
  }

  subir(documento: ComunicacionDeBaja): BehaviorSubject<boolean> {
    this._spinner.set(true);
    console.log(JSON.stringify(documento));
    const documentobaja = JSON.stringify(documento);
    const response = new  BehaviorSubject<boolean>(null);
    this.httpClient.post<ComunicacionDeBaja>(this.url, documento)
      .subscribe(
        data => {
          this._spinner.set(false);
          swal({
            type: 'success',
            title: 'Acción Exitosa',
            html:
              '<div class="text-center">El ticket de Comunicación de Baja será enviado al correo de la Organización Emisora.</div>',
            confirmButtonClass: 'btn btn-success',
            confirmButtonText: 'CONTINUAR',
            buttonsStyling: false
          });
          response.next(true);
        },
        error => {
          response.next(false);
          this._spinner.set(false);
          console.log('error');
          console.log(error);
          swal({
            type: 'error',
            title: 'No se pudo subir el archivo. Inténtelo en otro momento.',
            confirmButtonClass: 'btn btn-danger',
            buttonsStyling: false,
            confirmButtonText: 'CONTINUAR',
          });
        }
      );
    return response;
  }

}
