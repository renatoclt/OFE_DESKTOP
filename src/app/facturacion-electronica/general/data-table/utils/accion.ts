import {TipoAccion} from './tipo-accion';

export class Accion {
  nombre: string;
  icono?: Icono;
  tipoAccion: TipoAccion;
  atributoItemAComparar?: string;
  paraEstarHabilitado?: any[];

  constructor(nombre: string,
              icono?: Icono,
              tipoAccion?: TipoAccion,
              atributoItemAComparar ?: string,
              paraEstarHabilitado ?: any[]
              ) {
    this.nombre = nombre;
    this.icono = icono;
    this.tipoAccion = tipoAccion;
    this.atributoItemAComparar = atributoItemAComparar;
    this.paraEstarHabilitado = paraEstarHabilitado;
  }
}

export class Icono {
  nombre: string;
  clase: string; //nombre en material.icons
  constructor (nombre: string,
               clase: string) {
    this.nombre = nombre;
    this.clase = clase;
  }
}
