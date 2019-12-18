import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
    selector: 'app-rate',
    templateUrl: './rate.component.html',
    styleUrls: [ './rate.component.scss' ],
})
export class RateComponent implements OnInit {

    @Input() ratingValue: number;

    @Input() mode: 'display' | 'select';

    @Input() tooltip = '';

    @Output() rateValueSelect = new EventEmitter();

    hoverRating: number;

    get filledStarsCount() {
        const startIndex = 0;
        return Array(...Array(this.n)).map((_, i) => startIndex + i);
    }

    get emptyStarsCount() {
        const startIndex = this.hoverRating;
        return Array(...Array(5 - this.n)).map((_, i) => startIndex + i);
    }

    ngOnInit() {
        this.hoverRating = this.ratingValue;
    }

    onRateSelect($event): void {
        $event.stopPropagation();
        $event.preventDefault();
        this.rateValueSelect.emit(this.hoverRating);
    }

    private get n(): number {
        return parseInt.call(null, this.hoverRating);
    }

}
