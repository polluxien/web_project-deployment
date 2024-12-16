import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAlleEintraege,
  getProtokoll,
  updateProtokoll,
} from "../backend/api";
import { EintragResource, ProtokollResource } from "../Resources";
import { DeleteDialog } from "./DeleteDialog";

import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "bootstrap/dist/css/bootstrap.min.css";
import { useLoginContext } from "../backend/LoginInfo";

export default function PageProtokoll() {
  const params = useParams();
  const navigate = useNavigate();
  const protoID = params.protokollId;
  const [protokoll, setProtokoll] = useState<ProtokollResource>();
  const [eintraege, setEintraege] = useState<EintragResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const { loginInfo } = useLoginContext();
  const [validated, setValidated] = useState(false);

  // Editing Variablen
  const refPatient = useRef<HTMLInputElement>(null);
  const refDatum = useRef<HTMLInputElement>(null);
  const [closed, setClosed] = useState<boolean | undefined>(undefined);

  // Delete Dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function load() {
    try {
      const proto = await getProtokoll(protoID!);
      setProtokoll(proto);
      const alleEintraege = await getAlleEintraege(protoID!);
      setEintraege(Array.isArray(alleEintraege) ? alleEintraege : []);
      setClosed(proto.closed);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [protoID]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false || closed === undefined) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const myProtokoll = {
      id: protoID,
      patient: refPatient.current!.value,
      datum: refDatum.current!.value,
      closed: closed,
      public: !closed
    } as ProtokollResource;

    try {
      await updateProtokoll(myProtokoll, protoID!);
      setEditing(false);
      navigate(`/protokoll/${protoID}`);
      navigate(0);
    } catch (err) {
      console.error("Fehler beim Aktualisieren des Protokolls:", err);
    }
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-CA");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div key={protoID} className="container mt-4">
      {!editing ? (
        <Card>
          <Card.Header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {protokoll!.patient}{" "}
            {!protokoll!.public && (
              <Card.Img
                variant="top"
                src="/private.png"
                style={{ height: "24px", width: "24px" }}
              />
            )}
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <strong>Gesammte Menge:</strong> {protokoll!.gesamtMenge} ml
            </Card.Text>
            <Card.Text>
              <strong>Ersteller:</strong> {protokoll!.erstellerName}
            </Card.Text>
            <Card.Text>
              <strong>Erstellt am:</strong> {protokoll!.datum}
            </Card.Text>
            {protokoll!.updatedAt && (
              <Card.Text>
                <strong>Zuletzt geändert:</strong> {protokoll!.updatedAt}
              </Card.Text>
            )}
            {loginInfo && protokoll!.ersteller === loginInfo.id && (
              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => setEditing(true)}
                >
                  Editieren
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Löschen
                </Button>
              </div>
            )}
            <hr></hr>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>
                Einträge <Badge bg="secondary">{eintraege.length}</Badge>
              </h3>
              <div className="ml-auto">
                {loginInfo ? (
                  <Link to={`/protokoll/${protoID}/eintrag/neu`}>
                    <Button variant="secondary">Neuer Eintrag</Button>
                  </Link>
                ) : (
                  <Button variant="secondary" disabled>
                    Neuer Eintrag
                  </Button>
                )}
              </div>
            </div>
            {eintraege.length > 0 ? (
              <ul className="list-unstyled">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Getränk</th>
                      <th>Menge</th>
                      <th>Erstellt am</th>
                      <th>Kommentar</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {eintraege.map((eintrag, index) => (
                      <tr key={eintrag.id}>
                        <td>{index + 1}</td>
                        <td>{eintrag.getraenk}</td>
                        <td>{eintrag.menge} ml</td>
                        <td>{eintrag.createdAt}</td>
                        <td>{eintrag.kommentar ? eintrag.kommentar : ""}</td>
                        <td>
                          {loginInfo &&
                          loginInfo.id === protokoll!.ersteller ? (
                            <Link to={`/eintrag/${eintrag.id}`}>Details</Link>
                          ) : (
                            "nicht eingeloggt"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ul>
            ) : (
              <i>Noch keine Einträge vorhanden</i>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Header>Bestehendes Protokoll Bearbeiten</Card.Header>
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
                  defaultValue={protokoll!.patient}
                  ref={refPatient}
                />
                <Form.Control.Feedback type="invalid">
                  Bitte geben Sie einen gültigen Patientennamen ein (3-50
                  Zeichen).
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="datum">
                <Form.Label>Datum</Form.Label>
                <Form.Control
                  type="date"
                  ref={refDatum}
                  required
                  defaultValue={formatDate(protokoll!.datum)}
                />
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
                  defaultChecked={protokoll!.closed === true}
                  required
                  isInvalid={closed === undefined && validated}
                />
                <Form.Check
                  type="radio"
                  label="Öffentlich"
                  name="closed"
                  value="false"
                  onChange={() => setClosed(false)}
                  defaultChecked={protokoll!.closed === false}
                  required
                  isInvalid={!closed === undefined && validated}
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
                onClick={() => setEditing(false)}
              >
                Abbrechen
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
      <DeleteDialog
        open={showDeleteDialog}
        deleteWhat="Protokoll"
        ID={protoID!}
        onHide={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
