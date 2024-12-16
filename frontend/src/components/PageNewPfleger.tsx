import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "bootstrap/dist/css/bootstrap.min.css";
import { PflegerResource } from "../Resources";
import { useLoginContext } from "../backend/LoginInfo";
import { createPfleger } from "../backend/api";
import Card from "react-bootstrap/esm/Card";

enum Gender {
  KeineAngabe = "Keine Angabe",
  Maennlich = "Männlich",
  Weiblich = "Weiblich",
  Divers = "Divers",
}

export default function PageNewPfleger() {
  const navigate = useNavigate();
  const { loginInfo } = useLoginContext();
  const [validated, setValidated] = useState(false);

  // Ersteller Variablen
  const refName = useRef<HTMLInputElement>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const [gender, setGender] = useState<Gender>(Gender.KeineAngabe); // Verwende das Gender-Enum
  const refBirth = useRef<HTMLInputElement>(null);
  const refAdress = useRef<HTMLInputElement>(null);
  const refPosition = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null); // Passwort-Referenz hinzugefügt

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const myPfleger: PflegerResource = {
      password: refPassword.current!.value, // Passwort aus dem Feld übernehmen
      name: refName.current!.value,
      admin: admin,
      gender: gender,
      birth: refBirth.current!.value,
      adress: refAdress.current!.value,
      position: refPosition.current!.value,
    };
    console.log("Angegebenes Geburtsdatum:" + refBirth.current!.value)

    try {
      await createPfleger(myPfleger);
      navigate(`/admin`);
    } catch (err) {
      console.error("Fehler beim erstellen des Pflegers:", err);
    }
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>Neuen Pfleger Erstellen</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Max Mustermann"
                minLength={3}
                maxLength={50}
                required
                ref={refName}
              />
              <Form.Control.Feedback type="invalid">
                Bitte geben Sie einen gültigen Pflegernamen ein (3-50 Zeichen).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>Geschlecht</Form.Label>
              <Form.Select
                onChange={(e) => setGender(e.target.value as Gender)}
              >
                {Object.values(Gender).map((genderOption) => (
                  <option key={genderOption} value={genderOption}>
                    {genderOption}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="datum">
              <Form.Label>Geburtsdatum</Form.Label>
              <Form.Control type="date" ref={refBirth} required />
              <Form.Control.Feedback type="invalid">
                Bitte geben Sie ein gültiges Datum ein.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="adress">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                minLength={3}
                maxLength={100}
                required
                ref={refAdress}
              />
              <Form.Control.Feedback type="invalid">
                Bitte geben Sie eine gültige Adresse ein (3-100 Zeichen).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="position">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                minLength={3}
                maxLength={100}
                required
                ref={refPosition}
              />
              <Form.Control.Feedback type="invalid">
                Bitte geben Sie eine gültige Position ein (3-100 Zeichen).
              </Form.Control.Feedback>
            </Form.Group>
            <hr></hr>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Passwort</Form.Label>
              <Form.Control
                type="password"
                minLength={3}
                maxLength={100}
                required
                ref={refPassword} // Referenz geändert
              />
              <Form.Control.Feedback type="invalid">
                Bitte geben Sie ein gültiges Passwort ein (3-100 Zeichen).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="admin">
              <Form.Check
                type="checkbox"
                label="Admin"
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Speichern
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate(`/admin`)}
            >
              Abbrechen
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
