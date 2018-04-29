import * as express from "express"
import * as bodyParser from "body-parser"
import * as expressValidator from "express-validator"
import * as cors from "cors"
import * as repo from "./repo"
import * as dao from "./dao";
import {getSpotifyApi} from "./spotify";

export const app = express()

app.set("port", process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(cors())
app.set('json spaces', 2)

app.get("/album/:id", async (req, res) => {
    try {
        const spotifyApi = await getSpotifyApi()

        const album = await dao.getAlbum(req.params.id, spotifyApi)
        res.json(album)
    } catch (err) {
        console.log(`Failed get /album/$id: ${err}`)
        res.status(400).json(err)
    }
})

app.post("/album", async (req, res) => {
    try {
        await repo.upsertAlbum(req.body)
        res.json("done")
    } catch (err) {
        console.log(`Failed post /album: ${err}`)
        res.status(400).json(err)
    }
})

app.get("/tags/names", async (req, res) => {
    try {
        const result = await repo.getTagNames()
        res.json(result)
    } catch (err) {
        console.log(`Failed get /tags/names: ${err}`)
        res.status(400).json(err)
    }
})

app.get("/tags/name/:name/value/:value", async (req, res) => {
    try {
        const result = await repo.getTagValues(req.params.name, `%${req.params.value}%`)
        res.json(result)
    } catch (err) {
        console.log(`Failed get /tags/name/${req.params.name}/value/${req.params.value}: ${err}`)
        res.status(400).json(err)
    }
})