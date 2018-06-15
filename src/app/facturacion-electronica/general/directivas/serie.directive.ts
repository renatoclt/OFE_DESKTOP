import { Directive, ElementRef, Input, EventEmitter , Output} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[SerieDirective]',
  host: {
    '(input)': 'toUpperCase($event.target.value)',
    '(keydown)': 'onKeyDown($event)'
  }

})
export class SerieDirective  {

  @Input('SerieDirective') allowUpperCase: boolean;
  @Output() ngModelChange = new EventEmitter();
  @Output() fxChange = new EventEmitter();
  private maxTamanio: number;

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
    const tamanio = this.control.value.length;

    if ((e.shiftKey && e.keyCode < 65 ) || ( e.shiftKey && e.keyCode > 90) ) {
      e.preventDefault();
    }
    if ((e.keyCode == 219) || (e.keyCode == 221) || (e.keyCode == 186) || (e.keyCode == 187) || (e.keyCode == 222) || (e.keyCode == 191) || (e.keyCode == 188) || (e.keyCode == 190) || (e.keyCode == 189) {
      e.preventDefault();
    }
    // if (tamanio > this.maxTamanio - 1 ) {
    //   if (this.control.value) {
    //
    //   } else {
    //       e.preventDefault();
    //   }
    // }
    this.setFormato();
  }

  public setFormato () {
    let cadena: string;
    cadena = this.control.value;
    if ( cadena.length - 1 > this.maxTamanio  - 2) {
      cadena = (cadena.substr(0, this.maxTamanio - 1));
    }
    this.control.reset( cadena );
  }
}