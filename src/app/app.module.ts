import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TripComponent } from './components/trip/trip.component';
import { TripsComponent } from './components/trips/trips.component';


@NgModule({
    declarations: [
        AppComponent,
        TripComponent,
        TripsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
    ],
    providers: [],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
