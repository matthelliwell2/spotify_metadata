-- List of all valid tag names
create table tag_names (
  name citext not null primary key
);
grant all on tag_names to spotify_metadata;

-- A single table for all tags applied to albums, tracks and anything else I think of
create table tags (
  -- The is a foreign key to either the albums or tracks table. We should enforce a contraint for this but haven't
  reference text not null,
  name citext not null references tag_names(name),
  value citext not null,
  -- A particular tag can only appear once for on an album or track
  UNIQUE (reference, name, value)
);
grant all on tags to spotify_metadata;

-- A table of tracks, usually associated with an album. They are identified with the spotify id. No spotify data
-- is cached but this might change to reduce the number of calls we make to spotify.
create table tracks (
  id text not null PRIMARY KEY,
  album_id text not null,
  name citext not null
);
grant all on tracks to spotify_metadata;

-- Table of album identified by the spotify id. As with tracks we don't cache any spotify data at the moment.
create table albums (
  id text not null PRIMARY KEY,
  name citext not null
);
grant all on albums to spotify_metadata;

insert into tag_names values('Comment');
insert into tag_names values('iTunesU?');
insert into tag_names values('MusicCDIdentifier');
insert into tag_names values('Ownership');
insert into tag_names values('PlayCounter');
insert into tag_names values('Podcast?');
insert into tag_names values('Popularimeter');
insert into tag_names values('Private');
insert into tag_names values('RelativeVolumeAdjustment');
insert into tag_names values('SynLyrics');
insert into tag_names values('Album');
insert into tag_names values('BeatsPerMinute');
insert into tag_names values('PodcastCategory');
insert into tag_names values('Compilation');
insert into tag_names values('Composer');
insert into tag_names values('Genre');
insert into tag_names values('Copyright');
insert into tag_names values('EncodingTime');
insert into tag_names values('PodcastDescription');
insert into tag_names values('PlaylistDelay');
insert into tag_names values('OriginalReleaseTime');
insert into tag_names values('RecordingTime');
insert into tag_names values('ReleaseTime');
insert into tag_names values('TaggingTime');
insert into tag_names values('EncodedBy');
insert into tag_names values('Lyricist');
insert into tag_names values('FileType');
insert into tag_names values('PodcastID');
insert into tag_names values('InvolvedPeople');
insert into tag_names values('Grouping');
insert into tag_names values('Title');
insert into tag_names values('Subtitle');
insert into tag_names values('InitialKey');
insert into tag_names values('PodcastKeywords');
insert into tag_names values('Language');
insert into tag_names values('Length');
insert into tag_names values('MusicianCredits');
insert into tag_names values('Media');
insert into tag_names values('Mood');
insert into tag_names values('OriginalAlbum');
insert into tag_names values('OriginalFileName');
insert into tag_names values('OriginalLyricist');
insert into tag_names values('OriginalArtist');
insert into tag_names values('FileOwner');
insert into tag_names values('Artist');
insert into tag_names values('Band');
insert into tag_names values('Conductor');
insert into tag_names values('InterpretedBy');
insert into tag_names values('PartOfSet');
insert into tag_names values('ProducedNotice');
insert into tag_names values('Publisher');
insert into tag_names values('Track');
insert into tag_names values('InternetRadioStationName');
insert into tag_names values('InternetRadioStationOwner');
insert into tag_names values('AlbumArtistSortOrder');
insert into tag_names values('AlbumSortOrder');
insert into tag_names values('ComposerSortOrder');
insert into tag_names values('PerformerSortOrder');
insert into tag_names values('TitleSortOrder');
insert into tag_names values('ISRC');
insert into tag_names values('EncoderSettings');
insert into tag_names values('SetSubtitle');
insert into tag_names values('UserDefinedText');
insert into tag_names values('TermsOfUse');
insert into tag_names values('Lyrics');
insert into tag_names values('CommercialURL');
insert into tag_names values('CopyrightURL');
insert into tag_names values('PodcastURL');
insert into tag_names values('FileURL');
insert into tag_names values('ArtistURL');
insert into tag_names values('SourceURL');
insert into tag_names values('InternetRadioStationURL');
insert into tag_names values('PaymentURL');
insert into tag_names values('PublisherURL');
insert into tag_names values('UserDefinedURL');
insert into tag_names values('OlympusDSS');
