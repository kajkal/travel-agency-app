import { by, element, ElementFinder } from 'protractor';
import { TripForm } from './TripForm';


export class AddTripForm extends TripForm {

    static ELEMENT = element(by.className('add-trip-form'));

    formTitle: ElementFinder;

    constructor() {
        super(AddTripForm.ELEMENT);
        this.formTitle = AddTripForm.ELEMENT.element(by.className('mat-card-title'));
    }

    getFormTitle(): Promise<string> {
        return this.formTitle.getText() as Promise<string>;
    }

}
