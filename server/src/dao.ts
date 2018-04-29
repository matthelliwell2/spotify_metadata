import * as spotify from "./spotify";
import * as repo from "./repo";
import {Tag} from "./model/Tag";
import {default as SpotifyWebApi} from "./spotify-web-api-node";
import {Album} from "./model/Album";

/**
 * Layer for combining spotify and database results together. Doesn't have to do much at the moment.
 */
export const getAlbum = async (id: string, spotifyApi: SpotifyWebApi): Promise<Album> => {
    const album = await spotify.getAlbum(id, spotifyApi)
    album.tags = await repo.getTags(id)

    await addTagsToTracks(album)

    return album
}

/**
 * Gets an array of albums using the getAlbums spotify api, calling it multiple times if necessary.
 */
export const getAlbums = async (ids: string[], spotifyApi: SpotifyWebApi): Promise<Album[]> => {
    const albums: Album[] = []
    if (ids.length > 20) {
        albums.push.apply(albums, await getAlbums(ids.slice(0, 20), spotifyApi))
        albums.push.apply(albums, await getAlbums(ids.slice(20), spotifyApi))
    } else {
        const localAlbums = await spotify.getAlbums(ids, spotifyApi)
        const promises = localAlbums.map(album => repo.getTags(album.id))

        for (let album of localAlbums) {
            await addTagsToTracks(album)
        }

        await Promise.all(promises)

        albums.push.apply(albums, localAlbums)
    }

    return albums
}

const addTagsToTracks = async (album: Album): Promise<void> => {
    const tags = await Promise.all(album.tracks.map((track) => repo.getTags(track.id)))
    tags.forEach((tag: Tag[], index: number) => {
        album.tracks[index].tags = tag
    })
}