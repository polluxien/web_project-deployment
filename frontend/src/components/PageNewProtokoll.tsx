import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ProtokollResource } from "../Resources";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "bootstrap/dist/css/bootstrap.min.css";
import { useLoginContext } from "../backend/LoginInfo";
import { createProtokoll } from "../backend/api";

export default function PageNewProtokoll() {
  const navigate = useNavigate();
  const { loginInfo } = useLoginContext();
  const [closed, setClosed] = useState<boolean>();
  const [validated, setValidated] = useState(false);

  const refPatient = useRef<HTMLInputElement>(null);
  const refDatum = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || closed === undefined) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const myProtokoll = {
      patient: refPatient.current!.value,
      datum: refDatum.current!.value,
      closed: closed,
      public: !closed,
      ersteller: loginInfo ? loginInfo.id : null,
    } as ProtokollResource;

    try {
      await createProtokoll(myProtokoll);
      navigate(`/`);
    } catch (err) {
      console.error("Fehler beim Erstellen des Protokolls:", err);
    }
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Neues Protokoll Erstellen</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="patient">
              <Form.Label>Patient</Form.Label>
              <Form.Control
                type="text"
                placeholder="Max Mustermann"
                minLength={3}
                maxLength={50}
                required
                ref={refPatient}
              />
              <Form.Control.Feedback type="invalid">
                Bitte geben Sie einen gültigen Patientennamen ein (3-50
                Zeichen).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="datum">
              <Form.Label>Datum</Form.Label>
              <Form.Control type="date" ref={refDatum} required />
              <Form.Control.Feedback type="invalid">
                Bitte geben Sie ein gültiges Datum ein.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="closed">
              <Form.Check
                type="radio"
                label="Privat"
                name="closed"
                value="true"
                onChange={() => setClosed(true)}
                required
              />
              <Form.Check
                type="radio"
                label="Öffentlich"
                name="closed"
                value="false"
                onChange={() => setClosed(false)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Bitte wählen Sie eine Option.
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Speichern
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate(`/`)}
            >
              Abbrechen
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
