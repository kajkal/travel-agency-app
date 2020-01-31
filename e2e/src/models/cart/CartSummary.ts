import { by, element, ElementFinder } from 'protractor';


export class CartSummary {

    static CART_SUMMARY_LOCATOR = element(by.tagName('app-cart'));

    private summaryRow: ElementFinder;
    cancelButton: ElementFinder;
    proceedButton: ElementFinder;

    constructor() {
        this.summaryRow = CartSummary.CART_SUMMARY_LOCATOR.element(by.css('.data-row.summary'));
        this.cancelButton = CartSummary.CART_SUMMARY_LOCATOR.element(by.css('button[color="warn"]'));
        this.proceedButton = CartSummary.CART_SUMMARY_LOCATOR.element(by.css('button[color="primary"]'));
    }

    async getTotalPrice(): Promise<number> {
        const rawValue = await element(by.css('.data-row.summary')).getText();
        return Number(rawValue.replace(/[^0-9.]+/g, ''));
    }

}
