const express = require('express');
const router = express.Router();
const protocol = require('../utils/connection');
const dictMap = require('../utils/dictMap');
const converter = require('../utils/converter');
const Tokens = require('csrf');
const _ = require('lodash');
const {getGradeColorByCategoryName} = require("../utils/gradeColor");
const {format, fromUnixTime, getYear, addYears, addMonths, addDays, subDays, differenceInDays, parseISO, startOfWeek} = require('date-fns');

router.get("/", (req, res) => {
    const base = protocol(req) + "://" + req.get('host') + "/powiatwulkanowy/123456";
    res.json({
        status: "sucess",
        data: {
            endpoints: [
                "/Diety.mvc/Get",
                "/EgzaminySemestralne.mvc/Get",
                "/EgzaminyZewnetrzne.mvc/Get",
                "/EwidencjaObecnosci.mvc/Get",
                "/FormularzeSzablony.mvc/Get",
                "/FormularzeSzablonyDownload.mvc/Get",
                "/FormularzeWysylanie.mvc/Get",
                "/FormularzeWysylanie.mvc/Post",
                "/Frekwencja.mvc/Get",
                "/FrekwencjaStatystyki.mvc/Get",
                "/FrekwencjaStatystykiPrzedmioty.mvc/Get",
                "/Jadlospis.mvc/Get",
                "/LekcjeZrealizowane.mvc/GetPrzedmioty",
                "/LekcjeZrealizowane.mvc/GetZrealizowane",
                "/Oceny.mvc/Get",
                "/OkresyUmowOplat.mvc/Get",
                "/Oplaty.mvc/Get",
                "/PlanZajec.mvc/Get",
                "/Pomoc.mvc/Get",
                "/RejestracjaUrzadzeniaToken.mvc/Get",
                "/RejestracjaUrzadzeniaToken.mvc/Delete",
                "/RejestracjaUrzadzeniaTokenCertyfikat.mvc/Get",
                "/Sprawdziany.mvc/Get",
                "/Statystyki.mvc/GetOcenyCzastkowe",
                "/Statystyki.mvc/GetOcenyRoczne",
                "/Statystyki.mvc/GetPunkty",
                "/SzkolaINauczyciele.mvc/Get",
                "/Uczen.mvc/Get",
                "/UczenCache.mvc/Get",
                "/UczenDziennik.mvc/Get",
                "/Usprawiedliwienia.mvc/Post",
                "/UwagiIOsiagniecia.mvc/Get",
                "/ZadaniaDomowe.mvc/Get",
                "/ZarejestrowaneUrzadzenia.mvc/Get",
                "/ZarejestrowaneUrzadzenia.mvc/Delete",
                "/ZgloszoneNieobecnosci.mvc/Get",
                "/ZgloszoneNieobecnosci.mvc/Post"
            ].map(item => {
                return base + item;
            })
        }
    });
});

router.get("/Start", (req, res) => {
    res.render("uczen/start");
});

router.all("/UczenCache.mvc/Get", (req, res) => {
    res.json({
        "data": {
            "czyOpiekun": false,
            "czyJadlospis": false,
            "czyOplaty": false,
            "poryLekcji": require("../../data/api/dictionaries/PoryLekcji").map(item => {
                return {
                    Id: item.Id,
                    Numer: item.Numer,
                    Poczatek: "1900-01-01 " + item.PoczatekTekst + ":00",
                    Koniec: "1900-01-01 " + item.KoniecTekst + ":00",
                    DataModyfikacji: "1900-01-01 00:00:00",
                    IdJednostkaSprawozdawcza: 1,
                    Nazwa: "" + item.Numer,
                    OkresDataOd: fromUnixTime(item.OkresDataOd)
                };
            }),
            "pokazLekcjeZrealizowane": true,
            "serverDate": format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        }, "success": true,
    });
});

