import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'precioFormato'
})
export class PrecioPipe implements PipeTransform {

  transform(value: number | string, tamanioFraccion = 2): string {
    let numeroFinal = '';
    let [numero, fraccion] = (value || '').toString().split('.');
    numero = (numero || '0');
    fraccion = (fraccion || '') + '0'.repeat(tamanioFraccion - (fraccion || []).length );

    numeroFinal = numero + '.' + fraccion;
    return numeroFinal;
  }

}
