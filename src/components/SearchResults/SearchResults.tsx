import './SearchResults.css';

import TrackList from '../TrackList/TrackList';
import { TrackElement } from '../../@types/Track';

interface SearchResultsProps {
  userId: string;
  searchResults: TrackElement[];
  onChanged: (index: number) => void;
}

export default function SearchResults({ userId, searchResults, onChanged }: SearchResultsProps) {
  return (
    <TrackList userId={userId} tracks={searchResults} onChanged={onChanged} />
  );
}
