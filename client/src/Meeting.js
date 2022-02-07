import React, { useState } from 'react';
import Participant from './Participant';

const SERVER = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
// const SERVER = 'http://localhost:3001';

export default function Meeting({ meeting, callback, updateState }) {
  const onDelete = async () => {
    const res = await fetch(SERVER + '/meeting/' + meeting.id, {
      method: 'DELETE',
    });
    if (res.ok) await updateState();
    else alert('eroare');
  };

  const [nume, setNume] = useState('');
  const [id, setId] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [showParticipanti, setShowParticipanti] = useState(false);

  const onFormSubmit = async () => {
    if (nume.length < 5) return alert('Name is at least 5 letters long');
    if (id == null) {
      const response = await fetch(
        SERVER + '/meeting/' + meeting.id + '/participanti',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nume }),
        }
      );
      if (!response.ok) alert('Error');
      else {
        const data = await response.json();
        meeting.Participants.push(data);
      }
    } else {
      const response = await fetch(
        SERVER + '/meeting/' + meeting.id + '/participanti/' + id,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nume }),
        }
      );
      if (!response.ok) alert('Error');
      else updateState();
    }
    setShowInput(false);
    setNume('');
    setId(null);
    setShowParticipanti(true);
  };

  const getParticipant = (participant) => {
    setNume(participant.nume);
    setId(participant.id);
    setShowInput(true);
  };

  const ComponentInput = () => {
    return (
      <div className="formular card">
        <div>
          <label style={{ margin: '10px' }}>Name:</label>
          <input
            style={{ margin: '10px' }}
            placeholder="name"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
          ></input>
        </div>
        <button className="btn btn-success" onClick={() => onFormSubmit()}>
          Submit
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            setShowInput(false);
            setId(null);
            setNume('');
          }}
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="card m-3">
      <div className="card-body">
        {showInput && ComponentInput()}
        <div>
          <h5 className="card-title">Description: {meeting.descriere}</h5>
          <h5 className="card-title">Url: {meeting.url}</h5>
          <h5 className="card-title">Date: {meeting.createdAt}</h5>
        </div>
        <button className="btn btn-secondary" onClick={() => callback(meeting)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={onDelete}>
          Delete
        </button>
        <button className="btn btn-success" onClick={() => setShowInput(true)}>
          Add participant
        </button>
        <br />
        <p
          className="card-link"
          onClick={() => setShowParticipanti(!showParticipanti)}
        >
          Show participants
        </p>
        {meeting.Participants.length > 0 && showParticipanti && (
          <div>
            {meeting.Participants.map((participant) => (
              <Participant
                key={participant.id}
                participant={participant}
                callback={getParticipant}
                updateState={updateState}
              />
            ))}
          </div>
        )}
        {meeting.Participants.length === 0 && showParticipanti && (
          <p>There are no participants</p>
        )}
      </div>
    </div>
  );
}
