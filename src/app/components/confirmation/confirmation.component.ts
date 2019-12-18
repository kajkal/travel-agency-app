import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { SelectedTrip } from '../../models/Trip';
import { TripsService } from '../../services/trips/trips.service';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { ShoppingCart } from '../../models/ShoppingCart';
import { Router } from '@angular/router';


@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: [ './confirmation.component.scss' ],
})
export class ConfirmationComponent implements OnInit {

    public selectedTrips$: Observable<SelectedTrip[]>;

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
    }

    back() {
        this.router.navigate([ '/cart' ]);
    }

    confirm() {
        this.shoppingService.shoppingCart$.next(ShoppingCart.emptyShoppingCart);
        this.router.navigate([ '/trips' ]);
    }

}
