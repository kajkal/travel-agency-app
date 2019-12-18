import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripsComponent } from './components/trips/trips.component';
import { AddTripComponent } from './components/add-trip/add-trip.component';
import { TripComponent } from './components/trip/trip.component';
import { CartComponent } from './components/cart/cart.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AdminGuard } from './guards/admin/admin.guard';
import { LogoutComponent } from './components/logout/logout.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: '/sign-in',
        pathMatch: 'full',
    },
    {
        path: 'sign-in',
        component: SignInComponent,
    },
    {
        path: 'sign-up',
        component: SignUpComponent,
    },
    {
        path: 'logout',
        component: LogoutComponent,
    },
    {
        path: 'trips',
        canActivate: [ AuthGuard ],
        children: [
            {
                path: '',
                component: TripsComponent,
            },
            {
                path: ':tripKey',
                component: TripComponent,
            },
        ],
    },
    {
        path: 'cart',
        canActivate: [ AuthGuard ],
        component: CartComponent,
    },
    {
        path: 'confirmation',
        canActivate: [ AuthGuard ],
        component: ConfirmationComponent,
    },
    {
        path: 'admin',
        canActivate: [ AdminGuard ],
        children: [
            {
                path: 'new-trip',
                component: AddTripComponent,
            },
        ],
    },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {
}
