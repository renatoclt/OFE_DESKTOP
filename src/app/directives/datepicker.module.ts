//import {BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {NgModule} from '@angular/core';
import {DatePickerDirective} from './datepicker.directive';
import {TimePickerDirective} from './timepicker.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        DatePickerDirective,TimePickerDirective
    ],
    exports: [DatePickerDirective,TimePickerDirective]
})
export class A2Edatetimepicker {
}