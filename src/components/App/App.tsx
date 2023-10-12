import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Playlist from '../PlayList/PlayList';
import { Alert, Button } from 'react-bootstrap';
import Home from '../Home/Home';
import SigninRegister from '../SigninRegister/SigninRegister';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import EditUser from '../EditUser/EditUser';
import ChangePassword from '../ChangePassword/ChangePassword';
import { baseWeddingBackendClient, weddingBackendClient } from '../../util/ApiClients';

export default function App() {
  const [showError, setShowError] = useState(false);
  const [cookies, setCookies] = useCookies(['userId']);
  const [userId, setUserId] = useState<string>(cookies.userId);
  const [userName, setUserName] = useState<string>('');

  const resetLogin = function () {
    setCookies('userId', '', { path: '/' });
    setUserId('');
    setUserName('');
  }

  const logout = function () {
    resetLogin();
    weddingBackendClient.post('/api/auth/signout');
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element:
        <>
          {userName !== '' ?
            <>
              {showError &&
                <div className='container'>
                  <div className='p-2'>
                    <Alert show={showError} variant='danger' onClose={() => setShowError(false)}
                      dismissible>Usuario no autorizado.</Alert>
                  </div>
                </div>}
              <Home userId={userId} />
            </> :
            <div className='container'>
              <div className='p-2'>
                <Alert variant='info'>Inicia sesión para buscar, canciones y valorar canciones</Alert>
              </div>
            </div>
          }
        </>
    },
    {
      path: '/signin',
      element: <SigninRegister />,
    },
    {
      path: '/forgot',
      element: <ForgotPassword />,
    },
    {
      path: '/changePassword',
      element: <ChangePassword />,
    },
    {
      path: '/editUser',
      element: <EditUser />,
    },
    {
      path: '/playlist',
      element: <Playlist userId={userId}></Playlist>
    }
  ]);

  const getUserData = async (userId: string) => {
    const userInfoData = await baseWeddingBackendClient.get(`/api/user/${userId}`)
      .then(response => response.data)
      .catch(() => setShowError(true));
    if (!userInfoData) {
      return;
    }

    setUserId(cookies.userId)
    setUserName(userInfoData.name);
  }

  useEffect(() => {
    if (!cookies.userId || cookies.userId === '') {
      return;
    }

    getUserData(cookies.userId);
  });

  return (
    <main>
      <Navbar expand='lg' className='bg-body-tertiary' fixed='top'>
        <Container>
          <Navbar.Brand href='/'>Wedding playlist</Navbar.Brand>
          {userName === '' ?
            <Button type='submit' href='/signin'>Acceder</Button> :
            <NavDropdown title={userName} id='basic-nav-dropdown'>
              <NavDropdown.Item href='/editUser' >Editar</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout} >Salir</NavDropdown.Item>
            </NavDropdown>
          }
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='flex-grow-1 pe-3 justify-content-end'>
              <Nav.Link href='/'>Inicio</Nav.Link>
              <Nav.Link href='/playlist'>Lista</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <RouterProvider router={router} />
    </main>
  );
}
