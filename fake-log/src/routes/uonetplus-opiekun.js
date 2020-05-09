const express = require('express');
const router = express.Router();
const converter = require('../utils/converter');
const dictMap = require('../utils/dictMap');
const { getGradeColorByCategoryName } = require("../utils/gradeColor");
const _ = require('lodash');

global.opiekunRoot = "/powiatwulkanowy/123456";

router.all("/", (req, res) => {
    res.render("log-exception", {
        title: "Dziennik FakeUONET+",
        message: "Podany identyfikator klienta jest niepoprawny.",
    });
});

router.all("/powiatwulkanowy(/12345[678])?", (req, res) => {
    if (req.header("Referer") || "true" === req.query.login) {
        return res.redirect("/powiatwulkanowy/123456/Start/Index/");
    }

    res.render("login", {
        title: "Uczeń"
    });
});

router.get("/Start/Index/", (req, res) => {
    res.cookie("EfebSsoAuthCookie", "asdfasdfasdfasdfasdfasdfas", {
        domain: req.get('host').replace("uonetplus-opiekun", ""),
        path: '/',
        httpOnly: true
    });
    res.cookie("idBiezacyDziennik", "1234");
    res.render("opiekun/start", {title: "Witryna ucznia i rodzica – Strona główna"});
});

router.get("/Uczen/UczenOnChange", (req, res) => {
    res.cookie("idBiezacyUczen", req.query.id);

    res.redirect(req.header("Referer") ? req.header("Referer") : "../?login=true");
});

router.get("/Dziennik/DziennikOnChange", (req, res) => {
    res.cookie("idBiezacyDziennik", req.query.id);

    res.redirect(req.header("Referer") ? req.header("Referer") : "../");
});

router.get("/Uczen.mvc/DanePodstawowe", (req, res) => {
    res.render("opiekun/dane", {
        title: "Witryna ucznia i rodzica – Dane ucznia",
        data: require("../../data/opiekun/dane.json")
    });
});

router.get("/Oceny(\.mvc|)/Wszystkie", (req, res) => {
    let data;
    let viewPath;

    const teachers = require("../../data/api/dictionaries/Nauczyciele");
    const subjects = require("../../data/api/dictionaries/Przedmioty");
    const details = require("../../data/api/student/Oceny");
    const subjectCategories = require("../../data/api/dictionaries/KategorieOcen");
    const summary = require("../../data/api/student/OcenyPodsumowanie");
    const descriptiveGrades = require("../../data/api/student/OcenyOpisowe");

    if (req.query.details === '2') {
        data = details.map(item => {
            const teacher = dictMap.getByValue(teachers, "Id", item.IdPracownikD);
            const category = dictMap.getByValue(subjectCategories, "Id", item.IdKategoria);
            return {
                "subject": dictMap.getByValue(subjects, "Id", item.IdPrzedmiot).Nazwa,
                "value": item.Wpis === "" ? item.Komentarz : item.Wpis,
                "color": getGradeColorByCategoryName(category.Nazwa),
                "symbol": category.Kod,
                "description": item.Opis,
                "weight": item.Waga,
                "date": converter.formatDate(new Date(item.DataUtworzenia * 1000)),
                "teacher": teacher.Imie + " " + teacher.Nazwisko
            };
        });
        viewPath = "opiekun/oceny-szczegolowy";
    } else {
        viewPath = "opiekun/oceny-skrocony";
        data = {
            normalGrades: subjects.map(item => {
                return {
                    "subject": item.Nazwa,
                    "average": dictMap.getByValue(summary.SrednieOcen, "IdPrzedmiot", item.Id).SredniaOcen,
                    "predictedRating": dictMap.getByValue(summary.OcenyPrzewidywane, "IdPrzedmiot", item.Id).Wpis,
                    "finalRating": dictMap.getByValue(summary.OcenyPrzewidywane, "IdPrzedmiot", item.Id).Wpis
                };
            }),
            descriptiveGrades,
        };
    }

    res.render(viewPath, {
        title: "Witryna ucznia i rodzica – Oceny",
        data: data
    });
});

