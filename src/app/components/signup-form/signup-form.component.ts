import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CommonValidators } from '../../validators/common-validators.validators';


@Component({
    selector: 'app-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: [ './signup-form.component.css' ],
})
export class SignupFormComponent implements OnInit {
    public form: FormGroup;

    // custom validator
    static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
        if ((control.value as string).includes(' ')) {
            return {
                cannotContainSpace: true,
            };
        }
        return null;
    }

    // async validator
    static shouldBeUnique(control: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise<ValidationErrors | null>(resolve => {
            setTimeout(() => {
                if (control.value === 'karol') {
                    resolve({
                        shouldBeUnique: {
                            value: control.value,
                        },
                    });
                } else {
                    resolve(null);
                }
            }, 2000);
        });
    }

    ngOnInit() {
        this.form = new FormGroup({
            username: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                SignupFormComponent.cannotContainSpace,
            ], [
                SignupFormComponent.shouldBeUnique,
            ]),
            password: new FormControl('', Validators.required),
        });
    }

    get username() {
        return this.form.get('username');
    }

    get password() {
        return this.form.get('password');
    }

    login(): void {
        console.log('login', this.form.value);
        this.form.setErrors({
            badCredentials: true,
        });
        this.form.get('username').setErrors({
            badCredentials: true,
        });
    }

}
