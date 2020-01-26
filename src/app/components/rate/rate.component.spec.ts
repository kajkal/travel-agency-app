import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatIcon, MatIconModule, MatTooltipModule } from '@angular/material';
import { RateComponent } from './rate.component';


describe('RateComponent', () => {
    let component: RateComponent;
    let fixture: ComponentFixture<RateComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ RateComponent ],
            imports: [
                MatIconModule,
                MatTooltipModule,
            ],
        });
        fixture = TestBed.createComponent(RateComponent);
        component = fixture.componentInstance;
    });

    describe('display mode', () => {

        beforeEach(() => {
            component.mode = 'display';
        });

        it('should display 3 full stars and 2 empty stars', () => {
            // given
            component.ratingValue = 3;
            fixture.detectChanges();

            // when
            const allStars = fixture.debugElement.queryAll(By.directive(MatIcon));
            const fullStars = allStars.filter(e => e.nativeElement.innerText === 'star');
            const emptyStars = allStars.filter(e => e.nativeElement.innerText === 'star_border');

            // then
            expect(allStars.length).toBe(5);
            expect(fullStars.length).toBe(3);
            expect(emptyStars.length).toBe(2);
        });

        it('should contain tooltip with message', () => {
            // given
            component.ratingValue = 3;
            component.tooltip = '3 votes';
            fixture.detectChanges();

            // when
            const ratingDebugElement = fixture.debugElement.query(By.css('.rating'));
            const ratingElement: HTMLElement = ratingDebugElement.nativeElement;
            const tooltipContent = ratingElement.getAttribute('ng-reflect-message');

            // then
            expect(tooltipContent).toContain('3 votes');
        });

    });

    describe('select mode', () => {

        beforeEach(() => {
            component.mode = 'select';
        });

        it('should emit selected rate value on rate select', () => {
            // given
            component.ratingValue = 3;
            spyOn(component.rateValueSelect, 'emit');
            fixture.detectChanges();

            // when
            const allStars = fixture.debugElement.queryAll(By.directive(MatIcon));
            const fifthStarDebugElement = allStars[ 4 ];
            fifthStarDebugElement.triggerEventHandler('mouseover', {});
            fifthStarDebugElement.triggerEventHandler('click', jasmine.createSpyObj([ 'stopPropagation', 'preventDefault' ]));

            // then
            expect(component.rateValueSelect.emit).toHaveBeenCalledWith(5);
        });

    });

});
