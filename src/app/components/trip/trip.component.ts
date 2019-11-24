import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Trip } from '../../models/Trip';


@Component({
    selector: 'app-trip',
    templateUrl: './trip.component.html',
    styleUrls: [ './trip.component.scss' ],
})
export class TripComponent implements OnInit {

    @Input()
    trip: Trip;

    constructor(private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        const tripId: string = this.route.snapshot.paramMap.get('tripId');
        console.log(tripId);

        // this.route.paramMap
        //     .subscribe(params => {
        //         console.log(params.get('tripId'));
        //     });

        // geting optional paramteres
        const page: string | null = this.route.snapshot.queryParamMap.get('page');
        console.log('page', page);

        // this.route.queryParamMap.subscribe();

        // połączenie dwóch:
        combineLatest([
            this.route.paramMap,
            this.route.queryParamMap,
        ])
            .pipe(
                switchMap(combined => {
                    const id = combined[0].get('tripId');
                    const pageNr = combined[1].get('page');

                    console.log({id, pageNr});

                    // call http service
                    return of({
                        id, pageNr, trips: [ 1, 2, 3, 4, 5, 5 ],
                    });
                }),
            )
            .subscribe(trips => {
                console.log({trips});
            });
    }

    handleClick() {
        console.log('clicked');
        this.router.navigate(['/trips']);
        // this.router.navigate(['/trips'], {
        //     queryParams: {page: 2, order: 'newest'},
        // });
    }

}
