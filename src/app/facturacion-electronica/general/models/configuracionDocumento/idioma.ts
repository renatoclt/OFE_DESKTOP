export class Idioma {
  idIdioma: number;
  descripcionCorta: string;
  descripcionLarga: string;
  constructor(idIdioma: number,
              descripcionCorta: string,
              descripcionLarga: string) {
    this.idIdioma = idIdioma;
    this.descripcionCorta = descripcionCorta;
    this.descripcionLarga = descripcionLarga;
  }
}

export const IDIOMA_ES = new Idioma(1,'ES','Español');
export const IDIOMA_EN = new Idioma(2,'EN','Inglés');