router.get("/Statystyki.mvc/Uczen", (req, res) => {
    let data;
    let viewPath;

    if (req.query.rodzajWidoku === '1') {
        viewPath = "opiekun/oceny-statystyki-czastkowe";
        data = require("../../data/opiekun/oceny-statystyki-czastkowe").map(item => {
            return {
                subject: item.subject,
                grade: item.grade,
                pupilAmount: item.pupilAmount,
                pupilPercent: item.pupilAmount !== 0 ? 25.000003 : 0,
                classAmount: item.classAmount,
                classPercent: item.classAmount !== 0 ? 25.000003 : 0
            };
        });
    } else {
        viewPath = "opiekun/oceny-statystyki-roczne";
        data = require("../../data/opiekun/oceny-statystyki-roczne").map(item => {
            return {
                subject: item.subject,
                grade: item.grade,
                amount: item.amount,
                percent: item.amount !== 0 ? 25.000003 : 0
            };
        });
    }

    res.render(viewPath, {
        title: "Witryna ucznia i rodzica – Statystyki ucznia",
        data: data
    });
});

router.get('/Frekwencja.mvc', (req, res) => {
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
    res.render("opiekun/frekwencja", {
        title: "Witryna ucznia i rodzica – Frekwencja",
        subjects: require("../../data/api/dictionaries/Przedmioty"),
        data: _.groupBy(require("../../data/api/student/Frekwencje").map(item => {
            const category = dictMap.getByValue(require("../../data/api/dictionaries/KategorieFrekwencji"), "Id", item.IdKategoria);
            return {
                number: item.Numer,
                subject: item.PrzedmiotNazwa,
                date: converter.formatDate(new Date(item.DzienTekst)),
                presence: category.Obecnosc,
                absence: category.Nieobecnosc,
                exemption: category.Zwolnienie,
                lateness: category.Spoznienie,
                excused: category.Usprawiedliwione,
                deleted: category.Usuniete,
                attendanceInfo: _.capitalize(category.Nazwa)
            };
        }), "number"),
        stats: require("../../data/opiekun/frekwencja-statystyki"),
        sumStats: sumStats,
        fullPresence: (
            (sumStats.presence + sumStats.lateness + sumStats.latenessExcused) /
            (sumStats.presence +
                sumStats.absence +
                sumStats.absenceExcused +
                sumStats.absenceForSchoolReasons +
                sumStats.lateness +
                sumStats.latenessExcused)
        ) * 100,
        weekDays: converter.getWeekDaysFrom(req.query.data),
        tics: {
            prev: converter.getPrevWeekTick(req.query.data),
            next: converter.getNextWeekTick(req.query.data)
        }
    });
});

router.get("/UwagiOsiagniecia.mvc/Wszystkie", (req, res) => {
    const teachers = require("../../data/api/dictionaries/Nauczyciele");
    const categories = require("../../data/api/dictionaries/KategorieUwag");

    res.render("opiekun/uwagi", {
        title: "Witryna ucznia i rodzica – Uwagi i osiągnięcia",
        notes: require("../../data/api/student/UwagiUcznia").map(item => {
            return {
                date: converter.formatDate(new Date(item.DataWpisuTekst)),
                teacher: `${item.PracownikImie} ${item.PracownikNazwisko} [${dictMap.getByValue(teachers, "Id", item.IdPracownik).Kod}]`,
                category: dictMap.getByValue(categories, "Id", item.IdKategoriaUwag).Nazwa,
                content: item.TrescUwagi
            };
        })
    });
});

