import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx'
import { Servidores } from '../servidores';
import { PersistenceService, StorageType } from 'angular-persistence';

@Injectable()
export class ParametrosService {

    private urlParametros: string;
    private urlTiposCalculo: string;

    constructor(private httpClient: HttpClient, private persistenceService: PersistenceService,
        private servidores: Servidores) {
        this.urlParametros = servidores.PARMQRY;
        this.urlTiposCalculo = "http://localhost:3000/v1/sincronizacion/tipoCalcIsc";;
    }

    buscarParametros(): BehaviorSubject<{}> {
        let parametros: BehaviorSubject<{}> = new BehaviorSubject<{}>({});
        this.httpClient.get(this.urlParametros).subscribe(data => {
                parametros.next(data);
            });
        return parametros;
    }

    obtenerTipoCalculo(urlTipoCalculo: string) {
        let tiposCalculos: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
        this.httpClient.get(urlTipoCalculo).map(
            data => {
                const tipoCalculo: any[] = data["_embedded"]["tipoCalculoIscRedises"];
                return tipoCalculo;
            }).subscribe(data => {
                tiposCalculos.next(data);
            });
        return tiposCalculos;
    }

    guardarTipoCalculo(tiposCalculos: any[]) {
        var mensaje: string = "";
        var tiposCalculosJson = JSON.stringify(tiposCalculos);
        this.httpClient.post(this.urlTiposCalculo, tiposCalculosJson).subscribe(
            res => {
                console.log(res);
                mensaje = "se registraron los tipos de calculo obtenidos";
            },
            err => {
                console.log(err);
                mensaje = "Error, no se pudo registrar los tipos de calculo";
            }
        );
        return mensaje;
    }
}