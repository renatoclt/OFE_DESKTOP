import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemComponent} from './item.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    ItemComponent
  ]
})
export class ItemModule { }
