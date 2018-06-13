import { Directive, ElementRef, Input, EventEmitter , Output} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[SerieDirective]',
  host: {
      '(input)': 'toUpperCase($event.target.value)',
      '(keydown)': 'onKeyDown($event)',
      '(keypress)': 'onKeyPress($event)'
  }

})
export class SerieDirective  {

    @Input('SerieDirective') allowUpperCase: boolean;
    @Output() ngModelChange = new EventEmitter();
    @Output() fxChange = new EventEmitter();
    private maxTamanio: number;
    private validador: boolean;

  constructor(private ref: ElementRef,
              private control: NgControl) {
    this.maxTamanio = 4;
  }

  toUpperCase(value: any) {
    if (this.allowUpperCase) {
      this.ref.nativeElement.value = value.toUpperCase();
      this.control.reset(value.toUpperCase());
      this.ref.nativeElement.value = this.ref.nativeElement.value.toUpperCase();
      this.ngModelChange.emit(this.ref.nativeElement.value);
      this.fxChange.emit(this.ref.nativeElement.value);
    }
  }

  onKeyDown(evento: Event) {
      const caracterEvento = evento['which'];
      const e = <KeyboardEvent> event;
      let tmp = false;
      //  Caracteres de recorrido izq, der, ini, fin, supr
      if (e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46) {
          return true;
      }
      if (this.control.value.length > (this.maxTamanio - 1)) {
          e.preventDefault();
      }
      //  Formato alfanumerico
      if ( e.keyCode > 47 && e.keyCode < 106 ) {
          console.log('------------------------------');
      } else {
          e.preventDefault();
      }
      //  Validación Shift
      if ((e.shiftKey && e.keyCode < 65 ) || ( e.shiftKey && e.keyCode > 90) ) {
          e.preventDefault();
      }
    }
    //  Permite validar ALT + num, tilde + vocal
    onKeyPress(evento: Event) {
        const e = <KeyboardEvent> event;
        if ( e.keyCode >= 48 && e.keyCode < 58 || e.keyCode > 65 && e.keyCode < 94 || e.keyCode > 96 && e.keyCode < 123 ) {
            console.log('------------------------------');
        } else {
            e.preventDefault();
        }
    }
}
