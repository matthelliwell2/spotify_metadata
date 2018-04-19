import {Component, Input, OnInit} from '@angular/core';
import {Tag} from '../../../../server/src/model/Tag'
import {Album} from '../../../../server/src/model/Album'

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

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
        console.log("on submit called")
    }

    get diagnostic() { return JSON.stringify(this.album.tags); }
}
