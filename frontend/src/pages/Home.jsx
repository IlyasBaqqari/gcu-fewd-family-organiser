import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdEdit, MdDelete } from 'react-icons/md';
import { FaLocationDot } from 'react-icons/fa6';
import { FaClock, FaSearch } from 'react-icons/fa';
import { BsBackpackFill } from 'react-icons/bs';
import useToken from '../hooks/useToken';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useToken();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const familyId = localStorage.getItem('familyId');
      if (!token || !familyId) {
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(
          `${API_URL}/get-family-events`,
          { familyId },
          { headers: { Authorization: token } },
        );
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching family events:', err);
        setError(err.response?.data?.message || 'Failed to load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.post(
        `${API_URL}/delete-event/${eventId}`,
        {
          username: localStorage.getItem('username'),
          userfamily: localStorage.getItem('familyId'),
        },
        { headers: { Authorization: token } },
      );
      // Remove from state
      setEvents(events.filter((e) => e._id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event.');
    }
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate
      ? event.date.split('T')[0] === filterDate
      : true;
    return matchesSearch && matchesDate;
  });

  if (loading)
    return <p className="text-center text-fo-dark mt-10">Loading events...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className="flex flex-col items-center pb-10">
      <div className="my-10 flex flex-col items-center w-full max-w-4xl px-4">
        <h1 className="text-5xl font-bold text-center text-fo-black mb-8 w-full border-b-2 border-fo-secondary-light pb-4">
          Family Events
        </h1>

        <div className="w-full flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fo-secondary" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-fo-secondary focus:outline-fo-primary transition-all"
            />
          </div>
          <div className="flex-none">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-white w-full md:w-auto px-4 py-3 rounded-2xl border-2 border-fo-secondary focus:outline-fo-primary transition-all"
            />
          </div>
        </div>

        <div className="w-full">
          {events.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-fo-secondary text-lg">
                No events yet. Add one!
              </p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-fo-secondary text-lg">
                No events found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all">
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-t-30 border-fo-primary flex flex-col relative"
                >
                  <h3 className="text-xl font-bold text-fo-black mb-4 truncate">
                    {event.event}
                  </h3>
                  <p className="text-fo-dark font-semibold">
                    {new Date(event.date).toDateString()}
                  </p>
                  <p className="text-fo-secondary flex items-center gap-1 mt-3">
                    <FaClock />
                    {event.startTime} - {event.endTime}
                  </p>
                  <p className="text-fo-secondary flex items-center gap-1">
                    <FaLocationDot />
                    {event.location}
                  </p>
                  <p className="text-fo-secondary flex items-center gap-1">
                    <BsBackpackFill />
                    {event.requiredItems}
                  </p>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to={`/edit-event/${event._id}`}
                      className="flex-1 bg-fo-secondary-light text-white flex justify-center items-center py-2 rounded-xl hover:bg-fo-secondary hover:cursor-pointer transition-all"
                      title="Edit Event"
                    >
                      <MdEdit size={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="flex-1 bg-red-400 text-white flex justify-center items-center py-2 rounded-xl hover:bg-red-500 hover:cursor-pointer transition-all"
                      title="Delete Event"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
