import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { LoginStatus, mockFetch } from './mockFetch';
import { act } from 'react-dom/test-utils';
import { clean } from 'semver';

expect.extend({
    toBeButtonOrLink(received) {
        const pass = ["A", "BUTTON"].includes(received.tagName);
        return {
            pass,
            message: () => `expected ${received} to be a button or tag, was ${received.tagName}`
        }
    }
});
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeButtonOrLink(): R;
        }
    }
}

test('Simple Happy Path', async () => {
    const loginStatus = new LoginStatus(false, true); //  noch nicht eingeloggt, Nutzer kann sich einloggen
    mockFetch(loginStatus); // fetch wird gemockt

    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);

    //////////////////////////////////////
    // Initiale Protokolle sollte geladen sein
    await waitFor(() => {
        const title = screen.getAllByText(/Castorp/i);
        expect(title.length).toBeGreaterThanOrEqual(1);
    });

    //////////////////////////////////////
    // Login-Button im Menü sollte vorhanden sein
    const login = screen.getByText(/Login/i);
    expect(login).toBeButtonOrLink();
    act(() => {
        login.click();
    });

    //////////////////////////////////////
    // Login-Dialog sollte jetzt sichtbar sein
    await waitFor(() => {
        screen.getByLabelText(/Name/i);
        screen.getByLabelText(/Passwort/i);
        expect(screen.getByText("OK")).toBeButtonOrLink();
        expect(screen.getByText("Abbrechen")).toBeButtonOrLink();
    });

    //////////////////////////////////////
    // Login-Dialog ausfüllen und OK klicken
    const email = screen.getByLabelText(/Name/i);
    const password = screen.getByLabelText(/Passwort/i);
    const ok = screen.getByText("OK");
    act(() => {
        fireEvent.change(email, { target: { value: "john@some-host.de" } });
        fireEvent.change(password, { target: { value: "12abcAB!" } });
        fireEvent.click(ok);
    });

    expect(loginStatus.isLoggedIn).toBeTruthy(); // Nutzer sollte jetzt eingeloggt sein
    
    //////////////////////////////////////
    // Index-Seite nach Anmeldung, neue Protokoll-Buttons sollten vorhanden sein
    cleanup(); // Löschen des internen React-Status, damit wirklich alles neu gerendert wird und nichts doppelt erscheint.
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    // Initiale Shop-Listen sollte geladen sein
    await waitFor(() => {
        screen.getByText(/Logout/i);
        expect(screen.getByText("Neues Protokoll")).toBeButtonOrLink();
    });
    
    expect(loginStatus.isLoggedIn).toBeTruthy(); // Nutzer sollte noch immer eingeloggt sein
    
    //////////////////////////////////////
    // Protokoll (nach erfolgreicher Anmeldung)
    cleanup();
    render(<MemoryRouter initialEntries={["/protokoll/101"]}><App /></MemoryRouter>);
    // Editier-Buttons sollten vorhanden sein
    await waitFor(() => {
        screen.getByText(/Logout/i);
        expect(screen.getByText("Editieren")).toBeButtonOrLink();
        expect(screen.getByText("Löschen")).toBeButtonOrLink();
        expect(screen.getByText("Neuer Eintrag")).toBeButtonOrLink();
    });

    //////////////////////////////////////
    // Editieren des Protokolls
    act(() => {
        screen.getByText("Editieren").click();
    });
    await waitFor(() => {
        expect(screen.getByText("Speichern")).toBeButtonOrLink();
        expect(screen.getByText("Abbrechen")).toBeButtonOrLink();
    });

    //////////////////////////////////////
    // Eintrag (nach erfolgreicher Anmeldung)
    cleanup();
    render(<MemoryRouter initialEntries={["/eintrag/201"]}><App /></MemoryRouter>);
    // Editier-Buttons sollten vorhanden sein
    await waitFor(() => {
        expect(screen.getByText("Editieren")).toBeButtonOrLink();
        expect(screen.getByText("Löschen")).toBeButtonOrLink();
    });

    //////////////////////////////////////
    // Editieren des Eintrags
    screen.getByText("Editieren").click();
    await waitFor(() => {
        expect(screen.getByText("Speichern")).toBeButtonOrLink();
        expect(screen.getByText("Abbrechen")).toBeButtonOrLink();
    });
});
