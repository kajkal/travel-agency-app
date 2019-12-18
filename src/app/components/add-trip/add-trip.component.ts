import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TripsService } from '../../services/trips/trips.service';
import { NewTrip } from '../../models/Trip';
import { Router } from '@angular/router';


@Component({
    selector: 'app-add-trip',
    templateUrl: './add-trip.component.html',
})
export class AddTripComponent implements OnInit {

    public form: FormGroup;

    constructor(
        private tripsService: TripsService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl('Trip name', [ Validators.required ]),
            country: new FormControl('Poland', [ Validators.required ]),
            startDate: new FormControl(new Date(), [ Validators.required ]),
            endDate: new FormControl(new Date(), [ Validators.required ]),
            price: new FormControl(1200, [ Validators.required ]),
            freePlaces: new FormControl(20, [ Validators.required ]),
            description: new FormControl('Trip description', [ Validators.required ]),
            thumbnailUrl: new FormControl('https://cdn.pixabay.com/photo/2016/10/17/10/52/wind-farm-1747331_960_720.jpg', [ Validators.required ]),
        });
    }

    get name() {
        return this.form.get('name');
    }

    get country() {
        return this.form.get('country');
    }

    get startDate() {
        return this.form.get('startDate');
    }

    get endDate() {
        return this.form.get('endDate');
    }

    get price() {
        return this.form.get('price');
    }

    get freePlaces() {
        return this.form.get('freePlaces');
    }

    get description() {
        return this.form.get('description');
    }

    get thumbnailUrl() {
        return this.form.get('thumbnailUrl');
    }

    async createTrip() {
        const {
            name,
            country,
            startDate,
            endDate,
            price,
            freePlaces,
            description,
            thumbnailUrl,
        } = this.form.value;

        const newTrip: NewTrip = {
            name,
            country,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            price,
            freePlaces,
            description,
            thumbnailUrl,
            rating: {
                value: 0,
                votes: [],
            },
            comments: [],
        };

        console.log('createTrip', {
            form: this.form.value, newTrip,
        });
        await this.tripsService.addTrip(newTrip);
        this.router.navigate([ '/trips' ]);
    }

}
