import {Album} from "./model/Album"
import * as SpotifyTypes from "./spotify-web-api-node";
import {Artist} from "./model/Artist";

const SpotifyWebApi = require('spotify-web-api-node')

// TODO take these out of the code
const clientId = "ede0390dc65a4ea18cf2bb65021606c7"
const clientSecret = "c0c19a915b6a4df69d8dc5472ad27903"

async function getSpotifyApi() {

    const spotifyApi = new SpotifyWebApi({
        clientId: clientId,
        clientSecret: clientSecret
    })

    const granted = await spotifyApi.clientCredentialsGrant()
    console.log('The access token expires in ' + granted.body.expires_in)

    spotifyApi.setAccessToken(granted.body.access_token)
    return spotifyApi;
}

export const getAlbum = async (id: string): Promise<Album> => {
    const spotifyApi = await getSpotifyApi();

    const album: SpotifyTypes.Album = (await spotifyApi.getAlbum(id)).body

    return toAlbum(album)
}

const toAlbum = (album: SpotifyTypes.Album): Album => {
    return new Album(album.id, album.external_urls["spotify"], album.name, album.label, album.release_date, album.genres, album.images, toArtists(album.artists))
}

const toArtists = (artists: SpotifyTypes.SimplifiedArtist[]): Artist[] => {
    return artists.map(toArtist)
}
const toArtist = (artist: SpotifyTypes.SimplifiedArtist): Artist => {
    return new Artist(artist.id, artist.external_urls["spotify"], artist.name)
}
