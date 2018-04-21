import {Component, Input, OnInit} from '@angular/core';
import {Tag} from '../../../../server/src/model/Tag'
import {Album} from '../../../../server/src/model/Album'
import {MetadataService} from "../metadata.service";

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

    constructor(private metadataService: MetadataService) {
    }

    // TODO when we do tracks this will have to change
    @Input() album: Album

    readonly onPlusClicked = () => {
        this.album.tags.push(new Tag("", ""))
    }

    readonly onDeleteClicked = (tagIndex: number) => {
        this.album.tags.splice(tagIndex, 1)
    }

    ngOnInit() {
    }

    onSubmit() {
        console.log(`Saving album ${this.album.name}`)
        try {
            const result = this.metadataService.putAlbum(this.album).toPromise()
            console.log(result)
        } catch (err) {
            console.log(err)
        }
    }

    get diagnostic() { return JSON.stringify(this.album.tags); }
}
