import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, switchMap, tap } from 'rxjs/operators';


export interface UserWithRole extends User {
    isAdmin: boolean;
}

export interface Credentials {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    readonly authState$: Observable<UserWithRole | null>;

    constructor(private db: AngularFireDatabase,
                private fireAuth: AngularFireAuth) {

        this.authState$ = this.fireAuth.authState
            .pipe(
                switchMap(authState => {
                    if (authState !== null) {
                        return this.db.list('/admins', ref => ref.orderByValue().equalTo(authState.uid))
                            .valueChanges()
                            .pipe(
                                map(result => ({
                                    ...authState,
                                    isAdmin: Array.isArray(result) && result.length === 1,
                                })),
                            );
                    }

                    return of(null);
                }),
                tap(authState => {
                    console.log('AuthService', authState);
                }),
            );
    }

    get user(): User | null {
        return this.fireAuth.auth.currentUser;
    }

    login({ email, password }: Credentials) {
        return this.fireAuth.auth.signInWithEmailAndPassword(email, password);
    }

    register({ email, password }: Credentials) {
        return this.fireAuth.auth.createUserWithEmailAndPassword(email,
            password);
    }

    logout() {
        return this.fireAuth.auth.signOut();
    }

}
