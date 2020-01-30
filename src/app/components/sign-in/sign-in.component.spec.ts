import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInComponent } from './sign-in.component';
import { MatCardModule, MatFormFieldModule, MatInputModule, MatProgressBarModule } from '@angular/material';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


class RouterStub {
    navigate = jasmine.createSpy();
}

class AuthServiceStub {
    login = jasmine.createSpy();
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

describe('SignInComponent', () => {

    let component: SignInComponent;
    let fixture: ComponentFixture<SignInComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ SignInComponent ],
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
        fixture = TestBed.createComponent(SignInComponent);
        component = fixture.componentInstance;
    });

    async function fillSignInForm(email: string, password: string) {
        const signInForm = fixture.debugElement.query(By.css('form'));
        const emailField = new InputWrapper(signInForm.query(By.css('#email')), component.email);
        const passwordField = new InputWrapper(signInForm.query(By.css('#password')), component.password);
        const submitButton = signInForm.query(By.css('button[color="primary"]'));

        emailField.sendKeys(email);
        passwordField.sendKeys(password);

        fixture.detectChanges();
        submitButton.nativeElement.click();

        await TestBed.get(AuthService).login;

        return { emailField, passwordField };
    }

    it('should sign in on \'Sign in\' button click and navigate to /trips page when credentials are correct', async () => {
        // given
        const router = TestBed.get(Router);
        const authService = TestBed.get(AuthService);
        authService.login.and.returnValue(Promise.resolve());
        fixture.detectChanges();

        // when
        await fillSignInForm('user@domain.com', '123456');

        // then
        expect(authService.login).toHaveBeenCalledTimes(1);
        expect(authService.login).toHaveBeenCalledWith({
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
            const signInForm = fixture.debugElement.query(By.css('form'));
            const tripName = new InputWrapper(signInForm.query(By.css(`#${inputSelector}`)), fixture.componentInstance[ inputSelector ]);
            tripName.sendKeys(value);
            fixture.detectChanges();

            // then
            expect(tripName.getErrors()).toEqual(expectedErrors);
        }

        it('should display error message when \'email\' is missing', () => {
            shouldDisplayErrors('email', '', [ 'Email is required.' ]);
        });

        it('should display error message when \'email\' is not valid email', () => {
            shouldDisplayErrors('email', 'user', [ 'Provide valid email.' ]);
        });

        it('should display \'User not found\' error when user with given email is not found', async () => {
            // given
            const authService = TestBed.get(AuthService);
            authService.login.and.returnValue(Promise.reject({ code: 'auth/user-not-found', message: 'User not found' }));
            fixture.detectChanges();

            // when
            const { emailField } = await fillSignInForm('user@domain.com', '123456');
            fixture.detectChanges();

            // then
            expect(emailField.getErrors()).toEqual([
                'User not found',
            ]);
        });

        it('should display error message when \'password\' is missing', () => {
            shouldDisplayErrors('password', '', [ 'Password is required.' ]);
        });

        it('should display error message when \'password\' is shorter than 6 characters', () => {
            shouldDisplayErrors('password', '1234', [ 'Password should be minimum 6 characters.' ]);
        });

        it('should display \'Wrong password\' error when provided password is invalid', async () => {
            // given
            const authService = TestBed.get(AuthService);
            authService.login.and.returnValue(Promise.reject({ code: 'auth/wrong-password', message: 'Wrong password' }));
            fixture.detectChanges();

            // when
            const { passwordField } = await fillSignInForm('user@domain.com', '123456');
            fixture.detectChanges();

            // then
            expect(passwordField.getErrors()).toEqual([
                'Wrong password',
            ]);
        });

        it('should display \'Too many requests\' error when the user has sent too many requests', async () => {
            // given
            const authService = TestBed.get(AuthService);
            authService.login.and.returnValue(Promise.reject({ code: 'auth/too-many-requests', message: 'Too Many Requests' }));
            fixture.detectChanges();

            // when
            await fillSignInForm('user@domain.com', '123456');
            fixture.detectChanges();
            const formErrors = fixture.debugElement.query(By.css('.form-error-message > span'));

            // then
            expect(formErrors.nativeElement.innerText).toBe('Too Many Requests');
        });

    });

});
