// istanbul ignore file

import { ValidationError } from "../../backend/fetchWithErrorHandling";
import { eintraege, protokolle } from "../../backend/testdata";

const MOCK_FETCH_DELAY = Number.parseInt(process.env.MOCK_FETCH_DELAY || "0");

class ValidationErrors {
    constructor(public errors: ValidationError[]) { }
}

export function responseWithJSON(status: number, url: string, data: any): Response {
    const resp: any /* Response */ = {
        headers: new Headers(),
        ok: status / 100 === 2,
        status: status,
        type: "basic",
        url: url,
        clone: () => resp,
        redirected: false,
        body: JSON.stringify(data),
        bodyUsed: true,
        json: () => Promise.resolve(data)
    }
    return resp;
}

/**
 * Der Login-Status eines Benutzers im Test. Im Grunde ersetzt dieser Status den Cookie.
 */
export class LoginStatus {
    /**
     * Benutzer ist eingeloggt oder nicht.
     */
    isLoggedIn: boolean
    /**
     * Benutzer kann sich, wenn er nicht bereits eingeloggt ist, erfolgreich einloggen.
     * Beim Login über den Mock werden User/Passwort nicht geprüft.
     */
    canLogin: boolean

    constructor(isLoggedIn: boolean = false, canLogin: boolean = true) {
        this.isLoggedIn = isLoggedIn;
        this.canLogin = canLogin;
    }
}

/**
 * Ersetzt fetch() durch eine Mock-Funktion, die die Daten aus testdata.ts zurückliefert.
 * Rufen Sie diese Funktion in Ihren jeweiligen Tests.
 * 
 * @param loginStatus -- der aktuelle Login-Status
 */
export function mockFetch(loginStatus: LoginStatus = new LoginStatus(false, false)) {
    const mock = jest.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
        let data: any
        const url = input.toString();
        const method = (init && init.method)
            ? init.method : "GET";

        function api_alleProtokolle() {
            const match = url.match(/\/api\/protokoll\/alle/i);
            if (match) {
                return protokolle;
            }
            return undefined;
        }
        function api_protokollEintraege() {
            const match = url.match(/\/api\/protokoll\/(\d+)\/eintraege/i);
            if (match) {
                const id = match[1];
                switch (id) {
                    case "101": return eintraege;
                    default: return "Not found"
                }
            }
            return undefined;
        }
        function api_protokoll() {
            const match = url.match(/\/api\/protokoll\/(\d+)/i);
            if (match) {
                const id = match[1];
                if (id && isNaN(Number(id))) {
                    return new ValidationErrors([{ msg: "Validation error, id not correct", path: "id", location: "params", value: id }]);
                }
                const data = protokolle.find(e => e.id === id)
                return data ?? "Not found";
            }
            return undefined;
        }
        function api_eintrag() {
            const match = url.match(/\/api\/eintrag\/(\d+)/i);
            if (match) {
                const id = match[1];
                if (id && isNaN(Number(id))) {
                    return new ValidationErrors([{ msg: "Validation error, id not correct", path: "id", location: "params", value: id }]);
                }
                const data = eintraege.find(e => e.id === id);
                return data ?? "Not found";
            }
            return undefined;
        }
        function api_login() {
            const match = url.match(/\/api\/login/i);
            if (match) {
                switch (method) {
                    case "DELETE":
                        loginStatus.isLoggedIn = false;
                        return ""; // will be translated to 204
                    case "POST":
                        if (loginStatus.canLogin) {
                            loginStatus.isLoggedIn = true;
                            return { id: "501", role: "a", exp: 0 }
                        } else {
                            return "Login failed"
                        }
                    default: return loginStatus.isLoggedIn ? { id: "501", role: "a", exp: 0 } : false;
                }
            }
            return undefined;
        }

        data = api_alleProtokolle()
            || api_protokollEintraege()
            || api_protokoll()
            || api_eintrag()
            || api_login() /* may return false */;

        const resp: any /* Response */ = {
            headers: new Headers(),
            ok: false,
            status: 500,
            statusText: "Internal server error",
            type: "basic",
            url: url,
            clone: () => resp,
            redirected: false,
            body: null,
            bodyUsed: false,
        }

        if (data instanceof ValidationErrors) {
            resp.status = 400;
            resp.ok = false;
            resp.headers.set("Content-Type", "application/json");
            resp.json = () => Promise.resolve({ errors: data.errors });
            return Promise.resolve(resp);
        }

        switch (typeof data) {
            case 'boolean':
            case 'object':
                resp.headers.set("Content-Type", "application/json");
                resp.status = 200;
                resp.ok = true;
                resp.json = () => Promise.resolve(data);
                break;
            case 'string':
                switch (data) {
                    case "Login failed":
                        resp.status = 401; break;
                    case "":
                        resp.status = 204; break;
                    default:
                        resp.status = 404;
                        resp.text = () => Promise.resolve("<html><body><h1>Not found</h1></body></html>");
                        resp.headers.set("Content-Type", "text/html");
                }
                resp.ok = false;
                break;
            default:
                resp.status = 400;
                resp.ok = false;
                resp.headers.set("Content-Type", "application/json");
                resp.json = () => Promise.resolve({ errors: [{ msg: "Validation error", path: "someID", location: "params", value: "someValue" }] });
        }
        await new Promise(resolve => setTimeout(resolve, MOCK_FETCH_DELAY))
        return Promise.resolve(resp);
    });

    return mock;
}