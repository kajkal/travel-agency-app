import { Injectable } from '@angular/core';
import { NewTrip, Trip } from '../../models/Trip';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { delay, filter, find, map, tap } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';


@Injectable({
    providedIn: 'root',
})
export class TripsService {

    public trips$: BehaviorSubject<Trip[]>;

    constructor(
        private db: AngularFireDatabase,
    ) {
        this.trips$ = new BehaviorSubject<Trip[]>([]);
        this.fetchTrips().subscribe(trips => {
            console.log('emiting', trips);
            this.trips$.next(trips as any);
        });
    }

    private fetchTrips(): Observable<Trip[]> {
        return this.db.list<Trip>('/trips')
            .snapshotChanges()
            .pipe(
                map(trips => trips.map(trip => ({
                    key: trip.key,
                    ...trip.payload.val(),
                }))),
            );
    }

    private fetchTrip(tripKey: string) {
        return this.db.object(`/trips/${tripKey}`);
    }

    getTripDetails(tripKey: string): Observable<Trip> {
        return this.trips$
            .pipe(
                filter(trips => Boolean(trips && trips.length)),
                map(trips => trips.find(trip => trip.key === tripKey)),
            );
    }

    addTrip(trip: NewTrip) {
        return this.db.list('/trips').push(trip);
    }

    updateTrip(tripToUpdate: Trip) {
        return this.fetchTrip(tripToUpdate.key)
            .set(tripToUpdate);
    }

    deleteTrip(tripToDelete: Trip) {
        return this.fetchTrip(tripToDelete.key)
            .remove();
    }

}
