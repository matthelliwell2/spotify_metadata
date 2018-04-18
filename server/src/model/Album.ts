import {Tag} from "./Tag";
import {Image} from "../spotify-web-api-node";
import {Artist} from "./Artist";

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
                public readonly artists: Artist[]) {
    }
}
