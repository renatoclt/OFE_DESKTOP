import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { isNull } from 'util';

@Directive({
    selector: '[ticketDirective]',
    host: {
        '(keyup)': 'onKeyUp($event)',
        '(keydown)': 'onKeyDown($event)',
        '(blur)': 'onBlur($event)',
    }
})
export class TicketDirective {

    public ctrlDown = false;
    constructor(
        private elemento: ElementRef,
        private control: NgControl
    ) { }
    public onKeyUp(evento: Event) {
        let e = <KeyboardEvent> event;
        if (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) {
            this.setTamanioFormato();
        }
        if ( e.keyCode === 190 ) {
            // this.setTamanioFormato();
        }
    }
    onKeyDown(event: Event) {
        const caracterEvento = event['which'];
        console.log(caracterEvento);
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
        } else {
            event.preventDefault();
            return false;
        }
    }
    // VALIDACION PARA DATOS INGRESADOS POR CTRL + C => COPY PASTE EZ :)
    public setTamanioFormato () {
        let cadena: string;
        cadena = '';
        for ( let a = 0; a < this.control.value.length; a++ ) {
            if ( Number(this.control.value[a]) > 0 ) {
                cadena = cadena + this.control.value[a];
            }
            if ( Number(this.control.value[a]) == 0 ) {
                cadena = cadena + this.control.value[a];
            }
        }
        this.control.reset( cadena );
    }
    // Falta validar que no se envien 0's antes del numero de ticket (ej. 000001 => 1)
    public onBlur(evento: Event) {
        this.setTamanioFormato();
    }

}
