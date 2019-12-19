import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ShoppingCart } from '../../models/ShoppingCart';
import { ShoppingService } from '../../services/shopping/shopping.service';


@Component({
    selector: 'app-logout',
    template: '',
})
export class LogoutComponent implements OnInit {

    constructor(
        private router: Router,
        private authService: AuthService,
        private shoppingService: ShoppingService,
    ) {
    }

    ngOnInit() {
        this.shoppingService.shoppingCart$.next(ShoppingCart.emptyShoppingCart);
        this.authService.logout();
        this.router.navigate([ '/sign-in' ], { replaceUrl: true });
    }

}
