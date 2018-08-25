import {Album} from "./model/Album"
import * as SpotifyTypes from "./spotify-web-api-node";
import {default as SpotifyWebApi, Page, SimplifiedTrack} from "./spotify-web-api-node";
import {Artist} from "./model/Artist";
import {Track} from "./model/Track";

const SpotifyWebApi = require('spotify-web-api-node')

// TODO take these out of the code
const clientId = "ede0390dc65a4ea18cf2bb65021606c7"
const clientSecret = "c0c19a915b6a4df69d8dc5472ad27903"

export const getSpotifyApi = async () => {

    const spotifyApi = new SpotifyWebApi({
        clientId: clientId,
        clientSecret: clientSecret
    })

    const granted = await spotifyApi.clientCredentialsGrant()
    console.log('The access token expires in ' + granted.body.expires_in)

    spotifyApi.setAccessToken(granted.body.access_token)
    spotifyApi.setRefreshToken(granted.body.refresh_token)
    return spotifyApi
}

export const getAlbum = async (id: string, spotifyApi: SpotifyWebApi): Promise<Album> => {
    const album: SpotifyTypes.Album = (await spotifyApi.getAlbum(id)).body

    return toAlbum(album)
}

export const getAlbums = async (ids: string[], spotifyApi: SpotifyWebApi): Promise<Album[]> => {
    const albums: SpotifyTypes.Album[] = (await spotifyApi.getAlbums(ids)).body.albums
    return albums.map(toAlbum)
}

const toAlbum = (album: SpotifyTypes.Album): Album => {
    return new Album(album.id,
        album.external_urls["spotify"],
        album.name,
        album.label,
        album.release_date,
        album.genres,
        album.images,
        toArtists(album.artists),
        toTracks(album.tracks)
    )
}

const toArtists = (artists: SpotifyTypes.SimplifiedArtist[]): Artist[] => {
    return artists.map(toArtist)
}

const toArtist = (artist: SpotifyTypes.SimplifiedArtist): Artist => {
    return new Artist(artist.id, artist.external_urls["spotify"], artist.name)
}

const toTracks = (pagedTracks: Page<SimplifiedTrack>): Track[] => {
    const tracks = [] as Track[]

    // TODO support pages/get all the tracks back
    pagedTracks.items.forEach((track) => {
        tracks.push(toTrack(track))
    })

    return tracks
}

const toTrack = (track: SpotifyWebApi.Track) => {
    return new Track(track.id, track.external_urls["spotify"], track.name, track.disc_number, track.track_number, toArtists(track.artists))
}
