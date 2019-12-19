import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TripsService } from '../../services/trips/trips.service';
import { Trip } from '../../models/Trip';
import { Observable } from 'rxjs';
import { ChangeContext, LabelType } from 'ng5-slider';
import { filter, map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material';


@Component({
    selector: 'app-trips',
    templateUrl: './trips.component.html',
    styleUrls: [ './trips.component.scss' ],
})
export class TripsComponent implements OnInit, OnDestroy {

    private filteredTrips$: Observable<Trip[]>;

    minValue = 0;
    maxValue = 0;
    options = {
        floor: 0,
        ceil: 0,
        translate: (value: number, label: LabelType): string => {
            switch (label) {
                case LabelType.Low:
                    return '<b>Min price:</b> $' + value;
                case LabelType.High:
                    return '<b>Max price:</b> $' + value;
                default:
                    return '$' + value;
            }
        },
        vertical: true,
    };

    minRating = 1;

    private media: MediaQueryList;
    @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

    constructor(
        private tripsService: TripsService,
    ) {
    }

    ngOnInit() {
        this.tripsService.trips$
            .pipe(
                map(trips => trips.map(trip => trip.price)),
                filter(prices => prices.length > 0),
            )
            .subscribe(prices => {
                const newOptions = {
                    ...this.options,
                    floor: prices.length ? Math.min(...prices) : 0,
                    ceil: prices.length ? Math.max(...prices) : 0,
                };

                if (this.minValue < newOptions.floor || this.minValue > newOptions.ceil) {
                    this.minValue = newOptions.floor;
                }

                if (this.maxValue < newOptions.floor || this.maxValue > newOptions.ceil) {
                    this.maxValue = newOptions.ceil;
                }

                this.options = newOptions;
            });

        this.filteredTrips$ = this.tripsService.trips$;

        this.media = window.matchMedia('(max-width: 960px)');
        this.media.addEventListener
            ? this.media.addEventListener('change', this.windowWidthListener)
            : this.media.addListener(this.windowWidthListener);
    }

    ngOnDestroy() {
        this.media.removeEventListener
            ? this.media.removeEventListener('change', this.windowWidthListener)
            : this.media.removeListener(this.windowWidthListener);
    }

    get trips(): Observable<Trip[]> {
        return this.filteredTrips$;
    }

    handlePriceFilterChange(changeContext: ChangeContext) {
        console.log('handlePriceFilter', { min: changeContext.value, max: changeContext.highValue });

        this.filteredTrips$ = this.filteredTrips$
            .pipe(
                map(trips => trips.filter(trip => (
                    trip.price >= this.minValue && trip.price <= this.maxValue
                ))),
            );
    }

    handleRateFilterChange(newMinRating: number) {
        console.log('handleRateFilterChange', { newMinRating });

        this.minRating = newMinRating;
        this.filteredTrips$ = this.filteredTrips$
            .pipe(
                map(trips => trips.filter(trip => (
                    trip.rating.value >= this.minRating || (!(trip.rating.votes || []).length && this.minRating === 1)
                ))),
            );
    }

    private windowWidthListener = () => {
        if (this.media.matches) {
            this.sidenav.mode = 'over';
        } else {
            this.sidenav.mode = 'side';
        }
    }

    toggleFilters() {
        this.sidenav.toggle();
    }

}
