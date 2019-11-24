import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripThumbnailComponent } from './trip-thumbnail.component';


describe('TripThumbnailComponent', () => {
    let component: TripThumbnailComponent;
    let fixture: ComponentFixture<TripThumbnailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ TripThumbnailComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TripThumbnailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
