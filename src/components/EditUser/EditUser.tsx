import React, { useState } from 'react';
import { Alert, Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { weddingBackendClient } from '../../util/ApiClients';

export default function EditUser() {
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const handleNewPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const changeData = await weddingBackendClient.put('/api/auth/',
      {
        newName: event.currentTarget.newName.value.trim(),
      })
      .then(response => response.data)
      .catch((err) => {
        setErrorMsg(err.response.data.message)
        setShowError(true);
      });
    if (!changeData) {
      return;
    }

    navigate('/');
  }

  return (
    <Container className="p-3 my-5 d-flex flex-column">
      <Row className='justify-content-center'>
        <Col xs={0} sm={0} md={7} lg={5}>
          <Alert show={showError} variant="danger" onClose={() => setShowError(false)} dismissible>{errorMsg}</Alert>
          <Form noValidate validated={validated} onSubmit={handleNewPassword}>
            <FloatingLabel className='mb-4' label="Nuevo usuario">
              <Form.Control type="text" placeholder="Nuevo usuario" id='newName' required />
            </FloatingLabel>

            <Button className="mb-4 w-100" type='submit'>Continuar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
