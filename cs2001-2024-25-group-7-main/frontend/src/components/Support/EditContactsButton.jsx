
// this component is a button that redirect the user to the page where they can edit their emergency contacts 
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyButton = () => {
  const navigate = useNavigate(); // hook to navigate to  another page 

  return (
    <button
      onClick={() => navigate('/emergency-contacts')}
      style={{
        width: '100%',
        maxWidth: '260px',
        marginTop: '16px',
        padding: '10px 20px',
        fontSize: '1em',
        fontWeight: 'bold',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        alignSelf: 'center',
        display: 'block'
      }}
    >
      Edit Emergency Contacts
    </button>
  );
};

export default EmergencyButton;
