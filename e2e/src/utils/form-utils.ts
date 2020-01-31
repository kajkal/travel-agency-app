import { by, ElementArrayFinder } from 'protractor';
import { FormField } from '../models/common/FormField';


export function getFormFieldById(formFields: ElementArrayFinder, fieldId: string): FormField {
    const formFieldWrapper = formFields.filter(formField => formField.element(by.id(fieldId)).isPresent()).first();
    return new FormField(formFieldWrapper, fieldId);
}
