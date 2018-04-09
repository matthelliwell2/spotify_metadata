import {Component, OnInit} from '@angular/core';
import {Track} from "./Track";
import {MetadataService} from "../metadata.service";

@Component({
    selector: 'app-tracks',
    templateUrl: './tracks.component.html',
    styleUrls: ['./tracks.component.css']
})
export class TracksComponent implements OnInit {

    tracks: Track[]
    selectedTrack: Track

    constructor(private metadataService: MetadataService) {
    }

    ngOnInit() {
        this.metadataService.getTracks().subscribe((tracks) => {
            this.tracks = tracks
        })
    }

    onClick(track: Track) {
        this.selectedTrack = track
    }
}
