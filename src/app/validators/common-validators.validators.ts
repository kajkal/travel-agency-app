import { AbstractControl, ValidationErrors } from '@angular/forms';


export class CommonValidators {

    static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
        if ((control.value as string).includes(' ')) {
            return {
                cannotContainSpace: true,
            };
        }
        return null;
    }

}
