import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { AuthService } from '../../services/auth/auth.service';
import { By } from '@angular/platform-browser';
import { MatBadge, MatBadgeModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


class AuthServiceStub {
    private authStateSubject = new BehaviorSubject({
        isAdmin: false,
        email: 'user@domain.com',
    });

    setAuthStateMock(value) {
        this.authStateSubject.next(value);
    }

    get authState$() {
        return this.authStateSubject.asObservable();
    }

    get user() {
        return this.authStateSubject.value;
    }
}

class ShoppingServiceStub {
    private shoppingCartSubject = new BehaviorSubject({
        trips: new Map<string, number>([
            [ 'T01', 2 ],
        ]),
    });

    setShoppingCartMock(value) {
        this.shoppingCartSubject.next({
            trips: value,
        });
    }

    get shoppingCart$() {
        return this.shoppingCartSubject;
    }
}

describe('HeaderComponent', () => {

    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ HeaderComponent ],
            imports: [
                RouterTestingModule.withRoutes([]),
                MatIconModule,
                MatToolbarModule,
                MatBadgeModule,
                MatMenuModule,
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: ShoppingService, useClass: ShoppingServiceStub },
            ],
        });
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
    });

    it('should render \'Sign in\' and \'Sign up\' links when no user is signed in', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock(null);
        fixture.detectChanges();

        // when
        const logo = fixture.debugElement.query(By.css('.logo'));
        const links = fixture.debugElement.queryAll(By.css('.link'));
        const signInLink = links[ 0 ];
        const signUpLink = links[ 1 ];

        // then
        expect(logo.nativeElement.innerText).toBe('Travel Agency App');
        expect(logo.properties.href).toBe('/trips');
        expect(links.length).toBe(2);
        expect(signInLink.nativeElement.innerText).toBe('Sign in');
        expect(signInLink.properties.href).toBe('/sign-in');
        expect(signUpLink.nativeElement.innerText).toBe('Sign up');
        expect(signUpLink.properties.href).toBe('/sign-up');
    });

    it('should render \'Cart\' with reserved trips count and \'Ellipsis\' buttons when user is signed in', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: false });
        const shoppingService = TestBed.get(ShoppingService);
        shoppingService.setShoppingCartMock(new Map<string, number>([
            [ 'T01', 2 ],
            [ 'T02', 1 ],
        ]));
        fixture.detectChanges();

        // when
        const buttons = fixture.debugElement.queryAll(By.css('button'));
        const cart = buttons[ 0 ];
        const ticketsCount = cart.query(By.directive(MatBadge));
        const ellipsis = buttons[ 1 ];

        // then
        expect(buttons.length).toBe(2);
        expect(cart.attributes.routerLink).toBe('/cart');
        expect(ticketsCount.nativeElement.innerText).toContain('3');
        expect(ellipsis).toBeDefined();
    });

    it('should render trips and logout links inside more options menu', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: false });
        fixture.detectChanges();

        // when
        const buttons = fixture.debugElement.queryAll(By.css('button'));
        const ellipsis = buttons[ 1 ];
        ellipsis.nativeElement.click();
        fixture.detectChanges();
        const options = fixture.debugElement.queryAll(By.css('.mat-menu-item'));
        const tripsOption = options[ 0 ];
        const logoutOption = options[ 1 ];

        // then
        expect(options.length).toBe(2);
        expect(tripsOption.nativeElement.innerText).toContain('Trips');
        expect(tripsOption.attributes.routerLink).toBe('/trips');
        expect(logoutOption.nativeElement.innerText).toContain('Logout');
        expect(logoutOption.attributes.routerLink).toBe('/logout');
    });

    it('should render add trip, trips and logout links inside more options menu if user is admin', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: true });
        fixture.detectChanges();

        // when
        const buttons = fixture.debugElement.queryAll(By.css('button'));
        const ellipsis = buttons[ 1 ];
        ellipsis.nativeElement.click();
        fixture.detectChanges();
        const options = fixture.debugElement.queryAll(By.css('.mat-menu-item'));
        const addTripOptions = options[ 0 ];
        const tripsOption = options[ 1 ];
        const logoutOption = options[ 2 ];

        // then
        expect(options.length).toBe(3);
        expect(addTripOptions.nativeElement.innerText).toContain('Add Trip');
        expect(addTripOptions.attributes.routerLink).toBe('/admin/new-trip');
        expect(tripsOption.nativeElement.innerText).toContain('Trips');
        expect(tripsOption.attributes.routerLink).toBe('/trips');
        expect(logoutOption.nativeElement.innerText).toContain('Logout');
        expect(logoutOption.attributes.routerLink).toBe('/logout');
    });

});
