import axios, { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';

import TrackList from '../TrackList/TrackList';
import { PlaylistData } from '../../@types/PlaylistData';
import { TrackData, TrackElement } from '../../@types/Track';
import { Alert } from 'react-bootstrap';

interface PlaylistProps {
  userId: string;
}

export default function Playlist({ userId }: PlaylistProps) {
  const [playlist, setPlaylist] = useState<TrackElement[]>([]);

  const fetchData = useCallback(async () => {
    const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/track/`)
      .then((response: AxiosResponse<PlaylistData>) => response.data)
      .catch(err => undefined);
    if (!data) return;

    const tracks: TrackElement[] = await Promise.all(data.tracks.map(async (track: TrackData) => {
      return {
        id: track.id,
        uri: track.uri,
        name: track.name,
        album: track.album,
        artist: track.artist,
        addedByUserId: track.spotifyUserId,
        addedByDisplayName: track.spotifyDisplayName,
        likes: track.likes,
        disable: true,
      }
    }));

    setPlaylist(tracks);
  }, [setPlaylist]);

  const onChanged = async function () {
    fetchData();
  }

  useEffect(() => {
    onChanged();
  }, [userId]);

  return (
    <div className="container">
      <div className="p-2">
        {userId === "" ?
          <Alert variant='info'>Inicia sesión para valorar canciones y modificar las tuyas</Alert> :
          <></>
        }
        <h2>Canciones</h2>
        <TrackList tracks={playlist} userId={userId} onChanged={onChanged} />
      </div>
    </div>
  );
}
