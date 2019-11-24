import { Component, OnInit } from '@angular/core';
import { TripsService } from '../../services/trips/trips.service';
import { Trip } from '../../models/Trip';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { ShoppingCart } from '../../models/ShoppingCart';
import { Observable } from 'rxjs';


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

    get trips(): Observable<Trip[]> {
        return this.tripsService.trips$;
    }

    handleRemove(trip: Trip) {
        this.tripsService.deleteTrip(trip);
        const shoppingCart: ShoppingCart = this.shoppingService.shoppingCart$.value;
        shoppingCart.trips.delete(trip.id);
        this.shoppingService.shoppingCart$.next(shoppingCart);
    }

}
