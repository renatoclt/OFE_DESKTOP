import {Directive, ElementRef, EventEmitter, Output} from '@angular/core';
import {MayusculaPipe} from '../pipes/mayuscula.pipe';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[mayusculaDirectiva]',
  host: {
    '(input)': 'toUpperCase($event.target.value)',
    '(keyup)': 'onKeyUp($event)',
    '(keydown)': 'onKeyUp($event)'
  },
  providers: [
    MayusculaPipe
  ]
})
export class MayusculaDirective {
  @Output() ngModelChange = new EventEmitter();
  @Output() fxChange = new EventEmitter();
  constructor(private precioPipe: MayusculaPipe,
              private ref: ElementRef,
              private control: NgControl) { }

  onKeyUp() {}
  onKeyDown() {}
  toUpperCase(value: any) {
      this.ref.nativeElement.value = value.toUpperCase();
      this.control.reset(value.toUpperCase());
      this.ref.nativeElement.value = this.ref.nativeElement.value.toUpperCase();
      this.ngModelChange.emit(this.ref.nativeElement.value);
      this.fxChange.emit(this.ref.nativeElement.value);
    
  }

}
