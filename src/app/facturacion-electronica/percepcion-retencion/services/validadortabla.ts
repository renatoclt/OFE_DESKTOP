import {FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class Validadortabla {

  static HayValoresenlaTabla(): ValidatorFn {
    return (formControl: FormControl): ValidationErrors => {
      if (formControl.value == 0.00) {
        return  {error: 'Debe ser Mayor'};
      }
      return null;
    };
  }
}
