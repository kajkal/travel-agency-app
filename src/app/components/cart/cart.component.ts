import { Component, OnInit } from '@angular/core';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { Observable } from 'rxjs';
import { Trip } from '../../models/Trip';
import { TripsService } from '../../services/trips/trips.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ShoppingCart } from '../../models/ShoppingCart';


interface SelectedTrip extends Trip {
    selectedPlacesCount: number;
}

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: [ './cart.component.scss' ],
})
export class CartComponent implements OnInit {

    constructor(private tripsService: TripsService, private shoppingService: ShoppingService, private router: Router) {
    }

    ngOnInit() {
    }

    get selectedTrips(): Observable<SelectedTrip[]> {
        return this.shoppingService.shoppingCart$
            .pipe(
                map(shoppingCart => (
                    Array.from(shoppingCart.trips.entries())
                        .map(([ tripId, selectedPlacesCount ]) => {
                            const trip = this.findTrip(tripId);
                            return trip ? { ...trip, selectedPlacesCount } : undefined;
                        })
                        .filter(Boolean)
                )),
            );
    }

    get totalTotalPrice(): Observable<number> {
        return this.shoppingService.shoppingCart$
            .pipe(
                map(shoppingCart => (
                    Array.from(shoppingCart.trips.entries())
                        .reduce((accumulator, [ tripId, selectedPlacesCount ]) => {
                            const trip: Trip | undefined = this.findTrip(tripId);
                            return accumulator + (trip ? trip.price : 0) * selectedPlacesCount;
                        }, 0)
                )),
            );
    }

    private findTrip(tripId: string): Trip | undefined {
        const trips = this.tripsService.trips$.value;
        return trips.find(trip => trip.id === tripId);
    }

    handleCancel() {
        this.shoppingService.shoppingCart$.next(ShoppingCart.emptyShoppingCart);
        this.router.navigate([ '/trips' ]);
    }

    handleProceed() {
        this.router.navigate([ '/confirmation' ]);
    }

}