router.all("/UczenDziennik.mvc/Get", (req, res) => {
    res.json({
        "data": require('../../data/api/ListaUczniow').reduce((res, current) => {
            return res.concat(Array(current.OkresPoziom).fill(current)).map((item, i, array) => {
                return {
                    // jshint ignore:start
                    ...item,
                    // jshint ignore:end
                    OkresPoziom: (i + 1 - 4) > 0 ? i + 1 - 4 : i + 1,
                    IdOkresKlasyfikacyjny: (i + 1) * 2,
                    year: getYear(parseISO(item.OkresDataOdTekst)) + i - array.length + 1,
                    OkresDataOd: addYears(parseISO(item.OkresDataOdTekst), i - array.length + 1),
                    OkresDataDo: addYears(parseISO(item.OkresDataDoTekst), i - array.length + 1)
                };
            }).reverse();
        }, []).map(item => {
            return {
                Id: item.OkresPoziom,
                IdUczen: item.Id,
                UczenImie: item.Imie,
                UczenImie2: item.Imie2,
                UczenNazwisko: item.Nazwisko,
                IsDziennik: true,
                IdDziennik: (item.OkresNumer === 1 ? item.IdOkresKlasyfikacyjny : item.IdOkresKlasyfikacyjny - 1),
                IdPrzedszkoleDziennik: 0,
                Poziom: item.OkresPoziom,
                Symbol: item.OddzialSymbol,
                Nazwa: null,
                DziennikRokSzkolny: item.year,
                Okresy: [
                    item.OkresNumer === 1 ? item.IdOkresKlasyfikacyjny : item.IdOkresKlasyfikacyjny - 1,
                    item.OkresNumer === 2 ? item.IdOkresKlasyfikacyjny : item.IdOkresKlasyfikacyjny + 1
                ].map((semesterId, i) => {
                    return {
                        NumerOkresu: i + 1,
                        Poziom: item.OkresPoziom,
                        DataOd: format(addMonths(item.OkresDataOd, i * 5), 'yyyy-MM-dd HH:mm:ss'),
                        DataDo: format(addMonths(item.OkresDataDo, i * 7), 'yyyy-MM-dd HH:mm:ss'),
                        IdOddzial: item.IdOddzial,
                        IdJednostkaSprawozdawcza: item.IdJednostkaSprawozdawcza,
                        IsLastOkres: i === 1,
                        Id: semesterId
                    };
                }),
                "IdSioTyp": 11,
                "IsDorosli": false,
                "IsPolicealna": false,
                "Is13": false,
                "IsArtystyczna": false,
                "IsArtystyczna13": false,
                "IsSpecjalny": false,
                "IsPrzedszkola": false,
                "UczenPelnaNazwa": `${item.OkresPoziom}${item.OddzialSymbol} ${item.year} - ${item.Imie} ${item.Nazwisko}`
            };
        }),
        "success": true
    });
});

router.all("/Home.mvc/RefreshSession", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/Diety.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/EgzaminySemestralne.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/EgzaminyZewnetrzne.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/EwidencjaObecnosci.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/FormularzeSzablony.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/FormularzeSzablonyDownload.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/FormularzeWysylanie.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/FormularzeWysylanie.mvc/Post", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/Frekwencja.mvc/Get", (req, res) => {
    const attendance = require("../../data/api/student/Frekwencje");
    res.json({
        "data": {
            "UsprawiedliwieniaAktywne": true,
            "Dni": [],
            "UsprawiedliwieniaWyslane": [],
            "Frekwencje": attendance.map((item) => {
                let offset = (new Date(item.DzienTekst)).getDay() - (new Date(attendance[0].DzienTekst).getDay());
                let date;
                if (req.body.data) {
                    date = converter.formatDate(addDays(new Date(req.body.data.replace(" ", "T").replace(/Z$/, '') + "Z"), offset), true);
                } else date = item.DzienTekst;
                return {
                    "IdKategoria": item.IdKategoria,
                    "NrDnia": item.Numer,
                    "Symbol": "/",
                    "SymbolImage": "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
                    "PrzedmiotNazwa": item.PrzedmiotNazwa,
                    "IdPoraLekcji": item.IdPoraLekcji,
                    "Data": `${date} 00:00:00`,
                    "LekcjaOddzialId": item.Dzien * item.Numer
                };
            })
        },
        "success": true
    });
});

