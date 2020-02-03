import { by, ElementFinder } from 'protractor';


export class FormField {

    input: ElementFinder;

    constructor(private root: ElementFinder, fieldId: string) {
        this.input = root.element(by.id(fieldId));
    }

    getErrors() {
        return this.root
            .all(by.css('.mat-error > span'))
            .map(inputError => inputError.getText());
    }

}
