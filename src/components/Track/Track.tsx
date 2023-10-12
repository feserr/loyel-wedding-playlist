import './Track.css';

import React, { useEffect, useState } from 'react';

import { TrackElement } from '../../@types/Track';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import Heart from '@react-sandbox/heart';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { weddingBackendClient } from '../../util/ApiClients';

interface TrackProps {
  track: TrackElement;
  index: number;
  userId: string;
  onChanged: (index: number) => void;
}

export default function Track({ track, index, userId, onChanged }: TrackProps) {
  const [showError, setShowError] = useState(false);
  const [likedBy, setLikedBy] = useState<string[]>([]);

  const addTrack = async function (event: React.MouseEvent<HTMLElement>) {
    await weddingBackendClient.post(`/api/track/${track.id}`,
      {
        uri: track.uri,
        name: track.name,
        album: track.album,
        artist: track.artist
      })
      .catch(() => setShowError(true));

    onChanged(index);
  }

  const removeTrack = async function (event: React.MouseEvent<HTMLElement>) {
    await weddingBackendClient.delete(`/api/track/${track.id}`)
      .then(() => undefined)
      .catch(() => undefined);

    onChanged(index);
  }

  const likeTrack = async function () {
    if (userId === '') return;

    await weddingBackendClient.post('/api/like',
      {
        spotifyTrackId: track.id
      })
      .catch(() => undefined);

    const data = await weddingBackendClient.get(`/api/like/${track.id}`)
      .then(response => response.data)
      .catch(() => undefined);

    setLikedBy(data.likes);
  }

  const renderAddRemoveAction = function () {
    if (track.addedById === '') {
      return (
        <Button variant='link' disabled={track.disable} onClick={addTrack}><FontAwesomeIcon icon={faPlus} /></Button>
      );
    }

    if (userId === track.addedById) {
      return (
        <Button className='pt-0' variant='link' onClick={removeTrack}><FontAwesomeIcon icon={faTrash} /></Button>
      );
    }
  }

  const renderLike = function () {
    return (<Heart width={24}
      height={24} active={likedBy.includes(userId)} onClick={likeTrack} />);
  }

  useEffect(() => {
    setLikedBy(track.likes);
  }, [onChanged])

  return (
    <div className='col'>
      <div className='card'>
        <div className='card-body'>
          <h5 className='card-title cut-text'><a href={track.uri}>
            <FontAwesomeIcon icon={faSpotify} /></a> {track.name}
          </h5>
          <div className='card-text'>
            <h6 className='cut-text'>{track.artist} | {track.album}</h6>
            {track.addedById !== '' ? <p className='cut-text'>{track.addedByName}</p> : <></>}
          </div>
          {track.addedById !== '' ?
            <Row>
              <Col xs={{ span: 2, offset: 0 }}>{renderLike()}</Col>
              <Col xs={{ span: 1, offset: 0 }}>{likedBy.length}</Col>
              <Col xs={{ span: 2, offset: 6 }} sm={{ span: 2, offset: 5 }} > {renderAddRemoveAction()}</Col>
            </Row>
            : <>{renderAddRemoveAction()}</>}
        </div>
      </div>
      {
        showError &&
        <Alert show={showError} variant='danger'
          onClose={() => setShowError(false)} dismissible>Limite excedido.</Alert>
      }
    </div >
  );
}
