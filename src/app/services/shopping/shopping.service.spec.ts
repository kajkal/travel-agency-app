import { TestBed } from '@angular/core/testing';
import { ShoppingService } from './shopping.service';


describe('ShoppingService', () => {

    let service: ShoppingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ ShoppingService ],
        });
        service = TestBed.get(ShoppingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

});
