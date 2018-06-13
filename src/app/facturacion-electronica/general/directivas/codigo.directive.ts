import { Directive, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[codigoDirective]',
    host:   {
        '(keyup)': 'onKeyUp($event)',
        '(keydown)': 'onKeyDown($event)',
        '(blur)': 'onBlur($event)'
    }
})
export class CodigoDirective {

    public ctrlDown = false;
    constructor(
        private elemento: ElementRef,
        private control: NgControl
    ) {
    }
    public onKeyUp(evento: Event) {
    }

    public onKeyDown(evento : Event) {
        const caracterEvento = evento['which'];
        const e = <KeyboardEvent> event;
        //  Validacion Shift + key
        // if ((e.shiftKey && e.keyCode < 65 ) || ( e.shiftKey && e.keyCode > 90) ) {
        //     evento.preventDefault();
        // }
        // if ((e.altKey && e.keyCode === 96 ) || ( e.altKey && e.keyCode > 105) ) {
        //     evento.preventDefault();
        // }

        if ( caracterEvento === 16 ) {
            event.preventDefault();
        }
        if (caracterEvento === 190) {
            event.preventDefault();
        }
        if ( this.control.value === null  ) {
            if ([8, 9, 13, 27, 37, 38, 39, 40 , 116].indexOf(caracterEvento) > -1) {
                // retroceso, enter, escape, flechas, tab , f5
                return true;
            }
            // if ( !(caracterEvento >= 96 && caracterEvento <= 105 )) {
            //     event.preventDefault();
            //     return false;
            // }
        }
        if ([8, 9, 13, 27, 37, 38, 39, 40 , 116].indexOf(caracterEvento) > -1) {
            // retroceso, enter, escape, flechas, tab , f5
            return true;
        } else if ( this.control.value !== null && (this.control.value.length > 11) ) {
            event.preventDefault();
            // } else if ( (caracterEvento >= 48 && caracterEvento <= 57)) {
            //     return true;
            // } else if (caracterEvento >= 96 && caracterEvento <= 105) {
            //     // numero del pad
            //     return true;
        } else if (caracterEvento === 17) {
            // comando en mac
            this.ctrlDown = true;
        } else if (this.ctrlDown && [86, 67].indexOf(caracterEvento) > -1) {
            // ctrl+c or ctrl+v
            return true;
        } else {
            // event.preventDefault();
            return true;
        }
    }
    public onBlur(evento: Event) {
    }
}
