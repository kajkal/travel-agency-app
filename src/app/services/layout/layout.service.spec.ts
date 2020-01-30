import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';


describe('LayoutService', () => {

    let service: LayoutService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ LayoutService ],
        });
        service = TestBed.get(LayoutService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

});
