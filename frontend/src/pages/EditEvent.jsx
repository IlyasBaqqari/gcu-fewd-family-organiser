import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useToken from '../hooks/useToken';

const API_URL = import.meta.env.VITE_API_URL;

function EditEvent() {
  const { token } = useToken();
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    event: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    requiredItems: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/event/${id}`, {
          headers: { Authorization: token },
        });
        const eventData = response.data;
        const formattedDate = new Date(eventData.date)
          .toISOString()
          .split('T')[0];

        setFormData({
          event: eventData.event,
          date: formattedDate,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          location: eventData.location,
          requiredItems: eventData.requiredItems,
          participants: eventData.participants,
          eventType: eventData.eventType,
          description: eventData.description,
        });
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, token]);

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
        `${API_URL}/update-event/${id}`,
        {
          ...formData,
        },
        {
          headers: { Authorization: token },
        },
      );

      navigate('/');
    } catch (err) {
      console.error('Error updating event:', err);
      setError(
        err.response?.data?.message ||
          'Failed to update event. Please try again.',
      );
      setIsSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-fo-dark">Loading event...</p>;

  return (
    <div className="flex flex-col items-center pb-10">
      <div className="my-10 flex flex-col items-center w-full max-w-2xl px-4">
        <h1 className="text-5xl font-bold text-center text-fo-black mb-8 w-full border-b-2 border-fo-secondary-light pb-4">
          Edit Event
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
              className="bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
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
              className="bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col w-1/2">
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
                className="bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
              />
            </div>
            <div className="flex flex-col w-1/2">
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
                className="bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
              />
            </div>
          </div>

          {/* Location */}
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
              className="bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
            />
          </div>

          {/* Required Items */}
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
              className="bg-white px-4 py-3 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-fo-primary px-6 md:px-8 py-3 w-full rounded-2xl shadow-lg text-center text-white font-semibold text-lg focus:outline-fo-dark hover:outline-2 hover:outline-fo-dark focus:bg-fo-primary-light hover:bg-fo-primary-light focus:text-fo-black hover:text-fo-black hover:cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;
