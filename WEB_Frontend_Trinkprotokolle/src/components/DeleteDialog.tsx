import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  deleteEintrag,
  deleteLogin,
  deletePfleger,
  deleteProtokoll,
} from "../backend/api";
import { useLoginContext } from "../backend/LoginInfo";

interface DeleteDialogProps {
  open: boolean;
  deleteWhat: string;
  ID: string;
  IDübergeordnetProto?: string;
  onHide: () => void;
}

export function DeleteDialog({
  open,
  onHide,
  deleteWhat,
  IDübergeordnetProto,
  ID,
}: DeleteDialogProps) {
  const [deleteFail, setDeleteFail] = useState("");
  const { loginInfo, setLoginInfo } = useLoginContext();
  const navigate = useNavigate();

  function onCancel() {
    onHide();
  }

  const onDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (deleteWhat === "Protokoll") {
        await deleteProtokoll(ID);
        navigate("/");
      } else if (deleteWhat === "Eintrag") {
        await deleteEintrag(ID);
        navigate("/protokoll/" + IDübergeordnetProto);
      } else if (deleteWhat === "Pfleger") {
        await deletePfleger(ID);
        setLoginInfo(false);
        if (loginInfo && loginInfo?.id === ID) {
          await deleteLogin();
          navigate("/");
        } else {
          navigate("/admin");
        }
      }
    } catch (err: any) {
      setDeleteFail(
        "Fehler beim Löschen: " + (err.message || "Unbekannter Fehler")
      );
    }
  };

  return (
    <Modal show={open} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{deleteWhat} Löschen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Sind Sie sich sicher, dass Sie{" "}
        {deleteWhat === "Protokoll" ? "das " : "den "} {deleteWhat} löschen
        möchten?
        <br />
        {deleteFail && <div style={{ color: "red" }}>{deleteFail}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button variant="danger" onClick={onDelete}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
