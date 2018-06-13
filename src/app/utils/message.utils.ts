import { Injectable} from '@angular/core';
import { ToastrService  } from 'ngx-toastr';
import { ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var GlobalFunctions: any;

@Injectable()
export class MessageUtils {

    constructor(private toastr: ToastrService, private router: Router, private route: ActivatedRoute) {
        GlobalFunctions.SetMessageUtilsComponent(this);
    }

    public showError(message: string) {
        this.toastr.error(message, 'Error');
    }

    public showSucess(message: string) {
        this.toastr.success(message);
    }

    public navigate(nav) {
        this.router.navigate(nav, { relativeTo: this.route });
    }

}