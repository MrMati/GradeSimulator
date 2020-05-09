const router = require('express').Router({});
const api = require("../../utils/api");

router.all("/ZmienStatusWiadomosci", (req, res) => {
    res.json(api.createResponse("Zmiana statusu wiadomości."));
});

router.all("/WiadomosciOdebrane", (req, res) => {
    res.json(api.createResponse(require("../../../data/api/messages/WiadomosciOdebrane")));
});

router.all("/WiadomosciWyslane", (req, res) => {
    res.json(api.createResponse(require("../../../data/api/messages/WiadomosciWyslane")));
});

router.all("/WiadomosciUsuniete", (req, res) => {
    res.json(api.createResponse(require("../../../data/api/messages/WiadomosciUsuniete")));
});

router.all("/DodajWiadomosc", (req, res) => {
    res.json(api.createResponse(require("../../../data/api/messages/DodajWiadomosc")));
});

module.exports = router;
