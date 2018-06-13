import { Injectable} from '@angular/core';
import { ToastrService  } from 'ngx-toastr';
import { ViewContainerRef } from '@angular/core';

@Injectable()
export class MessageUtils {

    constructor(private toastr: ToastrService) {
    }

    public showError(message: string) {
        this.toastr.error(message, 'Error');
    }

    public showSucess(message: string) {
        this.toastr.success(message);
    }
}