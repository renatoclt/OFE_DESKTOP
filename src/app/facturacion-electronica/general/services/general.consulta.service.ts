import { Injectable } from '@angular/core';
import { DtoOutConsultarBoleta } from '../dto/dtoOutConsultarBoleta';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TipoDocumento } from '../models/tipoDocumento';
import { Promise } from 'q';

@Injectable()
export class GeneralConsultaService {

    public dtoOutConsultarBoleta: DtoOutConsultarBoleta[];
    public dtoOutListarTipoDocumento: TipoDocumento[];
    private urlConsultaDocumentoRelacionado = 'https://facturacion-cb377.firebaseio.com/comprobante.json';
    private urlListarTipoDocumento = 'https://facturacion-cb377.firebaseio.com/tipoDocumento.json';

    public consultarDocRelacionado: BehaviorSubject<DtoOutConsultarBoleta[]> = new BehaviorSubject<DtoOutConsultarBoleta[]>([]);

    constructor(private _httpClient: HttpClient) {
        this.getTiposMoneda();
    }

    public listarTipoDocumento(): any {
        return this._httpClient.get<TipoDocumento[]>(this.urlListarTipoDocumento);
    }
    public buscar(): any {
        this._httpClient.get<TipoDocumento[]>( this.urlListarTipoDocumento ).
        subscribe(
            data => {
                this.dtoOutListarTipoDocumento = data;
                console.log('Servicio', this.dtoOutListarTipoDocumento);
            }
        );
    }
    public getdtoOutListarTipoDocumento(): Array<TipoDocumento> {
        return this.dtoOutListarTipoDocumento;
    }
    /*get(): Promise<Bundle> {
        return this._httpClient
        .get<TipoDocumento>(`${this.urlListarTipoDocumento}`)
        .toPromise();
    }*/

    getTipos(url: string) {
        return this._httpClient.get<any[]>(url, {
          observe: 'body',
          responseType: 'json'
        }).
        map(
          (tipos) => {
            return tipos;
          }
        );
    }
    getTiposMoneda() {
        this.getTipos(this.urlListarTipoDocumento).subscribe(
          (tipos: any[]) => {
            this.dtoOutListarTipoDocumento = tipos;
            this.consultarDocRelacionado.next(tipos.slice());
          }
        );
      }
}
