import { by, element, ElementFinder } from 'protractor';
import { FormField } from '../common/FormField';
import { getFormFieldById } from '../../utils/form-utils';


export class AddCommentForm {

    static ELEMENT = element(by.css('.comments form'));

    commentField: FormField;
    submitButton: ElementFinder;

    constructor() {
        const formRoot: ElementFinder = AddCommentForm.ELEMENT;

        const formFields = formRoot.all(by.css('.mat-form-field'));
        this.commentField = getFormFieldById(formFields, 'comment');

        this.submitButton = formRoot.element(by.css('button[color="primary"]'));
    }

    async fillAddCommentForm(comment: string) {
        await this.commentField.input.clear();
        await this.commentField.input.sendKeys(comment);
    }

    async submit() {
        await this.submitButton.click();
    }

}
