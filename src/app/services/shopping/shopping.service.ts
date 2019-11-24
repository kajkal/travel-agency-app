import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShoppingCart } from '../../models/ShoppingCart';


@Injectable({
    providedIn: 'root',
})
export class ShoppingService {

    public shoppingCart$: BehaviorSubject<ShoppingCart>;

    constructor() {
        this.shoppingCart$ = new BehaviorSubject<ShoppingCart>(ShoppingService.getShoppingCartFromMemory());
        this.shoppingCart$.subscribe(ShoppingService.saveShoppingCartInMemory);
    }

    private static getShoppingCartFromMemory(): ShoppingCart {
        const shoppingCartFromMemory: string | null = localStorage.getItem('ShoppingCart');
        return shoppingCartFromMemory
            ? ShoppingCart.fromJSON(shoppingCartFromMemory)
            : ShoppingCart.emptyShoppingCart;
    }

    private static saveShoppingCartInMemory(shoppingCart: ShoppingCart): void {
        localStorage.setItem('ShoppingCart', shoppingCart.toJSON());
    }

}
