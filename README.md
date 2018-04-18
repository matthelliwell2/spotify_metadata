# spotify_metadata

This is a prototype for storing additional tag information against Spotify music.

It is intended to allow extra tagging of classical music.

It is currently split into a frontend, in www directory, and a rest api, in server directory, that talks to a local Postgress DB

If I ever get around to it this will be moved over to AWS with lambdas.

TODO

- [ ] Migrate to aws
- [ ] Sort out character set problems, eg in Pärt
- [ ] Pact tests for the server
- [ ] Encode/decode parameters in urls
- [ ] Prefix routes with /v1