import { BehaviorSubject, of } from 'rxjs';
import { MatCardModule, MatCardSubtitle, MatCardTitle, MatDialog, MatFormFieldModule, MatIconModule, MatInputModule, MatListItem, MatListModule, MatMenu, MatMenuModule, MatTooltipModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TripComponent } from './trip.component';
import { TripsService } from '../../services/trips/trips.service';
import { ShoppingService } from '../../services/shopping/shopping.service';
import { AuthService } from '../../services/auth/auth.service';
import { RateComponent } from '../rate/rate.component';
import { Trip } from '../../models/Trip';
import { UpdateTripComponent } from '../update-trip/update-trip.component';


const baseTrip: Trip = {
    key: 'trip key',
    name: 'trip name',
    country: 'trip country',
    startDate: '2020-01-01',
    endDate: '2020-01-10',
    price: 100,
    freePlaces: 5,
    description: 'trip description',
    thumbnailUrl: 'thumbnail url',
    rating: {
        value: 3,
        votes: [ 'uid' ],
    },
    comments: [],
};

class ActivatedRouteStub {
    snapshot = {
        paramMap: {
            get: jasmine.createSpy().and.returnValue('1'),
        },
    };
}

class RouterStub {
    navigate = jasmine.createSpy();
}

class TripsServiceStub {
    getTripDetails = jasmine.createSpy().and.returnValue(of(baseTrip));
    deleteTrip = jasmine.createSpy().and.returnValue(Promise.resolve());
    updateTrip = jasmine.createSpy().and.returnValue(Promise.resolve());
}

class ShoppingServiceStub {
    private shoppingCartSubject = new BehaviorSubject({
        trips: jasmine.createSpyObj([ 'delete', 'get' ]),
    });

    setShoppingCartMock(value) {
        this.shoppingCartSubject.next(value);
    }

    get shoppingCart$() {
        return this.shoppingCartSubject;
    }
}

class AuthServiceStub {
    private authStateSubject = new BehaviorSubject({
        isAdmin: false,
        email: 'user@domain.com',
    });

    setAuthStateMock(value) {
        this.authStateSubject.next(value);
    }

    get authState$() {
        return this.authStateSubject.asObservable();
    }

    get user() {
        return this.authStateSubject.value;
    }
}

class MatDialogStub {
    open = jasmine.createSpy();
}

