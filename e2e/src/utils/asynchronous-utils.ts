import { browser, ElementFinder, protractor } from 'protractor';


export async function waitForElementToBeDisplayed(elementFinder: ElementFinder, timeout = 5000) {
    const EC = protractor.ExpectedConditions;
    await browser.wait(EC.presenceOf(elementFinder), timeout, 'element is not displayed');
}

export async function waitForElementToBeHidden(elementFinder: ElementFinder, timeout = 5000) {
    const EC = protractor.ExpectedConditions;
    await browser.wait(EC.stalenessOf(elementFinder), timeout, 'element is not hidden');
}

export async function waitForUrlToBeActive(url: string, timeout = 5000) {
    const EC = protractor.ExpectedConditions;
    await browser.wait(EC.urlContains(url), timeout, `expected url "${url}" is not active`);
}
