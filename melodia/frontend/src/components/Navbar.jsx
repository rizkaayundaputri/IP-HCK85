import { NavLink, useNavigate } from 'react-router';
import { FaHome, FaMusic, FaUser, FaCompactDisc } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          .navbar {
            background: linear-gradient(90deg, #020264ff, #202020ff);
            transition: all 0.3s ease;
            z-index: 999;
          }

          .nav-link {
            transition: color 0.2s ease;
            font-weight: 500;
          }

          .nav-link:hover {
            color: #f1f1f1 !important;
          }

          .navbar-toggler {
            border: none;
            box-shadow: none;
          }

          .navbar-brand {
            font-weight: 700;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: white !important;
          }

          @media (max-width: 991.98px) {
            .navbar-collapse {
              background: linear-gradient(90deg, #020264ff, #202020ff);
              border-radius: 0 0 1rem 1rem;
              padding: 1rem;
            }

            .navbar-nav {
              flex-direction: column !important;
              align-items: flex-start !important;
            }

            .nav-item {
              width: 100%;
            }

            .nav-link {
              width: 100%;
              padding-left: 0;
            }
          }
        `}
      </style>

      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top rounded-bottom-4 py-2">
        <div className="container">
          {/* Brand Kiri */}
          <NavLink className="navbar-brand" to="/">
            <FaCompactDisc size={24} color="white" /> Noisely
          </NavLink>

          {/* Toggle Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu Kanan */}
          <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
            <ul className="navbar-nav gap-2 gap-lg-4">
              <li className="nav-item">
                <NavLink className="nav-link d-flex align-items-center text-white" to="/">
                  <FaHome className="me-2" /> Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link d-flex align-items-center text-white" to="/collections">
                  <FaMusic className="me-2" /> My Playlist
                </NavLink>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link d-flex align-items-center text-white"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    localStorage.removeItem('access_token');
                    navigate('/login');
                  }}
                >
                  <FaUser className="me-2" /> Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
