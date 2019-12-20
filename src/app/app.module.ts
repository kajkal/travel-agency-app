import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TripComponent } from './components/trip/trip.component';
import { TripsComponent } from './components/trips/trips.component';
import { AddTripComponent } from './components/add-trip/add-trip.component';
import { MatToolbarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatListModule, MatProgressBarModule, MatMenuModule, MatBadgeModule, MatTooltipModule, MatGridListModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { CartComponent } from './components/cart/cart.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { TripThumbnailComponent } from './components/trip-thumbnail/trip-thumbnail.component';
import { MatSidenavModule } from '@angular/material';
import { Ng5SliderModule } from 'ng5-slider';
import { RateComponent } from './components/rate/rate.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LogoutComponent } from './components/logout/logout.component';
import { UpdateTripComponent } from './components/update-trip/update-trip.component';


@NgModule({
    declarations: [
        AppComponent,
        TripComponent,
        TripsComponent,
        AddTripComponent,
        HeaderComponent,
        CartComponent,
        ConfirmationComponent,
        TripThumbnailComponent,
        RateComponent,
        NotFoundComponent,
        SignInComponent,
        SignUpComponent,
        LogoutComponent,
        UpdateTripComponent,
    ],
    entryComponents: [
        UpdateTripComponent,
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
        MatSidenavModule,
        Ng5SliderModule,
        HttpClientModule,

        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        MatProgressBarModule,
        MatMenuModule,
        MatBadgeModule,
        MatTooltipModule,
        MatGridListModule,
        MatDialogModule,
    ],
    providers: [],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
