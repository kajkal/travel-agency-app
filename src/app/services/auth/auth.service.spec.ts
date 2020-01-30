import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';


class AngularFireDatabaseStub {
    list = jasmine.createSpy();
}

class AngularFireAuthStub {
    private authStateSubject = new BehaviorSubject(null);

    auth = {
        currentUser: this.authStateSubject.value,
        signInWithEmailAndPassword: jasmine.createSpy(),
        createUserWithEmailAndPassword: jasmine.createSpy(),
        signOut: jasmine.createSpy(),
    };

    setAuthStateMock(value) {
        this.authStateSubject.next(value);
    }

    get authState() {
        return this.authStateSubject.asObservable();
    }
}

describe('AuthService', () => {

    let service: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: AngularFireDatabase, useClass: AngularFireDatabaseStub },
                { provide: AngularFireAuth, useClass: AngularFireAuthStub },
            ],
        });
        service = TestBed.get(AuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

});
