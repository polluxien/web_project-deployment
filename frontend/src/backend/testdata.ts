// istanbul ignore file

import { ProtokollResource, EintragResource } from "../Resources";

export const protokolle: ProtokollResource[] = [
    {
        id: "101",
        patient: "Hans Castorp",
        datum: "01.10.1907",
        public: true,
        closed: false,
        ersteller: "501",
        erstellerName: "Hofrat Behrens",
        updatedAt: "01.10.2023",
        gesamtMenge: 1200
    },
    {
        id: "102",
        patient: "Clawdia Chauchat",
        datum: "31.12.1907",
        public: true,
        closed: false,
        ersteller: "501",
        erstellerName: "Hofrat Behrens",
        updatedAt: "02.10.2023",
        gesamtMenge: 1300
    },
    {
        id: "103",
        patient: "Hans Castorp",
        datum: "01.11.1907",
        public: true,
        closed: false,
        ersteller: "501",
        erstellerName: "Hofrat Behrens",
        updatedAt: "03.10.2023",
        gesamtMenge: 1100
    },
]

export const eintraege: EintragResource[] = [
    {
        id: "201",
        getraenk: "Tee",
        menge: 150,
        kommentar: "Selbstständig getrunken",
        ersteller: "501",
        erstellerName: "Hofrat Behrens",
        createdAt: "01.01.1908",
        protokoll: "101"
    },
    {
        id: "202",
        getraenk: "Wasser",
        menge: 200,
        ersteller: "501",
        erstellerName: "Hofrat Behrens",
        createdAt: "02.01.1908",
        protokoll: "202"
    },
    {
        id: "203",
        getraenk: "Sekt",
        menge: 250,
        ersteller: "501",
        erstellerName: "Hofrat Behrens",
        createdAt: "02.01.1908",
        protokoll: "202"
    }
];
