import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MetadataService} from "../metadata.service";
import {Tag} from '../../../../server/src/model/Tag'
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import "rxjs/add/operator/toArray";

@Component({
    selector: 'app-tag-name',
    templateUrl: './tag-name.component.html',
    styleUrls: ['./tag-name.component.scss', '../app.component.scss']
})
export class TagNameComponent implements OnInit {

    @Input() tag: Tag
    @ViewChild('instance') instance: NgbTypeahead;

    constructor(private metadataService: MetadataService) {
    }

    ngOnInit() {
    }

    private focus$ = new Subject<string>();
    private click$ = new Subject<string>();

    search = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .merge(this.focus$)
            .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
            .switchMap((input) => input.length < 1 ? [[]] : this.getTagNames(input.toLowerCase()))


    private getTagNames(filter: string) {
        return this.metadataService.getTagNames().map((names) => this.filterNames(filter, names))
    }

    private filterNames(filter: string, names: string[]): string[] {
        return names.filter((name) => {
            return name.toLowerCase().startsWith(filter)
        })
    }
}
