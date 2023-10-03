import './SearchResults.css';

import { Form } from 'react-bootstrap';

import TrackList from '../TrackList/TrackList';
import { TrackElement } from '../../@types/Track';

interface SearchResultsProps {
  userId: string;
  searchResults: TrackElement[];
  onChanged: () => void;
}

export default function SearchResults({ userId, searchResults, onChanged }: SearchResultsProps) {
  return (
    <TrackList userId={userId} tracks={searchResults} onChanged={onChanged} />
  );
}
