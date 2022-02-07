import React, { useEffect, useState } from 'react';
import Meeting from './Meeting';
import './index.css';

const SERVER = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
// const SERVER = 'http://localhost:3001';

export default function App() {
  const [meetings, setMeetings] = useState([]);
  const [descriere, setDescriere] = useState('');
  const [url, setUrl] = useState('');
  const [id, setId] = useState(null);
  const [showInput, setShowInput] = useState(false);

  const downloadMeetings = async () => {
    const res = await fetch(SERVER + '/meeting/all');
    const data = await res.json();
    setMeetings(data);
  };

  useEffect(() => {
    downloadMeetings();
  }, []);

  const onFormSubmit = async () => {
    if (descriere.length < 3)
      return alert('Description must have at least 3 letters');
    if (!id) {
      const response = await fetch(SERVER + '/meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descriere, url }),
      });
      if (!response.ok) alert('Error');
    } else {
      const response = await fetch(SERVER + '/meeting/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descriere, url }),
      });
      if (!response.ok) alert('Error');
    }
    await downloadMeetings();
    setShowInput(false);
    setId(null);
    setUrl('');
    setDescriere('');
  };

  const getMeeting = (meet) => {
    setDescriere(meet.descriere);
    setUrl(meet.url);
    setId(meet.id);
    setShowInput(true);
  };

  const ComponentInput = () => {
    return (
      <div className="card formular">
        <div>
          <label style={{ margin: '10px' }}>Description:</label>
          <input
            style={{ margin: '10px' }}
            placeholder="description"
            value={descriere}
            onChange={(e) => setDescriere(e.target.value)}
          ></input>
        </div>
        <div>
          <label style={{ margin: '10px' }}>Url:</label>
          <input
            style={{ margin: '10px' }}
            placeholder="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          ></input>
        </div>
        <button className="btn btn-success" onClick={() => onFormSubmit()}>
          Trimite
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            setShowInput(false);
            setDescriere('');
            setId(null);
            setUrl('');
          }}
        >
          Inchide
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <h3 className="titlu">Meetings:</h3>
      <button
        className="btn btn-success"
        onClick={() => {
          setShowInput(true);
        }}
      >
        Add meeting
      </button>
      {showInput && ComponentInput()}
      <div className="main m-3">
        {meetings.length > 0 &&
          meetings.map((meeting) => (
            <Meeting
              meeting={meeting}
              key={meeting.id}
              callback={getMeeting}
              updateState={downloadMeetings}
            />
          ))}
      </div>
    </div>
  );
}
