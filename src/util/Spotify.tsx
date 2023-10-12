import axios from 'axios';
import { TrackElement } from '../@types/Track';

export default class Spotify {
  static async search(searchTerm: string) {
    const searchResult = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/search/${searchTerm}`)
      .then(data => data.data);
    if (!searchResult.tracks) throw new Error('Failed to search');

    return searchResult.tracks.map((track: TrackElement) => (
      {
        ...track,
        disable: false
      }
    ));
  }
}