router.all("/FrekwencjaStatystyki.mvc/Get", (req, res) => {
    const attendance = require("../../data/opiekun/frekwencja-statystyki");
    const sumStats = require("../../data/opiekun/frekwencja-statystyki").reduce((prev, current) => {
        return {
            presence: prev.presence + current.presence,
            absence: prev.absence + current.absence,
            absenceExcused: prev.absenceExcused + current.absenceExcused,
            absenceForSchoolReasons: prev.absenceForSchoolReasons + current.absenceForSchoolReasons,
            lateness: prev.lateness + current.lateness,
            latenessExcused: prev.latenessExcused + current.latenessExcused,
            exemption: prev.exemption + current.exemption
        };
    });

    res.json({
        "data": {
            "Podsumowanie": Math.round((
                (sumStats.presence + sumStats.lateness + sumStats.latenessExcused) /
                (sumStats.presence +
                    sumStats.absence +
                    sumStats.absenceExcused +
                    sumStats.absenceForSchoolReasons +
                    sumStats.lateness +
                    sumStats.latenessExcused)
            ) * 10000) / 100,
            "Statystyki": [...Array(7).keys()].map(j => {
                const name = i => {
                    switch (i) {
                        case 0:
                            return "Obecność";
                        case 1:
                            return "Nieobecność nieusprawiedliwiona";
                        case 2:
                            return "Nieobecność usprawiedliwiona";
                        case 3:
                            return "Nieobecność z przyczyn szkolnych";
                        case 4:
                            return "Spóźnienie nieusprawiedliwione";
                        case 5:
                            return "Spóźnienie usprawiedliwione";
                        case 6:
                            return "Zwolnienie";
                    }
                };
                const value = (month, i) => {
                    switch (i) {
                        case 0:
                            return attendance[month].presence;
                        case 1:
                            return attendance[month].absence;
                        case 2:
                            return attendance[month].absenceExcused;
                        case 3:
                            return attendance[month].absenceForSchoolReasons;
                        case 4:
                            return attendance[month].lateness;
                        case 5:
                            return attendance[month].latenessExcused;
                        case 6:
                            return attendance[month].exemption;
                    }
                };
                return {
                    "Id": j + 1,
                    "NazwaTypuFrekwencji": name(j),
                    "Wrzesien": value(0, j),
                    "Pazdziernik": value(1, j),
                    "Listopad": value(2, j),
                    "Grudzien": value(3, j),
                    "Styczen": value(4, j),
                    "Luty": value(5, j),
                    "Marzec": value(6, j),
                    "Kwiecien": value(7, j),
                    "Maj": value(8, j),
                    "Czerwiec": value(9, j),
                    "Lipiec": value(10, j),
                    "Sierpien": value(11, j),
                    "Razem": 0
                };
            })
        },
        "success": true
    });
});

router.all("/FrekwencjaStatystykiPrzedmioty.mvc/Get", (req, res) => {
    const subjects = require("../../data/api/dictionaries/Przedmioty").map(item => {
        return {
            "Id": item.Id,
            "Nazwa": item.Nazwa
        };
    });
    subjects.unshift({
        "Id": -1,
        "Nazwa": "Wszystkie"
    });
    subjects.push({
        "Id": 0,
        "Nazwa": "Brak opisu lekcji"
    }, {
        "Id": 492,
        "Nazwa": "Opieka nad uczniami"
    });
    res.json({
        "data": subjects,
        "success": true
    });
});

router.all("/Jadlospis.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/LekcjeZrealizowane.mvc/GetPrzedmioty", (req, res) => {
    const subjects = require("../../data/api/dictionaries/Przedmioty").map(item => {
        return {
            "IdPrzedmiot": item.Id,
            "Nazwa": item.Nazwa
        };
    });
    subjects.unshift({
        "IdPrzedmiot": -1,
        "Nazwa": "Wszystkie"
    });
    res.json({
        "data": subjects,
        "success": true
    });
});

