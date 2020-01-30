import { TestBed } from '@angular/core/testing';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../../services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';


class AuthServiceStub {
    private authStateSubject = new BehaviorSubject(null);

    setAuthStateMock(value) {
        this.authStateSubject.next(value);
    }

    get authState$() {
        return this.authStateSubject.asObservable();
    }
}

describe('AdminGuard', () => {

    const routeMock: any = { snapshot: {} };
    const routeStateMock: any = { snapshot: {}, url: '/page' };
    let guard: AdminGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AdminGuard,
                { provide: AuthService, useClass: AuthServiceStub },
            ],
        });
        guard = TestBed.get(AdminGuard);
    });

    it('should notify the user without admin role that admin role is required to access', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: false });

        // when
        const canActivate = guard.canActivate(routeMock, routeStateMock);

        // then
        canActivate.subscribe(result => {
            expect(result).toEqual(false);
        });
    });

    it('should allow the user with admin role to access', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: true });

        // when
        const canActivate = guard.canActivate(routeMock, routeStateMock);

        // then
        canActivate.subscribe(result => {
            expect(result).toEqual(true);
        });
    });

});
