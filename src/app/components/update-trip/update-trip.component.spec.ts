import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTripComponent } from './update-trip.component';


describe('UpdateTripComponent', () => {
    let component: UpdateTripComponent;
    let fixture: ComponentFixture<UpdateTripComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ UpdateTripComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UpdateTripComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
