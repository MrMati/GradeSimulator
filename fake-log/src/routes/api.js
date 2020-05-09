const router = require('express').Router();
const protocol = require('../utils/connection');
const {format} = require("date-fns");

router.all("/", (req, res) => {
    const today = format(new Date(), "yyyy-MM-dd");

    let base = protocol(req) + "://" + req.get('host');
    res.json({
        "status": "success",
        "start": base.replace("api.", ""),
        "repo": "https://github.com/wulkanowy/fake-log",
        "sdk": "https://github.com/wulkanowy/sdk",
        "docs": "https://gitlab.com/erupcja/uonet-api-docs",
        "api": [
            base + "/powiatwulkanowy/api/mobile/register/new",
            base + "/powiatwulkanowy/api/mobile/register/hebe",
            base + "/powiatwulkanowy/123456/api/mobile/register/hebe",
            base + "/powiatwulkanowy/123456/api/mobile/version?app=DzienniczekPlus%202.0",
            base + "/powiatwulkanowy/123456/api/mobile/heartbeat",
            base + "/powiatwulkanowy/123456/api/mobile/internal/time",
            base + "/powiatwulkanowy/123456/api/mobile/school/lucky?constituentId=2&day=" + today,
            base + "/powiatwulkanowy/123456/api/mobile/school/grade/byPupil??unitId=2&pupilId=111&periodId=101&lastSyncDate=1970-01-01%2001%3A00%3A00&lastId=-2147483648&pageSize=500",
        ],
        "mobile-api": [
            base + "/powiatwulkanowy/mobile-api/Uczen.v3.UczenStart/Certyfikat",
            base + "/powiatwulkanowy/mobile-api/Uczen.v3.UczenStart/ListaUczniow",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/LogAppStart",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/Slowniki",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/PlanLekcjiZeZmianami",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/Oceny",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/OcenyPodsumowanie",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/Sprawdziany",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/UwagiUcznia",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/Frekwencje",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/ZadaniaDomowe",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/Nauczyciele",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/WiadomosciOdebrane",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/WiadomosciWyslane",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/WiadomosciUsuniete",
            base + "/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen/DodajWiadomosc"
        ]
    });
});

// v3
router.use("/powiatwulkanowy/mobile-api/Uczen.v3.UczenStart", require("./mobile-api/register"));
router.use("/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen", require("./mobile-api/student"));
router.use("/powiatwulkanowy/123456/mobile-api/Uczen.v3.Uczen", require("./mobile-api/messages"));
router.use("/powiatwulkanowy/123456/mobile-api/Push.v1.Push", require("./mobile-api/push"));

// hebe
router.use("/powiatwulkanowy/api/mobile/register", require("./api/register"));
router.use("/powiatwulkanowy/123456/api/mobile/register", require("./api/register"));
router.use("/powiatwulkanowy/123456/api/mobile", require("./api/student"));
router.use("/powiatwulkanowy/123456/api/mobile/school", require("./api/school"));

router.all("/*", (req, res) => {
    res.status(404).json({
        "status": "error",
        "message": "Not implemented yet"
    });
});

module.exports = router;
