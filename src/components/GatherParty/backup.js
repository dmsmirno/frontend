import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';

const GatherParty = () => {
    const [timer, setTimer] = useState(null);
    const location = useLocation();

    const inviteCode = location.state.partyId;
    const [isOwner, setIsOwner] = useState(location.state.isOwner || false);
    const [partyStatus, setPartyStatus] = useState('notStarted');
    const [users, setUsers] = useState(0);
    const ws = useRef(null);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const isUnmounting = useRef(false);
   
    const [votes, setVotes] = useState([]);
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    
      // Clear the interval when the component unmounts
      return () => {
        clearInterval(intervalId);
      };
    }, []);


    useEffect(() => {
        if (!location.state || !location.state.partyId) {
          navigate('/');
        }
        if (!ws.current) {
          ws.current = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}`);
          
          ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: 'JOIN_PARTY', partyId: inviteCode }));
            if (isOwner) {
              ws.current.send(JSON.stringify({ type: 'PREPARE_PARTY', partyId: inviteCode }));
            }
          };
    
          ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
    
            switch (message.type) {
              case 'PARTY_JOINED':
                setUsers(message.users);
                setMovies(message.party.movies);
                setVotes(message.party.votes);
                setPartyStatus(message.party.status);
                if(message.party.status === 'started') {
                  const savedMovieIndex = localStorage.getItem('movieIndex');
                  if (savedMovieIndex !== null) {
                    setCurrentMovieIndex(Number(savedMovieIndex));
                  }
                }
                break;
              case 'UPDATE_USERS':
                setUsers(message.users);
                break;
              case 'START_PARTY':
                setPartyStatus('started');
                localStorage.setItem('movieIndex', 0);
                break;
              case 'UPDATE_VOTES':
                setVotes(message.votes);
                break;
              case 'PARTY_TTL':
                setTimer(message.ttl);
                break;
              case 'PARTY_EXPIRED':
                setPartyStatus('expired');
                ws.current.close();
                break;
              case 'MAKE_OWNER': 
                setIsOwner(true);
                break;
              case 'ERROR':
                navigate('/', { state: { error: message.error } });
                break;
            }
          };
        }
    
        // Cleanup function
        return () => {
            if (isUnmounting.current) {
              if (ws.current) {
                if(isOwner) {
                  ws.current.send(JSON.stringify({ type: 'PASS_OWNER', partyId: inviteCode }));
                }
                ws.current.close();
              }
            } else {
              isUnmounting.current = true;
            }
        };
    }, [inviteCode]);

    const startParty = () => {
      if (ws.current) {
        ws.current.send(JSON.stringify({ type: 'START_PARTY', partyId: inviteCode }));
      }
    };

    const voteNo = () => {
      localStorage.setItem('movieIndex',  currentMovieIndex + 1);
      setCurrentMovieIndex((prevIndex) => prevIndex + 1);
    };

    const voteYes = () => {
      // Move to the next movie
      if (ws.current) {
        ws.current.send(JSON.stringify({ type: 'CAST_VOTE', partyId: inviteCode, movieId: movies[currentMovieIndex].id }));
      }
      localStorage.setItem('movieIndex', currentMovieIndex + 1);
      setCurrentMovieIndex((prevIndex) => prevIndex + 1);
    }

    const completeVoting = () => {
      localStorage.setItem('movieIndex', movies.length);
      setCurrentMovieIndex(movies.length);
    }

    return (
      <div>
        {partyStatus == 'notStarted' || partyStatus == 'prepared' && ( 
          <div className="section" style={{ paddingTop: '5rem' }}>
              <h1 className="title">Movie Party</h1>
              <div className="columns is-centered">
                  <div className="column is-one-third">
                  <div className="card" style={{ padding: '2rem', minHeight: '300px' }}>
                      <div className="card-content">
                        <h2 className="title is-4">Remaining Time: {timer}</h2>
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
                          <h2 className="title is-4">Joined Users</h2>
                          <h2 style={{ fontSize: '5rem' }}>{users}</h2>
                        
                        </div>
                    </div>
                  </div>
              </div>
              {isOwner && ( 
                <div style={{ paddingTop: '1rem' }}>
                  <button className="button is-danger is-large is-fullwidth" onClick={() => startParty()}>Begin Voting</button>
                </div>
              )}
              <div style={{ paddingTop: '1rem' }}>
                <h2 className="title is-4">Invite Code: {inviteCode}</h2>
              </div>
          </div>
        )}
        {partyStatus == 'started' && (
          <div>
            {currentMovieIndex < movies.length ? (
              <div className="voting-container">
                <div>
                <p> Remaining: {timer} seconds</p>
                
                <figure className="image is-3by4">
                  <img src={`https://image.tmdb.org/t/p/w500${movies[currentMovieIndex].poster_path}`} alt={movies[currentMovieIndex].title} />
                </figure>
                
                <div className="buttons">
                  <button className="button is-large is-success is-wide" onClick={voteYes}>Yes</button>
                  <button className="button is-large is-danger is-wide" onClick={voteNo}>No</button>
                </div>
                <div className="buttons">
                  <button className="button is-large is-danger is-wide" onClick={() => navigate('/')}>Exit</button>
                  <button className="button is-large is-link is-wide" onClick={() => completeVoting()}>To End</button>
                </div>
                </div>
              </div>
            ) : (
              <div className="overall-container pt-7">
                <div className="buttons">
                  <button className="button is-large is-danger is-wide" onClick={() => navigate('/')}>Exit</button>
                </div>
                {movies
                  .map(movie => ({ ...movie, vote: votes[movie.id] })) // Add vote counts to movies
                  .sort((a, b) => b.vote - a.vote) // Sort movies by vote count
                  .map(movie => ( // Map over sorted movies
                    <div key={movie.id} className="pb-2">
                      <figure className="is-3by4">
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                      </figure>
                      <button className="button is-rounded is-static has-text-weight-bold has-text-black is-large">Votes: {movie.vote} </button>
                    </div>
                ))}
              </div>
            )}
          </div>
        )}
        {partyStatus === 'expired' && (
          <div className="overall-container pt-7">
            <div className="buttons">
              <button className="button is-large is-danger is-wide" onClick={() => navigate('/')}>Exit</button>
            </div>
           {movies
             .map(movie => ({ ...movie, vote: votes[movie.id] })) // Add vote counts to movies
             .sort((a, b) => b.vote - a.vote) // Sort movies by vote count
             .map(movie => ( // Map over sorted movies
               <div key={movie.id} className="pb-2">
                 <figure className="is-3by4">
                   <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                 </figure>
                 <button className="button is-rounded is-static has-text-weight-bold has-text-black is-large">Votes: {movie.vote} </button>
               </div>
           ))}
         </div>
        )}
      </div>
    );
};

export default GatherParty;