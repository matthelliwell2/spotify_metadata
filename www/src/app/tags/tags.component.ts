import {Component, Input, OnInit} from '@angular/core';
import {Tag} from '../../../../server/src/model/Tag'
import {Album} from '../../../../server/src/model/Album'
import {MetadataService} from "../metadata.service"
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss','../app.component.scss']
})
export class TagsComponent implements OnInit {

    constructor(private metadataService: MetadataService) {
    }

    @Input() album: Album
    @Input() tags: Tag[]
    @Input() albumLevel: boolean

    // TODO clean up state maintenance. Can we use $dirty?
    error = false
    status: string
    saved = false

    onPlusClicked() {
        this.tags.push(new Tag("", ""))
        this.saved = false
    }

    onDeleteClicked(tagIndex: number) {
        this.tags.splice(tagIndex, 1)
        this.saved = false
    }

    ngOnInit() {
    }

    onSubmit() {
        this.status = ""
        this.saved = true
        this.metadataService.putAlbum(this.album).toPromise().then(() => {
            this.status = "Successfully saved"
            this.error = false
        }).catch((err) => {
            console.log(err)
            this.status = JSON.stringify(err)
            this.error = true
        })
    }
}
