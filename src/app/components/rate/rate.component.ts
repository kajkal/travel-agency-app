import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
    selector: 'app-rate',
    templateUrl: './rate.component.html',
    styleUrls: [ './rate.component.scss' ],
})
export class RateComponent implements OnInit {

    @Input() rating: number;

    @Output() rateSelect = new EventEmitter();

    hoverRating: number;

    get filledStarsCount() {
        const startIndex = 0;
        return Array(...Array(this.hoverRating)).map((_, i) => startIndex + i);
    }

    get emptyStarsCount() {
        const startIndex = this.hoverRating;
        return Array(...Array(5 - this.hoverRating)).map((_, i) => startIndex + i);
    }

    ngOnInit() {
        this.hoverRating = this.rating;
    }

    onRateSelect($event): void {
        $event.stopPropagation();
        $event.preventDefault();
        this.rateSelect.emit(this.hoverRating);
    }

}
