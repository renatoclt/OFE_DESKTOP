import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Servidores } from "app/facturacion-electronica/general/services/servidores";
import { BasePaginacion } from "app/facturacion-electronica/general/services/base.paginacion";
import { SpinnerService } from "app/service/spinner.service";
import { BehaviorSubject } from "rxjs";
import { DocumentoQuery } from "app/facturacion-electronica/general/models/comprobantes";
import { error } from "util";
import { OrganizacionDTO } from "../../models/organizacion/entidad";


@Injectable()
export class DocumentoQueryService {

    private urlDocumnetId: string;
    private url: string;
    private documentoPorId: BehaviorSubject<DocumentoQuery>;
    private urlGuardarOrganizacion: string = '/entidad/guardarEntidad'

    constructor(
        private _httpClient: HttpClient,
        private _servidores: Servidores,
        public _paginacion: BasePaginacion,
        public _spinner: SpinnerService
    ){
        this.url = this._servidores.HOSTLOCAL;
        this.urlDocumnetId = '/documento?id=';
        this.documentoPorId = '';
    }
    public buscarPorUuid(uuid: string) {
        const parametros = new HttpParams()
            .set('id', uuid);

        let urlDefecto = this._servidores.DOCUQRY + this.urlDocumnetId;
        // 'http://192.168.70.21:8081/api/fe/ms-documentos-query/v1/documento';
        //  let urlDefecto = 'http://35.225.238.222:8081/api/fe/ms-documentos-query/v1/documento/query';
        return this.buscarDefecto(parametros, urlDefecto);
    }
    buscarDefecto(parametros: HttpParams, urlDefecto): BehaviorSubject<DocumentoQuery> {
        const comprobantes: BehaviorSubject<DocumentoQuery[]> = new BehaviorSubject<DocumentoQuery[]>([]);
        this._spinner.set(true);
        this._httpClient.get<DocumentoQuery[]>(urlDefecto, {
            params: parametros
        }).map(
            data => {
                const prueba: DocumentoQuery[] = data['content'];
                this._spinner.set(false);
                return prueba;
            },
            error => {
                this._spinner.set(false);
            }
            )
            .subscribe(
            data => {
                comprobantes.next(data);
                this._spinner.set(false);
            },
            error => {
                this._spinner.set(false);
            }
            );
        return comprobantes;
    }
    public buscarDocumenentoPorId(uuid: string): BehaviorSubject<DocumentoQuery> {
        this.url = this.url + this.urlDocumnetId + uuid;
        this._spinner.set(true);
        this._httpClient.get<DocumentoQuery>( this.url,
            // {responseType: 'text'}
        )
        .subscribe(
            data => {
                this._spinner.set(false);
                this.documentoPorId.next( data );
                return this.documentoPorId;
            },
            error => {
                this._spinner.set(false);
                this.documentoPorId.next( error );
                return this.documentoPorId;
            }
        );
        return this.documentoPorId;
    }

    public guardarOrganizacion(organizacion : OrganizacionDTO){
        let organizacionRpta: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
        this._httpClient.post<OrganizacionDTO>(this.urlGuardarOrganizacion, organizacion ).subscribe();
        return organizacionRpta;
    }

}
