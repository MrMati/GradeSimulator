const router = require('express').Router({});
const api = require("../../utils/api");

router.all("/GetCertificatePushConfig", (req, res) => {
    res.json(api.createResponse("not implemented")); //TODO
});

module.exports = router;
