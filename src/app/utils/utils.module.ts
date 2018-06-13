import { NgModule } from '@angular/core';
import { AppUtils } from './app.utils';
import { MessageUtils } from './message.utils';
import { UIUtils } from './ui.utils';

@NgModule({
    declarations: [],
    imports: [],
    providers: [
        AppUtils,
        UIUtils,
        MessageUtils
    ],
    exports: []
})
export class UtilsModule { 
  constructor(){}
}