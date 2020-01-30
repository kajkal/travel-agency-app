import { TestBed } from '@angular/core/testing';
import { TripsService } from './trips.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { of } from 'rxjs';


class AngularFireDatabaseStub {
    object = jasmine.createSpy();
    list = jasmine.createSpy().and.returnValue({
        valueChanges: jasmine.createSpy().and.returnValue(of([])),
        snapshotChanges: jasmine.createSpy().and.returnValue(of([])),
    });
}

describe('TripsService', () => {

    let service: TripsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TripsService,
                { provide: AngularFireDatabase, useClass: AngularFireDatabaseStub },
            ],
        });
        service = TestBed.get(TripsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

});
