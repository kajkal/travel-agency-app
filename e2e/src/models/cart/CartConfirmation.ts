import { by, element, ElementFinder } from 'protractor';


export class CartConfirmation {

    static CART_CONFIRMATION_LOCATOR = element(by.tagName('app-confirmation'));

    backButton: ElementFinder;
    confirmButton: ElementFinder;

    constructor() {
        this.backButton = CartConfirmation.CART_CONFIRMATION_LOCATOR.element(by.css('button[color="warn"]'));
        this.confirmButton = CartConfirmation.CART_CONFIRMATION_LOCATOR.element(by.css('button[color="primary"]'));
    }

}
