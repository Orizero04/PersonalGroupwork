import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon, MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/solid';
// ^ Example heroicons

/*
  This overlay:

  1. Floats on top of the page when visible.
  2. Disables underlying page interactions (we can add a CSS class to the body or use a backdrop).
  3. Shows:
     - A list of friends and last message snippet
     - A search bar to find new pals
     - A requests list
     - A chat panel if user selects a friend
*/

const PenPalsOverlay = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('friends'); 
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chatData, setChatData] = useState([]); // array of docs with day + messages
  const [messageInput, setMessageInput] = useState('');

  // On open, load friend list and requests
  useEffect(() => {
    if (isOpen) {
      fetchFriends();
      fetchRequests();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    try {
      const res = await axios.get('/api/v1/penpals/friends', authConfig());
      setFriends(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/v1/penpals/requests', authConfig());
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/v1/penpals/search?query=${searchQuery}`, authConfig());
      setSearchResults(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFriend = async (targetUsername) => {
    try {
      await axios.post('/api/v1/penpals/requests/send', { targetUsername }, authConfig());
      alert('Friend request sent');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptRequest = async (fromUsername) => {
    try {
      await axios.post('/api/v1/penpals/requests/accept', { fromUsername }, authConfig());
      // refresh requests and friends
      fetchRequests();
      fetchFriends();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefuseRequest = async (fromUsername) => {
    try {
      await axios.post('/api/v1/penpals/requests/refuse', { fromUsername }, authConfig());
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const openChat = async (friendUsername) => {
    setSelectedFriend(friendUsername);
    try {
      const res = await axios.get(`/api/v1/penpals/chats/${friendUsername}`, authConfig());
      setChatData(res.data); // array of docs
    } catch (error) {
      console.error(error);
    }
    setActiveTab('chat');
  };

  const sendMessage = async () => {
    if (!selectedFriend || !messageInput.trim()) return;
    // We'll create a day string for now
    const now = new Date();
    const dayString = now.toDateString(); // e.g. "Thu Mar 27 2025"
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      await axios.post('/api/v1/penpals/chats/send', {
        friendUsername: selectedFriend,
        content: messageInput,
        day: dayString,
        time: timeString,
      }, authConfig());

      // Refresh the chat
      openChat(selectedFriend);
      setMessageInput('');
    } catch (error) {
      console.error(error);
    }
  };

  // Helper for axios auth header
  function authConfig() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // adapt to your auth
      },
    };
  }

  if (!isOpen) return null; // Don’t render if overlay is closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      {/* Right-side panel */}
      <div className="w-full sm:w-96 bg-white h-full flex flex-col shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Tabs at the top (Friends, Requests, Find Pals) */}
        <div className="flex p-2 space-x-2 border-b">
          <button
            onClick={() => setActiveTab('friends')}
            className={`p-2 ${activeTab === 'friends' ? 'font-bold' : ''}`}
          >
            Pals
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`p-2 ${activeTab === 'requests' ? 'font-bold' : ''}`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`p-2 ${activeTab === 'search' ? 'font-bold' : ''}`}
          >
            Find Pals
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-grow overflow-y-auto p-2">
          {activeTab === 'friends' && (
            <div>
              <h2 className="font-semibold mb-2">Your Friends</h2>
              {friends.length === 0 && <p>No friends yet</p>}
              {friends.map(friend => (
                <div
                  key={friend}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                  onClick={() => openChat(friend)}
                >
                  <span>{friend}</span>
                  {/* You could show a snippet of the last message by storing it in state */}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <h2 className="font-semibold mb-2">Friend Requests</h2>
              {requests.length === 0 && <p>No incoming requests</p>}
              {requests.map(fromUser => (
                <div key={fromUser} className="flex items-center justify-between p-2">
                  <span>{fromUser}</span>
                  <div className="space-x-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 text-sm"
                      onClick={() => handleAcceptRequest(fromUser)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 text-sm"
                      onClick={() => handleRefuseRequest(fromUser)}
                    >
                      Refuse
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              <h2 className="font-semibold mb-2">Find New Pals</h2>
              <div className="flex space-x-2 mb-2">
                <input
                  className="border flex-grow px-2"
                  placeholder="Search for username..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white px-2 flex items-center"
                  onClick={handleSearch}
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
              {searchResults.map(u => (
                <div key={u.username} className="flex items-center justify-between p-2">
                  <span>{u.username}</span>
                  <button
                    className="bg-green-500 text-white px-2 py-1 text-sm flex items-center"
                    onClick={() => handleAddFriend(u.username)}
                  >
                    <UserPlusIcon className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'chat' && selectedFriend && (
            <div className="flex flex-col h-full">
              <h2 className="font-semibold mb-2">Chat with {selectedFriend}</h2>
              <div className="flex-grow overflow-y-auto border p-2">
                {/* chatData is array of docs: each doc has day + messages[] */}
                {chatData.map(doc => (
                  <div key={`${doc._id}`}>
                    <div className="text-center font-bold my-2">{doc.day}</div>
                    {doc.messages.map((m, idx) => (
                      <div key={idx} className="mb-1">
                        <span className="font-semibold">{m.from}: </span>
                        {m.content} <span className="text-sm text-gray-500">({m.time})</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex">
                <input
                  className="border flex-grow px-2"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                />
                <button className="bg-blue-500 text-white px-3 ml-2" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PenPalsOverlay;
