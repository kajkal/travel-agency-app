import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripsComponent } from './trips.component';
import { BehaviorSubject } from 'rxjs';
import { LayoutService } from '../../services/layout/layout.service';
import { TripsService } from '../../services/trips/trips.service';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatSidenavModule } from '@angular/material';
import { MockComponent } from 'ng-mocks';
import { RateComponent } from '../rate/rate.component';
import { TripThumbnailComponent } from '../trip-thumbnail/trip-thumbnail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng5SliderModule } from 'ng5-slider';
import { By } from '@angular/platform-browser';


class TripsServiceStub {
    private tripsSubject = new BehaviorSubject([
        { name: 'Trip A', price: 100, rating: { value: 1 } },
        { name: 'Trip B', price: 120, rating: { value: 2 } },
        { name: 'Trip C', price: 200, rating: { value: 3 } },
        { name: 'Trip D', price: 150, rating: { value: 4 } },
        { name: 'Trip E', price: 400, rating: { value: 5 } },
        { name: 'Trip F', price: 300, rating: { value: 5 } },
    ]);

    setTripsMock(value) {
        this.tripsSubject.next(value);
    }

    get trips$() {
        return this.tripsSubject.asObservable();
    }
}

class LayoutServiceStub {
    private isMobileSubject = new BehaviorSubject(false);

    setIsMobileMock(value) {
        this.isMobileSubject.next(value);
    }

    get isMobile$() {
        return this.isMobileSubject.asObservable();
    }
}

describe('TripsComponent', () => {

    let component: TripsComponent;
    let fixture: ComponentFixture<TripsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TripsComponent,
                MockComponent(RateComponent),
                MockComponent(TripThumbnailComponent),
            ],
            imports: [
                MatSidenavModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                BrowserAnimationsModule,
                Ng5SliderModule,
            ],
            providers: [
                { provide: TripsService, useClass: TripsServiceStub },
                { provide: LayoutService, useClass: LayoutServiceStub },
            ],
        });
        fixture = TestBed.createComponent(TripsComponent);
        component = fixture.componentInstance;
    });

    it('should toggle filters on \'Filters\' button click (desktop mode)', () => {
        // given
        const layoutService = TestBed.get(LayoutService);
        layoutService.setIsMobileMock(false);
        fixture.detectChanges();

        // when
        const filtersButton = fixture.debugElement.query(By.css('.toggle-sidenav'));
        const filtersDrawer = fixture.debugElement.query(By.css('mat-drawer'));
        const initialState = filtersDrawer.componentInstance.opened;

        filtersButton.nativeElement.click();
        fixture.detectChanges();

        // then
        expect(filtersDrawer.componentInstance.mode).toBe('side');
        expect(initialState).toBe(true);
        expect(filtersDrawer.componentInstance.opened).toBe(false);
    });

    it('should toggle filters on \'Filters\' button click (mobile mode)', () => {
        // given
        const layoutService = TestBed.get(LayoutService);
        layoutService.setIsMobileMock(true);
        fixture.detectChanges();

        // when
        const filtersButton = fixture.debugElement.query(By.css('.toggle-sidenav'));
        const filtersDrawer = fixture.debugElement.query(By.css('mat-drawer'));
        const initialState = filtersDrawer.componentInstance.opened;

        filtersButton.nativeElement.click();
        fixture.detectChanges();

        // then
        expect(filtersDrawer.componentInstance.mode).toBe('over');
        expect(initialState).toBe(false);
        expect(filtersDrawer.componentInstance.opened).toBe(true);
    });


    it('should filter trips by given phrase', () => {
        // given
        fixture.detectChanges();

        // when
        const allTrips = fixture.debugElement.queryAll(By.directive(TripThumbnailComponent));
        const searchInput = fixture.debugElement.query(By.css('input'));
        searchInput.nativeElement.value = 'F';
        searchInput.nativeElement.dispatchEvent(new KeyboardEvent('keyup', {}));
        fixture.detectChanges();
        const filteredTrips = fixture.debugElement.queryAll(By.directive(TripThumbnailComponent));

        // then
        expect(allTrips.length).toBe(6);
        expect(filteredTrips.length).toBe(1);
        expect(filteredTrips.map(t => t.componentInstance.trip.name)).toEqual([
            'Trip F',
        ]);
    });

    it('should filter trips by minimal rating', () => {
        // given
        fixture.detectChanges();

        // when
        const allTrips = fixture.debugElement.queryAll(By.directive(TripThumbnailComponent));
        const selectRate = fixture.debugElement.query(By.directive(RateComponent));
        selectRate.componentInstance.rateValueSelect.emit(4);
        fixture.detectChanges();
        const filteredTrips = fixture.debugElement.queryAll(By.directive(TripThumbnailComponent));

        // then
        expect(allTrips.length).toBe(6);
        expect(filteredTrips.length).toBe(3);
        expect(filteredTrips.map(t => t.componentInstance.trip.name)).toEqual([
            'Trip D',
            'Trip E',
            'Trip F',
        ]);
    });

    it('should filter trips by price range', () => {
        // given
        fixture.detectChanges();

        // when
        const allTrips = fixture.debugElement.queryAll(By.directive(TripThumbnailComponent));
        const priceSlider = fixture.debugElement.query(By.css('ng5-slider'));
        priceSlider.componentInstance.userChange.emit({
            value: 100,
            highValue: 200,
        });
        fixture.detectChanges();
        const filteredTrips = fixture.debugElement.queryAll(By.directive(TripThumbnailComponent));

        // then
        expect(allTrips.length).toBe(6);
        expect(filteredTrips.length).toBe(4);
        expect(filteredTrips.map(t => t.componentInstance.trip.name)).toEqual([
            'Trip A',
            'Trip B',
            'Trip C',
            'Trip D',
        ]);
    });

});
