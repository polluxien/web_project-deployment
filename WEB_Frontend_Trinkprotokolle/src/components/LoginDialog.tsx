import { useRef, useState, useEffect } from "react";
import { useLoginContext } from "../backend/LoginInfo";
import { postLogin } from "../backend/api";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

interface LoginDialogProps {
  open: boolean;
  onHide: () => void;
}

export function LoginDialog({ open, onHide }: LoginDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  open ? dialogRef.current?.showModal() : dialogRef.current?.close();

  const { setLoginInfo } = useLoginContext();
  const [loginData, setLoginData] = useState({ name: "", password: "" });
  const [loginFailed, setLoginFailed] = useState("");

  function update(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setLoginFailed("");
  }

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginInfo = await postLogin(loginData.name, loginData.password);
      setLoginInfo(loginInfo);
      setLoginFailed("");
      onHide();
      console.log("Login erfolgreich");
    } catch (err) {
      setLoginFailed(String(err));
    } finally {
      setLoginData({ name: loginData.name, password: "" });
    }
  };

  function onCancel() {
    setLoginData({ name: loginData.name, password: "" });
    onHide();
  }

  return (
    <Modal show={open} onHide={onHide} data-testid="login-dialog">
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <form onSubmit={onLogin}>
        <Modal.Body>
          <label>
            Name:{" "}
            <input
              type="text"
              name="name"
              onChange={update}
              value={loginData.name}
              required
              style={{ width: "100%" }}
              data-testid="login-username"
            />
          </label>
          <br />
          <label>
            Passwort:{" "}
            <input
              type="password"
              name="password"
              onChange={update}
              value={loginData.password}
              required
              style={{ width: "100%" }}
              data-testid="login-password"
            />
          </label>
          {loginFailed && (
            <div style={{ color: "red" }} data-testid="login-error">
              {loginFailed}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onCancel}
            data-testid="cancel-button"
          >
            Abbrechen
          </Button>
          <Button type="submit" variant="primary" data-testid="submit-button">
            OK
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
