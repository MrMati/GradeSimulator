const express = require('express');
const router = express.Router();
const protocol = require('../utils/connection');

router.get("/powiatwulkanowy/Start.mvc/Endpoints", (req, res) => {
    const base = protocol(req) + "://" + req.get('host') + "/powiatwulkanowy/Start.mvc";
    res.json({
        status: "sucess",
        data: {
            endpoints: [
                "/GetSelfGovernments",
                "/GetStudentTrips",
                "/GetLastNotes",
                "/GetFreeDays",
                "/GetKidsLuckyNumbers",
                "/GetKidsLessonPlan",
                "/GetLastHomeworks",
                "/GetLastTests",
                "/GetLastStudentLessons",
            ].map(item => {
                return base + item;
            })
        }
    });
});

router.all("/powiatwulkanowy/Start.mvc/GetSelfGovernments", (req, res) => {
    res.json({
        "data": [],
        "success": false,
        "errorMessage": "Not implemented yet",
        "feedback": null
    });
});

router.all("/powiatwulkanowy/Start.mvc/GetStudentTrips", (req, res) => {
    res.json({
        "data": [],
        "success": false,
        "errorMessage": "Not implemented yet",
        "feedback": null
    });
});

router.all("/powiatwulkanowy/Start.mvc/GetLastNotes", (req, res) => {
    res.json(require("../../data/uonetplus/GetLastNotes"));
});

router.all("/powiatwulkanowy/Start.mvc/GetFreeDays", (req, res) => {
    res.json(require("../../data/uonetplus/GetFreeDays"));
});

router.all("/powiatwulkanowy/Start.mvc/GetKidsLuckyNumbers", (req, res) => {
    res.json(require("../../data/uonetplus/GetKidsLuckyNumbers"));
});

router.all("/powiatwulkanowy/Start.mvc/GetKidsLessonPlan", (req, res) => {
    res.json({
        "data": [],
        "success": false,
        "errorMessage": "Not implemented yet",
        "feedback": null
    });
});

router.all("/powiatwulkanowy/Start.mvc/GetLastHomeworks", (req, res) => {
    res.json({
        "data": [],
        "success": false,
        "errorMessage": "Not implemented yet",
        "feedback": null
    });
});

router.all("/powiatwulkanowy/Start.mvc/GetLastTests", (req, res) => {
    res.json({
        "data": [],
        "success": false,
        "errorMessage": "Not implemented yet",
        "feedback": null
    });
});

router.all("/powiatwulkanowy/Start.mvc/GetLastStudentLessons", (req, res) => {
    res.json({
        "data": [],
        "success": false,
        "errorMessage": "Not implemented yet",
        "feedback": null
    });
});

router.get("/", (req, res) => {
    res.render("log-exception", {
        title: "Dziennik FakeUONET+",
        message: "Podany identyfikator klienta jest niepoprawny.",
    });
});

router.get("/powiatwulkanowy(/)?", (req, res) => {
    if (req.header("Referer") || "true" === req.query.login) {
        return res.redirect("/powiatwulkanowy/Start.mvc/Index");
    }

    res.render("login", {
        title: "Dziennik FakeUONET+"
    });
});

router.all("/powiatwulkanowy/LoginEndpoint.aspx", (req, res) => {
    if (req.body.wa && req.body.wresult) {
        return res.redirect("/powiatwulkanowy/?login=true");
    }

    res.redirect(protocol(req) + "://" + req.get('host').replace("uonetplus", "cufs") + "/powiatwulkanowy/Account/LogOn");
});

router.post("(/*)?", (req, res) => {
    res.render("permission-error", {
        title: "Logowanie"
    });
});

router.get("/powiatwulkanowy/Start.mvc/Index", (req, res) => {
    res.render("homepage", {
        title: "Uonet+",
        uonetplusOpiekun: protocol(req) + "://" + req.get('host').replace("uonetplus", "uonetplus-opiekun"),
        uonetplusUczen: protocol(req) + "://" + req.get('host').replace("uonetplus", "uonetplus-uczen")
    });
});

module.exports = router;
