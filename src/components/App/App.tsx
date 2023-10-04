import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Spotify from '../../util/Spotify';
import Playlist from '../PlayList/PlayList';
import { Alert, Button } from 'react-bootstrap';
import Home from '../Home/Home';
import Footer from '../Footer/Footer';
import axios from 'axios';

export default function App() {
  const [showError, setShowError] = useState(false);
  const [cookies, setCookies] = useCookies(["SpotifyAccessToken", "SpotifyUserId"]);
  const [userId, setUserId] = useState<string>(cookies.SpotifyUserId || "");

  const login = function () {
    Spotify.getAccessToken();
  }

  const resetLogin = function () {
    setCookies("SpotifyAccessToken", "");
    setCookies("SpotifyUserId", "");
    setUserId("");
  }

  const logout = function () {
    resetLogin();
  }

  useEffect(() => {
    if (cookies.SpotifyAccessToken && cookies.SpotifyAccessToken !== "" &&
      cookies.SpotifyUserId && cookies.SpotifyUserId !== "") {
      Spotify.setToken(cookies.SpotifyAccessToken);
      setUserId(cookies.SpotifyUserId);
      return;
    }

    const hash = window.location.hash;

    if (!hash) {
      resetLogin();
      return;
    };

    const newAccessToken = hash.match(/access_token=([^&]*)/);
    const newExpiresIn = hash.match(/expires_in=([^&]*)/);
    if (!newAccessToken || !newExpiresIn) {
      resetLogin();
      return;
    }

    const accessToken = newAccessToken[1];
    const expiresIn = Number(newExpiresIn[1]) * 1000;

    Spotify.setToken(accessToken);
    Spotify.getUserData().then(result => {
      setCookies("SpotifyAccessToken", accessToken, { maxAge: expiresIn });
      setCookies("SpotifyUserId", result.id, { maxAge: expiresIn });
      setUserId(result.id);
      axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/${result.id}`);
    }).catch(() => {
      setShowError(true);
      resetLogin();
    })

    window.location.hash = "";
  }, []);

  return (
    <Router>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container>
          <Navbar.Brand href="/">Wedding playlist</Navbar.Brand>
          {userId === "" ?
            <Button type="submit" onClick={login}>Login</Button> :
            <Button type="submit" onClick={logout}>Logout</Button>
          }
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="flex-grow-1 pe-3 justify-content-end">
              <Nav.Link href="/">Inicio</Nav.Link>
              <Nav.Link href="/playlist">Lista</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={
          <>
            {userId !== "" ?
              <>
                {showError &&
                  <div className="container">
                    <div className="p-2">
                      <Alert show={showError} variant="danger" onClose={() => setShowError(false)} dismissible>Usuario no autorizado.</Alert>
                    </div>
                  </div>}
                <Home userId={userId} resetLogin={resetLogin} />
              </> :
              <div className="container">
                <div className="p-2">
                  <Alert variant='info'>Inicia sesión para buscar, canciones y valorar canciones</Alert>
                </div>
              </div>
            }
          </>
        } />
        <Route path="/playlist" element={<Playlist userId={userId} />} />
      </Routes>
      {/* <Footer></Footer> */}
    </Router>
  );
}
