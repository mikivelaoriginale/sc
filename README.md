Module for fetching results from soundcloud.

Install with yarn or npm:

```
yarn add @mikivela/sc-scrappy
```

(or npm)
Import with with

```
import scrappy from "@mikivela/sc-scrappy"
```

or

```
const scrappy = require("@mikivela/sc-scrappy")
```

## Requires

| title     | type   |
| --------- | ------ |
| client_id | string |

## Usage

First supply a client_id with `setApiKey`:

```
scrappy.setApiKey(yourApiKey);
```

Then, you're good to go. You can use any of the provided functions. You only need to supply this key once, since it is shared.

## Available calls

```ts
ping(): Promise<void>
search(searchString: string, limit?: any): Promise<Track[]>;
getTrackInfo(trackId: string): Promise<Track>;
getUserTracks(userId: string, limit?: any): Promise<UsersTrack[]>;
getUsersPlaylists(userId: string, limit?: any): Promise<UsersPlaylist[]>;
getPlaylistItems(id: string): Promise<PlaylistTrack[]>;
getSuggestions(searchString: string, limit?: any): Promise<Suggestion[]>;
```

Examples of responses can be found in `/examples`.

### scrappy.ping()

Pings to check if your clientId and connection is working.

### scrappy.search(searchString, limit)

Search for tracks by a text query.
Returns: array of TrackInfos that meet search criteria.

| parameters   |        |
| ------------ | ------ |
| searchString | string |
| limit        | number |

### scrappy.getTrackInfo(trackId, limit)

Returns a TrackInfo for a specific track.
TrackId can be extracted from `.search()` results.

| parameters |        |
| ---------- | ------ |
| trackId    | string |
| limit      | number |

### scrappy.getChannelItems(channelId, limit) or scrappy.getChannelPlaylists(channelId, limit)

Retuns Tracks or Playlists for a channel. (user)

### scrappy.getPlaylistItems(playlistId)

Returns an array of TrackInfos for tracks in a playlist.
`playlistId` can be extracted from `.getChannelPlaylists()`.

| parameters |        |
| ---------- | ------ |
| playlistId | string |

### scrappy.getSuggestions(searchString)

Returns text input suggestion results for a search string.

| parameters   |        |
| ------------ | ------ |
| searchString | string |

### scrappy.getDirectUrls(trackId)

Returns array of audio formats for a track.<br/>
Response:

```js
{
  url: string;
  type: mimeType;
}
```

TrackId can be extracted from `.search()` call.

| parameters |        |
| ---------- | ------ |
| trackId    | string |
