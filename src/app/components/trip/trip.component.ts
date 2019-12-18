import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from '../../models/Trip';
import { TripsService } from '../../services/trips/trips.service';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShoppingCart } from '../../models/ShoppingCart';
import { Observable } from 'rxjs';
import { retry, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';


@Component({
    selector: 'app-trip',
    templateUrl: './trip.component.html',
    styleUrls: [ './trip.component.scss' ],
})
export class TripComponent implements OnInit {

    public form: FormGroup;

    trip$: Observable<Trip>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private tripsService: TripsService,
        private shoppingService: ShoppingService,
        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        const tripKey: string = this.route.snapshot.paramMap.get('tripKey');
        this.trip$ = this.tripsService.getTripDetails(tripKey)
            .pipe(
                retry(2),
                tap(trip => {
                    if (!trip) {
                    console.log(`No trip with id ${tripKey} found`);
                    alert(`No trip with id ${tripKey} found`);
                    this.router.navigate([ '/trips' ]);
                    }
                }),
            );

        this.form = new FormGroup({
            comment: new FormControl('', [ Validators.required ]),
        });
    }

    async handleRemove(trip: Trip) {
        try {
            await this.tripsService.deleteTrip(trip);

            // remove from cart
            const shoppingCart: ShoppingCart = this.shoppingService.shoppingCart$.value;
            shoppingCart.trips.delete(trip.key);
            this.shoppingService.shoppingCart$.next(shoppingCart);

            // navigate to trips
            this.router.navigate([ '/trips' ]);
        } catch (e) {
            console.log('Trip remove error', e);
        }
    }

    async handleRateChange(trip: Trip, newRateValue: number) {
        try {
            await this.tripsService.updateTrip({
                ...trip,
                rating: {
                    value: (trip.rating.value * trip.rating.votesCount + newRateValue) / (trip.rating.votesCount + 1),
                    votesCount: trip.rating.votesCount + 1,
                },
            });
        } catch (e) {
            console.log('Trip rate change error', e);
        }
    }

    get comment() {
        return this.form.get('comment');
    }

    addComment() {
        console.log('createTrip', this.form.value);
    }

    getReservedPlacesCount(trip: Trip): number {
        return this.shoppingService.shoppingCart$.value.trips.get(trip.key) || 0;
    }

}
