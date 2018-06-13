import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'mayusculaFormato'
})
export class MayusculaPipe implements PipeTransform {

  transform(value: number | string): string {
    const nuevoValor = value.toString();
    return nuevoValor.toUpperCase();
  }

}
