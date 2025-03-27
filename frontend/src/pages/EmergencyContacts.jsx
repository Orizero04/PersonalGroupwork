// DONT FORGET TO ADD SOME BETTER VALIDATION 


// This page allows users to add , edit , delete emergency contacts 
// users  have up to 2 emeregency contacts

import React, { useState, useEffect } from 'react';
import '../components/Support/EmergencyContacts.css';
import '../components/Support/Support.css'; // ✅ Reuse helplineCard styling

 
const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', mobileNumber: '', gender: 'other' });
  const [editingId, setEditingId] = useState(null);// stors form input values 
  const [error, setError] = useState(null); // holds error messahes

  useEffect(() => {
    fetchContacts();
  }, []);

  // function to fetch contacts from the support databse
  const fetchContacts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/emergency-contacts');
      const data = await res.json();
      if (data.success) setContacts(data.data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };
// handles changes in the form 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handles adding and makking changes 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // make sure all fields are filled
    if (!form.firstName || !form.lastName || !form.mobileNumber || !form.gender) {
      return setError('All fields are required.');
    }

    try {
      // decides methos base if uer is editing contact or not
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `http://localhost:5000/api/v1/emergency-contacts/${editingId}`
        : 'http://localhost:5000/api/v1/emergency-contacts';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!data.success) {
        return setError(data.message || 'Something went wrong');
      }
      // refresh contacts and resets the form 
      await fetchContacts();
      setForm({ firstName: '', lastName: '', mobileNumber: '', gender: 'other' });
      setEditingId(null);
      setError(null);
    } catch (err) {
      console.error('Error saving contact:', err);
      setError('Error saving contact');
    }
  };
// handles editing of contacts
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
// handles deleting of contacts
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/v1/emergency-contacts/${id}`, {
        method: 'DELETE'
      });

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
      setError('Error deleting contact');
    }
  };
// gets avatar based on the contacts gender 
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
    <div className="emergency-contact-container">
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
