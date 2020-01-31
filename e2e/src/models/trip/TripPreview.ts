import { by, ElementFinder } from 'protractor';


export class TripPreview {

    private rating: ElementFinder;
    private tripName: ElementFinder;
    private tripPrice: ElementFinder;
    private availablePlaceCount: ElementFinder;
    private reservedTicketsCount: ElementFinder;
    private reserveTicketButton: ElementFinder;
    private cancelTicketReservationButton: ElementFinder;

    constructor(tripPreviewRoot: ElementFinder) {
        this.rating = tripPreviewRoot.element(by.css('.rating'));
        this.tripName = tripPreviewRoot.element(by.css('.mat-card-title'));
        this.tripPrice = tripPreviewRoot.element(by.className('price'));
        this.availablePlaceCount = tripPreviewRoot.element(by.css('.limit'));
        this.reservedTicketsCount = tripPreviewRoot.element(by.css('.actions > span'));
        this.reserveTicketButton = tripPreviewRoot.element(by.css('.increment-btn'));
        this.cancelTicketReservationButton = tripPreviewRoot.element(by.css('.decrement-btn'));
    }

    getTripName(): Promise<string> {
        return this.tripName.getText() as Promise<string>;
    }

    async getTripPrice(): Promise<number> {
        const rawValue = await this.tripPrice.getText();
        return Number(rawValue.replace(/[^0-9.]+/g, ''));
    }

    async getRatingValue(): Promise<number> {
        const allStars = await this.rating
            .all(by.cssContainingText('.mat-icon', 'star'))
            .count();
        const emptyStars = await this.rating
            .all(by.cssContainingText('.mat-icon', 'star_border'))
            .count();
        return allStars - emptyStars;
    }

    async getAvailablePlaceCountValue(): Promise<number> {
        const rawValue = await this.availablePlaceCount.getText();
        return Number(rawValue);
    }

    async getReservedTicketsCountValue(): Promise<number> {
        const rawValue = await this.reservedTicketsCount.getText();
        return Number(rawValue.replace(/[^0-9]+/g, ''));
    }

    async reserveTicket(): Promise<void> {
        await this.reserveTicketButton.click();
    }

    async cancelTicketReservation(): Promise<void> {
        await this.cancelTicketReservationButton.click();
    }

}
