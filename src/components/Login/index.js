
import React, { useState, useContext } from 'react';
import { loginUser as login } from '../../services/userApi';
import { UserContext } from '../../providers/UserProvider';
import { useNavigate } from 'react-router-dom';
import { joinParty } from '../../services/partyApi';
import "./index.css";

const Login = ({ error: errorProp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(errorProp || '');
  const [joinError, setJoinError] = useState('');
  const { user, login, logout } = useContext(UserContext);
  const [inviteCode, setInviteCode] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  const joinMovieParty = async (event) => {
    event.preventDefault();

    const response = await joinParty(inviteCode);

    if (response.status === 200 && response.data.partyExists) {
      navigate('/gather-party', {
        state: {
          partyId: inviteCode,
          isOwner: false
        }
      });
    } else {
      setJoinError('Invalid invite code');
    }
  };


  return (
    <div className="section">
      <div className="container">
        <div className="box">
          <h1 className="title">Please use TMDB Credentials</h1>
          <form onSubmit={handleLogin}>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
              </div>
            </div>
            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button className="button is-primary" type="submit">Login</button>
              </div>
            </div>
            {error && <p className="has-text-danger">{error}</p>}
          </form>
        </div>
      </div>
      <div className="container pt-5 invite-code-container">
        <div className="box">
          <form onSubmit={joinMovieParty}>
            <div className="field">
              <label className="label">Invite Code</label>
              <div className="control">
                <input className="input" type="inviteCode" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Invite Code" required />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button className="button is-primary" type="submit">Join Party</button>
              </div>
            </div>
            {joinError && <p className="has-text-danger">{joinError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
