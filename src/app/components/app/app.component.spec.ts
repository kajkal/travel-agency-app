import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { MockComponent } from 'ng-mocks';


describe('AppComponent', () => {

    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ AppComponent, MockComponent(HeaderComponent) ],
            imports: [
                RouterTestingModule.withRoutes([]),
            ],
        });
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });

    it('should have header', () => {
        // given
        fixture.detectChanges();

        // when
        const header = fixture.debugElement.query(By.directive(HeaderComponent));

        // then
        expect(header).toBeTruthy();
    });


    it('should have router outlet', () => {
        // given
        fixture.detectChanges();

        // when
        const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));

        // then
        expect(routerOutlet).toBeTruthy();
    });

});
