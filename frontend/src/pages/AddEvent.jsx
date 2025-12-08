import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useToken from '../hooks/useToken';

const API_URL = import.meta.env.VITE_API_URL;

function AddEvent() {
  const { token } = useToken();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    event: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    requiredItems: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const username = localStorage.getItem('username');
    const userfamily = localStorage.getItem('familyId');
    const userrole = localStorage.getItem('role');

    if (!username || !userfamily) {
      setError('User details missing. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time.');
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `${API_URL}/new-event-entry`,
        {
          ...formData,
          username,
          userfamily,
          userrole,
        },
        {
          headers: { Authorization: token },
        },
      );

      navigate('/');
    } catch (err) {
      console.error('Error adding event:', err);
      setError(
        err.response?.data?.message || 'Failed to add event. Please try again.',
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center pb-10">
      <div className="my-10 flex flex-col items-center w-full max-w-2xl px-4">
        <h1 className="text-5xl font-bold text-center text-fo-black mb-8 w-full border-b-2 border-fo-secondary-light pb-4">
          Add New Event
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 w-full text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="event"
              className="text-fo-secondary font-semibold ms-3 mb-1"
            >
              Event Name
            </label>
            <input
              type="text"
              name="event"
              id="event"
              required
              placeholder="e.g. Swimming Lesson"
              value={formData.event}
              onChange={handleChange}
              className="w-full bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="date"
              className="text-fo-secondary font-semibold ms-3 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full md:w-1/2">
              <label
                htmlFor="startTime"
                className="text-fo-secondary font-semibold ms-3 mb-1"
              >
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                id="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="w-full bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
              />
            </div>
            <div className="flex flex-col w-full md:w-1/2">
              <label
                htmlFor="endTime"
                className="text-fo-secondary font-semibold ms-3 mb-1"
              >
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                id="endTime"
                required
                value={formData.endTime}
                onChange={handleChange}
                className="w-full bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="location"
              className="text-fo-secondary font-semibold ms-3 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              placeholder="e.g. Community Centre"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="requiredItems"
              className="text-fo-secondary font-semibold ms-3 mb-1"
            >
              Required Items
            </label>
            <input
              type="text"
              name="requiredItems"
              id="requiredItems"
              placeholder="e.g. Swimsuit, Towel, Goggles"
              value={formData.requiredItems}
              onChange={handleChange}
              className="w-full bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
            />
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-fo-primary px-6 md:px-8 py-3 w-full rounded-2xl shadow-lg text-center text-white font-semibold text-lg focus:outline-fo-dark hover:outline-2 hover:outline-fo-dark focus:bg-fo-primary-light hover:bg-fo-primary-light focus:text-fo-black hover:text-fo-black hover:cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
