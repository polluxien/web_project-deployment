import {
  EintragResource,
  LoginResource,
  PflegerResource,
  ProtokollResource,
} from "../Resources";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";
import { eintraege, protokolle } from "./testdata";

// Simulated delay for mock data
const simulateDelay = async (ms: number) =>
  new Promise((r) => setTimeout(r, ms));

export async function getAlleProtokolle(): Promise<ProtokollResource[]> {
  console.log(
    "Meine URL für Backend-Server: " +
      process.env.REACT_APP_API_SERVER_URL +
      " : Meine URL für Frontend-Server: " +
      process.env.REACT_APP_FRONTEND_SERVER_URL +
      ": Meine Fetch: " +
      process.env.REACT_APP_REAL_FETCH
  );
  try {
    if (process.env.REACT_APP_REAL_FETCH !== "true") {
      await new Promise((r) => setTimeout(r, 700));
      return Promise.resolve(protokolle);
    } else {
      const response = await fetch(
        process.env.REACT_APP_API_SERVER_URL + "/api/protokoll/alle",
        { credentials: "include" as RequestCredentials }
      );
      if (response.status == 404) {
        throw new Error("Error 404");
      }
      if (!response.ok) {
        throw new Error("kein Zugriff auf Backend");
      }
      return response.json();
    }
  } catch (err: any) {
    throw err;
  }
}

export async function getAlleEintraege(
  protokollId: string
): Promise<EintragResource[]> {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    return Promise.resolve(eintraege);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/protokoll/${protokollId}`,
      { credentials: "include" as RequestCredentials }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf Backend");
    }
    return response.json();
  }
}

export async function getProtokoll(
  protokollId: string
): Promise<ProtokollResource> {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    const protokoll = protokolle.find((proto) => proto.id === protokollId);
    if (!protokoll) {
      throw new Error(
        "Protokoll mit entsprechender Id konnte nicht gefunden werden"
      );
    }
    return Promise.resolve(protokoll);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}`,
      { credentials: "include" as RequestCredentials }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf das Protokoll :/");
    }
    return response.json();
  }
}

export async function deleteProtokoll(protokollId: string) {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    const protokoll = protokolle.find((proto) => proto.id === protokollId);
    if (!protokoll) {
      throw new Error(
        "Protokoll mit entsprechender Id konnte nicht gefunden werden"
      );
    }
    return Promise.resolve(protokoll);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}`,
      { method: "DELETE", credentials: "include" as RequestCredentials }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf das Protokoll :/");
    }
  }
}

export async function updateProtokoll(
  protoResource: ProtokollResource,
  protokollId: string
): Promise<ProtokollResource> {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    const protokoll = protokolle.find((proto) => proto.id === protokollId);
    if (!protokoll) {
      throw new Error(
        "Protokoll mit entsprechender Id konnte nicht gefunden werden"
      );
    }
    return Promise.resolve(protokoll);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/${protokollId}`,
      {
        method: "PUT",
        credentials: "include" as RequestCredentials,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(protoResource),
      }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf das Protokoll :/");
    }
    console.log("Erfolgreich Proto upgedated");
    return response.json();
  }
}

export async function createProtokoll(protoResource: ProtokollResource) {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    //funktioniert nicht ohne backend
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/protokoll/`,
      {
        method: "POST",
        credentials: "include" as RequestCredentials,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(protoResource),
      }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff");
    }
    console.log("Erfolgreich Proto erstellt");
    return;
  }
}

export async function getEintrag(eintragId: string): Promise<EintragResource> {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    const eintrag = eintraege.find((ein) => ein.id === eintragId);
    if (!eintrag) {
      throw new Error(
        "Eintrag mit entsprechender Id konnte nicht gefunden werden"
      );
    }
    return Promise.resolve(eintrag);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/${eintragId}`,
      { credentials: "include" as RequestCredentials }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("Kein ZUgriff auf das Protokoll :/");
    }
    return response.json();
  }
}