router.get("/Lekcja(\.mvc|)/PlanZajec", (req, res) => {
    const teachers = require("../../data/api/dictionaries/Nauczyciele");
    const days = _.groupBy(require("../../data/api/student/PlanLekcjiZeZmianami").filter((item) => item.PlanUcznia).map(item => {
        const teacher = dictMap.getByValue(teachers, "Id", item.IdPracownik);
        const oldTeacher = dictMap.getByValue(teachers, "Id", item.IdPracownikOld);
        const times = dictMap.getByValue(require("../../data/api/dictionaries/PoryLekcji"), "Id", item.IdPoraLekcji);
        return {
            number: item.NumerLekcji,
            id: item.IdPoraLekcji,
            gap: false,
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
            date: converter.formatDate(new Date(item.DzienTekst)),
        };
    }), "date");

    const firstLesson = _.min(_.flatten(_.values(days)).map(e => e.number));
    const lastLesson = _.max(_.flatten(_.values(days)).map(e => e.number));

    const daysWithGaps = _.mapValues(days, day => {
        const dayWithGaps = [];
        let prevNumber = null;

        const beforeGap = day[0].number - firstLesson;

        for (i = 0; i < beforeGap; i++) {
            const number = firstLesson + i;
            const times = dictMap.getByValue(require("../../data/api/dictionaries/PoryLekcji"), "Numer", number);
            dayWithGaps.push({
                number,
                gap: true,
                start: times.PoczatekTekst,
                end: times.KoniecTekst,
            });
        }

        day.forEach(lesson => {
            let gap = 0;
            if (prevNumber !== null) {
                gap = lesson.number - prevNumber - 1;
            }

            for (i = 0; i < gap; i++) {
                const number = prevNumber + i + 1;
                const times = dictMap.getByValue(require("../../data/api/dictionaries/PoryLekcji"), "Numer", number);
                dayWithGaps.push({
                    number,
                    gap: true,
                    start: times.PoczatekTekst,
                    end: times.KoniecTekst,
                });
            }

            prevNumber = lesson.number;

            dayWithGaps.push(lesson);
        });

        const afterGap = lastLesson - prevNumber;

        for (i = 0; i < afterGap; i++) {
            const number = prevNumber + i + 1;
            const times = dictMap.getByValue(require("../../data/api/dictionaries/PoryLekcji"), "Numer", number);
            dayWithGaps.push({
                number,
                gap: true,
                start: times.PoczatekTekst,
                end: times.KoniecTekst,
            });
        }

        return dayWithGaps;
    });

    const data = _.groupBy(_.flatten(_.values(daysWithGaps)), "number");

    res.render("opiekun/plan-zajec", {
        title: "Witryna ucznia i rodzica – Plan lekcji",
        data,
        weekDays: converter.getWeekDaysFrom(req.query.data),
        tics: {
            prev: converter.getPrevWeekTick(req.query.data),
            next: converter.getNextWeekTick(req.query.data)
        }
    });
});

router.get("/Lekcja(\.mvc|)/Zrealizowane", (req, res) => {
    res.render("opiekun/plan-zrealizowane", {
        title: "Witryna ucznia i rodzica – Plan lekcji",
        subjects: require("../../data/api/dictionaries/Przedmioty"),
        data: _.groupBy(require("../../data/opiekun/plan-zrealizowane.json").map(item => {
            return {
                // jshint ignore:start
                ...item,
                // jshint ignore:end
                date: converter.formatDate(new Date(item.date))
            };
        }), "date")
    });
});

router.get("/Sprawdziany.mvc/Terminarz", (req, res) => {
    const subjects = require("../../data/api/dictionaries/Przedmioty");
    const teachers = require("../../data/api/dictionaries/Nauczyciele");
    const days = converter.getWeekDaysFrom(req.query.data);
    res.render("opiekun/sprawdziany", {
        title: "Witryna ucznia i rodzica – Terminarz sprawdzianów",
        data: _.groupBy(require("../../data/api/student/Sprawdziany").map((item, index) => {
            const subject = dictMap.getByValue(subjects, "Id", item.IdPrzedmiot);
            const teacher = dictMap.getByValue(teachers, "Id", item.IdPracownik);
            let examType;
            switch (item.RodzajNumer) {
                case 1: examType = "Sprawdzian"; break;
                case 2: examType = "Kartkówka"; break;
                case 3: examType = "Praca klasowa"; break;
                default: examType = "Nieznany";
            }
            return {
                entryDate: "01.01.1970",
                date: days[index][1],
                // date: converter.formatDate(new Date(item.DataTekst)),
                // dayName: converter.getDayName(item.DataTekst),
                dayName: days[index][0],
                subject: `${subject.Nazwa} ${res.locals.userInfo.OddzialKod}${item.PodzialSkrot ? "|" + item.PodzialSkrot : ""}`,
                type: examType,
                description: item.Opis,
                teacher: `${teacher.Imie} ${teacher.Nazwisko}`,
                teacherSymbol: teacher.Kod
            };
        }), "date"),
        weekDays: converter.getWeekDaysFrom(req.query.data),
        tics: {
            prev: converter.getPrevWeekTick(req.query.data),
            next: converter.getNextWeekTick(req.query.data)
        }
    });
});

