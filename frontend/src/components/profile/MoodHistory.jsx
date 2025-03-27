import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FaRegSmile, FaRegMeh, FaRegFrown } from 'react-icons/fa';

const MoodHistory = forwardRef((props, ref) => {
  const [moodLogs, setMoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMoodLogs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (!user || !token) {
        setError('Please log in to view your mood history');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/v1/moods/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch mood logs');
      }

      setMoodLogs(data.data);
    } catch (error) {
      console.error('Error fetching mood logs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchMoodLogs
  }));

  useEffect(() => {
    fetchMoodLogs();
  }, []);

  const getMoodEmoji = (rating) => {
    if (rating <= 2) return <FaRegFrown className="text-xl text-red-500" />;
    if (rating <= 4) return <FaRegMeh className="text-xl text-yellow-500" />;
    return <FaRegSmile className="text-xl text-green-500" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Mood History</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {moodLogs.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-gray-500 text-center">No mood logs found. Start tracking your moods!</p>
          </div>
        ) : (
          moodLogs.map((log) => (
            <div key={log._id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="mb-2">
                <p className="text-xs text-gray-500">{formatDate(log.timestamp)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Before</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mood</span>
                      {getMoodEmoji(log.beforeMood)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Energy</span>
                      <span className="text-sm font-medium text-gray-900">{log.beforeEnergy}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Motivation</span>
                      <span className="text-sm font-medium text-gray-900">{log.beforeMotivation}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">After</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mood</span>
                      {getMoodEmoji(log.afterMood)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Improved</span>
                      <span className="text-sm font-medium text-gray-900">{log.improvedMood}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Repeat</span>
                      <span className="text-sm font-medium text-gray-900">{log.workoutAgain}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default MoodHistory; 