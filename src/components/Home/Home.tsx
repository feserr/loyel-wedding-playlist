import './Home.css';

import { useEffect, useState } from 'react';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';
import { TrackElement } from '../../@types/Track';
import { Alert } from 'react-bootstrap';
import { baseWeddingBackendClient, weddingBackendClient } from '../../util/ApiClients';

interface HomeProps {
  userId: string;
  userMaxSongs: number
}

export default function Home({ userId, userMaxSongs }: HomeProps) {
  const [showError, setShowError] = useState(false);
  const [searchResults, setSearchResults] = useState<TrackElement[]>([]);
  const [remaingSongs, setRemainingSongs] = useState(0);

  const setTrackMetadata = async (tracksData: TrackElement[], currentRemainingSongs: number, indexToChange: number) => {
    const disable = currentRemainingSongs == 0;

    const tracks = await Promise.all(tracksData.map(async (track, index) => {
      if (indexToChange !== index) {
        return ({
          ...track,
          disable
        });
      }

      const data = await baseWeddingBackendClient.get(`/api/track/${track.id}`)
        .then(response => response.data)
        .catch(() => ({ trackInfo: { addedById: '', addedByName: '', likes: [] } }));
      const trackInfo = data.trackInfo;

      return ({
        ...track,
        addedById: trackInfo.addedById,
        addedByName: trackInfo.addedByName,
        likes: trackInfo.likes,
        userRoleColor: trackInfo.userRoleColor,
        disable
      });
    }));

    setSearchResults(tracks);
  }

  const search = async (searchTerm: string) => {
    const currentRemainingSongs = await updateRemainingSongs();

    const tracksData = await Spotify.search(searchTerm)
      .then(results => results)
      .catch(() => {
        setShowError(true);
      });
    if (!tracksData) return;

    await setTrackMetadata(tracksData, currentRemainingSongs, -1);
  }

  const updateRemainingSongs = async () => {
    if (userId === '') {
      setRemainingSongs(0);
      return 0;
    }

    const userTracks = await weddingBackendClient.get('/api/user')
      .then(response => response.data)
      .catch(() => undefined);

    const currentRemainingSongs = userMaxSongs - userTracks.tracks.length;
    setRemainingSongs(currentRemainingSongs);
    return currentRemainingSongs;
  }

  const onChanged = async (index: number) => {
    const currentRemainingSongs = await updateRemainingSongs();
    await setTrackMetadata(searchResults, currentRemainingSongs, index);
  }

  const clearSearchResult = () => {
    setSearchResults([]);
  }

  useEffect(() => {
    if (showError) {
      window.setTimeout(() => {
        setShowError(false);
      }, 5000)

      return;
    }

    updateRemainingSongs();
  }, [showError, remaingSongs, userId]);

  return (
    <div className='container'>
      <div className='p-2'>
        {showError &&
          <Alert show={showError} variant='danger'
            onClose={() => setShowError(false)} dismissible>Error buscando, vuelve a intentarlo.</Alert>}
        <h6>{`Canciones restantes: ${remaingSongs} / ${userMaxSongs}`}</h6>
        <SearchBar onSearch={search} onClearSearchResult={clearSearchResult} />
        <div style={{ paddingTop: '1rem' }}>
          <SearchResults userId={userId} searchResults={searchResults} onChanged={onChanged} />
        </div>
      </div>
    </div>
  );
}