router.get("/ZadaniaDomowe.mvc", (req, res) => {
    const subjects = require("../../data/api/dictionaries/Przedmioty");
    res.render("opiekun/zadania", {
        title: "Witryna ucznia i rodzica – Zadania domowe",
        homework: require("../../data/api/student/ZadaniaDomowe").map(item => {
            const teacher = dictMap.getByValue(require("../../data/api/dictionaries/Nauczyciele"), "Id", item.IdPracownik);
            const date = converter.getDateString(req.query.data);
            return {
                date: converter.formatDate(date),
                dayName: converter.getDayName(date),
                entryDate: converter.formatDate(new Date(item.DataTekst)),
                teacher: teacher.Imie + " " + teacher.Nazwisko,
                teacherSymbol: teacher.Kod,
                subject: dictMap.getByValue(subjects, "Id", item.IdPrzedmiot).Nazwa,
                content: item.Opis
            };
        }),
        tics: {
            prev: converter.getPrevDayTick(req.query.data),
            next: converter.getNextDayTick(req.query.data)
        }
    });
});

router.get("/Szkola.mvc/Nauczyciele", (req, res) => {
    const teachers = require("../../data/api/student/Nauczyciele");
    const subjectsDict = require("../../data/api/dictionaries/Przedmioty");
    const teachersDict = require("../../data/api/dictionaries/Pracownicy");

    const headmaster = dictMap.getByValue(teachersDict, "Id", teachers.NauczycieleSzkola[0].IdPracownik);
    const tutor = dictMap.getByValue(teachersDict, "Id", teachers.NauczycieleSzkola[3].IdPracownik);
    res.render("opiekun/szkola", {
        title: "Witryna ucznia i rodzica – Szkoła i nauczyciele",
        headMaster: `${headmaster.Imie} ${headmaster.Nazwisko}`,
        tutor: `${tutor.Imie} ${tutor.Nazwisko}`,
        teachers: teachers.NauczycielePrzedmioty.map(item => {
            const teacher = dictMap.getByValue(teachersDict, "Id", item.IdPracownik);
            return {
                subject: dictMap.getByValue(subjectsDict, "Id", item.IdPrzedmiot).Nazwa,
                name: `${teacher.Imie} ${teacher.Nazwisko} [${teacher.Kod}]`
            };
        })
    });
});

router.get("/DostepMobilny.mvc", (req, res) => {
    res.render('opiekun/mobilny', {
        title: "Witryna ucznia i rodzica – Dostęp mobilny",
        devices: require("../../data/opiekun/zarejestrowane-urzadzenia").map(item => {
            const created = item.DataUtworzenia.split(" ");
            return {
                // jshint ignore:start
                ...item,
                // jshint ignore:end
                "DataUtworzenia": `${converter.formatDate(new Date(created[0]))} godz: ${created[1]}`
            };
        })
    });
});

router.get('/DostepMobilny.mvc/Rejestruj', (req, res) => {
    res.render('opiekun/mobilny-rejestruj');
});

router.all('/DostepMobilny.mvc/PingForCertGeneratedToken', (req, res) => {
    res.json({
        success: true,
        data: req.body.idToken % 2 === 0
    });
});

router.get('/DostepMobilny.mvc/Wyrejestruj/:id', (req, res) => {
    res.render('opiekun/mobilny-wyrejestruj');
});

router.post("/DostepMobilny.mvc/PotwierdzWyrejestrowanie", (req, res) => {
    res.redirect("/DostepMobilny.mvc");
});

module.exports = router;
