import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, CheckCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--bg-tertiary)', padding: '1rem 0' }}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: '700' }}>
          <CheckCircle size={28} color="var(--accent-primary)" />
          TaskFlow
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span style={{ color: 'var(--text-secondary)' }}>Hello, {user.name}</span>
              <button className="btn btn-secondary flex items-center gap-2" onClick={onLogout}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
