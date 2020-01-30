import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTripComponent } from './add-trip.component';
import { Router } from '@angular/router';
import { TripsService } from '../../services/trips/trips.service';
import { MatCardModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


class RouterStub {
    navigate = jasmine.createSpy();
}

class TripsServiceStub {
    addTrip = jasmine.createSpy().and.returnValue(Promise.resolve());
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

describe('AddTripComponent', () => {

    let component: AddTripComponent;
    let fixture: ComponentFixture<AddTripComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ AddTripComponent ],
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
                { provide: Router, useClass: RouterStub },
                { provide: TripsService, useClass: TripsServiceStub },
            ],
        });
        fixture = TestBed.createComponent(AddTripComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add new trip on \'Create\' button click and navigate to /trips', async () => {
        // given
        const router = TestBed.get(Router);
        const tripsService = TestBed.get(TripsService);
        fixture.detectChanges();

        // when
        const instance = fixture.componentInstance;
        const addTripForm = fixture.debugElement.query(By.css('form'));
        const tripName = new InputWrapper(addTripForm.query(By.css('#name')), instance.name);
        const country = new InputWrapper(addTripForm.query(By.css('#country')), instance.country);
        const startDate = new InputWrapper(addTripForm.query(By.css('#startDate')), instance.startDate);
        const endDate = new InputWrapper(addTripForm.query(By.css('#endDate')), instance.endDate);
        const price = new InputWrapper(addTripForm.query(By.css('#price')), instance.price);
        const freePlaces = new InputWrapper(addTripForm.query(By.css('#freePlaces')), instance.freePlaces);
        const description = new InputWrapper(addTripForm.query(By.css('#description')), instance.description);
        const photoUrl = new InputWrapper(addTripForm.query(By.css('#thumbnailUrl')), instance.thumbnailUrl);
        const submitButton = addTripForm.query(By.css('button[color="primary"]'));

        tripName.sendKeys('Salt Mine Wieliczka');
        country.sendKeys('Poland');
        startDate.sendKeys('1/10/2020');
        endDate.sendKeys('1/12/2020');
        price.sendKeys('300');
        freePlaces.sendKeys('12');
        description.sendKeys('trip description');
        photoUrl.sendKeys('example-url');

        fixture.detectChanges();
        submitButton.nativeElement.click();

        // then
        expect(tripsService.addTrip).toHaveBeenCalledTimes(1);
        expect(tripsService.addTrip).toHaveBeenCalledWith({
            name: 'Salt Mine Wieliczka',
            country: 'Poland',
            startDate: '2020-01-09T23:00:00.000Z',
            endDate: '2020-01-11T23:00:00.000Z',
            price: 300,
            freePlaces: 12,
            description: 'trip description',
            thumbnailUrl: 'example-url',
            rating: {
                value: 0,
                votes: [],
            },
            comments: [],
        });
        expect(await router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([ '/trips' ]);
    });

    describe('error messages', () => {

        function shouldDisplayErrors(inputSelector: string, value: string, expectedErrors: string[]) {
            // given
            fixture.detectChanges();

            // when
            const addTripForm = fixture.debugElement.query(By.css('form'));
            const tripName = new InputWrapper(addTripForm.query(By.css(`#${inputSelector}`)), fixture.componentInstance[ inputSelector ]);
            tripName.sendKeys(value);
            fixture.detectChanges();

            // then
            expect(tripName.getErrors()).toEqual(expectedErrors);
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
