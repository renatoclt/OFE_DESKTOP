import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PdfViewerComponent} from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PdfViewerComponent
  ],
  exports: [
    PdfViewerComponent
  ]
})
export class PdfViewerModule { }
