import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { ShoppingCart } from '../../models/ShoppingCart';
import { AuthService } from '../../services/auth/auth.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [ './header.component.scss' ],
})
export class HeaderComponent {

    private selectedPlacesCount$: Observable<number>;

    constructor(
        private authService: AuthService,
        private shoppingService: ShoppingService,
    ) {
        this.selectedPlacesCount$ = shoppingService.shoppingCart$
            .pipe(
                map((shoppingCart: ShoppingCart): number => (
                    Array.from(shoppingCart.trips.values())
                        .reduce((accumulator, current) => accumulator + current, 0)
                )),
            );
    }



}
