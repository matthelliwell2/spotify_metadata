import * as pg from "pg"
import * as Cursor from "pg-cursor"
import {getSpotifyApi} from "../spotify";
import {getAlbums} from "../dao";
import * as repo from "../repo"

const connectionString = "postgres://spotify_metadata@localhost:5432/spotify_metadata?encoding=UTF-8"

let done = false
let processing = false

/**
 * Populate the name columns from spotify. This is a one of function so it a bit of a mess
 */
export const populateNames = async () => {
    const client = new pg.Client(connectionString)
    await client.connect()

    const cursor: any = client.query(new Cursor("select id from albums where name is null"))
    while (!done) {
        processing = true
        cursor.read(50, processRows)
        while (processing) {
            await sleep(200)
        }
    }

    await client.end()
}

const processRows = async (err: any, rows: Row[]) => {
    if (err) {
        throw err
    }

    console.log(`Processing ${rows.length} albums`)
    if (rows.length === 0) {
        console.log("Finished")
        done = true
        processing = false
        return
    }

    let spotifyApi = await getSpotifyApi()

    // Get the albums, this will populate the name from spotify
    const albums = await getAlbums(rows.map(row => row.id), spotifyApi)

    // Now save the albums, this will force the name to be saved
    for (let album of albums) {
        await repo.upsertAlbum(album)
    }

    console.log(`Processed ${rows.length} albums`)

    processing = false
}

const sleep = (ms:number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

class Row {
    id: string
}