import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Alert, Button, Col, Container, FloatingLabel, Form, Row, Tab, Tabs } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import { baseWeddingBackendClient, weddingBackendClient } from '../../util/ApiClients';

export default function SigninRegister() {
  const [showLoginError, setShowLoginError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  const [showRegisterError, setShowRegisterError] = useState(false);
  const [registerErrorMsg, setRegisterErrorMsg] = useState("");

  const [currentTab, setCurrentTab] = useState('tab1');

  const [validatedLogin, setValidatedLogin] = useState(false);
  const [validatedRegister, setValidatedRegister] = useState(false);
  const [cookies, setCookies] = useCookies(['userId']);

  const registerFormRef = useRef<HTMLFormElement>(null);

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidatedRegister(true);
      return;
    }

    const userData = await weddingBackendClient.post('/api/auth/signin',
      {
        email: event.currentTarget.loginEmail.value.trim(),
        password: event.currentTarget.loginPassword.value
      })
      .then(response => response.data)
      .catch((err) => {
        setLoginErrorMsg(err.response.data.message)
        setShowLoginError(true);
      });
    if (!userData) {
      return;
    }

    setCookies('userId', userData.id, { path: '/', });

    navigate('/');
  }

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidatedLogin(true);
      return;
    }

    if (event.currentTarget.registerPassword.value !== event.currentTarget.registerPasswordRepeat.value) {
      setRegisterErrorMsg('Las contraseñas no coinciden');
      setShowRegisterError(true);
      return;
    }

    const userData = await baseWeddingBackendClient.post('/api/auth/register',
      {
        name: event.currentTarget.registerName.value.trim(),
        email: event.currentTarget.registerEmail.value.trim(),
        password: event.currentTarget.registerPassword.value
      }).catch((err) => {
        setRegisterErrorMsg(err.response.data.message)
        setShowRegisterError(true);
      });
    if (!userData) {
      return;
    }

    if (registerFormRef.current)
      registerFormRef.current.reset();

    setShowRegisterError(false);
    setCurrentTab('tab1');
  }

  return (
    <Container className="p-3 my-5 d-flex flex-column">
      <Row className='justify-content-center'>
        <Col xs={0} sm={0} md={7} lg={5}>
          <Tabs justify className='mb-3 d-flex flex-row justify-content-between' defaultActiveKey='tab1' activeKey={currentTab} onSelect={(key) => { if (key) setCurrentTab(key) }} >
            <Tab eventKey='tab1' title='Acceder'>
              <Alert show={showLoginError} variant="danger" onClose={() => setShowLoginError(false)} dismissible>{loginErrorMsg}</Alert>
              <Form noValidate validated={validatedLogin} onSubmit={handleLogin}>
                <FloatingLabel className='mb-4' label="Correo electrónico">
                  <Form.Control type="email" placeholder="Correo electrónico" id='loginEmail' required />
                </FloatingLabel>
                <FloatingLabel className='mb-4' label="Contraseña">
                  <Form.Control type="password" placeholder="Contraseña" id='loginPassword' required />
                </FloatingLabel>

                <div className="d-flex justify-content-between mx-4 mb-4">
                  <a href="/forgot">Recuperar contraseña</a>
                </div>

                <Button className="mb-4 w-100" type='submit'>Continuar</Button>
              </Form>
            </Tab>
            <Tab eventKey='tab2' title='Registrarse'>
              <Alert show={showRegisterError} variant="danger" onClose={() => setShowRegisterError(false)} dismissible>{registerErrorMsg}</Alert>
              <Form ref={registerFormRef} noValidate validated={validatedRegister} className='row g-1' onSubmit={handleRegister}>
                <FloatingLabel className='mb-4' label="Usuario">
                  <Form.Control type="text" placeholder="Usuario" id='registerName' required />
                </FloatingLabel>
                <FloatingLabel className='mb-4' label="Correo electrónico">
                  <Form.Control type="email" placeholder="Correo electrónico" id='registerEmail' required />
                </FloatingLabel>
                <FloatingLabel className='mb-4' label="Contraseña">
                  <Form.Control type="password" placeholder="Contraseña" id='registerPassword' required />
                </FloatingLabel>
                <FloatingLabel className='mb-4' label="Repite la contraseña">
                  <Form.Control type="password" placeholder="Contraseña" id='registerPasswordRepeat' required />
                </FloatingLabel>

                <Button className="mb-4 w-100" type='submit'>Continuar</Button>
              </Form>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
