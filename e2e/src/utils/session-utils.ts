import { waitForElementToBeDisplayed, waitForElementToBeHidden, waitForUrlToBeActive } from './asynchronous-utils';
import { Header } from '../models/header/Header';
import { SignInForm } from '../models/forms/SignInForm';
import { browser } from 'protractor';
import { SignUpForm } from '../models/forms/SignUpForm';
import { generateRandomEmail } from './other-utils';


export async function signIn(email = 'test@domain.com', password = 'haslo88') {
    await browser.get('/sign-in');
    await waitForElementToBeDisplayed(SignInForm.ELEMENT);
    const form = new SignInForm();

    await form.fillSignInForm(email, password);
    await form.submit();
    await waitForElementToBeHidden(form.progressBar);

    await waitForUrlToBeActive('/trips');
}

export async function logout() {
    const header = new Header();

    await waitForElementToBeDisplayed(Header.HEADER_ELEMENT);
    await header.optionMenuTriggerButton.click();

    await waitForElementToBeDisplayed(Header.OPTION_MENU_ELEMENT);
    await header.logoutOption.click();

    await waitForUrlToBeActive('/sign-in');
}

export async function signUp() {
    await browser.get('/sign-up');
    await waitForElementToBeDisplayed(SignUpForm.ELEMENT);
    const form = new SignUpForm();

    await form.fillSignUpForm(generateRandomEmail(), 'haslo88');
    await form.submit();
    await waitForElementToBeHidden(form.progressBar);

    await waitForUrlToBeActive('/trips');
}
