import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {

    constructor(
        private db: AngularFireDatabase,
        private authService: AuthService,
        private router: Router,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.authState$
            .pipe(
                map(authState => {
                    if (authState !== null && authState.isAdmin) {
                        return true;
                    }

                    alert('Admin role required');
                    console.log('Admin role required');
                    return false;
                }),
            );
    }

}