router.all("/LekcjeZrealizowane.mvc/GetZrealizowane", (req, res) => {
    const realized = require("../../data/opiekun/plan-zrealizowane.json");
    const requestDate = req.body.poczatek ? parseISO(req.body.poczatek.replace("T", " ").replace(/Z$/, '')) : parseISO(realized[0].date);
    const baseOffset = differenceInDays(requestDate, parseISO(realized[0].date));

    res.json({
        "data": _.groupBy(realized.map(item => {
            return {
                "Data": `${converter.formatDate(addDays(parseISO(item.date), baseOffset), true)} 00:00:00`,
                "Przedmiot": item.subject,
                "NrLekcji": item.number,
                "Temat": item.topic,
                "Nauczyciel": `${item.teacher} [${item.teacherSymbol}]`,
                "Zastepstwo": "",
                "Nieobecnosc": item.absence,
                "PseudonimUcznia": null,
                "ZasobyPubliczne": "",
                "PrzedmiotDisplay": item.subject
            };
        }), item => converter.formatDate(new Date(item.Data))),
        "success": true
    });
});

router.all("/Oceny.mvc/Get", (req, res) => {
    const summary = require("../../data/api/student/OcenyPodsumowanie");
    const teachers = require("../../data/api/dictionaries/Nauczyciele");
    const subjectCategories = require("../../data/api/dictionaries/KategorieOcen");
    const descriptiveGrades = require("../../data/api/student/OcenyOpisowe");

    res.json({
        "data": {
            "IsSrednia": true,
            "IsPunkty": true,
            "Oceny": require("../../data/api/dictionaries/Przedmioty").map((item, index) => {
                return {
                    "Przedmiot": item.Nazwa,
                    "Pozycja": item.Pozycja,
                    "OcenyCzastkowe": require("../../data/api/student/Oceny").filter(grade => grade.IdPrzedmiot === item.Id).map(item => {
                        const teacher = dictMap.getByValue(teachers, "Id", item.IdPracownikD);
                        const category = dictMap.getByValue(subjectCategories, "Id", item.IdKategoria);
                        return {
                            "Nauczyciel": `${teacher.Imie} ${teacher.Nazwisko}`,
                            "Wpis": item.Wpis,
                            "Waga": Math.round(item.WagaOceny),
                            "NazwaKolumny": item.Opis,
                            "KodKolumny": category.Kod,
                            "DataOceny": converter.formatDate(new Date(item.DataUtworzenia * 1000)),
                            "KolorOceny": parseInt(getGradeColorByCategoryName(category.Nazwa), 16)
                        };
                    }),
                    "ProponowanaOcenaRoczna": dictMap.getByValue(summary.OcenyPrzewidywane, "IdPrzedmiot", item.Id, {"Wpis": ""}).Wpis,
                    "OcenaRoczna": dictMap.getByValue(summary.OcenyPrzewidywane, "IdPrzedmiot", item.Id, {"Wpis": ""}).Wpis,
                    "ProponowanaOcenaRocznaPunkty": index * 2.5 + 1 + "",
                    "OcenaRocznaPunkty": index * 3 + 2 + "",
                    "Srednia": parseFloat(dictMap.getByValue(summary.SrednieOcen, "IdPrzedmiot", item.Id, {"SredniaOcen": "0"}).SredniaOcen.replace(/,/, '.')),
                    "SumaPunktow": dictMap.getByValue(summary.SrednieOcen, "IdPrzedmiot", item.Id, {"SumaPunktow": null}).SumaPunktow,
                    "WidocznyPrzedmiot": false
                };
            }),
            "OcenyOpisowe": descriptiveGrades,
            "TypOcen": 2,
            "IsOstatniSemestr": false,
            "IsDlaDoroslych": false
        },
        "success": true
    });
});

