import React, { useEffect, useState } from "react";
import { EintragResource } from "../Resources";
import { useNavigate, useParams } from "react-router-dom";
import { getEintrag, updateEintrag } from "../backend/api";
import { LoadingIndicator } from "./LoadingIndicator";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLoginContext } from "../backend/LoginInfo";
import Button from "react-bootstrap/Button";
import { DeleteDialog } from "./DeleteDialog";

export default function PageEintrag() {
  const params = useParams();
  const eintragID = params.eintragId;
  console.log(eintragID);
  const [eintrag, setEintrag] = useState<EintragResource>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { loginInfo } = useLoginContext();
  const [editing, setEditing] = useState<boolean>(false);
  const navigate = useNavigate();

  // Editing Variablen
  const refGetraenk = React.useRef<HTMLInputElement>(null);
  const refMenge = React.useRef<HTMLInputElement>(null);
  const refKommentar = React.useRef<HTMLTextAreaElement>(null);
  const [validated, setValidated] = useState(false);

  //Delete Dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function load() {
    try {
      const eintrag = await getEintrag(eintragID!);
      setEintrag(eintrag);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [eintragID]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const myEintrag = {
      id: eintragID,
      getraenk: refGetraenk.current!.value,
      menge: parseInt(refMenge.current!.value, 10),
      protokoll: eintrag!.protokoll,
      ersteller: eintrag!.ersteller,
    } as EintragResource;

    if (refKommentar.current && refKommentar.current.value !== "") {
      myEintrag.kommentar = refKommentar.current.value;
    }
    await updateEintrag(myEintrag, eintragID!);
    setEditing(false);
    navigate(`/eintrag/${eintragID}`);
    navigate(0);
  }

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
    console.log("Error detected:", error);
    return <div>{error}</div>;
  }

  if (!eintrag) {
    return <div>Eintrag nicht gefunden mit id: ${eintragID}</div>;
  }

  return (
    <div key={eintragID} className="container mt-4">
      {!editing ? (
        <Card>
          <Card.Header>Eintrag vom {eintrag.createdAt!}</Card.Header>
          <Card.Body>
            <Card.Text>
              <strong>Getränk:</strong> {eintrag.getraenk}
            </Card.Text>
            <Card.Text>
              <strong>Menge:</strong> {eintrag.menge}
            </Card.Text>
            <Card.Text>
              <strong>Ersteller:</strong> {eintrag.erstellerName}
            </Card.Text>
            <Card.Text>
              <strong>Kommentar:</strong>{" "}
              {eintrag.kommentar ? (
                eintrag.kommentar
              ) : (
                <i>Noch kein Kommentar vorhanden</i>
              )}
            </Card.Text>
            {loginInfo && eintrag!.ersteller === loginInfo.id && (
              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => setEditing(true)}
                >
                  {" "}
                  Editieren
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  {" "}
                  Löschen
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Header>Bestehenden Eintrag Bearbeiten</Card.Header>
          <Card.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formGetränk">
                <Form.Label>Getränk</Form.Label>
                <Form.Control
                  placeholder="Wasser"
                  type="text"
                  id="patient"
                  ref={refGetraenk}
                  defaultValue={eintrag!.getraenk}
                  minLength={3}
                  maxLength={50}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Bitte geben Sie einen gültigen Getränkenamen ein (3-50
                  Zeichen).
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formMenge">
                <Form.Label>Menge in ml</Form.Label>
                <Form.Control
                  type="number"
                  id="patient"
                  ref={refMenge}
                  defaultValue={eintrag!.menge}
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
                  defaultValue={eintrag?.kommentar || ""}
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
                onClick={() => navigate(`/protokoll/${eintrag.protokoll}`)}
              >
                Abbrechen
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
      <DeleteDialog
        open={showDeleteDialog}
        deleteWhat="Eintrag"
        ID={eintragID!}
        IDübergeordnetProto={eintrag.protokoll}
        onHide={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
