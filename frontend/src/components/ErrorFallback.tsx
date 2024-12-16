import React, { useEffect } from "react";
import { useLoginContext } from "../backend/LoginInfo";
import { deleteLogin } from "../backend/api";

export function ErrorFallback({ error }: { error: Error }) {
  const { setLoginInfo } = useLoginContext();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        setLoginInfo(false);
        await deleteLogin();
      } catch (err) {
        console.error("Fehler beim Ausloggen:", err);
      }
    };

    handleLogout();
  }, [setLoginInfo]);

  return (
    <div>
      <h1>Irgendwas ist schief gelaufen :/</h1>
      <p>{error.name}</p>
      <p>{error.message}</p>
      <p>Bitte versuchen Sie es später erneut.</p>
    </div>
  );
}
