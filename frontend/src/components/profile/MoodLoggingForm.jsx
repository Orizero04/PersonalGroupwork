import React, { useState, useEffect, useRef } from 'react';
import { FaRegSmile, FaRegMeh, FaRegFrown, FaBolt, FaHeart, FaDumbbell } from 'react-icons/fa';
import MoodHistory from './MoodHistory';

const MoodLoggingForm = () => {
  const [user, setUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    exerciseId: '',
    beforeMood: '',
    beforeEnergy: '',
    beforeMotivation: '',
    afterMood: '',
    improvedMood: '',
    workoutAgain: '',
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const moodHistoryRef = useRef();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
      fetchExercises();
    }
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/exercises', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }

      const data = await response.json();
      setExercises(data.data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to load exercises' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: '', message: '' });

    if (!user) {
      setSubmitStatus({ type: 'error', message: 'Please log in to save your mood log' });
      return;
    }

    if (!formData.exerciseId) {
      setSubmitStatus({ type: 'error', message: 'Please select an exercise first' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save mood log');
      }

      setSubmitStatus({ type: 'success', message: 'Mood log saved successfully!' });
      setFormData({
        exerciseId: '',
        beforeMood: '',
        beforeEnergy: '',
        beforeMotivation: '',
        afterMood: '',
        improvedMood: '',
        workoutAgain: '',
      });

      // Refresh mood history
      if (moodHistoryRef.current?.fetchMoodLogs) {
        moodHistoryRef.current.fetchMoodLogs();
      }
    } catch (error) {
      console.error('Error saving mood log:', error);
      setSubmitStatus({ type: 'error', message: error.message });
    }
  };

  const MoodOption = ({ rating, selected, onClick, showLabel = true }) => {
    const getEmoji = () => {
      if (rating <= 2) return { icon: <FaRegFrown className="text-2xl" />, label: "Not Great", color: "text-red-500" };
      if (rating <= 4) return { icon: <FaRegMeh className="text-2xl" />, label: "Okay", color: "text-yellow-500" };
      return { icon: <FaRegSmile className="text-2xl" />, label: "Great", color: "text-green-500" };
    };

    const { icon, label, color } = getEmoji();

    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200 ${
          selected
            ? 'bg-blue-50 border-2 border-blue-500 shadow-md transform scale-105'
            : 'bg-white border-2 border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className={`${selected ? 'text-blue-500' : color}`}>
          {icon}
        </div>
        {showLabel && (
          <span className={`text-sm font-medium ${selected ? 'text-blue-700' : 'text-gray-600'}`}>
            {label}
          </span>
        )}
      </button>
    );
  };

  const LevelIndicator = ({ value, options, onChange, icon }) => (
    <div className="flex gap-3 items-center justify-center">
      <div className="text-gray-400">{icon}</div>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              value === option.value
                ? `${option.bgColor} ${option.textColor} shadow-md transform scale-105`
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const energyOptions = [
    { value: 'Low', label: 'Low', bgColor: 'bg-red-100', textColor: 'text-red-700' },
    { value: 'Medium', label: 'Medium', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { value: 'High', label: 'High', bgColor: 'bg-green-100', textColor: 'text-green-700' }
  ];

  const motivationOptions = [
    { value: 'Low', label: 'Low', bgColor: 'bg-red-100', textColor: 'text-red-700' },
    { value: 'Medium', label: 'Medium', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { value: 'High', label: 'High', bgColor: 'bg-green-100', textColor: 'text-green-700' }
  ];

  const feedbackOptions = [
    { value: 'Yes', label: 'Yes!', bgColor: 'bg-green-100', textColor: 'text-green-700' },
    { value: 'Somewhat', label: 'Kind of', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { value: 'No', label: 'Not really', bgColor: 'bg-red-100', textColor: 'text-red-700' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {user && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user.forenames}
            </h1>
            <p className="text-lg text-gray-600">
              Track your fitness journey and emotional well-being
            </p>
          </div>
        )}

        {!user && (
          <div className="max-w-md mx-auto mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-center text-sm font-medium">
              Please <a href="/login" className="text-yellow-900 underline font-semibold hover:text-yellow-700">sign in</a> to track your mood
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Exercise Selection Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-purple-50 px-6 py-4">
                  <h2 className="text-lg font-semibold text-purple-900">Select Exercise</h2>
                  <p className="text-sm text-purple-600">Choose the exercise you're about to do</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Exercise Type</label>
                    {loading ? (
                      <div className="animate-pulse flex space-x-4">
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                      </div>
                    ) : exercises.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No exercises available. Please add exercises first.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {exercises.map((exercise) => (
                          <button
                            key={exercise._id}
                            type="button"
                            onClick={() => handleChange('exerciseId', exercise._id)}
                            className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                              formData.exerciseId === exercise._id
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <FaDumbbell className={`mr-3 ${
                              formData.exerciseId === exercise._id ? 'text-purple-500' : 'text-gray-400'
                            }`} />
                            <div className="text-left">
                              <div className="font-medium">{exercise.name}</div>
                              <div className="text-sm text-gray-500">{exercise.type}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Before Exercise Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 bg-blue-50 px-6 py-4">
                    <h2 className="text-lg font-semibold text-blue-900">Before Exercise</h2>
                    <p className="text-sm text-blue-600">How are you feeling right now?</p>
                  </div>
                  <div className="p-6 space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Current Mood</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 3, 5].map((rating) => (
                          <MoodOption
                            key={rating}
                            rating={rating}
                            selected={formData.beforeMood === rating}
                            onClick={() => handleChange('beforeMood', rating)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Energy Level</label>
                        <LevelIndicator
                          value={formData.beforeEnergy}
                          options={energyOptions}
                          onChange={(value) => handleChange('beforeEnergy', value)}
                          icon={<FaBolt />}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Motivation Level</label>
                        <LevelIndicator
                          value={formData.beforeMotivation}
                          options={motivationOptions}
                          onChange={(value) => handleChange('beforeMotivation', value)}
                          icon={<FaHeart />}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* After Exercise Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 bg-green-50 px-6 py-4">
                    <h2 className="text-lg font-semibold text-green-900">After Exercise</h2>
                    <p className="text-sm text-green-600">How did your workout go?</p>
                  </div>
                  <div className="p-6 space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Current Mood</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 3, 5].map((rating) => (
                          <MoodOption
                            key={rating}
                            rating={rating}
                            selected={formData.afterMood === rating}
                            onClick={() => handleChange('afterMood', rating)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Did the exercise improve your mood?</label>
                        <LevelIndicator
                          value={formData.improvedMood}
                          options={feedbackOptions}
                          onChange={(value) => handleChange('improvedMood', value)}
                          icon={<FaHeart />}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Would you do this workout again?</label>
                        <LevelIndicator
                          value={formData.workoutAgain}
                          options={feedbackOptions}
                          onChange={(value) => handleChange('workoutAgain', value)}
                          icon={<FaHeart />}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {submitStatus.message && (
                <div className={`rounded-lg p-4 ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <p className="text-sm font-medium">{submitStatus.message}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!user || !formData.exerciseId}
                  className={`px-8 py-3 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${
                    user && formData.exerciseId
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Save Mood Log
                </button>
              </div>
            </form>
          </div>

          {/* History Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <MoodHistory ref={moodHistoryRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodLoggingForm; 