router.all("/OkresyUmowOplat.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/Oplaty.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/PlanZajec.mvc/Get", (req, res) => {
    const requestDate = req.body.data ?
        parseISO(req.body.data.replace("T", " ").replace(/Z$/, '')) :
        startOfWeek(new Date(), {weekStartsOn: 1});

    const teachers = require("../../data/api/dictionaries/Nauczyciele");
    const lessons = _.map(_.groupBy(require("../../data/api/student/PlanLekcjiZeZmianami").filter((item) => item.PlanUcznia).map((item) => {
        const teacher = dictMap.getByValue(teachers, "Id", item.IdPracownik);
        const oldTeacher = dictMap.getByValue(teachers, "Id", item.IdPracownikOld);
        const times = dictMap.getByValue(require("../../data/api/dictionaries/PoryLekcji"), "Id", item.IdPoraLekcji);
        return {
            number: item.NumerLekcji,
            id: item.IdPoraLekcji,
            start: times.PoczatekTekst,
            end: times.KoniecTekst,
            subject: item.PrzedmiotNazwa,
            group: item.PodzialSkrot,
            teacher: `${teacher.Imie} ${teacher.Nazwisko}`,
            oldTeacher: !_.isEmpty(oldTeacher) ? `${oldTeacher.Imie} ${oldTeacher.Nazwisko}` : false,
            room: item.Sala,
            info: item.AdnotacjaOZmianie,
            changes: item.PogrubionaNazwa,
            canceled: item.PrzekreslonaNazwa,
            date: new Date(item.DzienTekst),
        };
    }), 'number'), number => number.sort((a, b) => (a.date - b.date)));

    const earliestDay = new Date(_.minBy(_.flatten(_.values(lessons)), i => new Date(i.date)).date);
    const latestDay = new Date(_.maxBy(_.flatten(_.values(lessons)), i => new Date(i.date)).date);

    const rows = _.values(_.mapValues(lessons, item => {
        const row = {
            times: `${[item[0].number]}<br />${[item[0].start]}<br />${[item[0].end]}`,
            lessons: [],
        };
        let prevDay = subDays(earliestDay, 1);
        item.forEach(lesson => {
            const gapSize = differenceInDays(lesson.date, prevDay) - 1;
            for (let i = 0; i < gapSize; i++) {
                row.lessons.push('');
            }
            let cell = '';
            if (lesson.oldTeacher) {
                cell += `<span class="x-treelabel-inv">${lesson.subject}</span>`;
                cell += `<span class="x-treelabel-inv">${lesson.oldTeacher}</span>`;
                cell += `<span class="x-treelabel-inv">${lesson.room}</span>`;
                cell += `<span class="x-treelabel-ppl x-treelabel-zas">${lesson.subject}</span>`;
                cell += `<span class="x-treelabel-ppl x-treelabel-zas">${lesson.teacher}</span>`;
                cell += `<span class="x-treelabel-ppl x-treelabel-zas">${lesson.room}</span>`;
                cell += `<span class="x-treelabel-rlz">${lesson.info}</span>`;
            } else {
                if (lesson.group) {
                    cell += `<span class="${lesson.canceled ? 'x-treelabel-ppl x-treelabel-inv' : ''}">${lesson.subject} [${lesson.group}]</span>`;
                    cell += `<span class="${lesson.canceled ? 'x-treelabel-ppl x-treelabel-inv' : ''}"></span>`;
                } else {
                    cell += `<span class="${lesson.canceled ? 'x-treelabel-ppl x-treelabel-inv' : ''}">${lesson.subject}</span>`;
                }
                cell += `<span class="${lesson.canceled ? 'x-treelabel-ppl x-treelabel-inv' : ''}">${lesson.teacher}</span>`;
                cell += `<span class="${lesson.canceled ? 'x-treelabel-ppl x-treelabel-inv' : ''}">${lesson.room}</span>`;
                if (lesson.info) {
                    cell += `<span class="x-treelabel-rlz">${lesson.info}</span>`;
                }
            }
            row.lessons.push(`<div>${cell}</div>`);
            prevDay = lesson.date;
        });
        const gapSize = differenceInDays(latestDay, prevDay);
        for (let i = 0; i < gapSize; i++) {
            row.lessons.push('');
        }

        return row;
    }));

    res.json({
        "data": {
            "Data": format(requestDate, 'yyyy-MM-dd HH-mm-ss'),
            "Headers": [
                {
                    "Text": "Lekcja",
                    "Width": "85",
                    "Distinction": false,
                    "Flex": 0,
                },
                {
                    "Text": `poniedziałek<br />${converter.formatDate(addDays(requestDate, 0))}`,
                    "Width": null,
                    "Distinction": false,
                    "Flex": 1,
                },
                {
                    "Text": `wtorek<br />${converter.formatDate(addDays(requestDate, 1))}`,
                    "Width": null,
                    "Distinction": false,
                    "Flex": 1,
                },
                {
                    "Text": `środa<br />${converter.formatDate(addDays(requestDate, 2))}`,
                    "Width": null,
                    "Distinction": false,
                    "Flex": 1,
                },
                {
                    "Text": `czwartek<br />${converter.formatDate(addDays(requestDate, 3))}`,
                    "Width": null,
                    "Distinction": false,
                    "Flex": 1,
                },
                {
                    "Text": `piątek<br />${converter.formatDate(addDays(requestDate, 4))}`,
                    "Width": null,
                    "Distinction": false,
                    "Flex": 1,
                },
            ],
            "Rows": rows.map(row => [row.times, ...row.lessons]),
        },
        "success": true
    });
});

router.all("/Pomoc.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/RejestracjaUrzadzeniaToken.mvc/Get", (req, res) => {
    const student = require('../../data/api/ListaUczniow')[1];
    const base = protocol(req) + "://" + req.get('host');
    const token = new Tokens({secretLength: 97, saltLength: 4});
    const secret = token.secretSync();
    res.json({
        "data": {
            "TokenId": 423,
            "TokenKey": "FK100000",
            "CustomerGroup": "powiatwulkanowy",
            "CustomerSymbol": student.JednostkaSprawozdawczaSymbol,
            "QrCodeContent": `CERT#${base}/powiatwulkanowy/mobile-api#FK100000#ENDCERT`,
            "QrCodeContentEncoded": "xxx", // TODO: create and use qr encrypt
            "QrCodeImage": "<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAACTAQMAAACwK7lWAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB+klEQVRIieWWvY3EIBCFxyIggwaQaMMZLdkN+KcBb0tktIFEA96MAHnusV7pLvTEhzZYfwHyvHlvxkT/7VjmV2rLqM7AW+BLwgypV/VbIFv9NeJRwkJ51fJixZW3kQ8pS2Sjm7Q/5GzTzWi8EU1ShjqSm6jssfyt7QmDfsdYvr9fTR+xfoLaU5voFzxkNvIe3Rz50ETaXxJmgpsrhEcp2aa8SBgFPonPsZza710MCdPOkFuIN52H2oyEdZ+yQ9/eXM7QSMJM7xXvjL7RnO77njIacV+bRgjQbBUyXKkVR39oWFVtEmaT36gNzO+Uh3jr95QREpluDRSwjI2FE80xLwHGKZuEDZxtLcwIJazaJgmzld+Vz1AOXd7pvu8pG2ov3WhnY16hoox57kzt0SPcRsYIyRgSbN6m0ETMJrUFdaF67daYJwkzIc/oWPV75T19Z/ZDhnzgYHrNDJ8WETN0+6WtkdZKi4T1AcZugX4VucwkYZg9ay1bwIu47jgJo+D5MzjPkVb+5vIpG/Oa+vxbgoNnScJsVa/YhoSNgft4k7CP/AhHnjSKuHfUU4a+7SnP0b979766PGSf/YbFiF3hr28uHzMkEuKFbHSv4xCyrXeP4Jch3vNPwsY+OHu4qzMihjpi6XtV+5PKJWGf7yaFFYfPn4nwR8D+1/kBSYetNXqSF/8AAAAASUVORK5CYII=\" alt=\"Kod QR\" title=\"Kod QR\" height=\"400\" width=\"400\" />",
            "ImageSize": 400,
            "IdLogin": student.UzytkownikLoginId,
            "LoginValue": student.UzytkownikLogin,
            "PIN": "999999",
            "AntiForgeryAppGuid": secret,
            "AntiForgeryToken": token.create(secret)
        },
        "success": true
    });
});

router.all("/RejestracjaUrzadzeniaToken.mvc/Delete", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/RejestracjaUrzadzeniaTokenCertyfikat.mvc/Get", (req, res) => {
    res.json({
        "data": true,
        "success": true
    });
});