export async function deleteEintrag(eintragID: string) {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    const protokoll = protokolle.find((proto) => proto.id === eintragID);
    if (!protokoll) {
      throw new Error(
        "Protokoll mit entsprechender Id konnte nicht gefunden werden"
      );
    }
    return Promise.resolve(protokoll);
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/${eintragID}`,
      { method: "DELETE", credentials: "include" as RequestCredentials }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf den Eintrag :/");
    }
    return;
  }
}

export async function updateEintrag(
  eintragResource: EintragResource,
  eintragID: string
): Promise<EintragResource> {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    await new Promise((r) => setTimeout(r, 700));
    const eintrag = eintraege.find((ein) => ein.id === eintragID);
    if (!eintrag) {
      throw new Error(
        "Eintrag mit entsprechender Id konnte nicht gefunden werden"
      );
    }
    return Promise.resolve(eintrag);
  } else {
    console.log("Eintrag bearbeitungsmodus");
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/${eintragID}`,
      {
        method: "PUT",
        credentials: "include" as RequestCredentials,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eintragResource),
      }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff auf den Eintrag :/");
    }
    console.log("Erfolgreich Eintrag upgedated");
    return response.json();
  }
}

export async function createEintrag(eintragResource: EintragResource) {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    //funktioniert nicht ohne backend
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/eintrag/`,
      {
        method: "POST",
        credentials: "include" as RequestCredentials,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eintragResource),
      }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff");
    }
    console.log("Erfolgreich Eintrag erstellt");
    return;
  }
}

export async function postLogin(name: string, password: string) {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/api/login`;

  const response = await fetchWithErrorHandling(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
    body: JSON.stringify({ name, password }),
  });
  console.log(`Response status: ${response.status}`);
  if (response.ok) {
    const loginInfo: LoginResource = await response.json();
    return loginInfo;
  }
  if (response.status === 401) {
    throw new Error("Invalid credentials");
  }
  throw new Error(
    `Error connecting to ${process.env.REACT_APP_API_SERVER_URL}: ${response.statusText}`
  );
}

export async function getLogin() {
  try {
    const baseUrl = process.env.REACT_APP_API_SERVER_URL;
    console.log("Current API URL:", baseUrl); // Debug-Ausgabe

    const url = `${baseUrl}/api/login`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const loginInfo: LoginResource | false = await response.json();
      return loginInfo;
    }

    if (response.status === 401) {
      throw new Error("Invalid credentials");
    }

    throw new Error(`Error connecting to ${baseUrl}: ${response.statusText}`);
  } catch (err: any) {
    console.error("Login error:", err);
    throw new Error(`Network error: ${err.message}`);
  }
}

export async function deleteLogin(): Promise<void> {
  const url = `${process.env.REACT_APP_API_SERVER_URL}/api/login`;
  const response = await fetchWithErrorHandling(url, {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return;
  }
  throw new Error(`Error logging out, status: ${response.status}`);
}

export async function getAllePfleger(): Promise<PflegerResource[]> {
  const response = await fetchWithErrorHandling(
    process.env.REACT_APP_API_SERVER_URL + "/api/pfleger/alle",
    { credentials: "include" as RequestCredentials }
  );
  if (response.status == 404) {
    throw new Error("Error 404");
  }
  if (!response.ok) {
    throw new Error("kein Zugriff auf Backend");
  }
  return response.json();
}

export async function deletePfleger(pflegerID: string) {
  const response = await fetchWithErrorHandling(
    `${process.env.REACT_APP_API_SERVER_URL}/api/pfleger/${pflegerID}`,
    { method: "DELETE", credentials: "include" as RequestCredentials }
  );
  if (response.status == 404) {
    throw new Error("Error 404");
  }
  if (!response.ok) {
    throw new Error("kein Zugriff auf den Pfleger :/");
  }
}

export async function updatePfleger(
  pflegerResource: PflegerResource,
  pflegerID: string
): Promise<PflegerResource> {
  const response = await fetchWithErrorHandling(
    `${process.env.REACT_APP_API_SERVER_URL}/api/pfleger/${pflegerID}`,
    {
      method: "PUT",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pflegerResource),
    }
  );
  if (response.status == 404) {
    throw new Error("Error 404");
  }
  if (!response.ok) {
    throw new Error("kein Zugriff auf das Protokoll :/");
  }
  console.log("Erfolgreich Pfleger upgedated");
  return response.json();
}

export async function createPfleger(pflegerResource: PflegerResource) {
  if (process.env.REACT_APP_REAL_FETCH !== "true") {
    //funktioniert nicht ohne backend
  } else {
    const response = await fetchWithErrorHandling(
      `${process.env.REACT_APP_API_SERVER_URL}/api/pfleger/`,
      {
        method: "POST",
        credentials: "include" as RequestCredentials,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pflegerResource),
      }
    );
    if (response.status == 404) {
      throw new Error("Error 404");
    }
    if (!response.ok) {
      throw new Error("kein Zugriff");
    }
    console.log("Erfolgreich Pfleger erstellt");
    return;
  }
}
