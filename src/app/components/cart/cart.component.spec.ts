import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { MatCardModule, MatListModule } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { TripsService } from '../../services/trips/trips.service';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { RouterTestingModule } from '@angular/router/testing';
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

describe('CartComponent', () => {

    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ CartComponent ],
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
        fixture = TestBed.createComponent(CartComponent);
        component = fixture.componentInstance;
    });

    it('should render 2 rows with reserved trips info and total price', () => {
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
        const totalPrice = fixture.debugElement.query(By.css('.data-row.summary'));

        // then
        expect(listItems.length).toBe(2);
        expect(totalPrice.nativeElement.innerText).toContain('350.00');
    });

    it('should navigate the user to the /confirmation page on \'Proceed\' button click', () => {
        // given
        const router = TestBed.get(Router);
        spyOn(router, 'navigate');
        fixture.detectChanges();

        // when
        const actionButtons = fixture.debugElement.queryAll(By.css('.mat-card-actions > button'));
        const proceedButton = actionButtons[ 1 ];
        proceedButton.nativeElement.click();

        // then
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([ '/confirmation' ]);
    });

    it('should clear shopping card and navigate the user to the /trips page on \'Cancel\' button click', () => {
        // given
        const router = TestBed.get(Router);
        spyOn(router, 'navigate');
        const shoppingService = TestBed.get(ShoppingService);
        fixture.detectChanges();

        // when
        const actionButtons = fixture.debugElement.queryAll(By.css('.mat-card-actions > button'));
        const cancelButton = actionButtons[ 0 ];
        cancelButton.nativeElement.click();

        // then
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([ '/trips' ]);
        expect(shoppingService.shoppingCart$.value).toEqual(ShoppingCart.emptyShoppingCart);
    });

});
