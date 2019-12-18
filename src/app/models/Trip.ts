export interface TripComment {

    timestamp: number;

    author: string;

    content: string;

}

export interface TripRating {

    value: number;

    votesCount: number;

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
