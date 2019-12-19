import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';


@Injectable({
    providedIn: 'root',
})
export class LoggedGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.authState$
            .pipe(
                map(authState => {
                    if (authState === null) {
                        return true;
                    }

                    this.router.navigate([ '/trips' ]);
                    return false;
                }),
            );
    }

}
