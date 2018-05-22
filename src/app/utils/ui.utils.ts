import { Injectable } from '@angular/core';
import { correctHeight, detectBody } from './app.helpers';

declare var jQuery: any;
declare var pleaseWait: any;
declare var loadingScreen: any;
@Injectable()
export class UIUtils {
    constructor() {}

    public addOrRemoveBodyBackGround(add: boolean, cssStyle: string) {
        add == true ? jQuery('body').addClass(cssStyle) :
            jQuery('body').removeClass(cssStyle);
    }

    public addOrRemoveStyleFooter(add: boolean, cssStyle: string) {
        add == true ? jQuery('.footer').addClass(cssStyle) :
            jQuery('.footer').removeClass(cssStyle);
    }

    public correctHeightOnResize() {
        // Run correctHeight function on load and resize window event
        jQuery(window).bind("load resize", function () {
            correctHeight();
            detectBody();
        });
    }

    public correctHeightBody() {
        correctHeight();
        detectBody();
    }

    public correctHeightOnMenuAnimation() {
        // Correct height of wrapper after metisMenu animation.
        jQuery('.metismenu a').click(() => {
            setTimeout(() => {
                correctHeight();
            }, 300)
        });
    }

    public showOrHideLoadingScreen(loading: boolean) {

        if (loading && loadingScreen) {
            loadingScreen = pleaseWait({
                logo: "assets/img/logo-ebiz.svg",
                backgroundColor: '#EEEEEE',
                loadingHtml: '<div class="sk-spinner sk-spinner-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div>'
            });
        }

        if (!loading && loadingScreen) {
            loadingScreen.finish();
        }

    }
}