import {Tag} from "./Tag";
import {Image} from "../spotify-web-api-node";
import {Artist} from "./Artist";
import {Track} from "./Track";

/**
 * This is the model of an album that is passed to the client. It combines selected data from Spotify with a set
 * of tag data
 */
export class Album {
    tags: Tag[] = []

    constructor(public readonly id: string,
                public readonly url: string,
                public readonly name: string,
                public readonly label: string,
                public readonly releaseDate: string,
                public readonly genres: string[],
                public readonly images: Image[],
                public readonly artists: Artist[],
                public readonly tracks: Track[]) {
    }

    hasArtist(artistName: string): boolean {
        return this.artists.findIndex(artist => artist.name.toLowerCase() === artistName.toLowerCase()) >= 0
    }

    insertTag(tagName: string, tagValue: string): void {
        if (!this.hasTag(tagName, tagValue)) {
            this.tags.push(new Tag(tagName, tagValue))
        }
    }

    private hasTag(name: string, value: string): boolean {
        return this.tags.findIndex(tag => tag.name === name && tag.value === value) >= 0
    }
}
