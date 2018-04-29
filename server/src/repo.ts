import * as pg from "pg"
import {Album} from "./model/Album";
import {Tag} from "./model/Tag";
import {Track} from "./model/Track";

const connectionString = "postgres://spotify_metadata@localhost:5432/spotify_metadata?encoding=UTF-8"

export const getTagNames = async (): Promise<string[]> => {
    const client = new pg.Client(connectionString)
    await client.connect()

    const result = await client.query("select name from tag_names order by name")
    await client.end()

    return result.rows.map((row) => row['name'])
}

export const getTagValues = async (name: string, value: string): Promise<string[]> => {
    const client = new pg.Client(connectionString)
    await client.connect()

    const result = await client.query("select distinct value from tags where name = $1 and value like $2 order by value", [name, value])
    await client.end()

    return result.rows.map((row) => row['value'])
}

const getTagsSql = `select coalesce(json_agg(r), '[]') as tags from (
    select tags.name, tags.value from tags where tags.reference = $1 order by tags.name, tags.value
) r`

export const getTags = async (reference: string): Promise<Tag[]> => {
    const client = new pg.Client(connectionString)
    await client.connect()

    const result = await client.query(getTagsSql, [reference])
    await client.end()

    return result.rows[0].tags
}

export const upsertAlbum = async (album: Album): Promise<void> => {
    const client = new pg.Client(connectionString)
    await client.connect()
    await begin(client)

    await insertAlbum(client, album.id)
    await insertTracks(client, album)

    await deleteTags(client, album.id)
    await insertTags(client, album.id, album.tags)

    await deleteTrackTags(client, album.tracks)
    await insertTrackTags(client, album.tracks)

    await commit(client)

    await client.end()

    return Promise.resolve()
}

const insertAlbum = async (client: pg.Client, id: string): Promise<pg.QueryResult> => {
    return client.query("insert into albums (id) values ($1) on conflict do nothing", [id])
}

const insertTracks = async (client: pg.Client, album: Album): Promise<any> => {
    // If this being called from the populate methods we won't have tracks at this point. This isn't a problem as
    // next time we save the album we'll get some tracks added.
    if (album.tracks.length > 0) {
        const values = album.tracks.map((track, index) => `($${index + 1}, '${album.id}')`)
        let sql = `insert into tracks (id, album_id) values ${values.join(",")} on conflict do nothing`

        const parameters = album.tracks.map(track => track.id)

        return client.query(sql, parameters)
    } else {
        return Promise.resolve()
    }
}

// TODO do this as a single sql statement
const deleteTrackTags = async (client: pg.Client, tracks: Track[]): Promise<pg.QueryResult[]> => {
    const promises = tracks.map((track) => {
        return deleteTags(client, track.id)
    })

    return Promise.all(promises)
}

const insertTrackTags = async (client: pg.Client, tracks: Track[]): Promise<any> => {
    const promises = tracks.map((track) => {
        return insertTags(client, track.id, track.tags)
    })

    return Promise.all(promises)
}
const insertTags = async (client: pg.Client, reference: string, tags: Tag[]): Promise<pg.QueryResult[] | void> => {
    if (tags.length === 0) {
        return Promise.resolve()
    }

    return Promise.all(tags.map((tag) => {
        return client.query("insert into tags (reference, name,value) values ($1,$2,$3) on conflict do nothing", [reference, tag.name, tag.value])
    }))
}


const deleteTags = async (client: pg.Client, reference: string): Promise<pg.QueryResult> => {
    return client.query("delete from tags where reference = $1", [reference])
}

const begin = async (client: pg.Client): Promise<pg.QueryResult> => {
    return client.query("BEGIN")
}

const commit = async (client: pg.Client): Promise<pg.QueryResult> => {
    return client.query("COMMIT")
}

