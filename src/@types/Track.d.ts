export type TrackData = {
  id: string;
  uri: string;
  name: string;
  album: string;
  artist: string;
  spotifyTrackId: string;
  addedById: string;
  addedByName: string;
  likes: string[];
  userRoleColor: string;
  createdAt: string;
  updatedAt: string;
};

export type TrackElement = {
  id: string;
  uri: string;
  name: string;
  album: string;
  artist: string;
  addedById: string;
  addedByName: string;
  likes: string[];
  userRoleColor: string;
  disable: boolean;
}
