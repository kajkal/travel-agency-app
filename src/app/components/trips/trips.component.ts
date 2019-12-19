import { Component, OnInit } from '@angular/core';
import { TripsService } from '../../services/trips/trips.service';
import { Trip } from '../../models/Trip';
import { Observable } from 'rxjs';
import { ChangeContext, LabelType } from 'ng5-slider';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { LayoutService } from '../../services/layout/layout.service';


@Component({
    selector: 'app-trips',
    templateUrl: './trips.component.html',
    styleUrls: [ './trips.component.scss' ],
})
export class TripsComponent implements OnInit {

    private filteredTrips$: Observable<Trip[]>;

    filters = {
        price: {
            min: 0,
            max: 0,
        },
        minRating: 1,
        searchPhrase: /.*/,
    };

    sliderOptions = {
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

    constructor(
        private tripsService: TripsService,
        private layoutService: LayoutService,
    ) {
    }

    ngOnInit() {
        this.tripsService.trips$
            .pipe(
                map(trips => trips.map(trip => trip.price)),
                map(prices => ({
                    floor: prices.length ? Math.min(...prices) : 0,
                    ceil: prices.length ? Math.max(...prices) : 0,
                })),
                distinctUntilChanged((a, b) => (a.floor === b.floor) && (a.ceil === b.ceil)),
            )
            .subscribe(({ floor, ceil }) => {
                console.log('prices subscribe: ', { floor, ceil });

                const newSliderOptions = {
                    ...this.sliderOptions,
                    floor, ceil,
                };

                const { min, max } = this.filters.price;
                let updateFilters = false;

                if (min < floor || min > ceil) {
                    this.filters.price.min = floor;
                    updateFilters = true;
                }

                if (max < floor || max > ceil) {
                    this.filters.price.max = ceil;
                    updateFilters = true;
                }

                this.sliderOptions = newSliderOptions;

                if (updateFilters) {
                    this.updateFilters();
                }
            });

        this.filteredTrips$ = this.tripsService.trips$;
    }

    private updateFilters() {
        this.filters = { ...this.filters };
        this.filteredTrips$ = this.tripsService.trips$
            .pipe(
                map(trips => trips
                    .filter(trip => this.filters.searchPhrase.test(trip.name.toLowerCase()))
                    .filter(trip => trip.rating.value >= this.filters.minRating || (!(trip.rating.votes || []).length && this.filters.minRating === 1))
                    .filter(trip => trip.price >= this.filters.price.min && trip.price <= this.filters.price.max),
                ),
                tap(console.log),
            );
    }

    handlePriceFilterChange(changeContext: ChangeContext) {
        console.log('handlePriceFilter', { min: changeContext.value, max: changeContext.highValue });

        this.filters.price = {
            min: changeContext.value,
            max: changeContext.highValue,
        };
        this.updateFilters();
    }

    handleRateFilterChange(newMinRating: number) {
        console.log('handleRateFilterChange', { newMinRating });

        this.filters.minRating = newMinRating;
        this.updateFilters();
    }

    handleSearchFilterKeyUp(event: any) {
        console.log('handleSearchFilterKeyUp', event.target.value);

        const searchPhrase = event.target.value;
        this.filters.searchPhrase = new RegExp([ '', ...searchPhrase.toLowerCase() ].map(c => `${c}.*`).join(''));
        this.updateFilters();
    }

}
