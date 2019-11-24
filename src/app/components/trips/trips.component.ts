import { Component, OnInit } from '@angular/core';
import { TripsService } from '../../services/trips/trips.service';
import { Trip } from '../../models/Trip';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { ShoppingCart } from '../../models/ShoppingCart';


@Component({
    selector: 'app-trips',
    templateUrl: './trips.component.html',
    styleUrls: [ './trips.component.scss' ],
})
export class TripsComponent implements OnInit {

    constructor(private tripsService: TripsService, private shoppingService: ShoppingService) {
    }

    ngOnInit() {
        console.log(this.trips);
    }

    get trips(): Trip[] {
        return this.tripsService.getTrips();
    }

    getReservedPlacesCount(trip: Trip): number {
        return this.shoppingService.shoppingCart$.value.trips.get(trip.id) || 0;
    }

    preventNavigation($event) {
        $event.stopPropagation();
        $event.preventDefault();
    }

    handleAdd(trip: Trip) {
        const shoppingCart: ShoppingCart = this.shoppingService.shoppingCart$.value;
        const currentCount = this.getReservedPlacesCount(trip);
        if (currentCount + 1 <= trip.limit) {
            shoppingCart.trips.set(trip.id, currentCount + 1);
            this.shoppingService.shoppingCart$.next(shoppingCart);
        }
    }

    handleSubtract(trip: Trip) {
        const shoppingCart: ShoppingCart = this.shoppingService.shoppingCart$.value;
        const currentCount = this.getReservedPlacesCount(trip);
        if (currentCount - 1 > 0) {
            shoppingCart.trips.set(trip.id, currentCount - 1);
            this.shoppingService.shoppingCart$.next(shoppingCart);
        }
        if (currentCount - 1 === 0) {
            shoppingCart.trips.delete(trip.id);
            this.shoppingService.shoppingCart$.next(shoppingCart);
        }
    }

    handleRemove(trip: Trip) {
        this.tripsService.deleteTrip(trip);
        const shoppingCart: ShoppingCart = this.shoppingService.shoppingCart$.value;
        shoppingCart.trips.delete(trip.id);
        this.shoppingService.shoppingCart$.next(shoppingCart);
    }

}
