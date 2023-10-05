import './Home.css';

import { useEffect, useState } from 'react';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';
import { TrackElement } from '../../@types/Track';
import axios from 'axios';
import { Alert } from 'react-bootstrap';

interface HomeProps {
  userId: string;
  resetLogin: () => void;
}

export default function Home({ userId, resetLogin }: HomeProps) {
  const [showError, setShowError] = useState(false);
  const [searchResults, setSearchResults] = useState<TrackElement[]>([]);
  const [remaingSongs, setRemainingSongs] = useState(0);

  const setTrackMetadata = async function (tracksData: TrackElement[]) {
    let disable = remaingSongs == 0;

    const tracks = await Promise.all(tracksData.map(async (track) => {
      const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/track/${track.id}`)
        .then(response => response.data)
        .catch(err => ({ trackInfo: { spotifyUserId: '', spotifyDisplayName: '', likes: [] } }));
      const trackInfo = data.trackInfo;

      return ({
        ...track,
        addedByUserId: trackInfo.spotifyUserId,
        addedByDisplayName: trackInfo.spotifyDisplayName,
        likes: trackInfo.likes,
        disable
      });
    }));

    setSearchResults(tracks);
  }

  const search = async function (searchTerm: string) {
    await updateRemainingSongs();
    const tracksData = await Spotify.search(searchTerm)
      .then(results => results)
      .catch(_ => {
        setShowError(true);
        resetLogin();
      });

    if (!tracksData) return;

    setTrackMetadata(tracksData);
  }

  const updateRemainingSongs = async function () {
    if (userId === "") {
      setRemainingSongs(0);
      return;
    }

    const userTracks = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}`)
      .then(response => response.data)
      .catch(err => undefined);

    const currentRemainingSongs = import.meta.env.VITE_MAX_SONGS - userTracks.tracks.length
    setRemainingSongs(currentRemainingSongs);
  }

  const onChanged = async function () {
    updateRemainingSongs()
  }

  const clearSearchResult = function () {
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
    setTrackMetadata(searchResults);
  }, [showError, remaingSongs, userId]);

  return (
    <div className="container">
      <div className="p-2">
        {showError &&
          <Alert show={showError} variant="danger" onClose={() => setShowError(false)} dismissible>Inicia la sesión para buscar.</Alert>}
        <h6>{`Canciones restantes: ${remaingSongs} / ${import.meta.env.VITE_MAX_SONGS}`}</h6>
        <SearchBar onSearch={search} onClearSearchResult={clearSearchResult} />
        <div style={{ paddingTop: '1rem' }}>
          <SearchResults userId={userId} searchResults={searchResults} onChanged={onChanged} />
        </div>
      </div>
    </div>
  );
}
