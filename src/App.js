import React, { useContext }  from 'react';
import Login from './components/Login';
import Movies from './components/Movies';
import Navbar from './components/Navbar';
import CardScreen from './components/CardScreen';
import { UserContext } from './providers/UserProvider';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GatherParty from './components/GatherParty';
import { Navigate, useLocation } from 'react-router-dom';
import './App.css';

function PrivateRoute({ children }) {
    const { user } = useContext(UserContext);
    return user ? children : <Navigate to="/" replace />;
}

function RoutesWithLocation() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const error = location.state?.error;

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
