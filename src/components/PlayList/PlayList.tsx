import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

import TrackList from '../TrackList/TrackList';
import { PlaylistData } from '../../@types/PlaylistData';
import { TrackData, TrackElement } from '../../@types/Track';
import { Alert } from 'react-bootstrap';
import { baseWeddingBackendClient } from '../../util/ApiClients';

interface PlaylistProps {
  userId: string;
}

export default function Playlist({ userId }: PlaylistProps) {
  const [playlist, setPlaylist] = useState<TrackElement[]>([]);

  const fetchAllData = async () => {
    const data = await baseWeddingBackendClient.get('/api/track/')
      .then((response: AxiosResponse<PlaylistData>) => response.data)
      .catch(() => undefined);
    if (!data) return;

    const tracks: TrackElement[] = await Promise.all(data.tracks.map(async (track: TrackData) => {
      return {
        id: track.id,
        uri: track.uri,
        name: track.name,
        album: track.album,
        artist: track.artist,
        addedById: track.addedById,
        addedByName: track.addedByName,
        likes: track.likes,
        userRoleColor: track.userRoleColor,
        disable: true,
      }
    }));

    setPlaylist(tracks);
  }

  const onChanged = async function () {
    fetchAllData();
  }

  useEffect(() => {
    fetchAllData();
  }, [userId]);

  return (
    <div className='container'>
      <div className='p-2'>
        {userId === '' ?
          <Alert variant='info'>Inicia sesión para valorar canciones y modificar las tuyas</Alert> :
          <></>
        }
        <h2>Canciones</h2>
        <TrackList tracks={playlist} userId={userId} onChanged={onChanged} />
      </div>
    </div>
  );
}
