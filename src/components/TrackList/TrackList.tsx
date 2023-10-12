import './TrackList.css';

import type { TrackElement } from '../../@types/Track';
import Track from '../Track/Track';

type TrackListProps = {
  tracks: TrackElement[];
  userId: string;
  onChanged: (index: number) => void;
};

export default function TrackList({ tracks, userId, onChanged }: TrackListProps) {
  return (
    <div className='row row-cols-1 row-cols-xs-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4'>
      {tracks.map((track, index) =>
        <Track key={index} track={track} index={index} userId={userId} onChanged={onChanged} />)
      }
    </div>
  );
}