router.all("/Sprawdziany.mvc/Get", (req, res) => {
    const subjects = require("../../data/api/dictionaries/Przedmioty");
    const teachers = require("../../data/api/dictionaries/Nauczyciele");
    const exams = require("../../data/api/student/Sprawdziany");
    const requestDate = req.body.data ? parseISO(req.body.data.replace("T", " ").replace(/Z$/, '')) : parseISO(exams[0].DataTekst);
    const baseOffset = differenceInDays(requestDate, parseISO(exams[0].DataTekst));

    res.json({
        "data": [...Array(4).keys()].map(function (j) {
            return {
                "SprawdzianyGroupedByDayList": converter.getWeekDaysFrom(addDays(requestDate, (7 * j)), 7).map((day, i) => {
                    return {
                        "Data": converter.formatDate(day[2], true) + " 00:00:00",
                        "Sprawdziany": exams.filter(exam => {
                            return 0 === differenceInDays(day[2], addDays(parseISO(exam.DataTekst), baseOffset + (7 * j)));
                        }).map(item => {
                            const subject = dictMap.getByValue(subjects, "Id", item.IdPrzedmiot);
                            const teacher = dictMap.getByValue(teachers, "Id", item.IdPracownik);

                            return {
                                "DisplayValue": `${subject.Nazwa} ${res.locals.userInfo.OddzialKod}${item.PodzialSkrot ? "|" + item.PodzialSkrot : ""}`,
                                "PracownikModyfikujacyDisplay": `${teacher.Imie} ${teacher.Nazwisko} [${teacher.Kod}]`,
                                "DataModyfikacji": `1970-01-01 00:00:00`,
                                "Opis": item.Opis,
                                "Rodzaj": item.RodzajNumer
                            };
                        }),
                        "Pokazuj": i < 5
                    };
                })
            };
        }),
        "success": true
    });
});

router.all("/Statystyki.mvc/GetOcenyCzastkowe", (req, res) => {
    res.json({
        "data": _.chain(require("../../data/opiekun/oceny-statystyki-czastkowe"))
            .groupBy("subject")
            .map((series, subject) => ({subject, series}))
            .value()
            .map(item => {
                return {
                    "Subject": item.subject,
                    "IsAverage": false,
                    "ClassSeries": {
                        "Average": null,
                        "IsEmpty": false,
                        "Items": item.series.map(item => {
                            return {
                                "Label": item.classAmount.toString(),
                                "Value": item.classAmount
                            };
                        })
                    },
                    "StudentSeries": {
                        "Average": null,
                        "IsEmpty": false,
                        "Items": item.series.map(item => {
                            return {
                                "Label": item.pupilAmount.toString(),
                                "Value": item.pupilAmount
                            };
                        })
                    }
                };
            }),
        "success": true
    });
});

router.all("/Statystyki.mvc/GetOcenyRoczne", (req, res) => {
    res.json({
        "data": _.chain(require("../../data/opiekun/oceny-statystyki-roczne"))
            .groupBy("subject")
            .map((series, subject) => ({subject, series}))
            .value()
            .map(item => {
                return {
                    "Subject": item.subject,
                    "IsEmpty": false,
                    "Items": item.series.map((item, i) => {
                        return {
                            "Label": item.amount.toString(),
                            "Description": i === 2 ? "Tu jesteś" : "",
                            "Value": item.amount
                        };
                    })
                };
            }),
        "success": true
    });
});

router.all("/Statystyki.mvc/GetPunkty", (req, res) => {
    res.json({
        "data": require("../../data/opiekun/oceny-statystyki-punkty"),
        "success": true
    });
});

router.all("/SzkolaINauczyciele.mvc/Get", (req, res) => {
    const teachers = require("../../data/api/student/Nauczyciele");
    const subjectsDict = require("../../data/api/dictionaries/Przedmioty");
    const teachersDict = require("../../data/api/dictionaries/Pracownicy");

    const headmaster = dictMap.getByValue(teachersDict, "Id", teachers.NauczycieleSzkola[0].IdPracownik);
    const tutor = dictMap.getByValue(teachersDict, "Id", teachers.NauczycieleSzkola[3].IdPracownik);
    res.json({
        "data": {
            "Szkola": {
                "Nazwa": res.locals.userInfo.JednostkaNazwa,
                "Adres": "Ul. Wulkanowego 30, 30-300 Fakelog.cf, Polska",
                "Kontakt": "+30 300 300 300",
                "Dyrektor": `${headmaster.Imie} ${headmaster.Nazwisko}`,
                "Pedagog": `${tutor.Imie} ${tutor.Nazwisko}`,
                "Id": 0
            },
            "Nauczyciele": require("../../data/api/student/Nauczyciele").NauczycielePrzedmioty.map(item => {
                const teacher = dictMap.getByValue(teachersDict, "Id", item.IdPracownik);
                return {
                    "Nazwa": dictMap.getByValue(subjectsDict, "Id", item.IdPrzedmiot).Nazwa,
                    "Nauczyciel": `${teacher.Imie} ${teacher.Nazwisko} [${teacher.Kod}]`,
                    "Id": 0
                };
            }),
            "Klasa": "Klasa 8A"
        },
        "success": true
    });
});

