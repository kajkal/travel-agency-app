export interface TripComment {

    timestamp: string;

    author: string;

    content: string;

}

export interface TripRating {

    value: number;

    votes: string[];

}

export interface Trip {

    key: string;

    name: string;

    country: string;

    startDate: string;

    endDate: string;

    price: number;

    freePlaces: number;

    description: string;

    thumbnailUrl: string;

    rating: TripRating;

    comments?: TripComment[];

}

export type NewTrip = Omit<Trip, 'key'>;

export interface SelectedTrip extends Trip {
    selectedPlacesCount: number;
}
