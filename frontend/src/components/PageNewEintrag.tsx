import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EintragResource } from "../Resources";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "bootstrap/dist/css/bootstrap.min.css";
import { useLoginContext } from "../backend/LoginInfo";
import { createEintrag } from "../backend/api";

export default function PageNewEintrag() {
  const navigate = useNavigate();
  const { loginInfo } = useLoginContext();
  const { protokollId } = useParams<{ protokollId: string }>();

  const refGetraenk = useRef<HTMLInputElement>(null);
  const refMenge = useRef<HTMLInputElement>(null);
  const refKommentar = useRef<HTMLTextAreaElement>(null);
  const [validated, setValidated] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!protokollId) {
      console.error("Fehler: protoID ist nicht definiert.");
      return;
    }

    const myEintrag = {
      getraenk: refGetraenk.current!.value,
      menge: parseInt(refMenge.current!.value, 10),
      protokoll: protokollId,
      ersteller: loginInfo ? loginInfo!.id : null,
    } as EintragResource;

    if (refKommentar.current && refKommentar.current.value !== "") {
      myEintrag.kommentar = refKommentar.current.value;
    }

    console.log("Sende Eintrag:", myEintrag);
    try {
      await createEintrag(myEintrag);
      navigate(`/protokoll/${protokollId}`);
    } catch (err) {
      console.error("Fehler beim Erstellen des Eintrags:", err);
    }
  }

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Neuen Eintrag Erstellen</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formGetränk">
              <Form.Label>Getränk</Form.Label>
              <Form.Control
                placeholder="Wasser"
                type="text"
                id="patient"
                ref={refGetraenk}
                minLength={3}
                maxLength={50}
                required
              />
              <Form.Control.Feedback type="invalid">
                Bitte geben Sie einen gültigen Getränkenamen ein (3-50 Zeichen).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMenge">
              <Form.Label>Menge in ml</Form.Label>
              <Form.Control
                type="number"
                id="patient"
                ref={refMenge}
                min={1}
                max={10000}
                required
              />
              <Form.Control.Feedback type="invalid">
                Bitte geben Sie eine gültige Menge ein (1-10000 ml).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formKommentar">
              <Form.Label>Kommentar</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                id="kommentar"
                ref={refKommentar}
                maxLength={1000}
                className="form-control"
              />
              <Form.Control.Feedback type="invalid">
                Kommentar darf maximal 1000 Zeichen lang sein.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Button variant="primary" type="submit">
              Speichern
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate(`/protokoll/${protokollId}`)}
            >
              Abbrechen
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
