// This is the main support page and shows helplines / emergency contacts

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmergencyList from '../components/Support/EmergencyList';
import EmergencyButton from '../components/Support/EditContactsButton';
import HelplinesList from '../components/Support/HelplinesList';
import ToggleSwitch from '../components/ToggleSwitch';
import '../components/Support/Support.css';

const Support = () => {
  const [helplines, setHelplines] = useState([]); // stores the helplienes stored from the backend 
  const [loading, setLoading] = useState(true); // loading state 
  const [error, setError] = useState(null); // error state 
  const [showOpenNow, setShowOpenNow] = useState(false); // toggle switch on or off 
  const navigate = useNavigate();

  useEffect(() => {
    const url = `http://localhost:5001/api/v1/helplines${showOpenNow ? '?openNow=true' : ''}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        // if the response is succesfull then the state is updated otherwise error message 
        if (data.success && Array.isArray(data.data)) {
          setHelplines(data.data);
        } else {
          setError('Failed to load helplines');
        }
      })
      .catch((error) => {
        console.error('Error fetching helplines:', error);
        setError(`Error fetching helplines: ${error.message}`);
      })
      .finally(() => setLoading(false));
  }, [showOpenNow]);

  if (loading) return <div className="bg-[#E6F7F4] loading">Loading...</div>; // show loading while data gets fetched 
  // dont even need this ngl 
  if (error) return <div className=" bg-[#E6F7F4] error">{error}</div>;

  return (
    <div className="bg-[#E6F7F4] supportLayout">
      {/* Left side – Helplines */}
      <div className="helplinesSection">
        <h2 className="subtitle">Available Helplines</h2>
        <div className="toggleLabel">
          <ToggleSwitch toggled={showOpenNow} onClick={() => setShowOpenNow(!showOpenNow)} />
          <span style={{ marginLeft: '10px', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Open now
          </span>
        </div>
        <HelplinesList helplines={helplines} />
      </div>

      <div className="emergencySection">
  <div className="emergencyColumn">
    <EmergencyList />
    <EmergencyButton />
  </div>
</div>
    </div>
  );
};

export default Support;
