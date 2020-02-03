import { browser, by, element, protractor } from 'protractor';
import { logout, signIn } from '../utils/session-utils';
import { waitForElementToBeDisplayed } from '../utils/asynchronous-utils';
import { TripPreviewList } from '../models/trip/TripPreviewList';
import { TripsFilters } from '../models/trip/TripsFilters';


describe('Trips filters', () => {

    let filters: TripsFilters;

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
        await signIn();
    });

    afterAll(async () => {
        await logout();
    });

    beforeEach(async () => {
        filters = new TripsFilters();
        await waitForElementToBeDisplayed(element(by.tagName('app-trip-thumbnail')));
    });

    it('should filter trips by given phrase', async () => {
        const fillTripList = await TripPreviewList.loadTripPreviewList();
        expect(fillTripList.length).toBe(9);

        await filters.searchByPhrase('krakow');

        const filteredTripList = await TripPreviewList.loadTripPreviewList();
        expect(filteredTripList.length).toBe(1);
        filteredTripList.map(async filteredTrip => {
            const tripName = await filteredTrip.getTripName();
            expect(tripName.toLowerCase()).toContain('krakow');
        });

        await filters.searchByPhrase(protractor.Key.BACK_SPACE);
    });

    it('should filter trips by price range', async () => {
        const fillTripList = await TripPreviewList.loadTripPreviewList();
        expect(fillTripList.length).toBe(9);

        await filters.changeMaxPrice(100);

        const filteredTripList = await TripPreviewList.loadTripPreviewList();
        expect(filteredTripList.length).toBe(5);

        await filters.changeMaxPrice(-100);
    });

    it('should filter trips by minimal rating', async () => {
        const fillTripList = await TripPreviewList.loadTripPreviewList();
        expect(fillTripList.length).toBe(9);

        await filters.selectMinimalRating(5);

        const filteredTripList = await TripPreviewList.loadTripPreviewList();
        expect(filteredTripList.length).toBe(2);
        filteredTripList.map(async filteredTrip => {
            const rating = await filteredTrip.getRatingValue();
            expect(rating).toBeGreaterThanOrEqual(5);
        });

        await filters.selectMinimalRating(1);
    });

});
