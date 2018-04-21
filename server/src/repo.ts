import * as pg from "pg"
import {Album} from "./model/Album";
import {Tag} from "./model/Tag";

const connectionString = "postgres://spotify_metadata@localhost:5432/spotify_metadata?encoding=UTF-8"

const getAlbumTagsSql = `select coalesce(json_agg(r), '[]') as tags from (
    select tags.name, tags.value
    from tags
      join albums_tags on albums_tags.tag_id = tags.id
      join albums on albums.id = albums_tags.album_id
    where albums.id = $1
) r`

export const getAlbumTags = async (id: string): Promise<Tag[]> => {
    console.log(`getAlbumTags ${id}`)
    try {
        const client = new pg.Client(connectionString)
        await client.connect()

        const result = await client.query(getAlbumTagsSql,[id])
        await client.end()

        return result.rows[0].tags
    } catch (err) {
        console.log(`getAlbumTags for album id ${id} failed, error ${err}`)
        throw err
    }
}

export const upsertAlbum = async (album: Album): Promise<void> => {
    console.log(`upsertAlbum id ${album.id}`)
    try {
        const client = new pg.Client(connectionString)
        await client.connect()
        await begin(client)

        const exists = await albumExists(client, album.id)
        if (exists) {
            await deleteAlbumTags(client, album.id)
            await deleteUnusedAlbumTags(client, album.id)
        } else {
            await insertAlbum(client, album.id)
        }

        await insertAlbumTags(client, album.id, album.tags)

        await insertAlbumTagMapping(client, album.id, album.tags)

        await commit(client)

        await client.end()

        return Promise.resolve()
    } catch (err) {
        console.log(`upsert for album id ${album.id} failed, error ${err}`)
        throw err
    }
}

const deleteUnusedAlbumTags = async(client: pg.Client, id: string): Promise<pg.QueryResult> => {
    console.log("deleteUnusedAlbumTags")
    return client.query("delete from tags where not exists (select 1 from albums_tags where tags.id = albums_tags.tag_id)")
}

const insertAlbum = async (client: pg.Client, id: string): Promise<pg.QueryResult> => {
    console.log("insert album")
    return client.query("insert into albums values ($1)", [id])
}

const deleteAlbumTags = async (client: pg.Client, id: string): Promise<pg.QueryResult> => {
    console.log("deleteAlbumTags")
    return client.query("delete from albums_tags where album_id = $1", [id])
}

const insertAlbumTags = async (client: pg.Client, id: string, tags: Tag[]) => {
    console.log("insertAlbumTags")
    return Promise.all(tags.map((tag) => {
        return client.query("insert into tags (name,value) values ($1,$2) on conflict do nothing", [tag.name, tag.value])
    }))
}

const insertAlbumTagMapping = async (client: pg.Client, id: string, tags: Tag[]) => {
    console.log("insertAlbumTagMapping")
    return Promise.all(tags.map((tag) => {
        return client.query("insert into albums_tags select $1 as album_id, id as tag_id from tags where name=$2 and value=$3", [id, tag.name, tag.value])
    }))
}

const begin = async (client: pg.Client): Promise<pg.QueryResult> => {
    console.log("begin")
    return client.query("BEGIN")
}

const commit = async (client: pg.Client): Promise<pg.QueryResult> => {
    console.log("commit")
    return client.query("COMMIT")
}

const albumExists = async (client: pg.Client, id: string): Promise<boolean> => {
    console.log("albumExists")
    try {
        const result: pg.QueryResult = await client.query("select count(*) from Albums where id = $1", [id])
        const count = result.rows[0].count
        return count > 0
    } catch (err) {
        console.log(`Query failed ${err}`)
        return Promise.reject(err)
    }
}

