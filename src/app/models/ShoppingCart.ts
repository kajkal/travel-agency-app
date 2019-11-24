export class ShoppingCart {

    static emptyShoppingCart: ShoppingCart = new ShoppingCart();

    trips: Map<string, number>; // trip id => reserved places

    private constructor(trips: Map<string, number> = new Map<string, number>()) {
        this.trips = trips;
    }

    static fromJSON(json: string): ShoppingCart {
        const parsed = JSON.parse(json);
        return new ShoppingCart(new Map<string, number>(parsed.trips));
    }

    toJSON(): string {
        return JSON.stringify({
            trips: Array.from(this.trips.entries()),
        });
    }

}
