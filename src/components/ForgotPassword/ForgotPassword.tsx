import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Col, Container, FloatingLabel, Form, Row, Tab, Tabs } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import { baseWeddingBackendClient } from '../../util/ApiClients';

export default function ForgotPassword() {
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const handleForgot = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const forgotData = await baseWeddingBackendClient.get(`/api/auth/forgot/${event.currentTarget.email.value}`)
      .then(response => response.data)
      .catch((err) => {
        setErrorMsg(err.response.data.message)
        setShowError(true);
      });
    if (!forgotData) {
      return;
    }

    navigate('/');
  }

  return (
    <Container className="p-3 my-5 d-flex flex-column">
      <Row className='justify-content-center'>
        <Col xs={0} sm={0} md={7} lg={5}>
          <Alert show={showError} variant="danger" onClose={() => setShowError(false)} dismissible>{errorMsg}</Alert>
          <Form noValidate validated={validated} onSubmit={handleForgot}>
            <FloatingLabel className='mb-4' label="Correo electrónico">
              <Form.Control type="email" placeholder="Correo electrónico" id='email' required />
            </FloatingLabel>

            <Button className="mb-4 w-100" type='submit'>Continuar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
