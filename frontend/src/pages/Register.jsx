import { useState } from 'react';
import useToken from '../hooks/useToken.jsx';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setToken } = useToken();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const registerResponse = await axios.post(`${API_URL}/register`, {
        username,
        password,
        familyId,
      });

      if (registerResponse.data.success) {
        try {
          const loginResponse = await axios.post(`${API_URL}/login`, {
            username,
            password,
            familyId,
          });
          if (loginResponse.data.success) {
            setToken(loginResponse.data.token);

            localStorage.setItem('role', loginResponse.data.userrole);
            localStorage.setItem('familyId', loginResponse.data.userfamily);
            localStorage.setItem('username', loginResponse.data.username);

            navigate('/');
          } else {
            navigate('/login');
          }
        } catch (loginErr) {
          console.error('Auto-login failed', loginErr);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration failed', err);
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="my-10 flex flex-col items-center">
        <img
          src="/logo-shadow.png"
          className="w-20 md:w-25 mb-0 transition-all"
          alt="Family Organiser logo"
        />
        <h2 className="mb-8 mt-1 pb-2 w-full text-fo-black text-lg text-center font-semibold border-b-2 transition-all">
          Family Organiser
        </h2>
        <h1 className="text-5xl font-bold text-center text-fo-black ">
          Register
        </h1>
      </div>

      {error && (
        <p className="bg-orange-500 px-6 md:px-8 py-2 mb-8 w-80 sm:w-100 md:w-150 rounded-2xl shadow-lg text-center text-white transition-all">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="text-fo-secondary font-semibold ms-3 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username..."
            onChange={(e) => setUserName(e.target.value)}
            required
            className="bg-white px-4 md:px-6 py-3 w-80 sm:w-100 md:w-150 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-fo-secondary font-semibold ms-3 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Choose a password..."
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white px-4 md:px-6 py-3 w-80 sm:w-100 md:w-150 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="familyId"
            className="text-fo-secondary font-semibold ms-3 mb-1"
          >
            Family ID
          </label>
          <input
            id="familyId"
            type="text"
            placeholder="Enter Family Name/ID..."
            onChange={(e) => setFamilyId(e.target.value)}
            required
            className="bg-white px-4 md:px-6 py-3 w-80 sm:w-100 md:w-150 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
          />
          <p className="text-xs text-fo-secondary ms-3 mt-1">
            Enter a new ID to create a family, or existing one to join.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-fo-primary mt-4 px-6 md:px-8 py-3 mb-8 w-80 sm:w-100 md:w-150 rounded-2xl shadow-lg text-center text-white font-semibold text-lg focus:outline-fo-dark hover:outline-2 hover:outline-fo-dark focus:bg-fo-primary-light hover:bg-fo-primary-light focus:text-fo-black hover:text-fo-black hover:cursor-pointer transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
          <p className="text-fo-dark">
            Already have an account?{' '}
            <Link
              to="/login"
              className="underline text-fo-primary font-semibold"
            >
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
