import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { AuthService } from '../../services/auth/auth.service';
import { ShoppingCart } from '../../models/ShoppingCart';


class RouterStub {
    navigate = jasmine.createSpy();
}

class AuthServiceStub {
    logout = jasmine.createSpy();
}

class ShoppingServiceStub {
    private shoppingCartSubject = new BehaviorSubject(null);

    setShoppingCartMock(value) {
        this.shoppingCartSubject.next(value);
    }

    get shoppingCart$() {
        return this.shoppingCartSubject;
    }
}

describe('LogoutComponent', () => {

    let component: LogoutComponent;
    let fixture: ComponentFixture<LogoutComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ LogoutComponent ],
            providers: [
                { provide: Router, useClass: RouterStub },
                { provide: ShoppingService, useClass: ShoppingServiceStub },
                { provide: AuthService, useClass: AuthServiceStub },
            ],
        });
        fixture = TestBed.createComponent(LogoutComponent);
        component = fixture.componentInstance;
    });

    it('should logout user on init, clear shopping cart and navigate the user to the /sign-in page', () => {
        // given
        const authService = TestBed.get(AuthService);
        const shoppingService = TestBed.get(ShoppingService);
        const router = TestBed.get(Router);
        fixture.detectChanges();

        // when/then
        expect(authService.logout).toHaveBeenCalledTimes(1);
        expect(shoppingService.shoppingCart$.value).toEqual(ShoppingCart.emptyShoppingCart);
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([ '/sign-in' ], { replaceUrl: true });
    });

});
