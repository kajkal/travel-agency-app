import { browser, by, element, ElementFinder } from 'protractor';


export class TripsFilters {

    static ELEMENT = element(by.className('mat-drawer'));

    private searchFilter: ElementFinder;
    private priceFilter: ElementFinder;
    private rateFilter: ElementFinder;

    constructor() {
        this.searchFilter = TripsFilters.ELEMENT.element(by.className('search-filter'));
        this.priceFilter = TripsFilters.ELEMENT.element(by.className('price-filter'));
        this.rateFilter = TripsFilters.ELEMENT.element(by.className('rate-filter'));
    }

    async searchByPhrase(searchPhrase: string): Promise<void> {
        const searchFilterInput = this.searchFilter.element(by.tagName('input'));
        await searchFilterInput.clear();
        await searchFilterInput.sendKeys(searchPhrase);
    }

    async changeMaxPrice(value: number): Promise<void> {
        const sliderHighPointer = this.priceFilter.element(by.className('ng5-slider-pointer-max'));
        await browser.actions()
            .mouseDown(sliderHighPointer)
            .mouseMove({ x: 0, y: value })
            .mouseUp()
            .perform();
    }

    async selectMinimalRating(rating: 1 | 2 | 3 | 4 | 5): Promise<void> {
        const selectedRate = this.rateFilter.all(by.className('mat-icon')).get(rating - 1);
        await browser.actions()
            .mouseMove(selectedRate)
            .perform();
        await selectedRate.click();
    }

}
