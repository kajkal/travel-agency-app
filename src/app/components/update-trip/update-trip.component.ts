import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Trip } from '../../models/Trip';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TripsService } from '../../services/trips/trips.service';


@Component({
    selector: 'app-update-trip',
    templateUrl: './update-trip.component.html',
    styleUrls: [ './update-trip.component.scss' ],
})
export class UpdateTripComponent implements OnInit {

    public form: FormGroup;

    constructor(
        private tripsService: TripsService,
        public dialogRef: MatDialogRef<UpdateTripComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Trip,
    ) {
    }

    ngOnInit() {
        const {
            name,
            country,
            startDate,
            endDate,
            price,
            freePlaces,
            description,
            thumbnailUrl,
        } = this.data;

        this.form = new FormGroup({
            name: new FormControl(name, [ Validators.required ]),
            country: new FormControl(country, [ Validators.required ]),
            startDate: new FormControl(new Date(startDate), [ Validators.required ]),
            endDate: new FormControl(new Date(endDate), [ Validators.required ]),
            price: new FormControl(price, [ Validators.required ]),
            freePlaces: new FormControl(freePlaces, [ Validators.required ]),
            description: new FormControl(description, [ Validators.required ]),
            thumbnailUrl: new FormControl(thumbnailUrl, [ Validators.required ]),
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

    async updateTrip() {
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

        const updatedTrip: Trip = {
            ...this.data,
            name,
            country,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            price,
            freePlaces,
            description,
            thumbnailUrl,
        };

        console.log('updateTrip', {
            old: this.data,
            new: updatedTrip,
        });

        await this.tripsService.updateTrip(updatedTrip);
        this.dialogRef.close();
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

}
