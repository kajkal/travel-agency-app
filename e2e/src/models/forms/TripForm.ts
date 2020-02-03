import { by, ElementFinder, protractor } from 'protractor';
import { FormField } from '../common/FormField';
import { getFormFieldById } from '../../utils/form-utils';


export interface TripData {
    name: string;
    country: string;
    startDate: string;
    endDate: string;
    price: number;
    freePlaces: number;
    description: string;
    thumbnailUrl: string;
}

export class TripForm {

    nameField: FormField;
    countryField: FormField;
    startDateField: FormField;
    endDateField: FormField;
    priceField: FormField;
    freePlacesField: FormField;
    descriptionField: FormField;
    thumbnailUrlField: FormField;

    submitButton: ElementFinder;

    constructor(root: ElementFinder) {
        const formFields = root.all(by.css('.mat-form-field'));

        this.nameField = getFormFieldById(formFields, 'name');
        this.countryField = getFormFieldById(formFields, 'country');
        this.startDateField = getFormFieldById(formFields, 'startDate');
        this.endDateField = getFormFieldById(formFields, 'endDate');
        this.priceField = getFormFieldById(formFields, 'price');
        this.freePlacesField = getFormFieldById(formFields, 'freePlaces');
        this.descriptionField = getFormFieldById(formFields, 'description');
        this.thumbnailUrlField = getFormFieldById(formFields, 'thumbnailUrl');

        this.submitButton = root.element(by.css('button[color="primary"]'));
    }

    async fillTripForm(tripData: TripData) {
        await Promise.all([
            this.nameField.input.clear(),
            this.countryField.input.clear(),
            this.startDateField.input.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'), protractor.Key.BACK_SPACE),
            this.endDateField.input.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'), protractor.Key.BACK_SPACE),
            this.priceField.input.clear(),
            this.freePlacesField.input.clear(),
            this.descriptionField.input.clear(),
            this.thumbnailUrlField.input.clear(),
        ]);
        await Promise.all([
            this.nameField.input.sendKeys(tripData.name),
            this.countryField.input.sendKeys(tripData.country),
            this.startDateField.input.sendKeys(tripData.startDate),
            this.endDateField.input.sendKeys(tripData.endDate),
            this.priceField.input.sendKeys(tripData.price),
            this.freePlacesField.input.sendKeys(tripData.freePlaces),
            this.descriptionField.input.sendKeys(tripData.description),
            this.thumbnailUrlField.input.sendKeys(tripData.thumbnailUrl),
        ]);
    }

    async submit() {
        await this.submitButton.click();
    }

}
