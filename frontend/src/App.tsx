// import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import PageIndex from "./components/PageIndex";
import PageProtokoll from "./components/PageProtokoll";
import PageAdmin from "./components/PageAdmin";
import PageEintrag from "./components/PageEintrag";
import PagePrefs from "./components/PagePrefs";
import Header from "./components/Header";
import React, { useEffect, useState } from "react";
import { getLogin } from "./backend/api";
import { ErrorFallback } from "./components/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { LoginContext } from "./backend/LoginInfo";
import { LoginResource } from "./Resources";
import PageNewProtokoll from "./components/PageNewProtokoll";
import PageNewEintrag from "./components/PageNewEintrag";
import PageNewPfleger from "./components/PageNewPfleger";

function App() {
  const [loginInfo, setLoginInfo] = useState<LoginResource | false | undefined>(
    undefined
  );

  useEffect(() => {
    try {
      const f = async () => {
        const actLogin = await getLogin();
        setLoginInfo(actLogin!);
      };
      f();
    } catch (err: any) {
      console.log("Error im Login: " + err.message);
    }
  }, []);

  return (
    <div>
      <LoginContext.Provider value={{ loginInfo, setLoginInfo }}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Header></Header>
          <Routes>
            <Route path="/" element={<PageIndex />} />
            <Route path="/protokoll/:protokollId" element={<PageProtokoll />} />
            <Route path="/eintrag/:eintragId" element={<PageEintrag />} />
            {loginInfo && (
              <>
                <Route path="/protokoll/neu" element={<PageNewProtokoll />} />
                <Route
                  path="/protokoll/:protokollId/eintrag/neu"
                  element={<PageNewEintrag />}
                />
                <Route path="/admin" element={<PageAdmin />} />
                <Route path="/pfleger/neu" element={<PageNewPfleger />} />
                <Route path="/prefs" element={<PagePrefs />} />
              </>
            )}
            //Fallback
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </LoginContext.Provider>
    </div>
  );
}

export default App;