router.all("/Uczen.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/Usprawiedliwienia.mvc/Post", (req, res) => {
    res.json({
        "data": {
            "success": true
        },
        "success": true
    });
});

router.all("/UwagiIOsiagniecia.mvc/Get", (req, res) => {
    const categories = require("../../data/api/dictionaries/KategorieUwag");
    const teachers = require("../../data/api/dictionaries/Pracownicy");
    let i = 1;
    res.json({
        "data": {
            "Uwagi": require("../../data/api/student/UwagiUcznia").map(item => {
                return {
                    "TrescUwagi": item.TrescUwagi,
                    "Kategoria": dictMap.getByValue(categories, "Id", item.IdKategoriaUwag).Nazwa,
                    "DataWpisu": format(fromUnixTime(item.DataWpisu), 'yyyy-MM-dd HH:mm:ss'),
                    "Nauczyciel": `${item.PracownikImie} ${item.PracownikNazwisko} [${dictMap.getByValue(teachers, "Id", item.IdPracownik).Kod}]`,

                    // 19.06
                    "Punkty": item._points,
                    "PokazPunkty": item._showPoints,
                    "KategoriaTyp": item._category
                };
            }),
            "Osiagniecia": []
        },
        "success": true
    });
});

router.all("/ZadaniaDomowe.mvc/Get", (req, res) => {
    const subjects = require("../../data/api/dictionaries/Przedmioty");
    const teachers = require("../../data/api/dictionaries/Nauczyciele");
    const homework = require("../../data/api/student/ZadaniaDomowe");
    const requestDate = req.body.data ? parseISO(req.body.data.replace("T", " ").replace(/Z$/, '')) : parseISO(homework[0].DataTekst);
    // const baseOffset = differenceInDays(requestDate, parseISO(homework[0].DataTekst));

    res.json({
        "data": [...Array(7).keys()].map(j => {
            return {
                "Data": converter.formatDate(addDays(requestDate, j), true) + " 00:00:00",
                "ZadaniaDomowe": homework.filter(item => {
                    return j < 5;
                    // return 0 === differenceInDays(addDays(requestDate, j), addDays(parseISO(item.DataTekst), baseOffset));
                }).map(item => {
                    const teacher = dictMap.getByValue(teachers, "Id", item.IdPracownik);
                    const attachments = [
                        "<a href=\"https://wulkanowy.github.io/\" target=\"_blank\">Strona główna Wulkanowego</a>",
                        "<a href=\"https://github.com/wulkanowy/wulkanowy/\" target=\"_blank\">Repozytorium kodu</a>"
                    ];
                    return {
                        "Przedmiot": dictMap.getByValue(subjects, "Id", item.IdPrzedmiot).Nazwa,
                        "Pracownik": `${teacher.Imie} ${teacher.Nazwisko} [${teacher.Kod}], ${converter.formatDate(new Date(item.DataTekst))}`,
                        "Opis": item.Opis,
                        "DataModyfikacji": converter.formatDate(new Date(item.DataTekst), true) + " 00:00:00",
                        "Attachments": item.Id % 2 == 0 ? attachments : []
                    };
                }),
                "Pokazuj": j < 5
            };
        }),
        "success": true
    });
});

router.all("/ZarejestrowaneUrzadzenia.mvc/Get", (req, res) => {
    res.json({
        "data": require("../../data/opiekun/zarejestrowane-urzadzenia"),
        "success": true
    });
});

router.all("/ZarejestrowaneUrzadzenia.mvc/Delete", (req, res) => {
    res.json({
        "data": null,
        "success": true
    });
});

router.all("/ZgloszoneNieobecnosci.mvc/Get", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

router.all("/ZgloszoneNieobecnosci.mvc/Post", (req, res) => {
    res.json({
        "data": {},
        "success": true
    });
});

module.exports = router;
