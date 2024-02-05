import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getCustomLists, getFavorites, getWatchlist, getCustomListContent, createParty } from '../../services/partyApi';
import { joinParty } from '../../services/partyApi';
import { UserContext } from '../../providers/UserProvider';
import { useNavigate } from 'react-router-dom';
import './index.css';

const CardScreen = () => {
  const navigate = useNavigate();
  const [sessionType, setSessionType] = useState('watchlist');
  const [customListSelection, setCustomListSelection] = useState([]);
  const [customSelection, setCustomSelection] = useState(""); 
  const [selected, setSelected] = useState(false);
  const [movies, setMovies] = useState([]);
  const [joinError, setJoinError] = useState('');
  const [customSessionOptions, setCustomSessionOptions] = useState([]);
  const { user } = useContext(UserContext);
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    const getCustom = async () => {
      let movies;
      switch (sessionType) {
        case 'custom':
          movies = await getCustomLists(user);
          break;
        case 'favorites':
          movies = await getFavorites(user);
          break;
        case 'watchlist':
          movies = await getWatchlist(user);
          break;
        default:
          movies = [];
          break;
      }
      if(sessionType === 'custom') {
        setCustomListSelection(movies);
        if (movies.length > 0) {
          setCustomSelection(movies[0].id);
        }
      } else {
        setCustomSessionOptions(movies);
      }
    };
    if(!selected) {
      fetchMovies();
    }
    getCustom();
  }, [sessionType, selected, user]);

  useEffect(() => {
    const getCustom = async () => {
      if(sessionType === 'custom') {
        let movies = await getCustomListContent(user, customSelection);
        setCustomSessionOptions(movies);
      }
    }
    getCustom();
  }, [customSelection, sessionType, user]);

  const fetchMovies = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies/popular`);
    setMovies(response.data);
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

  const handleCustomSelect = () => {
    setSelected(!selected);
    if(selected) {
      setSessionType('watchlist');
    }
  };

  const handleSessionTypeChange = (event) => {
    setSessionType(event.target.value);
  };

  const handleCustomTypeChange = (event) => {
    setCustomSelection(event.target.value);
  };

  const startMovieParty = async () => {
    const response = await createParty(selected ? customSessionOptions : movies, user);
    if (response.status === 200) {
      navigate('/gather-party', { 
        state: { 
          movies: selected ? customSessionOptions : movies,
          partyId: response.data.partyId,
          isOwner: true,
          movieIndex: 0,
        } 
      });
    }
  };

  return (
    <div className="section" style={{ paddingTop: '5rem' }}>
      <h1 className="title">Start a Movie Party</h1>
      <div className="columns is-centered">
        <div className="column is-one-third">
          <div className="card" style={{ padding: '2rem', minHeight: '300px' }}>
            <div className="card-content">
              <label className="radio">
                <input type="radio" value="popular" checked={!selected} onChange={handleCustomSelect} />
                <span className="title is-4" style={{ marginLeft: '10px' }}>Start a session with popular movies</span>
              </label>
              <div className="columns is-multiline">
                {movies.slice(0, 3).map(movie => (
                  <div className="column is-one-third" key={movie.id}>
                    <figure className="image is-3by4">
                      <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                    </figure>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="column is-one-third">
          <div className="card" style={{ padding: '2rem', minHeight: '300px' }}>
            <div className="card-content">
              <label className="radio">
                <input type="radio" checked={selected} onChange={handleCustomSelect} />
                <span className="title is-4" style={{ marginLeft: '10px' }}>Pick a custom session</span>
              </label>
              {selected && (
                <div className="select is-fullwidth">
                  <select onChange={handleSessionTypeChange}>
                    <option value="watchlist">Watchlist</option>
                    <option value="favorites">Favorites</option>
                    <option value="custom">TMDB Custom Watchlists</option>
                  </select>
                </div>
              )}
              <hr/>
              {selected && sessionType === 'custom' && customListSelection.length !== 0 && (
                <div className="select is-fullwidth">
                  <select onChange={handleCustomTypeChange}>
                    {customListSelection.map((list) => (
                      <option key={list.id} value={list.id}>{list.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="columns is-multiline pt-2">
                {selected && customSessionOptions && customSessionOptions.length !== 0 && customSessionOptions.slice(0, 3).map(movie => (
                  <div className="column is-one-third" key={movie.id}>
                    <figure className="image is-3by4">
                      <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                    </figure>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ paddingTop: '1rem' }}>
        <button className="button is-danger is-large"  onClick={startMovieParty}>Start Movie Party</button>
      </div>
      <div className="container pt-5 width-adjusted">
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
                <button className="button is-danger is-large" type="submit">Join Party</button>
              </div>
            </div>
            {joinError && <p className="has-text-danger">{joinError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CardScreen;