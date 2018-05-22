import {Directive} from '@angular/core';
import {MayusculaPipe} from '../pipes/mayuscula.pipe';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[mayusculaDirectiva]',
  host: {
    '(keyup)': 'onKeyUp($event)'
  },
  providers: [
    MayusculaPipe
  ]
})
export class MayusculaDirective {
  constructor(private precioPipe: MayusculaPipe,
              private control: NgControl) { }

  onKeyUp(evento) {
    const nuevoValor = this.precioPipe.transform(evento.target.value);
    this.control.reset(nuevoValor);

  }

}
