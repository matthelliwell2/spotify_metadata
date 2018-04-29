import * as SpotifyTypes from "../spotify-web-api-node"
import {default as SpotifyWebApi, Page, SimplifiedArtist} from "../spotify-web-api-node"
import {getSpotifyApi} from "../spotify"
import * as repo from "../repo"
import {Album} from "../model/Album"
import {composers} from "./composers";
import * as dao from "../dao";
import {Track} from "../model/Track";

export const tagAlbumsByComposers = async () => {
    try {
        const spotifyApi = await getSpotifyApi()
        for (let composer of composers) {
            const artist = await getSimplifiedArtist(composer, spotifyApi)
            if (artist !== undefined) {
                console.log(`Tagging albums by ${composer}`)
                await tagAlbums(artist.id, "Composer", composer, spotifyApi)
            } else {
                console.log(`No albums found for artist ${composer}`)
            }
        }
    } catch (err) {
        console.log(err)
    }
}

/**
 * Given an artist name, returns the first artist that exactly matches the name
 */
const getSimplifiedArtist = async (name: string, spotifyApi: SpotifyWebApi): Promise<SimplifiedArtist | undefined> => {
    console.log(`Searching for ${name}`)
    const response: Page<SpotifyTypes.SimplifiedArtist> = (await spotifyApi.searchArtists(name)).body.artists
    const matches = response.items.filter((artist) => artist.name === name)

    if (matches.length === 1) {
        return matches[0]
    } else {
        // If we've got multiple matches don't bother as we can't be sure if this is the composer we are after
        return undefined
    }
}

/**
 * Given an artist id, this populates the tags using the artist's names
 */
const tagAlbums = async (id: string, tagName: string, tagValue: string, spotifyApi: SpotifyWebApi): Promise<void> => {
    const limit = 50
    let offset = 0
    let finished = false

    do {
        const response: Page<SpotifyTypes.SimplifiedAlbum> = (await spotifyApi.getArtistAlbums(id, {
            limit: limit,
            offset: offset
        })).body

        const albums = await getAlbums(response.items, spotifyApi)
        albums.forEach(album => {
            tagAlbum(album, tagName, tagValue)
            album.tracks.forEach(track => {
                tagTrack(track, tagName, tagValue)
            })
        })

        const upsertAlbumPromises = albums.map(repo.upsertAlbum)

        await Promise.all(upsertAlbumPromises)

        if (response.next !== null) {
            offset += limit
        } else {
            console.log(`Updated ${offset + albums.length} albums for ${tagValue}`)
            finished = true
        }
    } while (!finished)
}

const tagAlbum = (album: Album, tagName: string, tagValue: string): void => {
    if (album.hasArtist(tagValue)) {
        album.insertTag(tagName, tagValue)
    }
}

const tagTrack = (track: Track, tagName: string, tagValue: string): void => {
    if (track.hasArtist(tagValue)) {
        track.insertTag(tagName, tagValue)
    }
}

/**
 * Converts an array of Spotify simplied albums into an array of our internal albums. This is done to get the list
 * of tracks so they can be tagged as well
 */
const getAlbums = async (simplifiedAlbums: SpotifyTypes.SimplifiedAlbum[], spotifyApi: SpotifyWebApi): Promise<Album[]> => {
    const albums = await dao.getAlbums(simplifiedAlbums.map(a => a.id), spotifyApi)

    return albums
}
