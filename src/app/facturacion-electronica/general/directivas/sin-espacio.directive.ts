import{ Directive} from '@angular/core';
import{AbstractControl,NG_VALIDATORS} from '@angular/forms';


function VerificarEspacio(c:AbstractControl)
{
    if(c.value==null)return null;
    if(c.value.indexOf(' ') >= 0){return {SinEspacio:true}}
    return null;
}
@Directive({
    selector:'[sin-espacio]',
    providers:[{provide:NG_VALIDATORS,multi:true,useValue:VerificarEspacio}]
})
export class SinEspacio{}