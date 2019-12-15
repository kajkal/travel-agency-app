import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

    @Output() delete = new EventEmitter();

    @Output() changeRating = new EventEmitter();

    constructor(private shoppingService: ShoppingService) {
    }

    ngOnInit() {
    }

    preventNavigation($event) {
        $event.stopPropagation();
        $event.preventDefault();
    }

    getReservedPlacesCount(trip: Trip): number {
        return this.shoppingService.shoppingCart$.value.trips.get(trip.id) || 0;
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

    onDelete($event, tripToDelete: Trip): void {
        this.preventNavigation($event);
        this.delete.emit(tripToDelete);
    }

    onRateSelect($event, tripToUpdate) {
        this.changeRating.emit({
            ...tripToUpdate,
            rating: $event,
        });
    }

}
