import React, { useState, useEffect } from 'react';
import '../components/Support/EmergencyContacts.css';
import '../components/Support/Support.css'; 

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', mobileNumber: '', gender: 'other' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get token from localStorage
  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchContacts();
  }, []);

  // Function to fetch contacts from the API
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
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Your session has expired. Please log in again.');
          // Optionally redirect to login page here
          return;
        }
        throw new Error('Failed to fetch contacts');
      }

      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to load contacts');
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load emergency contacts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handles changes in the form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const {firstName, lastName, mobileNumber, gender} = form;

  // Functions to validate names / phone numbers
  const validateName = (name) => /^[A-Za-z\s\-]{2,30}$/.test(name.trim());
  const validateMobile = (number) => /^\+?\d{10,15}$/.test(number.trim());
  
  // Function that will be used to capitalize names
  const capitalizeWords = (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Make sure all fields are filled
    if (!firstName || !lastName || !mobileNumber || !gender) {
      return setError('All fields are required.');
    }
    if (!validateName(lastName) || !validateName(firstName)) {
      return setError('Names must be 2–30 letters and only contain letters, spaces, or hyphens.');
    }
    if (!validateMobile(mobileNumber)) {
      return setError('Please enter a valid mobile number (10–15 digits, optional +).');
    }

    const formattedForm = {
      firstName: capitalizeWords(firstName),
      lastName: capitalizeWords(lastName),
      mobileNumber: mobileNumber.replace(/\s+/g, ''),
      gender
    };
    
    try {
      const token = getAuthToken();
      if (!token) {
        setError('You must be logged in to save contacts');
        return;
      }

      // Decide method based on whether user is editing contact or not
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `http://localhost:5001/api/v1/emergency-contacts/${editingId}`
        : 'http://localhost:5001/api/v1/emergency-contacts';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedForm)
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Your session has expired. Please log in again.');
          return;
        }
        throw new Error('Failed to save contact');
      }

      const data = await res.json();
      if (!data.success) {
        return setError(data.message || 'Something went wrong');
      }
      
      // Refresh contacts and reset the form
      await fetchContacts();
      setForm({ firstName: '', lastName: '', mobileNumber: '', gender: 'other' });
      setEditingId(null);
      setError(null);
    } catch (err) {
      console.error('Error saving contact:', err);
      setError('Error saving contact. Please try again later.');
    }
  };

  // Handles editing of contacts
  const handleEdit = (contact) => {
    setForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      mobileNumber: contact.mobileNumber,
      gender: contact.gender
    });
    setEditingId(contact._id);
    setError(null);
  };

  // Handles deleting of contacts
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const token = getAuthToken();
      if (!token) {
        setError('You must be logged in to delete contacts');
        return;
      }

      const res = await fetch(`http://localhost:5001/api/v1/emergency-contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });      

      if (!res.ok) {
        if (res.status === 401) {
          setError('Your session has expired. Please log in again.');
          return;
        }
        throw new Error('Failed to delete contact');
      }

      const data = await res.json();
      if (data.success) {
        setContacts(contacts.filter(c => c._id !== id));
        if (editingId === id) {
          setForm({ firstName: '', lastName: '', mobileNumber: '', gender: 'other' });
          setEditingId(null);
        }
      } else {
        setError(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Error deleting contact. Please try again later.');
    }
  };

  // Gets avatar based on the contact's gender
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
    return <div className="emergency-contact-container"><p>Loading contacts...</p></div>;
  }

  return (
    <div className="bg-[#E6F7F4] emergency-contact-container">
      <h3 className="page-title">Emergency Contacts</h3>

      <form onSubmit={handleSubmit} className="contact-form">
        <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
        <input name="mobileNumber" placeholder="Mobile Number" value={form.mobileNumber} onChange={handleChange} required />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button
          type="submit"
          className="btn green"
          disabled={!editingId && contacts.length >= 2}
        >
          {editingId ? 'Update Contact' : 'Add Contact'}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn red"
            onClick={() => {
              setForm({ firstName: '', lastName: '', mobileNumber: '', gender: 'other' });
              setEditingId(null);
              setError(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      {contacts.length === 0 ? (
        <p>No emergency contacts yet.</p>
      ) : (
        <ul className="contact-list">
          {contacts.map(contact => (
            <li key={contact._id} className="helplineCard">
              <img
                src={getAvatar(contact.gender)}
                alt={`${contact.gender} avatar`}
                className="avatar"
              />
              <span className="contact-name">
                {contact.firstName} {contact.lastName}
              </span>
              <a href={`tel:${contact.mobileNumber}`} className="phone">
                {contact.mobileNumber}
              </a>
              <p style={{ fontWeight: 'bold', marginTop: '4px' }}>({contact.gender})</p>

              <div className="button-group" style={{ marginTop: '12px' }}>
                <button onClick={() => handleEdit(contact)} className="btn green">Edit</button>
                <button onClick={() => handleDelete(contact._id)} className="btn red">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmergencyContacts;