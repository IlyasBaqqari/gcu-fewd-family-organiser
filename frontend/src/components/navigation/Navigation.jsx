import { Link, Outlet, useNavigate } from 'react-router-dom';
import useToken from '../../hooks/useToken.jsx';

function Navigation() {
  const { setToken } = useToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('familyId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <>
      <nav className="flex justify-between items-center m-4 rounded-2xl p-2 bg-fo-secondary shadow-2xl ">
        <Link to="/">
          <img
            src="/logo.png"
            className="w-10 p-0.5 rounded-xl transition-all"
            alt="Family Organiser logo"
            title="Home"
          />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/add-event"
            className="px-3 py-1.5 rounded-xl text-center text-white focus:outline-fo-dark hover:outline-2 hover:outline-fo-dark focus:bg-fo-secondary-light hover:bg-fo-secondary-light focus:text-fo-black hover:text-fo-black hover:cursor-pointer transition-all"
          >
            Add Event
          </Link>
          <button
            onClick={handleLogout}
            className="bg-fo-primary me-1 px-3 py-1.5 rounded-xl shadow-lg text-center text-white font-semibold focus:outline-fo-dark hover:outline-2 hover:outline-fo-dark focus:bg-fo-primary-light hover:bg-fo-primary-light focus:text-fo-black hover:text-fo-black hover:cursor-pointer transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}

export default Navigation;
