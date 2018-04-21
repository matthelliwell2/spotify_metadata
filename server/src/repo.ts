import * as pg from "pg"
import {Album} from "./model/Album";
import {Tag} from "./model/Tag";

const connectionString = "postgres://spotify_metadata@localhost:5432/spotify_metadata?encoding=UTF-8"
/*

const albumTagsSql =
    "  select t1.id,t1.name,t1.url,\n" +
    "    (\n" +
    "      select coalesce(json_agg(r), '[]') as tags from\n" +
    "        (\n" +
    "          select tags.name,tags.value from albums a2\n" +
    "            join albums_tags at on at.album_id = a2.id\n" +
    "            join tags on tags.id = at.tag_id\n" +
    "          where t2.id = {}\n" +
    "        ) r\n" +
    "    )\n" +
    "  from albums t1";


export const getAlbumTags = (id: string): Tag[] => {
    const client = new pg.Client(connectionString)
    client.connect().then(() => {
        return client.query(albumTagsSql)
    }).then((result) => {
        console.log(result)
        res.json(result.rows)
        disconnect(client)
    }).catch((err) => {
        console.log(err)
        disconnect(client)
    })
}*/

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
        console.log(`upsert for album ${album.url}, error ${err}`)
        return Promise.reject(err)
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

