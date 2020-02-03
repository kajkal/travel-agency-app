import { Header } from '../models/header/Header';
import { SignUpForm } from '../models/forms/SignUpForm';
import { browser } from 'protractor';
import { waitForElementToBeDisplayed, waitForElementToBeHidden, waitForUrlToBeActive } from '../utils/asynchronous-utils';
import { generateRandomEmail } from '../utils/other-utils';


describe('Sign up process', () => {

    let header: Header;
    let form: SignUpForm;

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
    });

    beforeEach(async () => {
        await browser.get('/sign-up');
        await waitForElementToBeDisplayed(SignUpForm.ELEMENT);
        header = new Header();
        form = new SignUpForm();
    });

    it('should display error when email is already taken', async () => {
        await form.fillSignUpForm('test@domain.com', 'haslo88');
        await form.submit();
        await waitForElementToBeHidden(form.progressBar);

        expect(await form.emailField.getErrors()).toEqual([ 'This email is already taken.' ]);
    });

    it('should sign up successfully', async () => {
        /* Sign up */

        await form.fillSignUpForm(generateRandomEmail(), 'haslo88');
        await form.submit();
        await waitForElementToBeHidden(form.progressBar);
        await waitForUrlToBeActive('/trips');

        /* Logout */

        await waitForElementToBeDisplayed(Header.HEADER_LOCATOR);
        await header.optionMenuTriggerButton.click();

        await waitForElementToBeDisplayed(Header.OPTION_MENU_LOCATOR);
        await header.logoutOption.click();

        await waitForUrlToBeActive('/sign-in');
    });

});
