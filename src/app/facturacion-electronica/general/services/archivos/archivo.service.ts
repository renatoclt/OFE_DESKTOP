import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Servidores} from '../servidores';
import {
  TIPO_ARCHIVO_CDR, TIPO_ARCHIVO_CSV, TIPO_ARCHIVO_PDF, TIPO_ARCHIVO_XML, TipoArchivo,
  TIPOS_ARCHIVOS
} from "../../models/archivos/tipoArchivo";
import * as FileSaver from 'file-saver';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {FORMATO_PRODUCTOS_MASIVAS_BASE64, FORMATO_RETENCIONES_MASIVAS_BASE64} from '../../models/archivos/FormatosBase64';
import {SpinnerService} from '../../../../service/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpResponse } from '@angular/common/http';
declare var $, swal: any;

@Injectable()
export class ArchivoService {
  urlDownload = '/archivos/download';
  urlQuery = '/archivos/search';
  urlRetencion: string;
  nombre_archivo: string;
  mediaType: string;
  urlRetencionArchivo: string;
  public labelContinuar: string;
  base: BehaviorSubject<{}> = new BehaviorSubject<{}>({data: []});

  pathFormatoArchivoMasivo = 'assets/formatos/RETENCIONES MASIVAS.csv';

  objeto = {data: []};

  constructor(private httpClient: HttpClient,
              private servidor: Servidores,
              private spinner: SpinnerService,
              private _translate: TranslateService) {
    this._translate.get('continuar').subscribe(data => this.labelContinuar = data);
    this.urlDownload = this.servidor.FILEQRY + this.urlDownload;
    this.urlQuery = this.servidor.HOSTLOCAL + this.urlQuery;
    //this.urlQuery = this.servidor.FILEQRY + this.urlQuery;
  }

  descargarArchivo(tipoArchivo: TipoArchivo) {
    // let parametros: HttpParams = new HttpParams().set('nombre','F004-00000111-01.pdf');
    this.httpClient.get(this.urlDownload, {
      // params: parametros,
      responseType: 'text'
    }).subscribe(
      (archivo) => {
        FileSaver.saveAs(this.base64ABlob(archivo, tipoArchivo.tipoContenido), 'prueba.pdf');
      }
    );
  }

  descargarArchivoRetencionPercepcion(tipoArchivo: TipoArchivo) {
    // let parametros: HttpParams = new HttpParams().set('nombre','F004-00000111-01.pdf');
    this.httpClient.get(this.urlRetencionArchivo, {
      // params: parametros,
      responseType: 'text'
    }).subscribe(
      (archivo) => {
        console.log(archivo);
        console.log(tipoArchivo);
        FileSaver.saveAs(this.base64ABlob(archivo, tipoArchivo.tipoContenido), 'archivo.' + tipoArchivo.descripcion);
      }
    );
  }

  retornarArchivoRetencionPercepcion(idComprobante: string) {
    //                     {  data: []  }
    this.spinner.set(true);
    const that = this;
    // let parametros: HttpParams = new HttpParams().set('nombre','F004-00000111-01.pdf');
    const parametros = new HttpParams()
      .set('id_comprobante', idComprobante)
      .set('tipo_archivo', '1');
    // this.urlQuery = this.urlQuery + '?id_comprobante=' + idComprobante + '&tipo_archivo=' + '1';
    setTimeout(
      () => {
        this.httpClient.get(this.urlQuery, {
          responseType: 'text',
          params: parametros
        })
          .subscribe(
            (archivo) => {
              this.spinner.set(false);
              that.base.next({data: that.convertirABinaryString(archivo)});
            },
            error2 => {
              that.base.error(error2);
              this.spinner.set(false);
            }
          );
      }, 1000
    );

  }

  // retornarArchivoRetencionPercepcionparaemision( idComprobante: string ): BehaviorSubject<{data: []}>  {
  //   const that = this;
  //   // let parametros: HttpParams = new HttpParams().set('nombre','F004-00000111-01.pdf');
  //   let retorno: any = {}; //{data: []};
  //   const DataPost: Observable<Post_retencion> = new BehaviorSubject<Post_retencion>(new Post_retencion());
  //   const parametros = new HttpParams()
  //     .set('id_comprobante', idComprobante)
  //     .set('tipo_archivo', '1');
  //   // this.urlQuery = this.urlQuery + '?id_comprobante=' + idComprobante + '&tipo_archivo=' + '1';
  //   this.httpClient.get( this.urlQuery, {
  //     responseType: 'text',
  //     params: parametros
  //   })
  //     .subscribe(
  //       (archivo) => {
  //         that.base.next({data: that.convertirABinaryString(archivo)});
  //         retorno = that.base;
  //       }
  //
  //     );
  //   return retorno;
  // }


  retornarArchivoRetencionPercepcionbase(idComprobante: string) {
    const that = this;
    const basestr: BehaviorSubject<string> = new BehaviorSubject<string>('');
    const parametros = new HttpParams()
      .set('id_comprobante', idComprobante)
      .set('tipo_archivo', '1');

    this.httpClient.get(this.urlQuery, {

      responseType: 'text',
      params: parametros
    }).take(1)
      .subscribe(
        (archivo) => {
          basestr.next(archivo);
        },
        error => {
          if (error.status === 500) {
            swal({
              type: 'error',
              title: 'No se encontró el documento de descarga u ocurrió un problema en el servidor. Vuelva a Actualizar la página',
              confirmButtonClass: 'btn btn-danger',
              confirmButtonText: that.labelContinuar,
              buttonsStyling: false
            });
          }
        }
      );
    return basestr;
  }

