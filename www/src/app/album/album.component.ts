import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {MetadataService} from "../metadata.service";
import {Album} from '../../../../server/src/model/Album'

@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
    private id: string
    private sub: Subscription;
    private album: Album

    constructor(private route: ActivatedRoute, private metadataService: MetadataService) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params.id

            this.metadataService.getAlbum(this.id).subscribe((album) => {
                this.album = album
            })
        })
    }
}
