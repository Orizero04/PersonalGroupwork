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
          <p className="helplineMainDescription">{helpline.description}</p>

          {helpline.contact.voice?.value && (
            <p className="helplineContact">
              <span className="contactRow">
                📞{' '}
                <a href={`tel:${helpline.contact.voice.value}`} className="helplineLink">
                  {helpline.contact.voice.value}
                </a>{' '}
                <span className="contactInstruction">{helpline.contact.voice.instruction}</span>
              </span>
            </p>
          )}

          {helpline.contact.text?.value && (
            <p className="helplineContact">
              <span className="contactRow">
                💬{' '}
                <a href={`sms:${helpline.contact.text.value}`} className="helplineLink">
                  {helpline.contact.text.value}
                </a>{' '}
                <span className="contactInstruction">{helpline.contact.text.instruction}</span>
              </span>
            </p>
          )}

          {helpline.contact.email?.value && (
            <p className="helplineContact">
              <span className="contactRow">
                ✉️{' '}
                <a href={`mailto:${helpline.contact.email.value}`} className="helplineLink">
                  {helpline.contact.email.value}
                </a>{' '}
                <span className="contactInstruction">{helpline.contact.email.instruction}</span>
              </span>
            </p>
          )}

          {helpline.contact.webchat?.value && (
            <p className="helplineContact">
              <span className="contactRow">
                🌐{' '}
                <a
                  href={helpline.contact.webchat.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="helplineLink"
                >
                  {helpline.contact.webchat.value}
                </a>{' '}
                <span className="contactInstruction">{helpline.contact.webchat.instruction}</span>
              </span>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
};

export default HelplinesList;
