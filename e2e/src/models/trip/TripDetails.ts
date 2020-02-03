import { browser, by, element, ElementFinder } from 'protractor';
import { Comment } from './Comment';
import { waitForElementToBeClickable, waitForElementToBeDisplayed } from '../../utils/asynchronous-utils';


export class TripDetails {

    static ELEMENT = element(by.className('trip-details'));
    static ADMIN_OPTION_MENU_ELEMENT = element(by.css('div[role="menu"]'));

    private rating: ElementFinder;
    private tripName: ElementFinder;
    private tripPrice: ElementFinder;
    private reservedTicketsCount: ElementFinder;
    private commentsRoot: ElementFinder;

    adminOptionMenuTriggerButton: ElementFinder;

    constructor() {
        const root = TripDetails.ELEMENT;

        this.rating = root.element(by.className('rating'));
        this.tripName = root.element(by.className('mat-card-title'));
        this.tripPrice = root.element(by.className('price'));
        this.reservedTicketsCount = root.element(by.css('.mat-card-content > span'));
        this.commentsRoot = root.element(by.className('comments'));

        this.adminOptionMenuTriggerButton = root.element(by.className('mat-menu-trigger'));
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

    getTripName(): Promise<string> {
        return this.tripName.getText() as Promise<string>;
    }

    async getTripPrice(): Promise<number> {
        const rawValue = await this.tripPrice.getText();
        return Number(rawValue.replace(/[^0-9.]+/g, ''));
    }

    async getReservedTicketsCountValue(): Promise<number> {
        const rawValue = await this.reservedTicketsCount.getText();
        return Number(rawValue.replace(/[^0-9]+/g, ''));
    }

    async getComments(): Promise<Comment[]> {
        const rawComments = this.commentsRoot.all(Comment.LOCATOR);
        const commentCount = await rawComments.count();
        const commentList = new Array(commentCount);
        for (let i = 0; i < commentCount; i++) {
            const rawComment = rawComments.get(i);
            commentList[ i ] = new Comment(rawComment);
        }
        return commentList;
    }

    async rateTrip(rating: 1 | 2 | 3 | 4 | 5): Promise<void> {
        const selectedRate = this.rating.all(by.className('mat-icon')).get(rating - 1);
        await browser.actions()
            .mouseMove(selectedRate)
            .perform();
        await selectedRate.click();
    }

    async selectUpdateTripOption() {
        const allOptions = TripDetails.ADMIN_OPTION_MENU_ELEMENT.all(by.tagName('button'));
        const updateOption = allOptions.get(0);
        await waitForElementToBeClickable(updateOption);
        await updateOption.click();
    }

    async selectDeleteTripOption() {
        const allOptions = TripDetails.ADMIN_OPTION_MENU_ELEMENT.all(by.tagName('button'));
        const deleteOption = allOptions.get(1);
        await waitForElementToBeClickable(deleteOption);
        await deleteOption.click();
    }

}
