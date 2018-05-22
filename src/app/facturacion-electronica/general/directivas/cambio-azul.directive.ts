import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
    selector: '[colorazul]'
})
export class ColorAzulDirective {

    private _snippetKeyRegex: RegExp;
    constructor( private el: ElementRef ) {
    }
    // @HostListener('keyup') onkeyup() {
    @HostListener('window:keyup', ['$event'])
        keyEvent(event: KeyboardEvent) {
            let caracter: string;
            caracter = event.key;
            console.log( caracter );
            if ( caracter == ' ' ) {
                return;
            }
            if ( caracter >= 'a' && caracter <= 'z' ) {
                return;
            }
            if ( caracter >= 'A' && caracter <= 'Z' ) {
                return;
            }
            if ( caracter >= '0' && caracter <= '9' ) {
                return;
            }
            this.clean();

        /*let cadena: string;
        cadena = this.el.nativeElement.value;
        console.log( cadena );
        let size: number;
        size = this.el.nativeElement.value.length;
        console.log( size );
        for ( let a = 0 ; a < cadena.length ; a++) {
            if ( cadena[a] >= 'a' && cadena[a] <= 'z' ) {
                console.log( 'letra minuscula' );
                break;
            }
            if ( cadena[a] >= 'A' && cadena[a] <= 'Z' ) {
                console.log( 'letra mayuscula' );
                break;
            }
        }*/

    }
    public clean() {
        let cadena: string;
        cadena = this.el.nativeElement.value;
        this.el.nativeElement.value = cadena.slice( 0, -1 );
    }
}
