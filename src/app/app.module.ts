import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TripComponent } from './components/trip/trip.component';
import { TripsComponent } from './components/trips/trips.component';
import { AddTripComponent } from './components/add-trip/add-trip.component';
import { MatToolbarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatListModule } from '@angular/material';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { CartComponent } from './components/cart/cart.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { TripThumbnailComponent } from './components/trip-thumbnail/trip-thumbnail.component';


@NgModule({
    declarations: [
        AppComponent,
        TripComponent,
        TripsComponent,
        AddTripComponent,
        SignupFormComponent,
        HeaderComponent,
        CartComponent,
        ConfirmationComponent,
        TripThumbnailComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatListModule,
    ],
    providers: [],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
