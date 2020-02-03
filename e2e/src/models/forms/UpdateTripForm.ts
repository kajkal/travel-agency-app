import { TripForm } from './TripForm';
import { by, element, ElementFinder } from 'protractor';


export class UpdateTripForm extends TripForm {

    static ELEMENT = element(by.css('app-update-trip form'));

    formTitle: ElementFinder;

    constructor() {
        super(UpdateTripForm.ELEMENT);
        this.formTitle = UpdateTripForm.ELEMENT.element(by.tagName('h1'));
    }

    getFormTitle(): Promise<string> {
        return this.formTitle.getText() as Promise<string>;
    }

}
