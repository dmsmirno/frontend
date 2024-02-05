import React, { useContext } from 'react';
import { UserContext } from '../../providers/UserProvider';

const Navbar = () => {
  const { user, logout } = useContext(UserContext)

  const handleLogout = () => {
    logout();
  };
  
  return (
    <nav className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
      <div className="navbar-menu">
        <div className="navbar-start">
          {/* Other navbar items can go here */}
        </div>
        <div className="navbar-end">
          <a className="navbar-item">
            {user ? `Logged in with TMDB` : 'Not logged in'}
          </a>
          {user && (
            <div className="navbar-item">
              <button className="button is-light" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;