import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, switchMap } from 'rxjs/operators';


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
                switchMap(authState => {
                    if (authState) {
                        return this.db.list('/admins', ref => ref.orderByValue().equalTo(authState.uid))
                            .valueChanges()
                            .pipe(map(result => Array.isArray(result) && result.length === 1));
                    }
                    return of(false);
                }),
                map(isAdmin => {
                    if (isAdmin) {
                        return true;
                    }

                    alert('Admin role required');
                    console.log('Admin role required');
                    this.router.navigate([ '/sign-in' ]);
                    return false;
                }),
            );
    }

}
