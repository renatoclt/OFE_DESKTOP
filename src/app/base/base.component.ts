import { Component, Injector, ViewChild,ApplicationRef } from '@angular/core';
import { AppUtils } from '../utils/app.utils';
import { MessageUtils } from '../utils/message.utils';
import { UIUtils } from '../utils/ui.utils';


@Component({
    selector: 'base',
    templateUrl: './base.template.html'
})
export class BaseComponent {

    @ViewChild('notificationZone') notificationZone;

    protected appUtils: AppUtils;
    protected messageUtils: MessageUtils;
    protected uiUtils: UIUtils;

    constructor(private injector: Injector) {
        //var appRef = <ApplicationRef>this.injector.get(ApplicationRef);
        this.appUtils = injector.get(AppUtils);
        //var vcRef = appRef['_rootComponents'][0]['_hostElement'].vcRef;
        this.messageUtils = injector.get(MessageUtils);
        //this.messageUtils.toastr.setRootViewContainerRef = appRef['_rootComponents'][0]['_hostElement'].vcRef;;
        this.uiUtils = injector.get(UIUtils);
    }

    protected addNotification(mensaje: string) {
        let htmlNotificacion: string = "<span class='text-danger'> * " +
            mensaje + "</span><br/>";
        this.notificationZone.nativeElement.innerHTML += htmlNotificacion;
    }

    protected cleanNotification() {
        this.notificationZone.nativeElement.innerHTML = "";
    }
}