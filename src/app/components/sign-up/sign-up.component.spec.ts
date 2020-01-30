import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { DebugElement } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatProgressBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';


class RouterStub {
    navigate = jasmine.createSpy();
}

class AuthServiceStub {
    register = jasmine.createSpy();
}

class InputWrapper {
    constructor(
        private input: DebugElement,
        private fieldControl: AbstractControl,
    ) {
    }

    sendKeys(value: string) {
        this.input.nativeElement.value = value;
        this.input.nativeElement.dispatchEvent(new Event('input'));
        this.fieldControl.markAllAsTouched();
    }

    getErrors(): string[] {
        return Array.from(this.input.nativeElement
            .closest('mat-form-field')
            .querySelectorAll('mat-error > span'))
            .map((e: HTMLSpanElement) => {
                console.log(e);
                return e.innerText;
            });
    }
}

describe('SignUpComponent', () => {

    let component: SignUpComponent;
    let fixture: ComponentFixture<SignUpComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ SignUpComponent ],
            imports: [
                MatCardModule,
                MatFormFieldModule,
                FormsModule,
                ReactiveFormsModule,
                MatInputModule,
                BrowserAnimationsModule,
                MatProgressBarModule,
            ],
            providers: [
                { provide: Router, useClass: RouterStub },
                { provide: AuthService, useClass: AuthServiceStub },
            ],
        });
        fixture = TestBed.createComponent(SignUpComponent);
        component = fixture.componentInstance;
    });

    async function fillSignUpForm(email: string, password: string) {
        const signUpForm = fixture.debugElement.query(By.css('form'));
        const emailField = new InputWrapper(signUpForm.query(By.css('#email')), component.email);
        const passwordField = new InputWrapper(signUpForm.query(By.css('#password')), component.password);
        const submitButton = signUpForm.query(By.css('button[color="primary"]'));

        emailField.sendKeys(email);
        passwordField.sendKeys(password);

        fixture.detectChanges();
        submitButton.nativeElement.click();

        await TestBed.get(AuthService).register;

        return { emailField, passwordField };
    }

    it('should sign up on \'Sign up\' button click and navigate to /trips page', async () => {
        // given
        const router = TestBed.get(Router);
        const authService = TestBed.get(AuthService);
        authService.register.and.returnValue(Promise.resolve());
        fixture.detectChanges();

        // when
        await fillSignUpForm('user@domain.com', '123456');

        // then
        expect(authService.register).toHaveBeenCalledTimes(1);
        expect(authService.register).toHaveBeenCalledWith({
            email: 'user@domain.com',
            password: '123456',
        });
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([ '/trips' ]);
    });

    describe('error messages', () => {

        function shouldDisplayErrors(inputSelector: string, value: string, expectedErrors: string[]) {
            // given
            fixture.detectChanges();

            // when
            const signUpForm = fixture.debugElement.query(By.css('form'));
            const inputField = new InputWrapper(signUpForm.query(By.css(`#${inputSelector}`)), component[ inputSelector ]);
            inputField.sendKeys(value);
            fixture.detectChanges();

            // then
            expect(inputField.getErrors()).toEqual(expectedErrors);
        }

        it('should display error message when \'email\' is missing', () => {
            shouldDisplayErrors('email', '', [ 'Email is required.' ]);
        });

        it('should display error message when \'email\' is not valid email', () => {
            shouldDisplayErrors('email', 'user', [ 'Provide valid email.' ]);
        });

        it('should display \'Email already in use\' error when provided email is already taken', async () => {
            // given
            const authService = TestBed.get(AuthService);
            authService.register.and.returnValue(Promise.reject({ code: 'auth/email-already-in-use' }));
            fixture.detectChanges();

            // when
            const { emailField } = await fillSignUpForm('user@domain.com', '123456');
            fixture.detectChanges();

            // then
            expect(emailField.getErrors()).toEqual([
                'This email is already taken.',
            ]);
        });

        it('should display error message when \'password\' is missing', () => {
            shouldDisplayErrors('password', '', [ 'Password is required.' ]);
        });

        it('should display error message when \'password\' is shorter than 6 characters', () => {
            shouldDisplayErrors('password', '1234', [ 'Password should be minimum 6 characters.' ]);
        });

    });

});
