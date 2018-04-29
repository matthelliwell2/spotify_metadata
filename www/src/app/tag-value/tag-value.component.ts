import {Tag} from '../../../../server/src/model/Tag'
import {Component, Input, OnInit, ViewChild} from '@angular/core'
import {MetadataService} from "../metadata.service"
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import {Subject} from "rxjs/Subject";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-tag-value',
    templateUrl: './tag-value.component.html',
    styleUrls: ['./tag-value.component.scss','../app.component.scss']
})
export class TagValueComponent implements OnInit {

    @Input() tag: Tag
    @ViewChild('instance') instance: NgbTypeahead;

    private focus$ = new Subject<string>();
    private click$ = new Subject<string>();

    constructor(private metadataService: MetadataService) {
    }

    ngOnInit() {
    }

    search = (text$: Observable<string>) =>
        text$
            .debounceTime(300)
            .distinctUntilChanged()
            // .merge(this.focus$)
            .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
            .switchMap(term => term.length < 3 ? [[]] : this.metadataService.getTagValues(this.tag.name, term))
}
