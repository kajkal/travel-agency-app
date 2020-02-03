import { by, element, ElementFinder } from 'protractor';


export class CartConfirmation {

    static ELEMENT = element(by.tagName('app-confirmation'));

    backButton: ElementFinder;
    confirmButton: ElementFinder;

    constructor() {
        this.backButton = CartConfirmation.ELEMENT.element(by.css('button[color="warn"]'));
        this.confirmButton = CartConfirmation.ELEMENT.element(by.css('button[color="primary"]'));
    }

}
