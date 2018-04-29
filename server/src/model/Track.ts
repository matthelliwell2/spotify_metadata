import {Tag} from "./Tag";
import {Artist} from "./Artist";

export class Track {
    tags: Tag[] = []

    constructor(public readonly id: string,
                public readonly url: string,
                public readonly name: string,
                public readonly discNumber: number,
                public readonly trackNumber: number,
                public readonly artists: Artist[]) {
    }

    // TODO this is the same code as in artists so we should make it common
    hasArtist(artistName: string): boolean {
        return this.artists.findIndex(artist => artist.name === artistName) >= 0
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
