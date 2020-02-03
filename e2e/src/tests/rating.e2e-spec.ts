import { browser, by, element } from 'protractor';
import { logout, signIn } from '../utils/session-utils';
import { waitForAlert, waitForElementToBeDisplayed, waitForUrlToBeActive } from '../utils/asynchronous-utils';
import { TripPreviewList } from '../models/trip/TripPreviewList';
import { TripDetails } from '../models/trip/TripDetails';


describe('trip rating process', () => {

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
        await signIn();
    });

    afterAll(async () => {
        await logout();
    });

    beforeEach(async () => {
        await browser.get('/trips');
        await waitForElementToBeDisplayed(element(by.tagName('app-trip-thumbnail')));
    });

    it('save user rating only when rated at the first time', async () => {
        const firstTrip = (await TripPreviewList.loadTripPreviewList())[ 0 ];

        /* Navigates to the trip page */

        await firstTrip.navigateToTripDetailsPage();
        await waitForUrlToBeActive('/trips/');
        await waitForElementToBeDisplayed(TripDetails.ELEMENT);
        const tripDetails = new TripDetails();

        /* Validates initial state */

        expect(await tripDetails.getRatingValue()).toBe(0);

        /* Rate trip for the first time */

        await tripDetails.rateTrip(3);

        /* Validates if trip rating is set properly */

        expect(await tripDetails.getRatingValue()).toBe(3);

        /* Rate trip for the second time */

        await tripDetails.rateTrip(5);

        /* Validates if error alert is displayed */

        await waitForAlert();
        const alert = await browser.driver.switchTo().alert();
        expect(await alert.getText()).toBe('You already rate this trip!');
        await alert.accept();
    });

});
