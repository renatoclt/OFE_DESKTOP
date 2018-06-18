import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { persona } from './../models/persona';

@Injectable()
export class ComprobantePersonaService {

    private urlPersonaRegistro = "http://localhost:3000/v1/juridico";
    private urlPersonaId = "http://localhost:3000/v1/juridico/:id";

    constructor(private _httpClient: HttpClient) {

    }

    public registrarPersona(entidad : persona) {
        var entidadJson = JSON.stringify(entidad);
        this._httpClient.post(this.urlPersonaRegistro, entidad).subscribe(
            res => {
                console.log(res);
                console.log("se registro en la base de datos el cliente");
            },
            err => {
                console.log(err);
            }
        );
    }

    public obtenerPersonaPorId() {
        return this._httpClient.get<any[]>(this.urlPersonaId, {
            observe: 'body',
            responseType: 'json'
        }).map(
            (persona) => {
                return persona;
            }
        );
    }
}
