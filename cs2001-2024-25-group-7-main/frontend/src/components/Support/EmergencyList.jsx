import React, { useEffect, useState } from 'react';

// Component to show the list of emergency contacts
const EmergencyList = () => {
  // State to store the contacts
  const [contacts, setContacts] = useState([]);
  // State to store the error message
  const [error, setError] = useState(null);
  // State to track loading state
  const [loading, setLoading] = useState(true);

  // Get token from localStorage
  const getAuthToken = () => localStorage.getItem('token');
  
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        if (!token) {
          setError('You must be logged in to view emergency contacts');
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5001/api/v1/emergency-contacts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError('Your session has expired. Please log in again.');
            return;
          }
          throw new Error('Failed to fetch contacts');
        }

        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setContacts(data.data);
          setError(null);
        } else {
          throw new Error(data.message || 'Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setError('Failed to load emergency contacts.');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []); 

  // Function to choose avatar image based on gender 
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

  if (loading) {
    return <div><p>Loading contacts...</p></div>;
  }

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