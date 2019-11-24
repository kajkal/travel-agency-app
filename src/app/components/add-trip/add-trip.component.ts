import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'app-add-trip',
    templateUrl: './add-trip.component.html',
    styleUrls: [ './add-trip.component.scss' ],
})
export class AddTripComponent implements OnInit {

    public form: FormGroup;

    constructor() {
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl('', [ Validators.required ]),
            country: new FormControl('', [ Validators.required ]),
            startDate: new FormControl('', [ Validators.required ]),
            endDate: new FormControl('', [ Validators.required ]),
            price: new FormControl('', [ Validators.required ]),
            limit: new FormControl('', [ Validators.required ]),
            description: new FormControl('', [ Validators.required ]),
            thumbnailUrl: new FormControl('', [ Validators.required ]),
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

    get limit() {
        return this.form.get('limit');
    }

    get description() {
        return this.form.get('description');
    }

    get thumbnailUrl() {
        return this.form.get('thumbnailUrl');
    }

    createTrip() {
        console.log('createTrip', this.form.value);
    }

}
