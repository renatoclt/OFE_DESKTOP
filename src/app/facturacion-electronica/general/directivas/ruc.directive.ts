import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[rucDirective]',
    host: {
        '(keyup)': 'onKeyUp($event)',
        '(keydown)': 'onKeyDown($event)',
        '(blur)': 'onBlur($event)',
    }
})
export class RucDirective {

    public ctrlDown = false;
    constructor(
        private elemento: ElementRef,
        private control: NgControl
    ) {
    }
    public onKeyUp(evento: Event) {
        let e = <KeyboardEvent> event;
        if (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) {
            this.setTamanioFormato();
        }
    }

    public onKeyDown(evento: Event) {
        const caracterEvento = evento['which'];
        const e = <KeyboardEvent> event;
        if ((e.shiftKey && e.keyCode < 65 ) || ( e.shiftKey && e.keyCode > 90) ) {
          evento.preventDefault();
        }
        if ( this.control.value === null  ) {
            if ([8, 9, 13, 27, 37, 38, 39, 40 , 116].indexOf(caracterEvento) > -1) {
                // retroceso, enter, escape, flechas, tab , f5
                return true;
            }
            if ( !(caracterEvento >= 96 && caracterEvento <= 105 )) {
                event.preventDefault();
                return false;
            }
        }
        if ([8, 9, 13, 27, 37, 38, 39, 40 , 116].indexOf(caracterEvento) > -1) {
          // retroceso, enter, escape, flechas, tab , f5
            return true;
        } else if ( this.control.value !== null && (this.control.value.length > 10) ) {
            event.preventDefault();
        } else if ( (caracterEvento >= 48 && caracterEvento <= 57)) {
            return true;
        } else if (caracterEvento >= 96 && caracterEvento <= 105) {
          // numero del pad
            return true;
        } else if (caracterEvento === 17) {
          // comando en mac
            this.ctrlDown = true;
        } else if (this.ctrlDown && [86, 67].indexOf(caracterEvento) > -1) {
          // ctrl+c or ctrl+v
           return true;
        } else if ( (this.control.value.length > 7) ) {
            event.preventDefault();
        } else {
        event.preventDefault();
            return false;
        }
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
        if ( (cadena).length > 11 ) {
            cadena = (cadena.substr(0, 11));
        }
        this.control.reset( cadena );
    }
    public onBlur(evento: Event) {
      this.setTamanioFormato();
    }

}
