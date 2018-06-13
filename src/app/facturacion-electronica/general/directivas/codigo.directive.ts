import { Directive, ElementRef } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
    selector: '[codigoDirective]',
    host:   {
        '(keyup)': 'onKeyUp($event)',
        '(keydown)': 'onKeyDown($event)',
        '(blur)': 'onBlur($event)',
        '(onkeypress)': 'onKeyPress($event)'
    }
})

export class CodigoDirective {
    constructor(
        private elemento: ElementRef,
        private control: NgControl
    ) {}

    public onKeyUp(evento: Event) {

    }

    public onKeyDown(evento: Event) {
        const caracterEvento = evento['which'];
        const e = <KeyboardEvent> event;



    }

    public onBlur() {

    }

    public onKeyPress(evento: Event) {
        // const currencyRegex = /^[0-9]{0,5}(\.[0-9]{0,2})?$/;
        // const caracterEvento = evento['which'];
        //     let char = String.fromCharCode(caracterEvento.charCode);
        //     let target = evento.target;
        //     let inputVal = target.;
        //     // Construct what the value will be if the event is not prevented.
        //     value = inputVal.substr(0, target.selectionStart) + char + inputVal.substr(target.selectionEnd);

        // // Test to make sure the user is inputting only valid characters
        // // and that the resulting input is valid.
        // if (!char.match(/[0-9.]/) || !value.match(currencyRegex)) {
        //     e.preventDefault();
        // }
        console.log(evento);
    }
}