  retornarArchivo() {
    const that = this;
    // let parametros: HttpParams = new HttpParams().set('nombre','F004-00000111-01.pdf');
    this.httpClient.get(this.urlDownload, {
      responseType: 'text',
      // params: parametros
    })
      .subscribe(
        (archivo) => {
          that.base.next({data: that.convertirABinaryString(archivo)});
        }
      );
  }

  convertirABinaryString(base64) {
    return window.atob(base64);
  }

  base64ABlob(base64, mime) {
    mime = mime || '';
    const sliceSize = 1024;
    const byteChars = window.atob(base64);
    const byteArrays = [];

    for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      const slice = byteChars.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: mime});
  }

  descargarFormatoArchivoMasiva() {
    this.descargarFormato(FORMATO_PRODUCTOS_MASIVAS_BASE64, 'Formato_Retenciones_Masivas.csv', TIPO_ARCHIVO_CSV);
  }

  descargarFormato(formato: string, nombre: string, tipo: TipoArchivo) {
    FileSaver.saveAs(this.base64ABlob(formato, tipo), nombre);
  }

  descargarFormatoProductoMasiva() {
    this.descargarFormato(FORMATO_PRODUCTOS_MASIVAS_BASE64, 'Formato_Productos_Masivas.csv', TIPO_ARCHIVO_CSV);
  }

  descargararchivotipo(uuid: string, tipo: number) {
    this.spinner.set(true);
    const that = this;
    switch (tipo.toString()) {
      case TIPO_ARCHIVO_PDF.idArchivo.toString() :
        this.nombre_archivo = uuid + '-' + tipo + '.pdf';
        this.mediaType = 'application/pdf';
        break;
      case TIPO_ARCHIVO_XML.idArchivo.toString() :
        this.nombre_archivo = uuid + '-' + tipo + '.xml';
        this.mediaType = 'application/xml';
        break;
      case TIPO_ARCHIVO_CDR.idArchivo.toString() :
        this.nombre_archivo = uuid + '-' + tipo + '.xml';
        this.mediaType = 'application/zip';
        break;
      case TIPO_ARCHIVO_CSV.idArchivo.toString() :
        this.nombre_archivo = uuid;
        this.mediaType = 'application/vnd.ms-excel';
        break;
    }
    const parametros = new HttpParams()
      .set('nombre', this.nombre_archivo);
    this.httpClient.get(this.urlDownload, {responseType: 'blob', params: parametros,  observe: 'response'})
    // this.httpClient.get(this.urlDownload, {responseType: 'blob', params: parametros})
      .subscribe(
        (data: HttpResponse<any>) => {
          this.spinner.set(false);
          const mediaType = this.mediaType;
          // const blob = new Blob([data], {type: mediaType});
          const blob = new Blob([data.body], {type: mediaType});
          const filename = data.headers.get('Content-Disposition').split('=')[1];
          FileSaver.saveAs(blob, filename);
        },
        error => {
          this.spinner.set(false);
          console.log('ERROR');
          console.log(error);
          console.log(error.status);
          if (error.status == 500) {
            swal({
              type: 'error',
              title: 'No se encontró el documento de descarga u ocurrió un problema en el servidor.',
              confirmButtonClass: 'btn btn-danger',
              confirmButtonText: that.labelContinuar,
              buttonsStyling: false
            });
          }
          if (error.status == 0) {
            swal({
              type: 'error',
              title: 'No cuentas con conexión a internet. Por favor revise su conexión.',
              confirmButtonClass: 'btn btn-danger',
              buttonsStyling: false
            });
          }
        }
      );
  }


  searcharchivo(nombre: string) {
    const basestr: BehaviorSubject<string> = new BehaviorSubject<string>('');
    const parametros = new HttpParams()
      .set('nombre_archivo', nombre);
    this.httpClient.get(this.urlQuery, {
      responseType: 'text',
      params: parametros
    }).take(1)
      .subscribe(
        (archivo) => {
          basestr.next(archivo);
        }
      );
    return basestr;
  }

  downloadArchivo(nombre: string) {
    const that = this;
    this.mediaType = 'application/xml';
    const parametros = new HttpParams()
      .set('nombre', nombre);
    this.httpClient.get(this.urlDownload, {responseType: 'blob', params: parametros})
      .subscribe(
        (data) => {
          const mediaType = this.mediaType;
          const blob = new Blob([data], {type: mediaType});
          const filename = nombre;
          FileSaver.saveAs(blob, filename);
        },
        error => {
          if (error.status == 500) {
            swal({
              type: 'error',
              title: 'No se encontró el documento de descarga u ocurrió un problema en el servidor.',
              confirmButtonClass: 'btn btn-danger',
              confirmButtonText: that.labelContinuar,
              buttonsStyling: false
            });
          }
        }
      );
  }

}
