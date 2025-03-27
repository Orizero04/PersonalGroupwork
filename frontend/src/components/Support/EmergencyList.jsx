import React, { useEffect, useState } from 'react';

// component to show the list of emergergency contacts
const EmergencyList = () => {

  // state to store the contacts
  const [contacts, setContacts] = useState([]);
  // state to store the error message
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/emergency-contacts');
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setContacts(data.data);
        } else {
          throw new Error(data.message || 'Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to load emergency contacts.');
      }
    };

    fetchContacts();
  }, []); // empty the array so it only runs once 

  // function to chose avatar image based on gender 
  const getAvatar = (gender) => {
    switch (gender) {
      case 'male':
        return '/Avatars/male.png';
      case 'female':
        return '/Avatars/female.png';
      default:
        return '/Avatars/other.png';
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}

      {contacts && contacts.length === 0 ? (
        <p>No emergency contacts added yet.</p>
      ) : (
        <ul className="contact-list">
          {contacts?.map((contact) => (
            <li key={contact._id}>
              <span className="contact-name">
                {contact.firstName} {contact.lastName}
              </span>

              <img
                src={getAvatar(contact.gender)}
                alt={`${contact.gender} avatar`}
                className="avatar"
              />

              <a href={`tel:${contact.mobileNumber}`} className="phone">
                {contact.mobileNumber}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmergencyList;
