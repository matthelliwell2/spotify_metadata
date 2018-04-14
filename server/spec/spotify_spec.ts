import {getAlbum} from "../src/spotify"

describe("getAlbum", () => {
    it("should return an album without tags" , async (done) => {
        const album = await getAlbum("5EaDT1qwVjMTfSNQwUuAi0")

        const result = {...album}
        expect(result).toEqual({id: "5EaDT1qwVjMTfSNQwUuAi0", url: 'https://open.spotify.com/album/5EaDT1qwVjMTfSNQwUuAi0', name: "Invocation To The Night", label: "Alia Vox", genres: [], tags: []})
        done()
    })
})
