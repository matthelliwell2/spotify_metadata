import {getAlbum} from "../src/spotify"

describe("getAlbum", () => {
    xit("should return an album without tags", async (done) => {
        const album = await getAlbum("5EaDT1qwVjMTfSNQwUuAi0")

        const result = {...album}

        const expected = {
            id: "5EaDT1qwVjMTfSNQwUuAi0",
            url: 'https://open.spotify.com/album/5EaDT1qwVjMTfSNQwUuAi0',
            name: "Invocation To The Night",
            label: "Alia Vox",
            releaseDate: "2008-11-10",
            images: [{
                height: 640,
                url: 'https://i.scdn.co/image/4e7f969ed17c76b5bafadf295ce88188fca130da',
                width: 640
            }, {
                height: 300,
                url: 'https://i.scdn.co/image/b5228412a5b814d8db5dcd5865721892b6a51eb5',
                width: 300
            }, {height: 64, url: 'https://i.scdn.co/image/a69ae88ed655c9c914614f6b37287a3e3a57c8bf', width: 64}],
            artists: [{
                id: '3faEZMpTmZFXpELU1EwWNL',
                url: 'https://open.spotify.com/artist/3faEZMpTmZFXpELU1EwWNL',
                name: 'Jordi Savall'
            }],
            genres: [],
            tags: []
        }

        expect(JSON.parse(JSON.stringify(result))).toEqual(JSON.parse(JSON.stringify(expected)))
        done()
    })
})
