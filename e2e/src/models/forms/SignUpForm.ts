import { by, element, ElementFinder } from 'protractor';
import { FormField } from '../common/FormField';
import { getFormFieldById } from '../../utils/form-utils';


export class SignUpForm {

    static ELEMENT = element(by.css('app-sign-up'));

    formTitle: ElementFinder;
    emailField: FormField;
    passwordField: FormField;
    submitButton: ElementFinder;
    progressBar: ElementFinder;

    constructor() {
        const formRoot: ElementFinder = SignUpForm.ELEMENT;

        this.formTitle = formRoot.element(by.css('.mat-card-title'));

        const formFields = formRoot.all(by.css('.mat-form-field'));
        this.emailField = getFormFieldById(formFields, 'email');
        this.passwordField = getFormFieldById(formFields, 'password');

        this.submitButton = formRoot.element(by.css('button[color="primary"]'));
        this.progressBar = formRoot.element(by.css('.mat-progress-bar'));
    }

    async fillSignUpForm(email: string, password: string) {
        await Promise.all([
            this.emailField.input.clear(),
            this.passwordField.input.clear(),
        ]);
        await Promise.all([
            this.emailField.input.sendKeys(email),
            this.passwordField.input.sendKeys(password),
        ]);
    }

    async submit() {
        await this.submitButton.click();
    }

}
