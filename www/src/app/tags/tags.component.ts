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

    error = false
    status: string
    saved = false

    readonly onPlusClicked = () => {
        this.album.tags.push(new Tag("", ""))
        this.saved = false
    }

    readonly onDeleteClicked = (tagIndex: number) => {
        this.album.tags.splice(tagIndex, 1)
        this.saved = false
    }

    ngOnInit() {
    }

    async onSubmit() {
        this.status = ""
        this.saved = true
        console.log(`Saving album ${this.album.name}`)
        try {
            const result = await this.metadataService.putAlbum(this.album).toPromise()
            console.log(result)
            this.status = "Successfully saved"
            this.error = false
        } catch (err) {
            console.log(err)
            this.status = JSON.stringify(err)
            this.error = true
        }
    }
}
