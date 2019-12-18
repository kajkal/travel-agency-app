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
            // navigate to trips
            this.router.navigate([ '/trips' ]);

            await this.tripsService.deleteTrip(trip);

            // remove from cart
            const shoppingCart: ShoppingCart = this.shoppingService.shoppingCart$.value;
            shoppingCart.trips.delete(trip.key);
            this.shoppingService.shoppingCart$.next(shoppingCart);
        } catch (e) {
            console.log('Trip remove error', e);
        }
    }

    async handleRateChange(trip: Trip, newRateValue: number) {
        if (!(trip.rating.votes || []).includes(this.authService.user.uid)) {
            try {
                const oldValue = trip.rating.value;
                const oldVoteCount = (trip.rating.votes || []).length;

                await this.tripsService.updateTrip({
                    ...trip,
                    rating: {
                        value: (oldValue * oldVoteCount + newRateValue) / (oldVoteCount + 1),
                        votes: [...(trip.rating.votes || []), this.authService.user.uid],
                    },
                });
            } catch (e) {
                console.log('Trip rate change error', e);
            }
        } else {
            alert('You already rate this trip!');
        }
    }

    get comment() {
        return this.form.get('comment');
    }

    async addComment(trip: Trip) {
        console.log('addComment', this.form.value);

        try {
            await this.tripsService.updateTrip({
                ...trip,
                comments: [...(trip.comments || []), {
                    timestamp: new Date().toISOString(),
                    author: this.authService.user.email,
                    content: this.form.value.comment,
                }],
            });
            this.comment.setValue('');
            this.comment.setErrors(null);
        } catch (e) {
            console.log('Add comment error', e);
        }
    }

    getReservedPlacesCount(trip: Trip): number {
        return this.shoppingService.shoppingCart$.value.trips.get(trip.key) || 0;
    }

}
