import { Directive, ElementRef, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[MacDirective]',
    host: {
        '(input)': 'toUpperCase($event.target.value)',
        '(keyup)': 'onKeyUp($event)',
        '(keydown)': 'onKeyDown($event)',
        '(blur)': 'onBlur($event)',
    }
})
export class MacDirective {
    
    @Input('MacDirective') allowUpperCase: boolean;
    @Output() ngModelChange = new EventEmitter();
    @Output() fxChange = new EventEmitter();

    public ctrlDown = false;
    constructor(
        private elemento: ElementRef,
        private control: NgControl
    ) {
    }
    public onKeyUp(evento: Event) {
    }
    toUpperCase(value: any) {
          this.elemento.nativeElement.value = value.toUpperCase();
          this.control.reset(value.toUpperCase());
          this.elemento.nativeElement.value = this.elemento.nativeElement.value.toUpperCase();
          this.ngModelChange.emit(this.elemento.nativeElement.value);
          this.fxChange.emit(this.elemento.nativeElement.value);
      }

    public onKeyDown(evento: Event) {
        const caracterEvento = evento['which'];
        const e = <KeyboardEvent> event;
        console.log('Caracter Ingresado => ');
        console.log(caracterEvento);
        console.log(e);
        if ((e.shiftKey && e.keyCode < 65 ) || ( e.shiftKey && e.keyCode > 90) ) {
          evento.preventDefault();
        }
        if ( this.control.value ) {
            if ([8, 9, 13, 27, 37, 38, 39, 40 , 116].indexOf(caracterEvento) > -1) {
                // retroceso, enter, escape, flechas, tab , f5
                return true;
            } else if ( this.control.value.length > 16 ) {
                return false;
            } else if (caracterEvento === 189) {
                return true;
            } else if ( (caracterEvento < 48)
                || ( caracterEvento > 57 && caracterEvento < 65)
                || ( caracterEvento > 90 && caracterEvento < 96)
                || caracterEvento > 105 ) {
                evento.preventDefault();
            }
        }
        return true;
    }
    // VALIDACION PARA DATOS INGRESADOS POR CTRL + C => COPY PASTE EZ :)
    public setTamanioFormato () {
        let cadena: String;
        cadena = '';
        for ( let a = 0; a < this.control.value.length; a++ ) {
            if ( Number(this.control.value[a]) >= 0 ) {
                cadena = cadena + this.control.value[a];
            }
        }
        cadena = this.control.value;
        let cadenaFinal: String;
        cadenaFinal = '';
        for ( let a = 0; a < cadena.length; a++) {
          if ( cadena[a].charCodeAt(0) >= 48 && cadena[a].charCodeAt(0) <= 57) {
            cadenaFinal = cadenaFinal + cadena[a];
          }
        }
        cadena = cadenaFinal;
        if ( (cadena).length > 17 ) {
            cadena = (cadena.substr(0, 17));
        }
        this.control.reset( cadena );
    }
    public onBlur(evento: Event) {
    //   this.setTamanioFormato();
    }

}
