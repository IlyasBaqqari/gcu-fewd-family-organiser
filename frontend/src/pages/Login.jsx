import { useState } from 'react';
import useToken from '../hooks/useToken.jsx';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [error, setError] = useState('');

  const { setToken } = useToken();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Send credentials to server
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
        familyId,
      });

      // If successful, save token and redirect
      if (response.data.success && response.data.token) {
        localStorage.setItem('familyId', response.data.userfamily);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.userrole);

        setToken(response.data.token);
        navigate('/');
      } else {
        setError('Login failed: Server response was invalid.');
      }
    } catch (err) {
      console.error('Login failed', err);
      setError(err.response?.data?.message || 'Invalid username or password');
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
        <h1 className="text-5xl font-bold text-center text-fo-black ">Login</h1>
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
            placeholder="Enter username..."
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
            placeholder="Enter password..."
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
            placeholder="Enter Family ID..."
            onChange={(e) => setFamilyId(e.target.value)}
            required
            className="bg-white px-4 md:px-6 py-3 w-80 sm:w-100 md:w-150 rounded-2xl border-2 border-fo-secondary text-lg text-fo-black focus:outline-fo-primary transition-all"
          />
        </div>

        <div className="flex flex-col items-center">
          <button
            type="submit"
            className="bg-fo-primary mt-4 px-6 md:px-8 py-3 mb-8 w-80 sm:w-100 md:w-150 rounded-2xl shad	ow-lg text-center text-white font-semibold text-lg focus:outline-fo-dark hover:outline-2 hover:outline-fo-dark focus:bg-fo-primary-light hover:bg-fo-primary-light focus:text-fo-black hover:text-fo-black hover:cursor-pointer transition-all"
          >
            Log In
          </button>
          <p className="text-fo-dark">
            No account yet?{' '}
            <Link
              to="/register"
              className="underline text-fo-primary font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