describe('TripComponent', () => {

    let component: TripComponent;
    let fixture: ComponentFixture<TripComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ TripComponent, RateComponent ],
            imports: [
                MatCardModule,
                MatIconModule,
                MatMenuModule,
                MatListModule,
                MatFormFieldModule,
                FormsModule,
                ReactiveFormsModule,
                MatTooltipModule,
                MatInputModule,
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: ActivatedRoute, useClass: ActivatedRouteStub },
                { provide: Router, useClass: RouterStub },
                { provide: TripsService, useClass: TripsServiceStub },
                { provide: ShoppingService, useClass: ShoppingServiceStub },
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: MatDialog, useClass: MatDialogStub },
            ],
        });
        fixture = TestBed.createComponent(TripComponent);
        component = fixture.componentInstance;
    });

    it('should navigate the user to the /trips page when no trip with id from url is found', () => {
        // given
        const router = TestBed.get(Router);
        const tripsService = TestBed.get(TripsService);
        tripsService.getTripDetails.and.returnValue(of(undefined));
        fixture.detectChanges();

        // when/then
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([ '/trips' ]);
    });

    it('should not render update and remove button if user is not admin', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: false });
        fixture.detectChanges();

        // when
        const tripActionMenuDebugElement = fixture.debugElement.query(By.directive(MatMenu));

        // then
        expect(tripActionMenuDebugElement).toBeFalsy();
    });

    it('should render update and remove button if user is admin', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: true });
        fixture.detectChanges();

        // when
        const tripActionMenuDebugElement = fixture.debugElement.query(By.directive(MatMenu));

        // then
        expect(tripActionMenuDebugElement).toBeTruthy();
    });

    it('should open update dialog on \'Update\' button click', () => {
        // given
        const dialog = TestBed.get(MatDialog);
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: true });
        fixture.detectChanges();

        // when
        const adminOptionsMenuTrigger = fixture.debugElement.query(By.css('.mat-menu-trigger'));
        adminOptionsMenuTrigger.triggerEventHandler('click', {});
        fixture.detectChanges();
        const menuItems = fixture.debugElement.queryAll(By.css('.mat-menu-item'));
        const updateButton = menuItems[ 0 ];
        updateButton.triggerEventHandler('click', {});

        // then
        expect(dialog.open).toHaveBeenCalledTimes(1);
        expect(dialog.open).toHaveBeenCalledWith(UpdateTripComponent, {
            data: baseTrip,
        });
    });

    it('should delete trip on \'Delete\' button click and navigate to /trips', () => {
        // given
        const router = TestBed.get(Router);
        const tripsService = TestBed.get(TripsService);
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: true });
        fixture.detectChanges();

        // when
        const adminOptionsMenuTrigger = fixture.debugElement.query(By.css('.mat-menu-trigger'));
        adminOptionsMenuTrigger.triggerEventHandler('click', {});
        fixture.detectChanges();
        const menuItems = fixture.debugElement.queryAll(By.css('.mat-menu-item'));
        const deleteButton = menuItems[ 1 ];
        deleteButton.triggerEventHandler('click', {});

        // then
        expect(tripsService.deleteTrip).toHaveBeenCalledTimes(1);
        expect(tripsService.deleteTrip).toHaveBeenCalledWith(baseTrip);
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([ '/trips' ]);
    });

    it('should render rate component', () => {
        // given
        const tripsService = TestBed.get(TripsService);
        tripsService.getTripDetails.and.returnValue(of({
            ...baseTrip,
            rating: {
                value: 4,
                votes: [ 'uid' ],
            },
        }));
        fixture.detectChanges();

        // when
        const rateComponentDebugElement = fixture.debugElement.query(By.directive(RateComponent));
        const rateComponentInstance = rateComponentDebugElement.componentInstance;

        // then
        expect(rateComponentInstance.mode).toBe('select');
        expect(rateComponentInstance.ratingValue).toBe(4);
    });

    it('should update trip with new rate on rate select', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: false, uid: 'uid_x' });
        const tripsService = TestBed.get(TripsService);
        tripsService.getTripDetails.and.returnValue(of({
            ...baseTrip,
            rating: {
                value: 2,
                votes: [ 'uid' ],
            },
        }));
        fixture.detectChanges();

        // when
        const rateComponentDebugElement = fixture.debugElement.query(By.directive(RateComponent));
        const rateComponentInstance = rateComponentDebugElement.componentInstance;
        rateComponentInstance.rateValueSelect.emit(5);

        // then
        expect(tripsService.updateTrip).toHaveBeenCalledTimes(1);
        expect(tripsService.updateTrip).toHaveBeenCalledWith({
            ...baseTrip,
            rating: {
                value: 3.5,
                votes: [ 'uid', 'uid_x' ],
            },
        });
    });

    it('should not update trip with new rate on rate select when user already rated this trip', () => {
        // given
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: false, uid: 'uid_x' });
        const tripsService = TestBed.get(TripsService);
        tripsService.getTripDetails.and.returnValue(of({
            ...baseTrip,
            rating: {
                value: 2,
                votes: [ 'uid', 'uid_x' ],
            },
        }));
        fixture.detectChanges();

        // when
        const rateComponentDebugElement = fixture.debugElement.query(By.directive(RateComponent));
        const rateComponentInstance = rateComponentDebugElement.componentInstance;
        rateComponentInstance.rateValueSelect.emit(5);

        // then
        expect(tripsService.updateTrip).toHaveBeenCalledTimes(0);
    });

    it('should render basic trip info', () => {
        // given
        const tripsService = TestBed.get(TripsService);
        tripsService.getTripDetails.and.returnValue(of({
            ...baseTrip,
            name: 'trip name',
            startDate: '2020-01-01',
            endDate: '2020-01-10',
            price: 100,
            description: 'trip description',
        }));
        fixture.detectChanges();

        // when
        const tripTitle = fixture.debugElement.query(By.directive(MatCardTitle));
        const tripSubTitle = fixture.debugElement.query(By.directive(MatCardSubtitle));
        const tripDescription = fixture.debugElement.query(By.css('.description'));

        // then
        expect(tripTitle.nativeElement.innerText).toContain('trip name');
        expect(tripSubTitle.nativeElement.innerText).toContain('Jan 1, 2020-Jan 10, 2020');
        expect(tripSubTitle.nativeElement.innerText).toContain('€100.00');
        expect(tripDescription.nativeElement.innerText).toContain('trip description');
    });

    it('should render \'No comments yet.\' when trip has no comments', () => {
        // given
        const tripsService = TestBed.get(TripsService);
        tripsService.getTripDetails.and.returnValue(of({
            ...baseTrip,
            comments: [],
        }));
        fixture.detectChanges();

        // when
        const noCommentsMessage = fixture.debugElement.query(By.directive(MatListItem));
        const comments = fixture.debugElement.queryAll(By.css('.comment'));

        // then
        expect(noCommentsMessage.nativeElement.innerText).toContain('No comments yet.');
        expect(comments.length).toBe(0);
    });

    it('should render 2 comments', () => {
        // given
        const tripsService = TestBed.get(TripsService);
        tripsService.getTripDetails.and.returnValue(of({
            ...baseTrip,
            comments: [
                { timestamp: '2019-12-19T00:53:52.443Z', author: 'admin@domain.com', comment: 'Bardzo polecam!' },
                { timestamp: '2019-12-19T13:42:53.954Z', author: 'user2@domain.com', comment: 'Super wycieczka!' },
            ],
        }));
        fixture.detectChanges();

        // when
        const comments = fixture.debugElement.queryAll(By.css('.comment'));

        // then
        expect(comments.length).toBe(2);
    });

    it('should not render add comment form when user did not reserved a seat on this trip', () => {
        // given
        const shoppingService = TestBed.get(ShoppingService);
        shoppingService.setShoppingCartMock({
            trips: {
                get: jasmine.createSpy().and.returnValue(undefined),
            },
        });
        fixture.detectChanges();

        // when
        const addCommentForm = fixture.debugElement.query(By.css('form'));

        // then
        expect(addCommentForm).toBeFalsy();
    });

    it('should render add comment form when user reserved a seat on this trip', () => {
        // given
        const shoppingService = TestBed.get(ShoppingService);
        shoppingService.setShoppingCartMock({
            trips: {
                get: jasmine.createSpy().and.returnValue(1),
            },
        });
        fixture.detectChanges();

        // when
        const addCommentForm = fixture.debugElement.query(By.css('form'));

        // then
        expect(addCommentForm).toBeTruthy();
    });

    it('should add comment on \'Add comment\' button click', () => {
        // given
        const shoppingService = TestBed.get(ShoppingService);
        shoppingService.setShoppingCartMock({
            trips: {
                get: jasmine.createSpy().and.returnValue(1),
            },
        });
        const authService = TestBed.get(AuthService);
        authService.setAuthStateMock({ isAdmin: false, email: 'user@domain.com' });
        const tripsService = TestBed.get(TripsService);
        fixture.detectChanges();

        // when
        const addCommentForm = fixture.debugElement.query(By.css('form'));
        const commentMessage = addCommentForm.query(By.css('input'));
        const addCommentButton = addCommentForm.query(By.css('button'));
        commentMessage.nativeElement.value = 'Comment message';
        commentMessage.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        addCommentButton.nativeElement.click();

        // then
        expect(tripsService.updateTrip).toHaveBeenCalledTimes(1);
        expect(tripsService.updateTrip).toHaveBeenCalledWith({
            ...baseTrip,
            comments: [
                jasmine.objectContaining({
                    author: 'user@domain.com',
                    content: 'Comment message',
                }),
            ],
        });
    });

});
