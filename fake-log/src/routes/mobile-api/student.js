const router = require('express').Router({});
const api = require('../../utils/api');
const converter = require('../../utils/converter');
const {addDays, differenceInDays, parseISO, startOfWeek, getTime} = require('date-fns');

router.all("/LogAppStart", (req, res) => {
    res.json(api.createResponse("Log"));
});

router.all("/UstawPushToken", (req, res) => {
    res.json(api.createResponse("Zapisano tokenId dla powiadomien PUSH"));
});

router.all("/Slowniki", (req, res) => {
    res.json(api.createResponse({
        "TimeKey": Math.round(new Date().getTime() / 1000),
        "Nauczyciele": require("../../../data/api/dictionaries/Nauczyciele"),
        "Pracownicy": require("../../../data/api/dictionaries/Pracownicy"),
        "Przedmioty": require("../../../data/api/dictionaries/Przedmioty"),
        "PoryLekcji": require("../../../data/api/dictionaries/PoryLekcji"),
        "KategorieOcen": require("../../../data/api/dictionaries/KategorieOcen"),
        "KategorieUwag": require("../../../data/api/dictionaries/KategorieUwag"),
        "KategorieFrekwencji": require("../../../data/api/dictionaries/KategorieFrekwencji"),
        "TypyFrekwencji": require("../../../data/api/dictionaries/TypyFrekwencji")
    }));
});

router.all("/PlanLekcjiZeZmianami", (req, res) => {
    const timetable = require("../../../data/api/student/PlanLekcjiZeZmianami");
    const requestDate = req.body.DataPoczatkowa ? parseISO(req.body.DataPoczatkowa) : startOfWeek(new Date(), {weekStartsOn: 1});
    const baseOffset = differenceInDays(requestDate, parseISO(timetable[0].DzienTekst));

    res.json(api.createResponse(timetable.map(item => {
        const date = addDays(parseISO(item.DzienTekst), baseOffset);
        return {
            ...item,
            Dzien: getTime(date) / 1000,
            DzienTekst: converter.formatDate(date, true)
        };
    })));
});

router.all("/Oceny", (req, res) => {
    res.json(api.createResponse(require("../../../data/api/student/Oceny")));
});

router.all("/OcenyPodsumowanie", (req, res) => {
    res.json(api.createResponse(require("../../../data/api/student/OcenyPodsumowanie")));
});

router.all("/Sprawdziany", (req, res) => {
    const exams = require("../../../data/api/student/Sprawdziany");
    const requestDate = req.body.DataPoczatkowa ? parseISO(req.body.DataPoczatkowa) : startOfWeek(new Date(), {weekStartsOn: 1});
    const baseOffset = differenceInDays(requestDate, parseISO(exams[0].DataTekst));

    res.json(api.createResponse(exams.map(item => {
        const date = addDays(parseISO(item.DataTekst), baseOffset);
        return {
            ...item,
            Data: getTime(date) / 1000,
            DataTekst: converter.formatDate(date, true)
        };
    })));
});

router.all("/UwagiUcznia", (req, res) => {
    res.json(api.createResponse(require("../../../data/api/student/UwagiUcznia")));
});

router.all("/Frekwencje", (req, res) => {
    const attendance = require("../../../data/api/student/Frekwencje");
    const requestDate = req.body.DataPoczatkowa ? parseISO(req.body.DataPoczatkowa) : startOfWeek(new Date(), {weekStartsOn: 1});
    const baseOffset = differenceInDays(requestDate, parseISO(attendance[0].DzienTekst));

    res.json(api.createResponse({
        "DataPoczatkowa": 1524434400,
        "DataKoncowa": 1525039199,
        "DataPoczatkowaTekst": req.body.DataPoczatkowa,
        "DataKoncowaTekst": req.body.DataKoncowa,
        "Frekwencje": attendance.map(item => {
            const date = addDays(parseISO(item.DzienTekst), baseOffset);
            return {
                ...item,
                Dzien: getTime(date) / 1000,
                DzienTekst: converter.formatDate(date, true)
            };
        })
    }));
});

router.all("/ZadaniaDomowe", (req, res) => {
    const homework = require("../../../data/api/student/ZadaniaDomowe");
    const requestDate = req.body.DataPoczatkowa ? parseISO(req.body.DataPoczatkowa) : startOfWeek(new Date(), {weekStartsOn: 1});
    const baseOffset = differenceInDays(requestDate, parseISO(homework[0].DataTekst));

    res.json(api.createResponse(homework.map(item => {
        const date = addDays(parseISO(item.DataTekst), baseOffset);
        return {
            ...item,
            Data: getTime(date) / 1000,
            DataTekst: converter.formatDate(date, true)
        };
    })));
});

router.all("/Nauczyciele", (req, res) => {
    res.json(api.createResponse(require("../../../data/api/student/Nauczyciele")));
});

module.exports = router;
