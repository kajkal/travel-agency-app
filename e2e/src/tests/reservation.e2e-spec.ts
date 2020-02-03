import { browser, by, element } from 'protractor';
import { logout, signIn } from '../utils/session-utils';
import { waitForElementToBeDisplayed, waitForUrlToBeActive } from '../utils/asynchronous-utils';
import { TripPreviewList } from '../models/trip/TripPreviewList';
import { Header } from '../models/header/Header';
import { CartSummary } from '../models/cart/CartSummary';
import { CartConfirmation } from '../models/cart/CartConfirmation';


describe('trip reservation process', () => {

    let header: Header;

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
        await signIn();
        header = new Header();
    });

    afterAll(async () => {
        await logout();
    });

    beforeEach(async () => {
        await waitForElementToBeDisplayed(element(by.tagName('app-trip-thumbnail')));
    });

    it('should complete reservation process successfully', async () => {
        const firstTrip = (await TripPreviewList.loadTripPreviewList())[ 0 ];
        const tripPrice = await firstTrip.getTripPrice();
        const initialAvailablePlaceCount = await firstTrip.getAvailablePlaceCountValue();
        const initialReservedTicketsCount = await firstTrip.getReservedTicketsCountValue();
        const initialHeaderReservedTicketsCount = await header.getReservedTicketCountIndicatorValue();

        /* Validates initial state */

        expect(initialAvailablePlaceCount).toBeGreaterThanOrEqual(2);
        expect(initialReservedTicketsCount).toBe(0);
        expect(initialHeaderReservedTicketsCount).toBe(0);

        /* Reserve 2 tickets for the first trip */

        await firstTrip.reserveTicket();
        await firstTrip.reserveTicket();

        /* Validates if available and reserved places numbers are updated correctly */

        expect(await firstTrip.getAvailablePlaceCountValue()).toBe(initialAvailablePlaceCount - 2);
        expect(await firstTrip.getReservedTicketsCountValue()).toBe(2);

        /* Validates if header reserved places indicator is updated correctly */

        expect(await header.getReservedTicketCountIndicatorValue()).toBe(2);

        /* Navigates to cart page */

        await header.cartButton.click();
        await waitForUrlToBeActive('/cart');
        await waitForElementToBeDisplayed(CartSummary.ELEMENT);
        const cartSummary = new CartSummary();

        /* Validates if total price is correct */

        expect(await cartSummary.getTotalPrice()).toBe(tripPrice * 2);

        /* Proceeds to confirmation page */

        await cartSummary.proceedButton.click();
        await waitForUrlToBeActive('/confirmation');
        await waitForElementToBeDisplayed(CartConfirmation.ELEMENT);
        const cartConfirmation = new CartConfirmation();

        /* Confirms transaction */

        await cartConfirmation.confirmButton.click();

        /* Validates if available and reserved places numbers are updated correctly */

        expect(await firstTrip.getAvailablePlaceCountValue()).toBe(initialAvailablePlaceCount);
        expect(await firstTrip.getReservedTicketsCountValue()).toBe(0);

        /* Validates if header reserved places indicator is updated correctly */

        expect(await header.getReservedTicketCountIndicatorValue()).toBe(0);
    });

    it('should clear cart when user cancel transaction on the cart page', async () => {
        const firstTrip = (await TripPreviewList.loadTripPreviewList())[ 0 ];
        const initialAvailablePlaceCount = await firstTrip.getAvailablePlaceCountValue();
        const initialReservedTicketsCount = await firstTrip.getReservedTicketsCountValue();
        const initialHeaderReservedTicketsCount = await header.getReservedTicketCountIndicatorValue();

        /* Validates initial state */

        expect(initialAvailablePlaceCount).toBeGreaterThanOrEqual(2);
        expect(initialReservedTicketsCount).toBe(0);
        expect(initialHeaderReservedTicketsCount).toBe(0);

        /* Reserve 1 ticket for the first trip */

        await firstTrip.reserveTicket();

        /* Validates if available and reserved places numbers are updated correctly */

        expect(await firstTrip.getAvailablePlaceCountValue()).toBe(initialAvailablePlaceCount - 1);
        expect(await firstTrip.getReservedTicketsCountValue()).toBe(1);

        /* Validates if header reserved places indicator is updated correctly */

        expect(await header.getReservedTicketCountIndicatorValue()).toBe(1);

        /* Navigates to cart page */

        await header.cartButton.click();
        await waitForUrlToBeActive('/cart');
        await waitForElementToBeDisplayed(CartSummary.ELEMENT);
        let cartSummary = new CartSummary();

        /* Proceeds to confirmation page */

        await cartSummary.proceedButton.click();
        await waitForUrlToBeActive('/confirmation');
        await waitForElementToBeDisplayed(CartConfirmation.ELEMENT);
        const cartConfirmation = new CartConfirmation();

        /* Back to Cart page */

        await cartConfirmation.backButton.click();
        await waitForUrlToBeActive('/cart');
        await waitForElementToBeDisplayed(CartSummary.ELEMENT);
        cartSummary = new CartSummary();

        /* Cancel the transaction */

        await cartSummary.cancelButton.click();

        /* Validates if available and reserved places numbers are updated correctly */

        expect(await firstTrip.getAvailablePlaceCountValue()).toBe(initialAvailablePlaceCount);
        expect(await firstTrip.getReservedTicketsCountValue()).toBe(0);

        /* Validates if header reserved places indicator is updated correctly */

        expect(await header.getReservedTicketCountIndicatorValue()).toBe(0);
    });

});
