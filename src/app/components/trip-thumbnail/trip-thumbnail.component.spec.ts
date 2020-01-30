import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripThumbnailComponent } from './trip-thumbnail.component';
import { BehaviorSubject } from 'rxjs';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { MatButtonModule, MatCardModule, MatCardTitle, MatIconModule } from '@angular/material';
import { MockComponent } from 'ng-mocks';
import { RateComponent } from '../rate/rate.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Trip } from '../../models/Trip';
import { By } from '@angular/platform-browser';


const baseTrip: Trip = {
    key: 'T01',
    name: 'trip name',
    country: 'trip country',
    startDate: '2020-01-01',
    endDate: '2020-01-10',
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

class ShoppingServiceStub {
    private shoppingCartSubject = new BehaviorSubject({
        trips: new Map<string, number>([
            [ 'T01', 2 ],
        ]),
    });

    setShoppingCartMock(value) {
        this.shoppingCartSubject.next({
            trips: value,
        });
    }

    get shoppingCart$() {
        return this.shoppingCartSubject;
    }
}

describe('TripThumbnailComponent', () => {

    let component: TripThumbnailComponent;
    let fixture: ComponentFixture<TripThumbnailComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ TripThumbnailComponent, MockComponent(RateComponent) ],
            imports: [
                RouterTestingModule.withRoutes([]),
                MatCardModule,
                MatIconModule,
                MatButtonModule,
            ],
            providers: [
                { provide: ShoppingService, useClass: ShoppingServiceStub },
            ],
        });
        fixture = TestBed.createComponent(TripThumbnailComponent);
        component = fixture.componentInstance;
    });

    it('should render basic trip info', () => {
        // given
        component.trip = baseTrip;
        const shoppingService = TestBed.get(ShoppingService);
        shoppingService.setShoppingCartMock(new Map([]));
        fixture.detectChanges();

        // when
        const tripName = fixture.debugElement.query(By.directive(MatCardTitle));
        const price = fixture.debugElement.query(By.css('.price'));
        const description = fixture.debugElement.query(By.css('.description'));
        const availableTickets = fixture.debugElement.query(By.css('.available > .limit'));

        // then
        expect(tripName.nativeElement.innerText).toContain(baseTrip.name);
        expect(price.nativeElement.innerText).toContain(`${baseTrip.price.toFixed(2)}`);
        expect(description.nativeElement.innerText).toContain(baseTrip.description);
        expect(availableTickets.nativeElement.innerText).toBe(`${baseTrip.freePlaces}`);
    });

    it('should render rate component', () => {
        // given
        component.trip = {
            ...baseTrip,
            rating: {
                value: 4,
                votes: [ 'uid1', 'uid2' ],
            },
        };
        fixture.detectChanges();

        // when
        const rateComponentDebugElement = fixture.debugElement.query(By.directive(RateComponent));
        const rateComponentInstance = rateComponentDebugElement.componentInstance;

        // then
        expect(rateComponentInstance.mode).toBe('display');
        expect(rateComponentInstance.ratingValue).toBe(4);
        expect(rateComponentInstance.tooltip).toBe('2 votes');
    });

    it('should adds one reserved ticket and update \'available\' tickets count', () => {
        // given
        component.trip = baseTrip;
        const shoppingService = TestBed.get(ShoppingService);
        shoppingService.setShoppingCartMock(new Map());
        fixture.detectChanges();

        // when
        const incrementButton = fixture.debugElement.query(By.css('.increment-btn'));
        incrementButton.nativeElement.click();
        fixture.detectChanges();
        const availableTickets = fixture.debugElement.query(By.css('.available > .limit'));

        // then
        expect(shoppingService.shoppingCart$.value).toEqual({
            trips: new Map([
                [ baseTrip.key, 1 ],
            ]),
        });
        expect(availableTickets.nativeElement.innerText).toBe(`${baseTrip.freePlaces - 1}`);
    });

    it('should removes one reserved ticket and update \'available\' tickets count', () => {
        // given
        component.trip = baseTrip;
        const shoppingService = TestBed.get(ShoppingService);
        shoppingService.setShoppingCartMock(new Map([
            [ baseTrip.key, 2 ],
        ]));
        fixture.detectChanges();

        // when
        const decrementButton = fixture.debugElement.query(By.css('.decrement-btn'));
        decrementButton.nativeElement.click();
        fixture.detectChanges();
        const availableTickets = fixture.debugElement.query(By.css('.available > .limit'));

        // then
        expect(shoppingService.shoppingCart$.value).toEqual({
            trips: new Map([
                [ baseTrip.key, 1 ],
            ]),
        });
        expect(availableTickets.nativeElement.innerText).toBe(`${baseTrip.freePlaces}`);
    });

    it('should removes trip entry from card when reserved ticket count reach 0', () => {
        // given
        component.trip = baseTrip;
        const shoppingService = TestBed.get(ShoppingService);
        shoppingService.setShoppingCartMock(new Map([
            [ baseTrip.key, 1 ],
        ]));
        fixture.detectChanges();

        // when
        const decrementButton = fixture.debugElement.query(By.css('.decrement-btn'));
        decrementButton.nativeElement.click();
        fixture.detectChanges();
        const availableTickets = fixture.debugElement.query(By.css('.available > .limit'));

        // then
        expect(shoppingService.shoppingCart$.value).toEqual({
            trips: new Map([]),
        });
        expect(availableTickets.nativeElement.innerText).toBe(`${baseTrip.freePlaces}`);
    });

});
