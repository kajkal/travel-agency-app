import { Component, OnInit } from '@angular/core';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { combineLatest, Observable } from 'rxjs';
import { SelectedTrip, Trip } from '../../models/Trip';
import { TripsService } from '../../services/trips/trips.service';
import { filter, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ShoppingCart } from '../../models/ShoppingCart';




@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: [ './cart.component.scss' ],
})
export class CartComponent implements OnInit {

    public selectedTrips$: Observable<SelectedTrip[]>;
    public totalTotalPrice$: Observable<number>;

    constructor(
        private tripsService: TripsService,
        private shoppingService: ShoppingService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.selectedTrips$ = combineLatest(this.shoppingService.shoppingCart$, this.tripsService.trips$)
            .pipe(
                filter(([ _, trips ]) => Boolean(trips.length)),
                map(([ shoppingCart, trips ]) => (
                    Array.from(shoppingCart.trips.entries())
                        .map(([ tripKey, selectedPlacesCount ]) => {
                            const trip = trips.find(t => t.key === tripKey);
                            return trip ? { ...trip, selectedPlacesCount } : undefined;
                        })
                        .filter(Boolean)
                )),
                tap(v => console.log('selectedTrips$', v)),
            );

        this.totalTotalPrice$ = this.selectedTrips$
            .pipe(
                map(selectedTrips => (
                    selectedTrips.reduce((accumulator, selectedTrip) => (
                        accumulator + (selectedTrip.price * selectedTrip.selectedPlacesCount)
                    ), 0)
                )),
                tap(v => console.log('totalTotalPrice$', v)),
            );
    }

    handleCancel() {
        this.shoppingService.shoppingCart$.next(ShoppingCart.emptyShoppingCart);
        this.router.navigate([ '/trips' ]);
    }

    handleProceed() {
        this.router.navigate([ '/confirmation' ]);
    }

}
