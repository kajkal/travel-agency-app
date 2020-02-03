import { browser, by, element } from 'protractor';
import { logout, signIn } from '../utils/session-utils';
import { waitForElementToBeDisplayed, waitForUrlToBeActive } from '../utils/asynchronous-utils';
import { TripPreviewList } from '../models/trip/TripPreviewList';
import { TripDetails } from '../models/trip/TripDetails';
import { AddCommentForm } from '../models/forms/AddCommentForm';


describe('trip comment process', () => {

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

    it('should prevent from adding comments when user did not reserved trip', async () => {
        const firstTrip = (await TripPreviewList.loadTripPreviewList())[ 0 ];

        /* Navigates to the trip page */

        await firstTrip.navigateToTripDetailsPage();
        await waitForUrlToBeActive('/trips/');
        await waitForElementToBeDisplayed(TripDetails.ELEMENT);
        const tripDetails = new TripDetails();

        /* Validates trip details page and lack of add comment form presence */

        expect(await tripDetails.getReservedTicketsCountValue()).toBe(0);
        expect(await AddCommentForm.ELEMENT.isPresent()).toBe(false);
    });

    it('should add new comment when user has reserved a trip', async () => {
        const firstTrip = (await TripPreviewList.loadTripPreviewList())[ 0 ];

        /* Reserve 1 ticket for the first trip */

        await firstTrip.reserveTicket();

        /* Navigates to the trip page */

        await firstTrip.navigateToTripDetailsPage();
        await waitForUrlToBeActive('/trips/');
        await waitForElementToBeDisplayed(TripDetails.ELEMENT);
        const tripDetails = new TripDetails();

        /* Validates trip details page */

        expect(await tripDetails.getReservedTicketsCountValue()).toBe(1);
        expect(await AddCommentForm.ELEMENT.isPresent()).toBe(true);

        const form = new AddCommentForm();
        const initialCommentCount = (await tripDetails.getComments()).length;

        /* Adds comment + validates submit button behaviour */

        expect(await form.submitButton.isEnabled()).toBe(false);
        await form.fillAddCommentForm('');
        expect(await form.submitButton.isEnabled()).toBe(false);
        await form.fillAddCommentForm('test comment content');
        expect(await form.submitButton.isEnabled()).toBe(true);
        await form.submit();

        /* Validates added comment */

        const newComments = await tripDetails.getComments();
        const newComment = newComments[ newComments.length - 1 ];

        expect(newComments.length).toBe(initialCommentCount + 1);
        expect(await newComment.getAuthor()).toBe('test@domain.com');
        expect(await newComment.getContent()).toBe('test comment content');
    });

});
