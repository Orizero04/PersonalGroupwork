
// This component is used to show the list of helplines
// it shows the name, description and contact information of the helpline

import React from 'react';
import './Support.css'; 
const HelplinesList = ({ helplines }) => {
    // if theres no helplines it shows a fallback message
  if (!helplines || helplines.length === 0) {
    return <p>No helplines available.</p>;
  }

  return (
    <ul className="helplineList">
      {helplines.map((helpline, index) => (
        <li key={index} className="helplineCard">
          <h3 className="helplineName">{helpline.name}</h3>
          <p className="helplineDescription">{helpline.description}</p>

          {helpline.contact.voice?.number && (
            <p className="helplineContact">
              📞{' '}
              <a href={`tel:${helpline.contact.voice.number}`} className="helplineLink">
                {helpline.contact.voice.number}
              </a>
            </p>
          )}

          {helpline.contact.text?.number && (
            <p className="helplineContact">
              💬{' '}
              <a href={`sms:${helpline.contact.text.number}`} className="helplineLink">
                {helpline.contact.text.number}
              </a>
            </p>
          )}

          {helpline.contact.email && (
            <p className="helplineContact">
              ✉️{' '}
              <a href={`mailto:${helpline.contact.email}`} className="helplineLink">
                {helpline.contact.email}
              </a>
            </p>
          )}

          {helpline.contact.webchat?.url && (
            <p className="helplineContact">
              🌐{' '}
              <a
                href={helpline.contact.webchat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="helplineLink"
              >
                Click here for Webchat
              </a>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
};

export default HelplinesList;
