psql -U postgres -p 5432 -c 'create user spotify_metadata;'
psql -U postgres -p 5432 -c 'create database spotify_metadata owner spotify_metadata;'
psql -U postgres -p 5432 -c 'CREATE EXTENSION citext;'