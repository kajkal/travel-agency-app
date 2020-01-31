import { TripPreview } from './TripPreview';
import { by, element } from 'protractor';


export class TripPreviewList {

    static async loadTripPreviewList(): Promise<TripPreview[]> {
        const rawTrips = element.all(by.tagName('app-trip-thumbnail'));
        const tripCount = await rawTrips.count();
        const tripPreviewList = new Array(tripCount);
        for (let i = 0; i < tripCount; i++) {
            const rawTrip = rawTrips.get(i);
            tripPreviewList[ i ] = new TripPreview(rawTrip);
        }
        return tripPreviewList;
    }

}
