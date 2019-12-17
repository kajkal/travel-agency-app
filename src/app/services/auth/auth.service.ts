import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';


export interface Credentials {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    readonly authState$: Observable<User | null> = this.fireAuth.authState;

    constructor(private fireAuth: AngularFireAuth) {
        this.authState$.subscribe(value => {
            console.log('AuthService', value);
        });
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
