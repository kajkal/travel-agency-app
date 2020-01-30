import { TestBed } from '@angular/core/testing';
import { LoggedGuard } from './logged.guard';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';


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

describe('LoggedGuard', () => {

    const routeMock: any = { snapshot: {} };
    const routeStateMock: any = { snapshot: {}, url: '/page' };
    let guard: LoggedGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LoggedGuard,
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: Router, useClass: RouterStub },
            ],
        });
        guard = TestBed.get(LoggedGuard);
    });

    it('should navigate an authenticated user to the /trips page', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: false });
        const router = TestBed.get(Router);

        // when
        const canActivate = guard.canActivate(routeMock, routeStateMock);

        // then
        canActivate.subscribe(result => {
            expect(result).toEqual(false);
            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith([ '/trips' ]);
        });
    });

    it('should allow an unauthenticated user to access', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock(null);

        // when
        const canActivate = guard.canActivate(routeMock, routeStateMock);

        // then
        canActivate.subscribe(result => {
            expect(result).toEqual(true);
        });
    });

});
