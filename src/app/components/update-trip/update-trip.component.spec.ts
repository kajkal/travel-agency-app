import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateTripComponent } from './update-trip.component';
import { MAT_DIALOG_DATA, MatCardModule, MatDatepickerModule, MatDialogRef, MatFormFieldModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TripsService } from '../../services/trips/trips.service';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Trip } from '../../models/Trip';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';


const baseTrip: Trip = {
    key: 'trip key',
    name: 'trip name',
    country: 'trip country',
    startDate: '2020-01-01T00:00:00.000Z',
    endDate: '2020-01-10T00:00:00.000Z',
    price: 100,
    freePlaces: 5,
    description: 'trip description',
    thumbnailUrl: 'thumbnail url',
    rating: {
        value: 3,
        votes: [ 'uid' ],
    },
    comments: [],
};

class TripsServiceStub {
    updateTrip = jasmine.createSpy().and.returnValue(Promise.resolve());
}

class MatDialogRefStub {
    close = jasmine.createSpy();
}

class InputWrapper {
    constructor(
        private input: DebugElement,
        private fieldControl: AbstractControl,
    ) {
    }

    sendKeys(value: string) {
        this.input.nativeElement.value = value;
        this.input.nativeElement.dispatchEvent(new Event('input'));
        this.fieldControl.markAllAsTouched();
    }

    getErrors(): string[] {
        return Array.from(this.input.nativeElement
            .closest('mat-form-field')
            .querySelectorAll('mat-error > span'))
            .map((e: HTMLSpanElement) => {
                console.log(e);
                return e.innerText;
            });
    }
}

describe('UpdateTripComponent', () => {

    let component: UpdateTripComponent;
    let fixture: ComponentFixture<UpdateTripComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ UpdateTripComponent ],
            imports: [
                MatCardModule,
                MatFormFieldModule,
                MatDatepickerModule,
                MatNativeDateModule,
                FormsModule,
                ReactiveFormsModule,
                MatInputModule,
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: TripsService, useClass: TripsServiceStub },
                { provide: MatDialogRef, useClass: MatDialogRefStub },
                { provide: MAT_DIALOG_DATA, useValue: baseTrip },
            ],
        });
        fixture = TestBed.createComponent(UpdateTripComponent);
        component = fixture.componentInstance;
    });

    it('should close itself on \'Cancel\' button click', () => {
        // given
        const dialogRef = TestBed.get(MatDialogRef);
        fixture.detectChanges();

        // when
        const cancelButton = fixture.debugElement.query(By.css('button[color="warn"]'));
        cancelButton.nativeElement.click();

        // then
        expect(cancelButton.nativeElement.innerText).toBe('Cancel');
        expect(dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should propagate fields based on trip data object', () => {
        // given
        fixture.detectChanges();

        // when
        const updateTripForm = fixture.debugElement.query(By.css('form'));
        const tripName = updateTripForm.query(By.css('#name'));
        const country = updateTripForm.query(By.css('#country'));
        const startDate = updateTripForm.query(By.css('#startDate'));
        const endDate = updateTripForm.query(By.css('#endDate'));
        const price = updateTripForm.query(By.css('#price'));
        const freePlaces = updateTripForm.query(By.css('#freePlaces'));
        const description = updateTripForm.query(By.css('#description'));
        const thumbnailUrl = updateTripForm.query(By.css('#thumbnailUrl'));

        // then
        expect(tripName.nativeElement.value).toBe(baseTrip.name);
        expect(country.nativeElement.value).toBe(baseTrip.country);
        expect(startDate.nativeElement.value).toBe('1/1/2020');
        expect(endDate.nativeElement.value).toBe('1/10/2020');
        expect(price.nativeElement.value).toBe(`${baseTrip.price}`);
        expect(freePlaces.nativeElement.value).toBe(`${baseTrip.freePlaces}`);
        expect(description.nativeElement.value).toBe(baseTrip.description);
        expect(thumbnailUrl.nativeElement.value).toBe(baseTrip.thumbnailUrl);
    });

    it('should update trip and close itself on \'Update\' button click', async () => {
        // given
        const dialogRef = TestBed.get(MatDialogRef);
        const tripsService = TestBed.get(TripsService);
        fixture.detectChanges();

        // when
        const updateTripForm = fixture.debugElement.query(By.css('form'));
        const tripName = new InputWrapper(updateTripForm.query(By.css('#name')), component.name);
        tripName.sendKeys('Updated trip name');
        fixture.detectChanges();
        const updateButton = fixture.debugElement.query(By.css('button[color="primary"]'));
        updateButton.nativeElement.click();

        // then
        expect(tripsService.updateTrip).toHaveBeenCalledTimes(1);
        expect(tripsService.updateTrip).toHaveBeenCalledWith({
            ...baseTrip,
            name: 'Updated trip name',
        });
        expect(await dialogRef.close).toHaveBeenCalledTimes(1);
    });

    describe('error messages', () => {

        function shouldDisplayErrors(inputSelector: string, value: string, expectedErrors: string[]) {
            // given
            fixture.detectChanges();

            // when
            const addTripForm = fixture.debugElement.query(By.css('form'));
            const inputField = new InputWrapper(addTripForm.query(By.css(`#${inputSelector}`)), component[ inputSelector ]);
            inputField.sendKeys(value);
            fixture.detectChanges();

            // then
            expect(inputField.getErrors()).toEqual(expectedErrors);
        }

        it('should display error message when \'Trip name\' is missing', () => {
            shouldDisplayErrors('name', '', [ 'Trip name is required.' ]);
        });

        it('should display error message when \'Country\' is missing', () => {
            shouldDisplayErrors('country', '', [ 'Country is required.' ]);
        });

        it('should display error message when \'Start date\' is missing', () => {
            shouldDisplayErrors('startDate', '', [ 'Start date is required.' ]);
        });

        it('should display error message when \'End date\' is missing', () => {
            shouldDisplayErrors('endDate', '', [ 'End date is required.' ]);
        });

        it('should display error message when \'Price\' is missing', () => {
            shouldDisplayErrors('price', '', [ 'Price is required.' ]);
        });

        it('should display error message when \'Free places\' is missing', () => {
            shouldDisplayErrors('freePlaces', '', [ 'Free places is required.' ]);
        });

        it('should display error message when \'Description\' is missing', () => {
            shouldDisplayErrors('description', '', [ 'Description is required.' ]);
        });

        it('should display error message when \'Photo url\' is missing', () => {
            shouldDisplayErrors('thumbnailUrl', '', [ 'Photo url is required.' ]);
        });

    });

});
