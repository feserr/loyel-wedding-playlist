export type TrackData = {
  id: string;
  uri: string;
  name: string;
  album: string;
  artist: string;
  spotifyTrackId: string;
  spotifyUserId: string;
  spotifyDisplayName: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
};

export type TrackElement = {
  id: string;
  uri: string;
  name: string;
  album: string;
  artist: string;
  addedByUserId: string;
  addedByDisplayName: string;
  likes: string[];
  disable: boolean;
}
