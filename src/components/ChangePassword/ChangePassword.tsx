import React, { useState } from 'react';
import { Alert, Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom'
import { baseWeddingBackendClient } from '../../util/ApiClients';

export default function ChangePassword() {
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validated, setValidated] = useState(false);

  const location = useLocation();
  const queryParameters = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const handleNewPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    if (event.currentTarget.password.value !== event.currentTarget.passwordRepeat.value) {
      setErrorMsg('Las contraseñas no coinciden');
      setShowError(true);
      return;
    }

    const changeData = await baseWeddingBackendClient.post('/api/auth/newPassword/',
      {
        email: queryParameters.get('email'),
        tempPassword: queryParameters.get('code'),
        newPassword: event.currentTarget.password.value,
      })
      .then(response => response.data)
      .catch((err) => {
        setErrorMsg(err.response.data.message)
        setShowError(true);
      });
    if (!changeData) {
      return;
    }

    navigate('/signin');
  }

  return (
    <Container className="p-3 my-5 d-flex flex-column">
      <Row className='justify-content-center'>
        <Col xs={0} sm={0} md={7} lg={5}>
          <Alert show={showError} variant="danger" onClose={() => setShowError(false)} dismissible>{errorMsg}</Alert>
          <Form noValidate validated={validated} onSubmit={handleNewPassword}>
            <FloatingLabel className='mb-4' label="Contraseña">
              <Form.Control type="password" placeholder="Contraseña" id='password' required />
            </FloatingLabel>
            <FloatingLabel className='mb-4' label="Repite la contraseña">
              <Form.Control type="password" placeholder="Contraseña" id='passwordRepeat' required />
            </FloatingLabel>

            <Button className="mb-4 w-100" type='submit'>Continuar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
