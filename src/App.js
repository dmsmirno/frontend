import React, {  useEffect, useContext }  from 'react';
import Login from './components/Login';
import Movies from './components/Movies';
import Navbar from './components/Navbar';
import CardScreen from './components/CardScreen';
import { UserContext } from './providers/UserProvider';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GatherParty from './components/GatherParty';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';



function RoutesWithLocation() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    const error = location.state?.error;
    const { handleAuthorizedRequestToken } = useContext(UserContext);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const authorizedRequestToken = queryParams.get('request_token');
        if (authorizedRequestToken) {
            handleAuthorizedRequestToken(authorizedRequestToken);
            navigate('/');
        }
    }, [location, handleAuthorizedRequestToken]);

    return (
        <Routes>
            <Route path="/gather-party" element={<GatherParty />} />
            <Route path="/" element={
                <>
                    {!user &&
                        <div>
                            <div className={"Movies blur"}>
                                <Movies />
                            </div>
                            <div className="Login"><Login errorProp={error} /></div>
                        </div>
                    }
                    {user && <CardScreen errorProp={error} />}
                </>
            } />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <RoutesWithLocation />
            </div>
        </Router>
    );
}

export default App;
