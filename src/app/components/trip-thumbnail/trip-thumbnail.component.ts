import { Component, Input, OnInit } from '@angular/core';
import { Trip } from '../../models/Trip';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { ShoppingCart } from '../../models/ShoppingCart';


@Component({
    selector: 'app-trip-thumbnail',
    templateUrl: './trip-thumbnail.component.html',
    styleUrls: [ './trip-thumbnail.component.scss' ],
})
export class TripThumbnailComponent implements OnInit {

    @Input() trip: Trip;

    constructor(private shoppingService: ShoppingService) {
    }

    ngOnInit() {
    }

    preventNavigation($event) {
        $event.stopPropagation();
        $event.preventDefault();
    }

    getReservedPlacesCount(trip: Trip): number {
        return this.shoppingService.shoppingCart$.value.trips.get(trip.key) || 0;
    }

    handleAdd(trip: Trip) {
        const shoppingCart: ShoppingCart = this.shoppingService.shoppingCart$.value;
        const currentCount = this.getReservedPlacesCount(trip);
        if (currentCount + 1 <= trip.freePlaces) {
            shoppingCart.trips.set(trip.key, currentCount + 1);
            this.shoppingService.shoppingCart$.next(shoppingCart);
        }
    }

    handleSubtract(trip: Trip) {
        const shoppingCart: ShoppingCart = this.shoppingService.shoppingCart$.value;
        const currentCount = this.getReservedPlacesCount(trip);
        if (currentCount - 1 > 0) {
            shoppingCart.trips.set(trip.key, currentCount - 1);
            this.shoppingService.shoppingCart$.next(shoppingCart);
        }
        if (currentCount - 1 === 0) {
            shoppingCart.trips.delete(trip.key);
            this.shoppingService.shoppingCart$.next(shoppingCart);
        }
    }

}
