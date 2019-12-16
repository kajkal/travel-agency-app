import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Trip } from '../../models/Trip';
import { TripsService } from '../../services/trips/trips.service';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-trip',
    templateUrl: './trip.component.html',
    styleUrls: [ './trip.component.scss' ],
})
export class TripComponent implements OnInit {

    public form: FormGroup;
    trip: Trip = null;

    constructor(private route: ActivatedRoute, private router: Router, private tripsService: TripsService, private shoppingService: ShoppingService) {
    }

    ngOnInit() {
        const tripId: string = this.route.snapshot.paramMap.get('tripId');

        this.tripsService.getTripDetails(tripId)
            .subscribe(trip => {
                if (!trip) {
                    console.log(`No trip with id ${tripId} found`);
                    this.router.navigate([ '/trips' ]);
                } else {
                    this.trip = trip;
                }
            });

        this.form = new FormGroup({
            comment: new FormControl('', [ Validators.required ]),
        });

        //
        // // this.route.paramMap
        // //     .subscribe(params => {
        // //         console.log(params.get('tripId'));
        // //     });
        //
        // // geting optional paramteres
        // const page: string | null = this.route.snapshot.queryParamMap.get('page');
        // console.log('page', page);
        //
        // // this.route.queryParamMap.subscribe();
        //
        // // połączenie dwóch:
        // combineLatest([
        //     this.route.paramMap,
        //     this.route.queryParamMap,
        // ])
        //     .pipe(
        //         switchMap(combined => {
        //             const id = combined[ 0 ].get('tripId');
        //             const pageNr = combined[ 1 ].get('page');
        //
        //             console.log({ id, pageNr });
        //
        //             // call http service
        //             return of({
        //                 id, pageNr, trips: [ 1, 2, 3, 4, 5, 5 ],
        //             });
        //         }),
        //     )
        //     .subscribe(trips => {
        //         console.log({ trips });
        //     });
    }

    get comment() {
        return this.form.get('comment');
    }

    addComment() {
        console.log('createTrip', this.form.value);
    }

    getReservedPlacesCount(trip: Trip): number {
        return this.shoppingService.shoppingCart$.value.trips.get(trip.id) || 0;
    }

}
