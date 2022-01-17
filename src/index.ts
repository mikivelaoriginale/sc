import {
  PlaylistExample,
  PlaylistsTrackExample,
  SuggestionExample,
  TrackExample,
  UsersPlaylistExample,
  UsersTrackExample,
} from './examples';

export type Track = typeof TrackExample;
export type Playlist = typeof PlaylistExample;
export type PlaylistTrack = typeof PlaylistsTrackExample;
export type UsersTrack = typeof UsersTrackExample;
export type UsersPlaylist = typeof UsersPlaylistExample;
export type Suggestion = typeof SuggestionExample;

import { setApiKey, getOptions, httpsClient } from './httpsClient';

const HOST = 'https://api-v2.soundcloud.com';

async function getUserTracks(
  userId: string,
  limit: any = 10
): Promise<UsersTrack[]> {
  const requestOptions = getOptions(
    `${HOST}/users/${userId}/tracks?limit=${limit}`
  );
  const rawResponse = await httpsClient.get(requestOptions);
  const userTracks: UsersTrack[] = JSON.parse(rawResponse).collection;
  return userTracks;
}

async function getUsersPlaylists(
  userId: string,
  limit: any = 20
): Promise<UsersPlaylist[]> {
  //playlists_without_albums
  //playlists
  const requestOptions = getOptions(
    `${HOST}/users/${userId}/playlists_without_albums?limit=${limit}`
  );
  const rawData = await httpsClient.get(requestOptions);
  const mappedPlaylists: UsersPlaylist[] = JSON.parse(rawData).collection;
  return mappedPlaylists;
}

async function getSuggestions(
  searchString: string,
  limit: any = 10
): Promise<Suggestion[]> {
  const requestOptions = getOptions(
    `${HOST}/search/queries?q=${searchString}&limit=${limit}`
  );
  const rawData = await httpsClient.get(requestOptions);
  const suggestions: Suggestion[] = JSON.parse(rawData).collection;
  return suggestions;
}

async function getTrackInfo(trackId: string): Promise<Track> {
  // ili return (await getTracksInfo([id]))[0];
  const requestOptions = getOptions(`${HOST}/tracks/${trackId}`);
  const rawData = await httpsClient.get(requestOptions);
  const unmappedTrackInfo: Track = JSON.parse(rawData);
  return unmappedTrackInfo;
}

async function getPlaylistTrackIds(playlistId: string): Promise<string[]> {
  const requestOptions = getOptions(`${HOST}/playlists/${playlistId}`);
  const rawData = await httpsClient.get(requestOptions);
  const playlistInfo: Playlist = JSON.parse(rawData);
  const trackIdsArray = playlistInfo.tracks.map((item: any) => item.id);
  return trackIdsArray;
}

async function getTracksInfo(
  trackIdsArray: string[]
): Promise<PlaylistTrack[]> {
  const uriEncodedCommaSeparatedTrackIds = encodeURIComponent(
    trackIdsArray.join(',')
  );
  const requestOptions = getOptions(
    `${HOST}/tracks?ids=${uriEncodedCommaSeparatedTrackIds}`
  );
  const rawData = await httpsClient.get(requestOptions);
  const tracksInfos: PlaylistTrack[] = JSON.parse(rawData);
  return tracksInfos;
}

async function getPlaylistItems(id: string): Promise<PlaylistTrack[]> {
  const trackIdsArray = await getPlaylistTrackIds(id);
  const playlistItems: PlaylistTrack[] = await getTracksInfo(trackIdsArray);
  return playlistItems;
}

async function search(searchString: string, limit: any = 10): Promise<Track[]> {
  const encodedSearchString = encodeURIComponent(searchString);
  const requestOptions = getOptions(
    `${HOST}/search/tracks?q=${encodedSearchString}&limit=${limit}`
  );
  const rawData = await httpsClient.get(requestOptions);
  const body = JSON.parse(rawData);
  const unmappedTracks: Track[] = body.collection;
  return unmappedTracks;
}

const getUrlFromTrackInfo = (item: Track | UsersTrack): string | undefined => {
  const url = item.media.transcodings.find(
    item => item.format.protocol === 'progressive'
  )?.url;

  return url;
};

const getDirectUrls = async (trackId: string, fromUrl: string | undefined) => {
  const url = fromUrl || getUrlFromTrackInfo(await getTrackInfo(trackId));

  if (!url) {
    throw new Error('Unable to fetch');
  }

  const requestOptions = getOptions(url);

  const rawData = await httpsClient.get(requestOptions);
  const body: { url: string } = JSON.parse(rawData);
  const directUrl = body.url;
  const directUrls = [{ url: directUrl, mimeType: 'audio/mpeg' }];
  return directUrls;
};

const ping = async () => {
  try {
    const response = await search('idkjeffery', 2);
    if (response) {
      return true;
    }
    {
      throw new Error('Unable to ping.');
    }
  } catch (e) {
    throw new Error(e as any);
  }
};

export default {
  ping,
  search,
  getTrackInfo,
  getPlaylistItems,
  getChannelItems: getUserTracks,
  getChannelPlaylists: getUsersPlaylists,
  getSuggestions,
  getDirectUrls,
  setApiKey,
};
