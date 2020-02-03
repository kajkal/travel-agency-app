import { by, element, ElementFinder } from 'protractor';


export class CartSummary {

    static ELEMENT = element(by.tagName('app-cart'));

    private summaryRow: ElementFinder;
    cancelButton: ElementFinder;
    proceedButton: ElementFinder;

    constructor() {
        this.summaryRow = CartSummary.ELEMENT.element(by.css('.data-row.summary'));
        this.cancelButton = CartSummary.ELEMENT.element(by.css('button[color="warn"]'));
        this.proceedButton = CartSummary.ELEMENT.element(by.css('button[color="primary"]'));
    }

    async getTotalPrice(): Promise<number> {
        const rawValue = await element(by.css('.data-row.summary')).getText();
        return Number(rawValue.replace(/[^0-9.]+/g, ''));
    }

}
