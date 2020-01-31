import { by, element, ElementFinder } from 'protractor';


export class Header {

    static HEADER_LOCATOR = element(by.css('app-header'));
    static OPTION_MENU_LOCATOR = element(by.css('div[role="menu"]'));

    signInButton: ElementFinder;
    signUpButton: ElementFinder;
    cartButton: ElementFinder;
    optionMenuTriggerButton: ElementFinder;

    addTripOption: ElementFinder;
    tripsOption: ElementFinder;
    logoutOption: ElementFinder;

    constructor() {
        this.signInButton = element(by.css('a[routerlink="/sign-in"]'));
        this.signUpButton = element(by.css('a[routerlink="/sign-up"]'));
        this.cartButton = element(by.css('button[routerlink="/cart"]'));
        this.optionMenuTriggerButton = element(by.css('button.mat-menu-trigger'));

        this.addTripOption = element(by.css('button[routerlink="/admin/new-trip"]'));
        this.tripsOption = element(by.css('button[routerlink="/trips"]'));
        this.logoutOption = element(by.css('button[routerlink="/logout"]'));
    }

    async getReservedTicketCountIndicatorValue(): Promise<number> {
        const value = await this.cartButton.element(by.className('mat-badge-content')).getText();
        return Number(value);
    }

}
