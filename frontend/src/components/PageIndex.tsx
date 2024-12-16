import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import "bootstrap/dist/css/bootstrap.min.css";
import { getAlleProtokolle, getLogin } from "../backend/api";
import { useEffect, useState } from "react";
import { ProtokollResource } from "../Resources";
import { useLoginContext } from "../backend/LoginInfo";
import { stringToDate } from "../Helper/DateHelper"

export default function PageIndex() {
  const [protokolle, setProtokolle] = useState<ProtokollResource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { loginInfo } = useLoginContext();

  async function load() {
    setError("");
    setLoading(true);

    try {
      const alleProtokolle = await getAlleProtokolle();

      // Sortiere die Protokolle nach Datum, von neu nach alt
      const sortierteProtokolle = alleProtokolle.sort((a, b) => {
        const dateA = new Date(stringToDate(a.datum)).getTime();
        const dateB = new Date(stringToDate(b.datum)).getTime();
        return dateB - dateA;
      });
      setProtokolle(sortierteProtokolle!);
    } catch (err: any) {
      setError("Error im getAlleProtokolle(): " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [loginInfo]);

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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>
          Alle Protokolle <Badge bg="secondary">{protokolle.length}</Badge>
        </h1>
        <div className="ml-auto">
          {loginInfo ? (
            <Link to={`/protokoll/neu`}>
              <Button variant="secondary" size="lg">
                Neues Protokoll
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" size="lg" disabled>
              Neues Protokoll
            </Button>
          )}
        </div>
      </div>
      <div className="row">
        {protokolle.map((protokoll) => (
          <div key={protokoll.id} className="col-12 mb-3">
            <Card>
              <Card.Header
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {protokoll.patient}{" "}
                {!protokoll.public && (
                  <Card.Img
                    variant="top"
                    src="private.png"
                    style={{ height: "24px", width: "24px" }}
                  />
                )}
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <strong>Gesammte Menge:</strong> {protokoll.gesamtMenge} ml
                </Card.Text>
                <Card.Text>
                  <strong>Ersteller:</strong> {protokoll.erstellerName}
                </Card.Text>
                <Card.Text>
                  <strong>Erstellt am:</strong> {protokoll.datum}
                </Card.Text>
                {protokoll.updatedAt && (
                  <Card.Text>
                    <strong>Zuletzt geändert:</strong> {protokoll.updatedAt}
                  </Card.Text>
                )}
                <hr></hr>
                <Link
                  to={`/protokoll/${protokoll.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Zur Detailansicht
                </Link>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
