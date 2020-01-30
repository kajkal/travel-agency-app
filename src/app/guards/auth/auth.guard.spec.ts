import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';


class RouterStub {
    navigate = jasmine.createSpy();
}

class AuthServiceStub {
    private authStateSubject = new BehaviorSubject(null);

    setAuthStateMock(value) {
        this.authStateSubject.next(value);
    }

    get authState$() {
        return this.authStateSubject.asObservable();
    }
}

describe('AuthGuard', () => {

    const routeMock: any = { snapshot: {} };
    const routeStateMock: any = { snapshot: {}, url: '/page' };
    let guard: AuthGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: Router, useClass: RouterStub },
            ],
        });
        guard = TestBed.get(AuthGuard);
    });

    it('should navigate an unauthenticated user to the /sign-in page', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock(null);
        const router = TestBed.get(Router);

        // when
        const canActivate = guard.canActivate(routeMock, routeStateMock);

        // then
        canActivate.subscribe(result => {
            expect(result).toEqual(false);
            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith([ '/sign-in' ]);
        });
    });

    it('should allow an authenticated user to access', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: false });

        // when
        const canActivate = guard.canActivate(routeMock, routeStateMock);

        // then
        canActivate.subscribe(result => {
            expect(result).toEqual(true);
        });
    });

});
