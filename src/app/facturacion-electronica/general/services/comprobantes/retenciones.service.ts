import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servidores } from '../servidores';
import { BehaviorSubject } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Comprobante } from '../../models/comprobantes/comprobante';

@Injectable()
export class RetencionesService {
    private url = '/documento';

    constructor(private httpClient: HttpClient,
        private servidores: Servidores) {
        this.url = this.servidores.DOCUQRY + this.url;
    }

    private buscar(parametros: HttpParams): BehaviorSubject<any[]> {
        const comprobantes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
        this.httpClient.get<any[]>(this.url, {
            params: parametros
        }).map(
            data => {
                const prueba: any[] = data['content'];
                return prueba;
            }
            )
            .subscribe(
            data => {
                comprobantes.next(data);
                console.log(comprobantes.getValue());
            }
            );
        return comprobantes;
    }

    public buscarComprobante(
        uid: string,
    ): BehaviorSubject<any[]> {
        const parametros = new HttpParams()
            .set('id', uid);
        return this.buscar(parametros);
    }

}
