import React from 'react';

const SERVER = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
// const SERVER = 'http://localhost:3001';

export default function Participant({ participant, callback, updateState }) {
  const onDelete = async () => {
    const res = await fetch(
      SERVER +
        '/meeting/' +
        participant.MeetingId +
        '/participanti/' +
        participant.id,
      {
        method: 'DELETE',
      }
    );
    if (res.ok) updateState();
    else alert('Error');
  };
  return (
    <div className="card secundar m-3 p-2">
      <h5 className="card-title">Participant :</h5>
      <div className="card-body">
        <h6>Name: {participant.nume}</h6>
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => callback(participant)}
          >
            Edit
          </button>
          <button className="btn btn-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
