import { waitForElementToBeDisplayed, waitForElementToBeHidden, waitForUrlToBeActive } from './asynchronous-utils';
import { Header } from '../models/header/Header';
import { SignInForm } from '../models/forms/SignInForm';
import { browser } from 'protractor';


export async function signIn(email = 'test@domain.com', password = 'haslo88') {
    await browser.get('/sign-in');
    await waitForElementToBeDisplayed(SignInForm.FORM_LOCATOR);
    const form = new SignInForm();

    await form.fillSignInForm(email, password);
    await form.submit();
    await waitForElementToBeHidden(form.progressBar);

    await waitForUrlToBeActive('/trips');
}

export async function logout() {
    const header = new Header();

    await waitForElementToBeDisplayed(Header.HEADER_LOCATOR);
    await header.optionMenuTriggerButton.click();

    await waitForElementToBeDisplayed(Header.OPTION_MENU_LOCATOR);
    await header.logoutOption.click();

    await waitForUrlToBeActive('/sign-in');
}
