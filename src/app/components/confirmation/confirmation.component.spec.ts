import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationComponent } from './confirmation.component';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule, MatListModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { TripsService } from '../../services/trips/trips.service';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ShoppingCart } from '../../models/ShoppingCart';


class TripsServiceStub {
    private tripsSubject = new BehaviorSubject([
        { key: 'T01', name: 'Trip 1', price: 100 },
    ]);

    setTripsMock(value) {
        this.tripsSubject.next(value);
    }

    get trips$() {
        return this.tripsSubject.asObservable();
    }
}

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

describe('ConfirmationComponent', () => {

    let component: ConfirmationComponent;
    let fixture: ComponentFixture<ConfirmationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ ConfirmationComponent ],
            imports: [
                MatCardModule,
                MatListModule,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [
                { provide: TripsService, useClass: TripsServiceStub },
                { provide: ShoppingService, useClass: ShoppingServiceStub },
            ],
        });
        fixture = TestBed.createComponent(ConfirmationComponent);
        component = fixture.componentInstance;
    });

    it('should render 2 rows with reserved trips info', () => {
        // given
        const tripsService = TestBed.get(TripsService);
        tripsService.setTripsMock([
            { key: 'T01', name: 'Trip 1', price: 100 },
            { key: 'T02', name: 'Trip 2', price: 150 },
        ]);
        const shoppingService = TestBed.get(ShoppingService);
        shoppingService.setShoppingCartMock(new Map<string, number>([
            [ 'T01', 2 ],
            [ 'T02', 1 ],
        ]));
        fixture.detectChanges();

        // when
        const listItems = fixture.debugElement.queryAll(By.css('.data-row:not(.summary):not(.header)'));

        // then
        expect(listItems.length).toBe(2);
    });

    it('should navigate the user to the /cart page on \'Back\' button click', () => {
        // given
        const router = TestBed.get(Router);
        spyOn(router, 'navigate');
        fixture.detectChanges();

        // when
        const actionButtons = fixture.debugElement.queryAll(By.css('.mat-card-actions > button'));
        const backButton = actionButtons[ 0 ];
        backButton.nativeElement.click();

        // then
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([ '/cart' ]);
    });

    it('should clear shopping card and navigate the user to the /trips page on \'Confirm\' button click', () => {
        // given
        const router = TestBed.get(Router);
        spyOn(router, 'navigate');
        const shoppingService = TestBed.get(ShoppingService);
        fixture.detectChanges();

        // when
        const actionButtons = fixture.debugElement.queryAll(By.css('.mat-card-actions > button'));
        const confirmButton = actionButtons[ 1 ];
        confirmButton.nativeElement.click();

        // then
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([ '/trips' ]);
        expect(shoppingService.shoppingCart$.value).toEqual(ShoppingCart.emptyShoppingCart);
    });

});
