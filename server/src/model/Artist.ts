/**
 *  Artist data to be passed to the client
 */
export class Artist {
    constructor(public readonly id: string,
                public readonly url: string,
                public readonly name: string) {
    }
}