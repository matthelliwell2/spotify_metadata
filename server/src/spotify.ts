import {Album} from "./model/Album"

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
    console.log('The access token is ' + granted.body.access_token)

    spotifyApi.setAccessToken(granted.body.access_token)
    return spotifyApi;
}

export const getAlbum = async (id: string): Promise<Album> => {
    const spotifyApi = await getSpotifyApi();

    const album = await spotifyApi.getAlbum(id)

    return new Album(album.body.id, album.body.external_urls["spotify"], album.body.name, album.body.label, album.body.genres)
}
