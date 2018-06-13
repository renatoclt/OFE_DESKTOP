import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector:   '[descripcion]'
})
export class DescripcionDirective {
    constructor( el: ElementRef ) {}

}
