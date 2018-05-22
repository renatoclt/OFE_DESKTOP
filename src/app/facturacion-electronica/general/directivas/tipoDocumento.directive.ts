import { Directive, ElementRef, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TiposService } from '../utils/tipos.service';


@Directive({
    selector: '[tipoDocumentoDirective]',
    host: {
        '(keyup)': 'onKeyUp($event)',
        '(keydown)': 'onKeyDown($event)'
    }
})
export class TipoDocumentoDirective {

    @Input() formato: number;
    @Input() size: number;
    public cadena: string = '';
    public keysValidos: number[] = []; 
    constructor(
        private elemento: ElementRef,
        private control: NgControl,
        private _tipos: TiposService
    ) {
        this.keysValidos = [65, 90];
    }
    onInit() {}

    public onKeyUp( evento: Event ) {
        let e = <KeyboardEvent> event;
        if (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) {
            this.setTamanioFormato();
        }
    }
    public onKeyDown( evento: Event ) {
        const caracterEvento =  evento['which'];
        const e = <KeyboardEvent> event;
        console.log(caracterEvento);
        if ([46, 8, 9, 27, 13].indexOf(caracterEvento) !== -1 ||
            // Allow: Ctrl+A
            (caracterEvento === 65 && (e.ctrlKey || e.metaKey)) ||
            // Allow: Ctrl+C
            (caracterEvento === 67 && (e.ctrlKey || e.metaKey)) ||
            // Allow: Ctrl+V
            (caracterEvento === 86 && (e.ctrlKey || e.metaKey)) ||
            // Allow: Ctrl+X
            (caracterEvento === 88 && (e.ctrlKey || e.metaKey)) ||
            // Allow: home, end, left, right
            (caracterEvento >= 35 && caracterEvento <= 39)) {
            // let it happen, don't do anything
            return;
        }
        if ((e.shiftKey && e.keyCode < 65 ) || ( e.shiftKey && e.keyCode > 90) ) {
            evento.preventDefault();
        }
        if (caracterEvento === 190) {
            event.preventDefault();
        }
        switch ( this.formato ) {
            case this._tipos.TIPO_FORMATO_NUMERICO:
                if ( (caracterEvento < 48 )
                    || ( caracterEvento > 57 && caracterEvento < 96 )
                    || ( caracterEvento > 105) ) {
                    evento.preventDefault();
                }
                break;
            case this._tipos.TIPO_FORMATO_ALFANUMERICO:
                if (e.keyCode === 192 || ( e.shiftKey && e.keyCode === 192 ) ) {
                    return;
                }
                if ((e.shiftKey && e.keyCode < 65 ) || ( e.shiftKey && e.keyCode > 90) ) {
                    evento.preventDefault();
                }
                if ((e.altKey && e.keyCode < 96 ) || ( e.altKey && e.keyCode > 105) ) {
                    console.log('KEY CODE');
                    evento.preventDefault();
                }
                if ( (caracterEvento < 48)
                    || ( caracterEvento > 57 && caracterEvento < 65)
                    || ( caracterEvento > 90 && caracterEvento < 96)
                    || caracterEvento > 105 ) {
                    evento.preventDefault();
                    }
                break;
        }
        // Tamaño Maximo 8 numeros
        if ( (this.control.value.length > ( this.size - 1 ) ) ) {
            evento.preventDefault();
        }
        //  Validacion Shift + key
        if ( caracterEvento === 16 ) {
            event.preventDefault();
        }
    }
    // VALIDACION PARA DATOS INGRESADOS POR CTRL + C => COPY PASTE EZ :)
    public setTamanioFormato () {
        let cadena: string;
        cadena = '';
        if (this.formato === 0) {
            for ( let a = 0; a < this.control.value.length; a++ ) {
                if ( Number(this.control.value[a]) > 0 ) {
                    cadena = cadena + this.control.value[a];
                }
                if ( Number(this.control.value[a]) == 0 ) {
                    cadena = cadena + this.control.value[a];
                }
            }
        } else {
            cadena = this.control.value;
        }
        if ( (cadena).length > this.size ) {
            cadena = (cadena.substr(0, this.size));
            // e.preventDefault();
        }
        this.control.reset( cadena );
    }
    // Falta validar que no se envien 0's antes del numero de ticket (ej. 000001 => 1)
    public onBlur(evento: Event) {
        this.setTamanioFormato();
    }
}
