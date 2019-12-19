import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    public isMobile$ = new BehaviorSubject<boolean>(LayoutService.isMobile());

    constructor() {
        fromEvent(window, 'resize')
            .pipe(
                map(LayoutService.isMobile),
                distinctUntilChanged(),
            )
            .subscribe(isMobile => this.isMobile$.next(isMobile));
    }

    private static isMobile(): boolean {
        return window.matchMedia('(max-width: 960px)').matches;
    }

}
