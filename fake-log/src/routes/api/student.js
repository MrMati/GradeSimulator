const router = require('express').Router({});
const {createEnvelope} = require("./utils");
const {getTime, format} = require("date-fns");

router.all("/version", (req, res) => {
    res.json(createEnvelope(105, "Podany czas jest nieprawidłowy", "Object", null));
});

router.all("/internal/time", (req, res) => {
    res.json(createEnvelope(0, "OK", "DateInfoPayload", {
        "Date": format(new Date(), "yyyy-MM-dd"),
        "DateDisplay": format(new Date(), "dd.MM.yyyy"),
        "Time": format(new Date(), "HH:mm:ss"),
        "Timestamp": getTime(new Date())
    }));
});

router.all("/heartbeat", (req, res) => {
    res.json(createEnvelope(0, "OK", "Boolean", true));
});

module.exports = router;
