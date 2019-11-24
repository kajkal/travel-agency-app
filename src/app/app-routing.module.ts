import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TripsComponent } from './components/trips/trips.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { AddTripComponent } from './components/add-trip/add-trip.component';
import { TripComponent } from './components/trip/trip.component';
import { CartComponent } from './components/cart/cart.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';


const routes: Routes = [
    {
        path: '',
        component: AddTripComponent,
    },
    {
        path: 'login',
        component: SignupFormComponent,
    },
    {
        path: 'trips/:tripId',
        component: TripComponent,
    },
    {
        path: 'trips',
        component: TripsComponent,
    },
    {
        path: 'new-trip',
        component: AddTripComponent,
    },
    {
        path: 'cart',
        component: CartComponent,
    },
    {
        path: 'confirmation',
        component: ConfirmationComponent,
    },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {
}
