const router = require('express').Router({});
const {createEnvelope} = require("./utils");
const {format} = require("date-fns");
const {uuid} = require("uuidv4");
const {getByValue} = require("./../../utils/dictMap");

router.get("/grade/byPupil", (req, res) => {
    const subjects = require("../../../data/api/dictionaries/Przedmioty");
    const categories = require("../../../data/api/dictionaries/KategorieOcen");
    const teachers = require("../../../data/api/dictionaries/Nauczyciele");

    res.json(createEnvelope(0, "OK", "IEnumerable`1", require("../../../data/api/student/Oceny").map(item => {
        return {
            "Column": {
                "Category": {
                    "Id": item.IdKategoria,
                    "Code": getByValue(categories, "Id", item.IdKategoria).Kod,
                    "Name": getByValue(categories, "Id", item.IdKategoria).Nazwa
                },
                "Code": getByValue(categories, "Id", item.IdKategoria).Kod,
                "Group": "",
                "Id": 0,
                "Key": uuid(),
                "Name": item.Opis,
                "Number": 0,
                "Period": 2,
                "Subject": {
                    "Id": item.IdPrzedmiot,
                    "Key": uuid(),
                    "Kod": getByValue(subjects, "Id", item.IdPrzedmiot).Kod,
                    "Name": getByValue(subjects, "Id", item.IdPrzedmiot).Nazwa,
                    "Position": getByValue(subjects, "Id", item.IdPrzedmiot).Pozycja
                },
                "Weight": item.WagaOceny,
            },
            "Comment": item.Komentarz,
            "Content": item.Wpis,
            "ContentRaw": `${item.Wartosc}`,
            "Creator": {
                "Id": item.IdPracownikD,
                "Name": getByValue(teachers, "Id", item.IdPracownikD).Imie,
                "Surname": getByValue(teachers, "Id", item.IdPracownikD).Nazwisko,
                "DisplayName": getByValue(teachers, "Id", item.IdPracownikD).Imie
            },
            "Modifier": {
                "Id": item.IdPracownikM,
                "Name": getByValue(teachers, "Id", item.IdPracownikM).Imie,
                "Surname": getByValue(teachers, "Id", item.IdPracownikM).Nazwisko,
                "DisplayName": getByValue(teachers, "Id", item.IdPracownikM).Imie
            },
            "DateCreated": {
                "Date": item.DataUtworzeniaTekst,
                "DateDisplay": item.DataUtworzeniaTekst,
                "Time": "00:01",
                "Timestamp": item.DataUtworzenia
            },
            "DateModify": {
                "Date": item.DataModyfikacjiTekst,
                "DateDisplay": item.DataModyfikacjiTekst,
                "Time": "00:02",
                "Timestamp": item.DataModyfikacji
            },
            "Id": item.Id,
            "Key": uuid(),
            "Numerator": item.Licznik,
            "Denominator": item.Mianownik,
            "PupilId": 111,
            "Value": item.Wartosc
        };
    })));
});

router.all("/lucky", (req, res) => {
    res.json(createEnvelope(0, "OK", "LuckyNumberPayload", {
        "Day": format(new Date(), "yyyy-MM-dd"),
        "Number": format(new Date(), "d")
    }));
});

module.exports = router;
