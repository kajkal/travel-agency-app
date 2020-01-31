import { by, ElementFinder } from 'protractor';


export class FormField {

    input: ElementFinder;

    constructor(private formFieldWrapper: ElementFinder, fieldId: string) {
        this.input = formFieldWrapper.element(by.id(fieldId));
    }

    getErrors() {
        return this.formFieldWrapper
            .all(by.css('.mat-error > span'))
            .map(inputError => inputError.getText());
    }

}
