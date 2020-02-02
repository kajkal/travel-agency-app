import { browser } from 'protractor';
import { waitForElementToBeDisplayed, waitForElementToBeHidden, waitForUrlToBeActive } from '../utils/asynchronous-utils';
import { Header } from '../models/header/Header';
import { SignInForm } from '../models/forms/SignInForm';


describe('Sign in page', () => {

    let header: Header;
    let form: SignInForm;

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
    });

    beforeEach(async () => {
        await browser.get('/sign-in');
        await waitForElementToBeDisplayed(SignInForm.FORM_LOCATOR);
        header = new Header();
        form = new SignInForm();
    });

    it('should sign and logout in successfully', async () => {
        /* Validates if sign in process is successful */

        await form.fillSignInForm('test@domain.com', 'haslo88');
        await form.submit();
        await waitForElementToBeHidden(form.progressBar);

        await waitForUrlToBeActive('/trips');

        /* Validates if logout process is successful */

        await waitForElementToBeDisplayed(Header.HEADER_LOCATOR);
        await header.optionMenuTriggerButton.click();

        await waitForElementToBeDisplayed(Header.OPTION_MENU_LOCATOR);
        await header.logoutOption.click();

        await waitForUrlToBeActive('/sign-in');
    });

    it('should display error messages when credentials are invalid (static validation)', async () => {
        /* Validates if email field is validated correctly */

        await form.emailField.input.sendKeys('');
        await form.formTitle.click();
        expect(await form.emailField.getErrors()).toEqual([ 'Email is required.' ]);

        await form.emailField.input.sendKeys('user');
        await form.formTitle.click();
        expect(await form.emailField.getErrors()).toEqual([ 'Provide valid email.' ]);

        /* Validates if password field is validated correctly */

        await form.passwordField.input.sendKeys('');
        await form.formTitle.click();
        expect(await form.passwordField.getErrors()).toEqual([ 'Password is required.' ]);

        await form.passwordField.input.sendKeys('123');
        await form.formTitle.click();
        expect(await form.passwordField.getErrors()).toEqual([ 'Password should be minimum 6 characters.' ]);
    });

    it('should display error messages when credentials are invalid (dynamic validation)', async () => {
        /* Validates if non existing user is handled properly */

        await form.fillSignInForm('non-existent-user@domain.com', 'haslo88');
        await form.submit();
        await waitForElementToBeHidden(form.progressBar);
        expect(await form.emailField.getErrors()).toEqual([
            'There is no user record corresponding to this identifier. The user may have been deleted.',
        ]);
        expect(await form.submitButton.isDisplayed()).toBe(true);

        /* Validates if wrong password is handled properly */

        await form.fillSignInForm('test@domain.com', 'wrong-password');
        await form.submit();
        await waitForElementToBeHidden(form.progressBar);
        expect(await form.passwordField.getErrors()).toEqual([
            'The password is invalid or the user does not have a password.',
        ]);
        expect(await form.submitButton.isDisplayed()).toBe(true);
    });

    it('should display links adequate to user auth state', async () => {
        /* Validates header links before sign in */

        expect(await header.signInButton.isPresent()).toBe(true);
        expect(await header.signUpButton.isPresent()).toBe(true);
        expect(await header.cartButton.isPresent()).toBe(false);
        expect(await header.optionMenuTriggerButton.isPresent()).toBe(false);

        /* Sign in */

        await form.fillSignInForm('test@domain.com', 'haslo88');
        await form.submit();
        await waitForElementToBeHidden(form.progressBar);

        await waitForUrlToBeActive('/trips');

        /* Validates header links after sign in */

        expect(await header.signInButton.isPresent()).toBe(false);
        expect(await header.signUpButton.isPresent()).toBe(false);
        expect(await header.cartButton.isPresent()).toBe(true);
        expect(await header.optionMenuTriggerButton.isPresent()).toBe(true);

        /* Logout */

        await waitForElementToBeDisplayed(Header.HEADER_LOCATOR);
        await header.optionMenuTriggerButton.click();

        await waitForElementToBeDisplayed(Header.OPTION_MENU_LOCATOR);
        await header.logoutOption.click();

        await waitForUrlToBeActive('/sign-in');

        /* Validates header links after logout */

        expect(await header.signInButton.isPresent()).toBe(true);
        expect(await header.signUpButton.isPresent()).toBe(true);
        expect(await header.cartButton.isPresent()).toBe(false);
        expect(await header.optionMenuTriggerButton.isPresent()).toBe(false);
    });

});
