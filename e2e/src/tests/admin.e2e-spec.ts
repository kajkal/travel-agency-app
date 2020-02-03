import { Header } from '../models/header/Header';
import { browser, by, element } from 'protractor';
import { logout, signIn } from '../utils/session-utils';
import { waitForElementToBeDisplayed, waitForUrlToBeActive } from '../utils/asynchronous-utils';
import { TripDetails } from '../models/trip/TripDetails';
import { AddTripForm } from '../models/forms/AddTripForm';
import { TripData } from '../models/forms/TripForm';
import { TripPreviewList } from '../models/trip/TripPreviewList';
import { UpdateTripForm } from '../models/forms/UpdateTripForm';


describe('admin panel', () => {

    let header: Header;

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
        await signIn('admin@domain.com', 'haslo88');
        header = new Header();
    });

    afterAll(async () => {
        await logout();
    });

    beforeEach(async () => {
        await browser.get('/trips');
        await waitForElementToBeDisplayed(Header.HEADER_LOCATOR);
        await waitForElementToBeDisplayed(element(by.tagName('app-trip-thumbnail')));
    });

    it('should display \'Add Trip\' option in header', async () => {
        /* Validates header admin links */

        expect(await header.signInButton.isPresent()).toBe(false);
        expect(await header.signUpButton.isPresent()).toBe(false);
        expect(await header.cartButton.isPresent()).toBe(true);
        expect(await header.optionMenuTriggerButton.isPresent()).toBe(true);

        /* Opens more options menu */

        await header.optionMenuTriggerButton.click();
        await waitForElementToBeDisplayed(Header.OPTION_MENU_LOCATOR);

        /* Validates admin options  */

        expect(await header.addTripOption.isPresent()).toBe(true);
        expect(await header.tripsOption.isPresent()).toBe(true);
        expect(await header.logoutOption.isPresent()).toBe(true);
    });

    it('it should adds, updates and removes trip successfully', async () => {
        const initialTripCount = (await TripPreviewList.loadTripPreviewList()).length;

        /* Select 'Add Trip' option in header */

        await header.optionMenuTriggerButton.click();
        await waitForElementToBeDisplayed(Header.OPTION_MENU_LOCATOR);
        await header.addTripOption.click();
        await waitForUrlToBeActive('/admin/new-trip');
        await waitForElementToBeDisplayed(AddTripForm.ELEMENT);

        /* Fill and submit add trip form */

        const newTripData: TripData = {
            name: 'Test name',
            country: 'Test country',
            startDate: '1/10/2020',
            endDate: '1/12/2020',
            price: 150,
            freePlaces: 10,
            description: 'Test description',
            thumbnailUrl: 'https://picjumbo.com/wp-content/uploads/free-stock-photos-san-francisco-2210x1473.jpg',
        };
        const addTripForm = new AddTripForm();
        await addTripForm.fillTripForm(newTripData);
        await addTripForm.submit();
        await waitForUrlToBeActive('/trips');
        await waitForElementToBeDisplayed(element(by.tagName('app-trip-thumbnail')));

        /* Validates newly added trip */

        const tripList = await TripPreviewList.loadTripPreviewList();
        const newTripPreview = tripList[ tripList.length - 1 ];

        expect(tripList.length).toBe(initialTripCount + 1);
        expect(await newTripPreview.getTripName()).toBe('Test name');
        expect(await newTripPreview.getTripPrice()).toBe(150);
        expect(await newTripPreview.getAvailablePlaceCountValue()).toBe(10);

        /* Navigates to the trip page */

        await newTripPreview.navigateToTripDetailsPage();
        await waitForUrlToBeActive('/trips/');
        await waitForElementToBeDisplayed(TripDetails.ELEMENT);
        const tripDetails = new TripDetails();

        /* Select 'Update' option */

        await tripDetails.adminOptionMenuTriggerButton.click();
        await waitForElementToBeDisplayed(TripDetails.ADMIN_OPTION_MENU_ELEMENT);
        await tripDetails.selectUpdateTripOption();
        await waitForElementToBeDisplayed(UpdateTripForm.ELEMENT);

        /* Fill and submit update trip form */

        const updatedTripData: TripData = {
            ...newTripData,
            name: 'San Francisco',
            price: 350,
        };
        const updateTripForm = new UpdateTripForm();
        await updateTripForm.fillTripForm(updatedTripData);
        await updateTripForm.submit();

        /* Validates updated trip */

        expect(await tripDetails.getTripName()).toBe('San Francisco');
        expect(await tripDetails.getTripPrice()).toBe(350);

        /* Select 'Delete' option */

        await tripDetails.adminOptionMenuTriggerButton.click();
        await waitForElementToBeDisplayed(TripDetails.ADMIN_OPTION_MENU_ELEMENT);
        await tripDetails.selectDeleteTripOption();
        await waitForUrlToBeActive('/trips');
        await waitForElementToBeDisplayed(element(by.tagName('app-trip-thumbnail')));

        /* Validates if trip has been successfully removed = no trip with name either 'Test name' or 'San Francisco' */

        const tripListAfterDelete = await TripPreviewList.loadTripPreviewList();
        const tripNames = await Promise.all(tripListAfterDelete.map(t => t.getTripName()));
        expect(tripNames.every(name => ![ 'Test name', 'San Francisco' ].includes(name))).toBe(true);
        expect(tripListAfterDelete.length).toBe(initialTripCount);
    });

});
