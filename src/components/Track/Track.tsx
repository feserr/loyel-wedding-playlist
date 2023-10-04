import './Track.css';

import React, { useContext, useEffect, useState } from 'react';

import { TrackElement } from '../../@types/Track';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import Heart from '@react-sandbox/heart';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';

interface TrackProps {
  track: TrackElement;
  userId: string;
  onChanged: () => void;
}

export default function Track({ track, userId, onChanged }: TrackProps) {
  const [showError, setShowError] = useState(false);
  const [likedBy, setLikedBy] = useState<string[]>([]);

  const addTrack = async function (event: React.MouseEvent<HTMLElement>) {
    const data = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/track/${track.id}`,
      {
        uri: track.uri,
        name: track.name,
        album: track.album,
        artist: track.artist,
        spotifyUserId: userId
      })
      .then(response => undefined)
      .catch(err => setShowError(true));

    onChanged();
  }

  const removeTrack = async function (event: React.MouseEvent<HTMLElement>) {
    const data = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/track/${track.id}&${userId}`)
      .then(response => undefined)
      .catch(err => undefined);

    onChanged();
  }

  const likeTrack = async function () {
    if (userId === "") return;

    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/like`,
      {
        spotifyTrackId: track.id,
        spotifyUserId: userId,
      })
      .then(response => undefined)
      .catch(err => undefined);

    const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/like/${track.id}`,)
      .then(response => response.data)
      .catch(err => undefined);

    setLikedBy(data.likes);
  }

  const renderAddRemoveAction = function () {
    if (track.addedByUserId === '') {
      return (
        <Button variant="link" disabled={track.disable} onClick={addTrack}><FontAwesomeIcon icon={faPlus} /></Button>
      );
    }

    if (userId === track.addedByUserId) {
      return (
        <a onClick={removeTrack}><FontAwesomeIcon icon={faTrash} /></a>
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
    <div className="col">
      <div className="card">
        <div className="card-body">
          <h5 className='card-title cut-text'><a href={track.uri}><FontAwesomeIcon icon={faSpotify} /></a> {track.name}</h5>
          <div className='card-text'>
            <h6 className='cut-text'>{track.artist} | {track.album}</h6>
            {track.addedByUserId !== "" ? <p className='cut-text'>{track.addedByUserId}</p> : <></>}
          </div>
          {track.addedByUserId !== "" ?
            <Row>
              {track.addedByUserId !== "" ?
                <>
                  <Col xs={{ span: 2, offset: 0 }}>{renderLike()}</Col>
                  <Col xs={{ span: 1, offset: 0 }}>{likedBy.length}</Col>
                </>
                : <></>}
              <Col xs={{ span: 2, offset: 6 }}>{renderAddRemoveAction()}</Col>
            </Row>
            : <>{renderAddRemoveAction()}</>}
        </div>
      </div>
      {showError &&
        <Alert show={showError} variant="danger" onClose={() => setShowError(false)} dismissible>Limite excedido.</Alert>}
    </div >
  );
}
