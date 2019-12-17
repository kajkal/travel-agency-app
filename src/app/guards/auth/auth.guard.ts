import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.authState$
            .pipe(
                map(authState => {
                    if (authState !== null) {
                        return true;
                    }
                    this.router.navigate([ '/sign-in' ]);
                    return false;
                }),
            );
    }

}
