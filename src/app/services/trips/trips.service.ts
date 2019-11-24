import { Injectable } from '@angular/core';
import { Trip } from '../../models/Trip';
import { BehaviorSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class TripsService {

    private trips: Trip[] = [
        {
            id: '1',
            name: 'Tydzień w Las Vegas',
            country: 'USA',
            startDate: '10-12-2019',
            endDate: '17-12-2019',
            price: 1250,
            limit: 12,
            description: 'Spędź niezapomniany tydzień w Las Vegas!',
            thumbnailUrl: 'https://images.unsplash.com/photo-1506804886640-20a2c0857946?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80',
        },
        {
            id: '2',
            name: 'Weekend w Nowym Jorku',
            country: 'USA',
            startDate: '14-12-2019',
            endDate: '15-12-2019',
            price: 720,
            limit: 8,
            description: 'Wyjedż na weekend do Nowego Jorku. Zobacz statue wolności i przespaceruj się po Central Parku.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1566421739906-44b62aa33f9a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1826&q=80',
        },
        {
            id: '3',
            name: 'Paryż jakiego nie znałeś',
            country: 'France',
            startDate: '01-12-2019',
            endDate: '07-12-2019',
            price: 1800,
            limit: 2,
            description: 'Myślisz że widziałeś w Paryżu wszystko? Zobacz jak bardzo się mylisz!',
            thumbnailUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1652&q=80',
        },
        {
            id: '4',
            name: 'Rzym',
            country: 'Italy',
            startDate: '01-01-2019',
            endDate: '01-02-2019',
            price: 2000,
            limit: 1,
            description: 'Spędź miesiąc w wiecznym mieście!',
            thumbnailUrl: 'https://images.unsplash.com/photo-1512767811219-ed2f11ce5d0d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
        },
        {
            id: '5',
            name: 'Tydzień w Las Vegas',
            country: 'USA',
            startDate: '10-12-2019',
            endDate: '17-12-2019',
            price: 950,
            limit: 12,
            description: 'Spędź niezapomniany tydzień w Las Vegas!',
            thumbnailUrl: 'https://images.unsplash.com/photo-1506804886640-20a2c0857946?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80',
        },
        {
            id: '6',
            name: 'Weekend w Nowym Jorku',
            country: 'USA',
            startDate: '14-12-2019',
            endDate: '15-12-2019',
            price: 720,
            limit: 8,
            description: 'Wyjedż na weekend do Nowego Jorku. Zobacz statue wolności i przespaceruj się po Central Parku.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1566421739906-44b62aa33f9a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1826&q=80',
        },
        {
            id: '7',
            name: 'Paryż jakiego nie znałeś',
            country: 'France',
            startDate: '01-12-2019',
            endDate: '07-12-2019',
            price: 800,
            limit: 2,
            description: 'Myślisz że widziałeś w Paryżu wszystko? Zobacz jak bardzo się mylisz!',
            thumbnailUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1652&q=80',
        },
        {
            id: '8',
            name: 'Rzym',
            country: 'Italy',
            startDate: '01-01-2019',
            endDate: '01-02-2019',
            price: 2000,
            limit: 1,
            description: 'Spędź miesiąc w wiecznym mieście!',
            thumbnailUrl: 'https://images.unsplash.com/photo-1512767811219-ed2f11ce5d0d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
        },
    ];

    trips$: BehaviorSubject<Trip[]>;

    constructor() {
        this.trips$ = new BehaviorSubject<Trip[]>([]);
        of(this.trips)
            .pipe(
                delay(200),
            )
            .subscribe(value => {
                this.trips$.next(value);
            });
    }

    getTrip(tripId: string): Trip | undefined {
        return this.trips$.value.find(trip => trip.id === tripId);
    }

    addTrip(trip: Trip): void {
    }

    deleteTrip(tripToDelete: Trip) {
        this.trips$.next(this.trips$.value.filter(trip => tripToDelete.id !== trip.id));
    }

}
