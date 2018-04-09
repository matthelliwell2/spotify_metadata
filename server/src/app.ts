import * as express from "express"
import * as bodyParser from "body-parser"
import * as expressValidator from "express-validator"
import * as cors from "cors"
import * as pg from "pg"

export const app = express()

app.set("port", process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cors())
app.set('json spaces', 2)

app.get('/', (req, res) => {
    res.send('Try /tracks to get a list of tracks')
})

const connectionString = "postgres://spotify_metadata@localhost:5432/spotify_metadata?encoding=UTF-8"

const sql =
    "  select t1.id,t1.name,t1.url,\n" +
    "    (\n" +
    "      select coalesce(json_agg(r), '[]') as tags from\n" +
    "        (\n" +
    "          select tags.name,tags.value from tracks t2\n" +
    "            join tracks_tags tt on tt.track_id = t2.id\n" +
    "            join tags on tags.id = tt.tag_id\n" +
    "          where t1.id = t2.id\n" +
    "        ) r\n" +
    "    )\n" +
    "  from tracks t1";


app.get("/tracks", (req, res) => {
    const client = new pg.Client(connectionString)
    client.connect().then(() => {
        return client.query(sql)
    }).then((result) => {
        console.log(result)
        res.json(result.rows)
        disconnect(client)
    }).catch((err) => {
        console.log(err)
        disconnect(client)
    })

})

const disconnect = (client: pg.Client) => {
    client.end().catch((err) => {console.log(`Failed to disconnect ${err}`)})
}
